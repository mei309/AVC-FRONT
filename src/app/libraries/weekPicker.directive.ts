import { Directive, Inject, Injectable } from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {MatDateRangeSelectionStrategy, DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY} from '@angular/material/datepicker';


@Injectable()
export class WeekDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createWeekDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createWeekDayRange(activeDate);
  }

  private _createWeekDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -this._dateAdapter.getDayOfWeek(date));
      const end = this._dateAdapter.addCalendarDays(date, 6-this._dateAdapter.getDayOfWeek(date));
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Directive({
    selector: "[weekPicker]",
    providers: [
        {
          provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
          useClass: WeekDayRangeSelectionStrategy
        }
    ]
  })
  export class WeekPickerDirective {
    constructor(
        @Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)
        private maxRangeStrategy: WeekDayRangeSelectionStrategy<any>
      ) {}
  }