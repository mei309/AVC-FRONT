import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OneColumn } from '../field.interface';

@Component({
  selector: 'search-details',
  template: `
<div class="tables mat-elevation-z8">
  <table mat-table matSort [dataSource]="dataSource">
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef mat-sort-header><h3>N.O.</h3> </th>
      <td mat-cell *matCellDef="let i = index">{{ this.paginator.pageIndex == 0 ?  1 + i : 1 + i + this.paginator.pageIndex * this.paginator.pageSize}}</td>
    </ng-container>

    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
        <th mat-header-cell *matHeaderCellDef>
          <h3 mat-sort-header>{{column.label}}</h3>
          <mat-form-field style="width:90%" [ngSwitch]="column.search" class="no-print">
              <mat-select *ngSwitchCase="'select'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
                <mat-option value="">--all--</mat-option>
                <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
              </mat-select>
              <mat-select *ngSwitchCase="'selectAsync'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
                <mat-option value="">--all--</mat-option>
                <mat-option *ngFor="let item of column.options | async" [value]="item">{{item}}</mat-option>
              </mat-select>
              <mat-select *ngSwitchCase="'selectObject'" placeholder="Search" (focus)="setupFilterObject(column.name)" (selectionChange)="applyFilter($event.value)">
                <mat-option value="">--all--</mat-option>
                <mat-option *ngFor="let item of column.options" [value]="item.value">{{item.value}}</mat-option>
              </mat-select>
              <mat-select *ngSwitchCase="'selectAsyncObject'" placeholder="Search" (focus)="setupFilterObject(column.name)" (selectionChange)="applyFilter($event.value)">
                <mat-option value="">--all--</mat-option>
                <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
              </mat-select>
              <mat-select *ngSwitchCase="'arraySelectAsyncObject'" placeholder="Search" (focus)="setupFilterArray(column.name)" (selectionChange)="applyFilter($event.value)">
                  <mat-option value="">--all--</mat-option>
                  <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
              </mat-select>

              <mat-date-range-input *ngSwitchCase="'dates'" placeholder="Choose dates" (focus)="picker4.open()" [rangePicker]="picker4">
                <input matStartDate placeholder="Start date" #dateRangeStart>
                <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="inlineRangeChange(dateRangeStart.value, dateRangeEnd.value, column.name)">
              </mat-date-range-input>
              <mat-datepicker-toggle *ngSwitchCase="'dates'" matSuffix [for]="picker4"></mat-datepicker-toggle>
              <mat-date-range-picker #picker4></mat-date-range-picker>

              <input *ngSwitchCase="'object'"  autocomplete="off" matInput type="search" (keyup)="applyFilter($event.target.value)" (focus)="setupFilterObject(column.name)" placeholder="Search">

              <input *ngSwitchDefault matInput autocomplete="off" type="search" (keyup)="applyFilter($event.target.value)" (focus)="setupFilter(column.name)" placeholder="Search">
          </mat-form-field>
        </th>
        <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
          <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                {{element[column.name] | tableCellPipe: column.type : column.collections}}
          </span>
        </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
 </table>
 <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
</div>
<mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
<div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data?.length === 0"><h2>No records found</h2></div>
  `,
})
export class SearchDetailsComponent {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataTable;
  @Input() set dataSource(value) {
    if(value) {
      this.dataTable = new MatTableDataSource(value);
      this.dataTable.sort = this.sort;
      this.dataTable.paginator = this.paginator;
    } else {
      this.dataTable = null;
    }
  }
  get dataSource() { return this.dataTable; }

  columns: OneColumn[] = [];
  @Input() set oneColumns(value: OneColumn[]) {
    if(value) {
      this.columnsDisplay = ['position'];
      value.forEach(element => {
        this.columnsDisplay.push(element.name);
      });
      this.columns =  value;
    }
  }
  get oneColumns() { return this.columns}
  
  @Output() details: EventEmitter<any> = new EventEmitter<any>();

  
  columnsDisplay: string[] = [];


  constructor() {
  }

  openDetails(value: any) {
    this.details.emit(value);
  }

  setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const textToSearch = d[column] && d[column].toString().toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
  setupFilterObject(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const textToSearch = d[column] && d[column]['value'] && d[column]['value'].toString().toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }
  setupFilterArray(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      // const textToSearch = d[column] && d[column].toString().toLowerCase() || '';
      return d[column].includes(filter);
    };
  }
  applyFilter(filterValue: any) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }
  inlineRangeChange($eventstart: Date, $eventend: Date, column: string) {
    if($eventend) {
      this.setupDateFilter(column);
      this.dataSource.filter = {begin: new Date($eventstart), end: new Date($eventend)};
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }
  setupDateFilter(column: string) {
    this.dataSource.filterPredicate = (data, filter: any) => {
        var dateStamp = (new Date(data[column])).getTime();
        return (dateStamp > filter.begin.setHours(0,0,0,0) && dateStamp < filter.end.setHours(23,59,59,999));
      };
  }
  operators = {
    // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    '>' : function(a, b) { return a > b; },
    '<' : function(a, b) { return a < b; },
    'weight' : function(a) { return a.amount < 0 },
    'date' : function(a) { return a < new Date().toISOString().substring(0, 10) },
  };
  compare (element, column) {
    if(column.compare.name) {
      if(element[column.compare.name] && element[column.name]) {
        if(column.compare.pipes) {
          return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
        } else {
          return this.operators[column.compare.type](element[column.name], element[column.compare.name]);
        }
        
      }
    } else {
      if(element[column.name]) {
        return this.operators[column.compare.type](element[column.name], column.compare.pipes);
      }
    }
    return false;
  }

}


