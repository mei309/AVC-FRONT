import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


// import {DateAdapter} from '@angular/material/core';
// import {
//   MatDateRangeSelectionStrategy,
//   DateRange,
//   MAT_DATE_RANGE_SELECTION_STRATEGY,
// } from '@angular/material/datepicker';
// import * as moment from 'moment';
// import { Moment } from 'moment';

// @Injectable()
// export class WeekDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
//   constructor(private _dateAdapter: DateAdapter<D>) {}

//   selectionFinished(date: D | null): DateRange<D> {
//     return this._createWeekDayRange(date);
//   }

//   createPreview(activeDate: D | null): DateRange<D> {
//     return this._createWeekDayRange(activeDate);
//   }

//   private _createWeekDayRange(date: D | null): DateRange<D> {
//     if (date) {
//       const start = this._dateAdapter.addCalendarDays(date, -this._dateAdapter.getDayOfWeek(date));
//       const end = this._dateAdapter.addCalendarDays(date, 6-this._dateAdapter.getDayOfWeek(date));
//       return new DateRange<D>(start, end);
//     }

//     return new DateRange<D>(null, null);
//   }
// }


@Component({
  selector: 'productions-by-time',
  template: `
    <h1 style="text-align:center" i18n>All production</h1>
    <date-range-select (submitRange)="getAllProduction($event)"></date-range-select>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSourceColumns" [totelColumn]="totelColumn" [totelAll]="totelAll" [withPaginator]="false">
      </search-group-details>
    </div>
    `,
    // providers: [{
    //   provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    //   useClass: WeekDayRangeSelectionStrategy
    // }]
})
export class ProductionsByTimeComponent implements OnInit {
  navigationSubscription;
  
  isDataAvailable: boolean = false;

  // dateDay = new FormControl('');
  // dateWeek = new FormControl('');
  // dateMonth = new FormControl('');
  // dateYear = new FormControl('');

  columnsShow: OneColumn[];
  
  totelColumn: OneColumn = {
      type: 'weight2',
      name: 'processGain',
      label: $localize`Total difference`,
      group: 'poCodes',
  };

  totelAll: OneColumn = {
    type: 'listAmountWithUnit',
    name: 'producedItems',
    label: $localize`Total all produced`,
    options: ['KG', 'LBS']
  };
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: ReportsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.columnsShow = [
          {
              type: 'arrayVal',
              name: 'poCodes',
              label: $localize`PO#`,
              search: 'normal',
              group: 'poCodes',
          },
          {
              type: 'arrayVal',
              name: 'suppliers',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersCashew(),
              group: 'poCodes',
          },
          {
              type: 'itemWeight',
              name: 'usedItems',
              label: $localize`Used items`,
              search: 'listAmountWithUnit',
              options: this.genral.getItemsCashew('All'),
          },
          {
              type: 'itemWeight',
              name: 'producedItems',
              label: $localize`Produced items`,
              search: 'listAmountWithUnit',
              options: this.genral.getItemsCashew('All'),
          },
          {
              type: 'weight2',
              name: 'processGain',
              label: $localize`Difference`,
              search: 'objArray',
          },
          {
              type: 'dateTime',
              name: 'recordedTime',
              label: $localize`Recorded time`,
              search: 'dates',
          },
          {
              type: 'normal',
              name: 'status',
              label: $localize`Status`,
              search: 'select',
              options: this.genral.getProcessStatus(),
          },
      ];
  }

  getAllProduction($event) {
    console.log($event);
    
    this.isDataAvailable = true;
    this.cashewSourceColumns = null;
    this.localService.allProductionByTime($event.begin, $event.end).pipe(take(1)).subscribe(value => {
      this.cashewSourceColumns = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

  //   chosenWeekHandler($eventstart: Moment, $eventend: Moment) {
  //     if($eventend) {
  //       this.isDataAvailable = true;
  //       this.cashewSourceColumns = null;
  //       this.localService.allProductionByTime($eventstart, 'WEEK').pipe(take(1)).subscribe(value => {
  //         this.cashewSourceColumns = <any[]>value;
  //       });
  //       this.cdRef.detectChanges();
  //     }
  //   }

  //   chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
  //       this.isDataAvailable = true;
        
  //       this.cashewSourceColumns = null;
  //       this.localService.allProductionByTime(normalizedYear, 'YEAR').pipe(take(1)).subscribe(value => {
  //         this.cashewSourceColumns = <any[]>value;
  //       });
  //       this.cdRef.detectChanges();
  //       this.dateYear.setValue(normalizedYear);
  //       datepicker.close();
  //   }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   this.isDataAvailable = true;
  //   this.cashewSourceColumns = null;
  //   this.localService.allProductionByTime(normalizedMonth, 'MONTH').pipe(take(1)).subscribe(value => {
  //     this.cashewSourceColumns = <any[]>value;
  //   });
  //   this.cdRef.detectChanges();
  //   this.dateMonth.setValue(normalizedMonth);
  //   datepicker.close();
  // }

  // chosenDayHandler(normalizedDay: Moment) {
  //   this.isDataAvailable = true;
  //   this.cashewSourceColumns = null;
  //   this.localService.allProductionByTime(normalizedDay, 'DAY').pipe(take(1)).subscribe(value => {
  //     this.cashewSourceColumns = <any[]>value;
  //   });
  //   this.cdRef.detectChanges();
  // }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

}

// <mat-form-field appearance="fill">
//         <mat-label i18n>Day</mat-label>
//         <input matInput [matDatepicker]="picker1" (dateChange)="chosenDayHandler($event.value)" [formControl]="dateDay">
//         <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
//         <mat-datepicker #picker1></mat-datepicker>
//     </mat-form-field>
//     <mat-form-field appearance="fill">
//       <mat-label i18n>Week</mat-label>
//       <mat-date-range-input [rangePicker]="picker">
//         <input matStartDate placeholder="Start date" #dateRangeStart (focus)="picker.open()" readonly i18n-placeholder>
//         <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="chosenWeekHandler(dateRangeStart.value, dateRangeEnd.value)" i18n-placeholder>
//       </mat-date-range-input>
//       <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
//       <mat-date-range-picker #picker></mat-date-range-picker>
//     </mat-form-field>
//     <mat-form-field appearance="fill">
//         <mat-label i18n>Month</mat-label>
//         <input matInput [matDatepicker]="dp" (focus)="dp.open()" [formControl]="dateMonth" readonly>
//         <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
//         <mat-datepicker #dp startView="year" (monthSelected)="chosenMonthHandler($event, dp)" panelClass="example-month-picker">
//         </mat-datepicker>
//     </mat-form-field>
//     <mat-form-field appearance="fill">
//         <mat-label i18n>Year</mat-label>
//         <input matInput [matDatepicker]="dy" (focus)="dy.open()" [formControl]="dateYear" readonly>
//         <mat-datepicker-toggle matSuffix [for]="dy"></mat-datepicker-toggle>
//         <mat-datepicker #dy startView="multi-year" (yearSelected)="chosenYearHandler($event, dy)" panelClass="example-year-picker">
//         </mat-datepicker>
//     </mat-form-field>
