import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { OneColumn } from '../field.interface';

@Component({
  selector: 'search-details',
  template: `
  <ng-container *ngIf="isPrint">
    <ng-container *ngFor="let item of searchGroup.value | keyvalue">
      <div *ngIf="item.value.val" class="half">
        <label>{{item.value.label}}</label>
        <span class="half">{{item.value.val | tableCellPipe: item.value.type : null}}</span>
      </div>
    </ng-container>
  </ng-container>
<div class="tables mat-elevation-z8">
  <table mat-table matSort [dataSource]="dataSource" matTableExporter #exporter="matTableExporter">
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef mat-sort-header><h3>N.O.</h3> </th>
      <td mat-cell *matCellDef="let i = index">{{ this.paginator.pageIndex == 0 ?  1 + i : 1 + i + this.paginator.pageIndex * this.paginator.pageSize}}</td>
    </ng-container>

    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns" [formGroup]="searchGroup">
        <th mat-header-cell *matHeaderCellDef>
          <h3 mat-sort-header>{{column.label}}</h3>
          <mat-form-field [ngSwitch]="column.search" class="no-print table-search" [formGroupName]="column.name">
              <mat-select *jrSwitchCases="['select', 'selectArr']" placeholder="Search" formControlName="val" i18n-placeholder>
                  <mat-option value="">--all--</mat-option>
                  <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
              </mat-select>
              <ng-container *jrSwitchCases="['selectObj', 'selectObjObj', 'selectObjArr']">
                <input matInput placeholder="Search" formControlName="val" i18n-placeholder [matAutocomplete]="auto">
                <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete" [displayWith]="getOptionText" panelWidth="fit-content">
                  <mat-option *ngFor="let item of column.options | async" [value]="item">
                    {{item.value}}
                  </mat-option>
                </mat-autocomplete>
              </ng-container>

              <input *ngSwitchCase="'none'" matInput readonly>

              <mat-date-range-input *ngSwitchCase="'dates'" placeholder="Choose dates" (focus)="picker4.open()" [rangePicker]="picker4" i18n-placeholder>
                <input matStartDate placeholder="Start date" #dateRangeStart i18n-placeholder>
                <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="inlineRangeChange(dateRangeStart.value, dateRangeEnd.value, column.name)" i18n-placeholder>
              </mat-date-range-input>
              <mat-datepicker-toggle *ngSwitchCase="'dates'" matSuffix [for]="picker4"></mat-datepicker-toggle>
              <mat-date-range-picker #picker4></mat-date-range-picker>

              <input *ngSwitchCase="'object'"  autocomplete="off" matInput type="search" formControlName="val" placeholder="Search" i18n-placeholder>

              <input *ngSwitchDefault matInput autocomplete="off" type="search" formControlName="val" placeholder="Search" i18n-placeholder>
          </mat-form-field>
        </th>
        <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
          <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                {{element[column.name] | tableCellPipe: column.type : column.collections}}
          </span>
        </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="columnsDisplay; sticky: true"></tr>
    <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
 </table>
  <mat-toolbar>
    <mat-toolbar-row>
      <mat-icon class="no-print" (click)="exporter.exportTable('csv')" title="Export as CSV">save_alt</mat-icon>
      <span class="row-spacer"></span>
      <mat-paginator class="no-print" [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
    </mat-toolbar-row>
  </mat-toolbar>
</div>
<mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
<h2 style="text-align:center" *ngIf="dataSource?.data?.length === 0" i18n>No records found</h2>
  `,
})
export class SearchDetailsComponent {
  isPrint = false;
  @HostListener('window:beforeprint', ['$event'])
    onBeforePrint(event){
      this.isPrint = true;
      this.paginator.pageSize = this.dataSource.filteredData.length;
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    }
    @HostListener('window:afterprint', ['$event'])
    onAfterPrint(event){
      this.isPrint = false;
      this.paginator.pageSize = 10;
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    }
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  destroySubject$: Subject<void> = new Subject();

  searchGroup: FormGroup;

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
      this.columns =  value;
      this.preperColumns();
    }
  }
  get oneColumns() { return this.columns}


  preperColumns() {
    this.searchGroup = this.fb.group({});
    this.oneColumns.forEach(element => {
          this.columnsDisplay.push(element.name);
          this.searchGroup.addControl(element.name, this.fb.group({val: '', type: element.search, label: element.label}));
          if(element.search && element.search.startsWith('selectObj')) {
            (element.options as Observable<any[]>).pipe(take(1)).subscribe(arg => {
                element.options = this.searchGroup.get(element.name).get('val').valueChanges.pipe(startWith(''), map(value => this._filter(arg, value)));
            });
          }
    });
    this.searchGroup.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(filters => {
      this.setFilters(filters);
    });
  }

  private _filter(arg, value: string): string[] {
    if(value && typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
      return arg.filter(option =>
        option.value.toLowerCase().includes(filterValue));
    } else {
      return arg;
    }
  }

  @Output() details: EventEmitter<any> = new EventEmitter<any>();


  columnsDisplay: string[] = [];


  constructor(private fb: FormBuilder, private cdRef:ChangeDetectorRef) {
  }

  openDetails(value: any) {
    this.details.emit(value);
  }

  setFilters(filters) {
    let newFilters = [];
    Object.keys(filters).forEach(filt => {
      if(filters[filt].val){
        filters[filt].cloumn = filt;
        newFilters.push(filters[filt]);
      }
    });
    this.dataSource.filterPredicate = this.customFilterPredicate;
    this.dataSource.filter = newFilters;
  }

  getOptionText(option) {
    if(option !== null) {
      return option.value;
    }
   }

  customFilterPredicate(data: any, filters): boolean {
    for (let i = 0; i < filters.length; i++) {
      if(!data[filters[i].cloumn]) return false;
      switch (filters[i].type) {
        case 'selectObjObj':
          if(typeof filters[i].val === 'string') {
            const fitsObjObj = data[filters[i].cloumn]['value'].toLowerCase().includes(filters[i].val.trim().toLowerCase());
            if (!fitsObjObj) {
              return false;
            }
          } else {
            if (data[filters[i].cloumn]['value'] != filters[i].val['value']) {
              return false;
            }
          }
          break;
        case 'object':
          const fitsThisObj = data[filters[i].cloumn]['value'].toLowerCase().includes((filters[i].val).trim().toLowerCase());
          if (!fitsThisObj) {
            return false;
          }
          break;
        case 'objArray':
          const fitsObjArr = data[filters[i].cloumn].some(a => a['value'].toLowerCase().includes((filters[i].val).trim().toLowerCase()));
          if (!fitsObjArr) {
            return false;
          }
          break;
        case 'listAmountWithUnit':
          const fitsThisList = data[filters[i].cloumn].some(a => a['item']['value'].includes(filters[i].val));
          if (!fitsThisList) {
            return false;
          }
          break;
        case 'percentage':
          const fitsPercentage = data[filters[i].cloumn].toString().includes(((filters[i].val)).toString());
          if (!fitsPercentage) {
            return false;
          }
          break;
        case 'dates':
          var dateStamp = (new Date(data[filters[i].cloumn])).getTime();
          if(!(dateStamp > filters[i].val.begin.setHours(0,0,0,0) && dateStamp < filters[i].val.end.setHours(23,59,59,999))){
            return false;
          }
          break;
        case 'select':
          if (data[filters[i].cloumn] != filters[i].val) {
            return false;
          }
          break;
        case 'selectArr':
          if (data[filters[i].cloumn].some(a => a === filters[i].val)) {
            break;
          } else {
            return false;
          }
        case 'selectObj':
          if(typeof filters[i].val !== 'string') {
            if (data[filters[i].cloumn] != filters[i].val['value']) {
              return false;
            }
            break;
          }
        case 'selectObjArr':
          if(typeof filters[i].val !== 'string') {
            if (data[filters[i].cloumn].some(a => a === filters[i].val['value'])) {
              break;
            } else {
              return false;
            }
          }
        default:
          const fitsThisFilter = data[filters[i].cloumn].toString().toLowerCase().includes((filters[i].val).trim().toLowerCase());
          if (!fitsThisFilter) {
            return false;
          }
      }
    }
    return true;
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
      // this.setupDateFilter(column);
      // this.dataSource.filter = {begin: new Date($eventstart), end: new Date($eventend)};
      let filters = this.searchGroup.value;
      filters[column]['val'] = {begin: new Date($eventstart), end: new Date($eventend)};
      this.setFilters(filters);
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


