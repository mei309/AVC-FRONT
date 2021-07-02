import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Genral } from './../genral.service';


@Component({
  selector: 'date-range-select',
  template: `
    <mat-form-field appearance="fill">
        <mat-label i18n>Showing results</mat-label>
        <mat-select [formControl]="choosedDate">
            <mat-select-trigger>
                <span *ngIf="choosedDate.value">
                    <ng-container *ngIf="choosedDate.value.type === 'range'; else noRange">
                        {{choosedDate.value.label}}: {{choosedDate.value.value.begin | date:choosedDate.value.format}}
                        - {{choosedDate.value.value.end | date:choosedDate.value.format}}
                    </ng-container>
                    <ng-template #noRange>
                        {{choosedDate.value.label}}: {{choosedDate.value.value | date:choosedDate.value.format}}
                    </ng-template>
                </span>
            </mat-select-trigger>
            <mat-option (click)="picker1.open()" [value]="datesList[0]">
                <mat-label i18n>By day</mat-label>
            </mat-option>
            <mat-option (click)="picker.open()" [value]="datesList[1]">
                <mat-label i18n>By week</mat-label>
            </mat-option>
            <mat-option (click)="dp.open()" [value]="datesList[2]">
                <mat-label i18n>By month</mat-label>
            </mat-option>
            <mat-option (click)="dy.open()" [value]="datesList[3]">
                <mat-label i18n>By year</mat-label>
            </mat-option>
            <mat-option (click)="picker4.open()" [value]="datesList[4]">
                <mat-label i18n>By range</mat-label>
            </mat-option>
        </mat-select>
    </mat-form-field>
    <div hidden="true">
        <mat-form-field>
            <input matInput [matDatepicker]="picker1" (dateChange)="chosenDayHandler($event.value)" readonly>
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
            <mat-date-range-input [rangePicker]="picker">
                <input matStartDate placeholder="Start date" #dateRangeStart readonly i18n-placeholder>
                <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="chosenWeekHandler(dateRangeStart.value, dateRangeEnd.value)" readonly i18n-placeholder>
            </mat-date-range-input>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-date-range-picker weekPicker #picker></mat-date-range-picker>
        </mat-form-field>
        <mat-form-field>
            <input matInput [matDatepicker]="dp" readonly>
            <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
            <mat-datepicker #dp startView="year" (monthSelected)="chosenMonthHandler($event, dp)" panelClass="example-month-picker">
            </mat-datepicker>
        </mat-form-field>
        <mat-form-field>
            <input matInput [matDatepicker]="dy" readonly>
            <mat-datepicker-toggle matSuffix [for]="dy"></mat-datepicker-toggle>
            <mat-datepicker #dy startView="multi-year" (yearSelected)="chosenYearHandler($event, dy)" panelClass="example-year-picker">
            </mat-datepicker>
        </mat-form-field>
        <mat-form-field>
            <mat-date-range-input [rangePicker]="picker4">
                <input matStartDate placeholder="Start date" #dateRangeStart1 readonly i18n-placeholder>
                <input matEndDate placeholder="End date" #dateRangeEnd1 (dateChange)="chosenRangeHandler(dateRangeStart1.value, dateRangeEnd1.value)" readonly i18n-placeholder>
            </mat-date-range-input>
            <mat-datepicker-toggle matSuffix [for]="picker4"></mat-datepicker-toggle>
            <mat-date-range-picker #picker4></mat-date-range-picker>
        </mat-form-field>
    </div>
    `,
})
export class DateRangeSelect {

    datesList = [
        {
            format: 'mediumDate',
            label: $localize`For year`,
            value: null,
        },
        {
            type: 'range',
            format: 'mediumDate',
            label: $localize`For week`,
            value: {begin: null, end: null},
        },
        {
            format: 'LLL yyyy',
            label: $localize`For month`,
            value: null,
        },
        {
            format: 'yyyy',
            label: $localize`For year`,
            value: null,
        },
        {
            type: 'range',
            format: 'mediumDate',
            label: $localize`For range`,
            value: {begin: null, end: null},
        },
    ];
    choosedDate = new FormControl();
  
  constructor(private router: Router, public dialog: MatDialog,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
  }

    chosenWeekHandler($eventstart: Date, $eventend: Date) {
      if($eventend) {
        this.datesList[1]['value'] = {begin: $eventstart, end: $eventend};
        this.choosedDate.setValue(this.datesList[1]);
        // this.isDataAvailable = true;
        // this.cashewSourceColumns = null;
        // this.localService.allProductionByTime(new Date($eventstart), 'WEEK').pipe(take(1)).subscribe(value => {
        //   this.cashewSourceColumns = <any[]>value;
        // });
        // this.cdRef.detectChanges();
      }
    }

    chosenRangeHandler($eventstart: Date, $eventend: Date) {
        if($eventend) {
          this.datesList[4]['value'] = {begin: $eventstart, end: $eventend};
          this.choosedDate.setValue(this.datesList[4]);
          // this.isDataAvailable = true;
          // this.cashewSourceColumns = null;
          // this.localService.allProductionByTime(new Date($eventstart), 'WEEK').pipe(take(1)).subscribe(value => {
          //   this.cashewSourceColumns = <any[]>value;
          // });
          // this.cdRef.detectChanges();
        }
      }

    chosenYearHandler(normalizedYear: Date, datepicker: MatDatepicker<Date>) {
        // this.isDataAvailable = true;
        
        // this.cashewSourceColumns = null;
        // this.localService.allProductionByTime(normalizedYear, 'YEAR').pipe(take(1)).subscribe(value => {
        //   this.cashewSourceColumns = <any[]>value;
        // });
        // this.cdRef.detectChanges();
        this.datesList[3]['value'] = normalizedYear;
        this.choosedDate.setValue(this.datesList[3]);
        datepicker.close();
    }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    // this.isDataAvailable = true;
    // this.cashewSourceColumns = null;
    // this.localService.allProductionByTime(normalizedMonth, 'MONTH').pipe(take(1)).subscribe(value => {
    //   this.cashewSourceColumns = <any[]>value;
    // });
    // this.cdRef.detectChanges();
    this.datesList[2]['value'] = normalizedMonth;
    this.choosedDate.setValue(this.datesList[2]);
    datepicker.close();
  }

  chosenDayHandler(normalizedDay: Date) {
    this.datesList[0]['value'] = normalizedDay;
    this.choosedDate.setValue(this.datesList[0]);
    // this.isDataAvailable = true;
    // this.cashewSourceColumns = null;
    // this.localService.allProductionByTime(normalizedDay, 'DAY').pipe(take(1)).subscribe(value => {
    //   this.cashewSourceColumns = <any[]>value;
    // });
    // this.cdRef.detectChanges();
  }

    ngOnDestroy() {
    }

}
