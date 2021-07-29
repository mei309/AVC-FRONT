import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
@Component({
  selector: 'date-range-select',
  template: `
    <mat-form-field appearance="fill" style="width: 400px">
        <mat-label i18n>Showing results</mat-label>
        <mat-select [formControl]="choosedDate">
            <mat-select-trigger> 
                <span *ngIf="choosedDate.value">
                    <ng-container [ngSwitch]="choosedDate.value.type">
                        <ng-container *ngSwitchCase="'range'">
                            {{choosedDate.value.label}}: {{choosedDate.value.value.begin | date:choosedDate.value.format}}
                            - {{choosedDate.value.value.end | date:choosedDate.value.format}}
                        </ng-container>
                        <ng-container *ngSwitchCase="'none'">
                            {{choosedDate.value.label}}
                        </ng-container>
                        <ng-container *ngSwitchDefault>
                            {{choosedDate.value.label}}: {{choosedDate.value.value | date:choosedDate.value.format}}
                        </ng-container>
                    </ng-container>
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
            <mat-option (click)="last2Weeks()" [value]="datesList[5]">
                <mat-label i18n>Last 2 weeks</mat-label>
            </mat-option>
            <mat-option (click)="allTimes()" [value]="datesList[6]">
                <mat-label i18n>All records</mat-label>
            </mat-option>
        </mat-select>
    </mat-form-field>

    <mat-form-field *ngIf="withTime" appearance="fill">
        <mat-label i18n>Strat time</mat-label>
        <mat-select [formControl]="startTime" (selectionChange)="firstChanged($event.value)">
            <mat-option *ngFor="let hour of hours" [value]="hour.val">
                {{hour.tex}}
            </mat-option>
        </mat-select>
    </mat-form-field>
    <mat-form-field *ngIf="choosedDate.value.endTime" appearance="fill">
        <mat-label i18n>End time</mat-label>
        <mat-select [formControl]="endTime" (selectionChange)="secondChanged($event.value)">
            <mat-option *ngFor="let hour of hours" [value]="hour.val">
                {{hour.tex}}
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

    @Output() submitRange: EventEmitter<any> = new EventEmitter<any>();

    @Input() withTime: boolean = true;

    startTime = new FormControl(6);
    endTime = new FormControl(6);
    hours = [{tex: '00:00',val: 0},{tex:'01:00',val:1},{tex:'02:00',varl:2},{tex:'03:00',val:3},{tex:'04:00',val:4},{tex:'05:00',val:5},{tex:'06:00',val:6},{tex:'07:00',val:7},{tex:'08:00',val:8},{tex:'09:00',val:9},{tex:'10:00',val:10},
        {tex:'11:00',val:11},{tex:'12:00',val:12},{tex:'13:00',val:13},{tex:'14:00',val:14},{tex:'15:00',val:15},{tex:'16:00',val:16},{tex:'17:00',val:17},{tex:'18:00',val:18},{tex:'19:00',val:19},{tex:'20:00',val:20},{tex:'21:00',val:21},{tex:'22:00',val:22},{tex:'23:00',val:23}];
    datesList = [
        {
            format: 'mediumDate',
            label: $localize`For date`,
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
            endTime: true,
            type: 'range',
            format: 'mediumDate',
            label: $localize`For range`,
            value: {begin: null, end: null},
        },
        {
            // type: 'range',
            format: 'mediumDate',
            label: $localize`From date`,
            value: {begin: null, end: null},
        },
        {
            type: 'none',
            label: $localize`Of all records`,
            value: null,
        },
    ];
    choosedDate = new FormControl();
  
  constructor() {
  }

  ngOnInit() {
    this.last2Weeks();
  }

  last2Weeks() {
    this.datesList[5]['value'] = moment().subtract(13, "day").startOf("day").toDate();
    this.choosedDate.setValue(this.datesList[5]);
    this.submitRange.emit({begin: moment.utc().subtract(13, "day").startOf("day").add(this.startTime.value, 'hours').toDate().toISOString(), end: null});
  }
  allTimes(){
    this.choosedDate.setValue(this.datesList[6]);
    this.submitRange.emit({begin: null, end: null});
  }

    chosenWeekHandler($eventstart: moment.Moment, $eventend: moment.Moment) {
      if($eventend) {
        this.datesList[1]['value'] = {begin: $eventstart, end: $eventend};
        this.choosedDate.setValue(this.datesList[1]);
        this.submitRange.emit({begin: moment.utc($eventstart).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc($eventend)).add(1, 'days').add(this.startTime.value, 'hours').toISOString()});
      }
    }

    chosenRangeHandler($eventstart: moment.Moment, $eventend: moment.Moment) {
        if($eventend) {
          this.datesList[4]['value'] = {begin: $eventstart, end: $eventend};
          this.choosedDate.setValue(this.datesList[4]);
          this.submitRange.emit({begin: moment.utc($eventstart).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc($eventend)).add(this.endTime.value, 'hours').toISOString()});
        }
      }

    chosenYearHandler(normalizedYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
        this.datesList[3]['value'] = normalizedYear;
        this.choosedDate.setValue(this.datesList[3]);
        datepicker.close();
        this.submitRange.emit({begin: moment.utc(normalizedYear).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc(normalizedYear)).add(1, 'years').add(this.startTime.value, 'hours').toISOString()});
    }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    this.datesList[2]['value'] = normalizedMonth;
    this.choosedDate.setValue(this.datesList[2]);
    datepicker.close();
    this.submitRange.emit({begin: moment.utc(normalizedMonth).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc(normalizedMonth)).add(1, 'months').add(this.startTime.value, 'hours').toISOString()});
  }

  chosenDayHandler(normalizedDay: moment.Moment) {
    this.datesList[0]['value'] = normalizedDay;
    this.choosedDate.setValue(this.datesList[0]);
    this.submitRange.emit({begin: moment.utc(normalizedDay).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc(normalizedDay)).add(1, 'days').add(this.startTime.value, 'hours').toISOString()});
  }

    firstChanged($event) {
        switch (this.choosedDate.value.label) {
            case $localize`For week`:
                this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value.begin).add($event, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value.end)).add(1, 'days').add($event, 'hours').toISOString()});
                break;
            case $localize`For range`:
                this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value.begin).add($event, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value.end)).add(this.endTime.value, 'hours').toISOString()});
                break;
            case $localize`For year`:
                this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value).add($event, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value)).add(1, 'years').add($event, 'hours').toISOString()});
                break;
            case $localize`For month`:
                this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value).add($event, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value)).add(1, 'months').add($event, 'hours').toISOString()});
                break;
            case $localize`For date`:
                this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value).add($event, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value)).add(1, 'days').add($event, 'hours').toISOString()});
                break;
            case $localize`From date`:
                this.submitRange.emit({begin: moment.utc().subtract(13, "day").startOf("day").add($event, 'hours').toDate().toISOString(), end: null});
            default:
                break;
        }
    }

    secondChanged($event) {
        this.submitRange.emit({begin: moment.utc(this.choosedDate.value.value.begin).add(this.startTime.value, 'hours').toISOString(), end: (moment.utc(this.choosedDate.value.value.end)).add($event, 'hours').toISOString()});
    }

    ngOnDestroy() {
    }

}
