import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
@Component({
  selector: 'search-group-details',
  template: `
  <div class="tables mat-elevation-z8">
    <table mat-table matSort [dataSource]="dataSource">
        
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns" [formGroup]="searchGroup">
            <th mat-header-cell *matHeaderCellDef>
                <h3 mat-sort-header>{{column.label}}</h3>
                <mat-form-field style="width:90%" [ngSwitch]="column.search" class="no-print" [formGroupName]="column.name">
                    <mat-select *ngSwitchCase="'select'" placeholder="Search" formControlName="val" i18n-placeholder>
                        <mat-option value="">--all--</mat-option>
                        <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
                    </mat-select>
                    <mat-select *ngSwitchCase="'selectObj'" placeholder="Search" formControlName="val" i18n-placeholder>
                        <mat-option value="">--all--</mat-option>
                        <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
                    </mat-select>
                    <mat-select *ngSwitchCase="'selectObjObj'" placeholder="Search" formControlName="val" i18n-placeholder>
                        <mat-option value="">--all--</mat-option>
                        <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
                    </mat-select>
                    
                    
                    <input *ngSwitchCase="'none'" matInput readonly>

                    <mat-date-range-input *ngSwitchCase="'dates'" placeholder="Choose dates" [rangePicker]="picker4" i18n-placeholder>
                      <input matStartDate placeholder="Start date" #dateRangeStart (focus)="picker4.open()" i18n-placeholder>
                      <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="inlineRangeChange(dateRangeStart.value, dateRangeEnd.value, column.name)" (focus)="picker4.open()" i18n-placeholder>
                    </mat-date-range-input>
                    <mat-datepicker-toggle *ngSwitchCase="'dates'" matSuffix [for]="picker4"></mat-datepicker-toggle>
                    <mat-date-range-picker #picker4></mat-date-range-picker>

                    <input *ngSwitchCase="'object'"  autocomplete="off" matInput type="search" formControlName="val" placeholder="Search" i18n-placeholder>

                    <input *ngSwitchDefault matInput autocomplete="off" type="search" formControlName="val" placeholder="Search" i18n-placeholder>
                </mat-form-field>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px; padding-right: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)"
                    [ngClass]="{'is-alert': column.compare && compare(element, column)}">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                  {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </td>
        </ng-container>


        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localItemWeightColumns" [formGroup]="searchGroup">
            <th mat-header-cell *matHeaderCellDef>
                <h3 mat-sort-header>{{column.label}}</h3>
                <mat-form-field style="width:90%" class="no-print" [formGroupName]="column.name">
                    <mat-select placeholder="Search" formControlName="val" i18n-placeholder>
                        <mat-option value="">--all--</mat-option>
                        <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
                    </mat-select>
                </mat-form-field>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px; padding-right: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)"
                    [ngClass]="{'is-alert': column.compare && compare(element, column)}">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                  <ng-container *ngFor="let itemElem of element[column.name]">
                    <b>{{itemElem.item.value}}: </b>
                    <ng-container *ngFor="let amountElem of itemElem['amountList']; let amou = index">
                      <span style="white-space: nowrap;" *ngIf="!amou; else notFirst">{{amountElem | tableCellPipe: 'weight' : null}}</span>
                      <ng-template #notFirst><span style="white-space: nowrap;">({{amountElem | tableCellPipe: 'weight' : null}})</span></ng-template>
                    </ng-container>
                    <small *ngIf="itemElem.warehouses">({{itemElem.warehouses}})</small>
                    <span *ngIf="itemElem.newWarehouses"> => ({{itemElem.newWarehouses}})</span>
                    <br/>
                  </ng-container>
                </span>
            </td>
        </ng-container>

          <ng-container matColumnDef="totealCol" *ngIf="totalColumn">
              <th mat-header-cell *matHeaderCellDef>
                <h3>{{totalColumn.label}}</h3>
              </th>
              <td mat-cell style="vertical-align: top;
              padding-left: 16px; padding-right: 16px;
              padding-top: 14px;" *matCellDef="let element; let i = index"
                  [style.display]="getRowSpan(i, totalColumn.group) ? '' : 'none'"
                  [attr.rowspan]="getRowSpan(i, totalColumn.group)">
                  {{getTotel(i + this.paginator.pageIndex * this.paginator.pageSize) | tableCellPipe: totalColumn.type : totalColumn.collections}}
              </td>
          </ng-container>

        <tr mat-header-row *matHeaderRowDef="getDisplayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: getDisplayedColumns()" (dblclick)="openDetails(row)"></tr>
    </table>
    <mat-paginator [ngStyle]="{display: withPaginator ? 'block' : 'none'}" [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
  </div>
  <ng-container *ngIf="!dataSource">
    <mat-spinner *ngIf="secondToUpload"></mat-spinner>
  </ng-container>
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2 i18n>No records found</h2></div>
  `,
})
export class SearchGroupDetailsComponent {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    destroySubject$: Subject<void> = new Subject();

    @Input() withPaginator: boolean = true;

    searchGroup: FormGroup;
    
    totalColumn: OneColumn;
    @Input() set totelColumn(value) {
        this.totalColumn = value;
    }

    dataSource;
  @Input() set detailsSource(value) {
        if(value) {
            // this.t0 = performance.now()
            this.dataSource = <any[]>value;
            if(this.oneColumns) {
              this.settingDataSource();
            } else {
              this.waitForCols = true;
            }
        } else {
            this.dataSource = null;
            this.secondTimer = setTimeout(() => this.secondToUpload = true, 500);
        }
  }

  @Input() set mainColumns(value) {
    if(value) {
        this.oneColumns = value;
        this.columnsDisplay = [];
        this.localGroupOneColumns = [];
        this.localItemWeightColumns = [];
        this.lastSpan = null;
        this.spans = [];
        this.preperColumns();
        if(this.waitForCols) {
          this.settingDataSource();
        }
    } else {
      this.oneColumns = null;
    }
  }

  oneColumns: OneColumn[] = [];
  
  secondToUpload: boolean = false;
  secondTimer;

  @Output() details: EventEmitter<any> = new EventEmitter<any>();

  lastSpan: string;
  spans = [];
  columnsDisplay: string[] = [];
  groupId: boolean = false;

  localGroupOneColumns = [];
  localItemWeightColumns = [];
  
  waitForCols: boolean = false;

  t0;
  
  constructor(private fb: FormBuilder) {
    // this.t0 = performance.
  }
  // ngAfterViewChecked() {
  //   var t1 = performance.now();
  //   console.log("Call all " + (t1 - this.t0) + " milliseconds.");
  //   // console.log("Call group " + (t1 - this.t2) + " milliseconds.");
  //   // console.log("only group " + (this.t2 - this.t0) + " milliseconds.")
  // }

  settingDataSource() {
      this.preperData();
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.sort = this.sort;
      if(this.withPaginator) {
        this.dataSource.paginator = this.paginator;
      }
      this.readySpanData();
      if(this.secondTimer) {
        clearTimeout(this.secondTimer);
      }
      this.secondToUpload = false;
  }


  preperData() {
    this.oneColumns.forEach(element => {
      if(element.type === 'kidArray'){
          this.dataKidArray(element);
      }
    });
  }

  dataKidArray(element) {
    var arr = [];
    this.dataSource?.forEach(line => {
      if(line[element.name]) {
        line[element.name].forEach(obj => {
          var copied = Object.assign({}, obj, line);
          delete copied[element.name];
          arr.push(copied);
        });
      } else {
        arr.push(line);
      }
    });
    this.dataSource = arr;
    element.collections?.forEach(second => {
      if(second.type === 'kidArray') {
          this.dataKidArray(second);
      }
    });
  }

  preperColumns() {
    this.searchGroup = this.fb.group({});
    if(this.oneColumns[0].type === 'idGroup'){
      this.oneColumns.splice(0, 1);
      this.groupId = true;
    }
    this.oneColumns.forEach(element => {
      if(element.type === 'kidArray'){
          // this.columnsKidArray(element);
      } else if(element.type === 'itemWeight') {
          this.localItemWeightColumns.push(element);
          this.columnsDisplay.push(element.name);
          this.searchGroup.addControl(element.name, this.fb.group({val: '', type: element.search}));
      } else {
          this.localGroupOneColumns.push(element);
          this.columnsDisplay.push(element.name);
          this.searchGroup.addControl(element.name, this.fb.group({val: '', type: element.search}));
      }
    });
    this.searchGroup.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(filters => {
      this.setFilters(filters);
    });
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
      this.readySpanData();
  }

  // columnsKidArray(element) {
  //   element.collections?.forEach(second => {
  //       if(second.type === 'kidArray') {
  //           this.columnsKidArray(second);
  //       }
  //   });
  // }


  getDisplayedColumns(): string[] {
    if(this.totalColumn) {
      return this.columnsDisplay.concat('totealCol')
    } else {
      return this.columnsDisplay;
    }
  }


  openDetails(value: any) {
    this.details.emit(value);
  }


  customFilterPredicate(data: any, filters): boolean {        
    for (let i = 0; i < filters.length; i++) {
      switch (filters[i].type) {
        case 'selectObjObj':
        case 'object':
          const fitsThisObj = data[filters[i].cloumn]['value'].includes(filters[i].val);
          if (!fitsThisObj) {
            return false;
          }
          break;
        case 'listAmountWithUnit':
          const fitsThisList = data[filters[i].cloumn].some(a => a['item']['value'].includes(filters[i].val));
          if (!fitsThisList) {
            return false;
          }
          break;
        case 'dates':
          var dateStamp = (new Date(data[filters[i].cloumn])).getTime();
          if(!(dateStamp > filters[i].val.begin.setHours(0,0,0,0) && dateStamp < filters[i].val.end.setHours(23,59,59,999))){
            return false;
          }
          break;
        default:
          const fitsThisFilter = data[filters[i].cloumn].includes(filters[i].val);
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
  listAmountWithUnit(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      return d[column].some(a => a['item']['value'].toString().toLowerCase().indexOf(filter) !== -1);
    };
  }
  applyFilter(filterValue: any) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.readySpanData();
  }
  inlineRangeChange($eventstart: Date, $eventend: Date, column: string) {
    if($eventend) {
      // this.setupDateFilter(column);
      let filters = this.searchGroup.value;
      filters[column]['val'] = {begin: new Date($eventstart), end: new Date($eventend)};
      this.setFilters(filters);
    }
  }
  setupDateFilter(column: string) {
    this.dataSource.filterPredicate = (data, filter: any) => {
        var dateStamp = (new Date(data[column])).getTime();
        return (dateStamp > filter.begin.setHours(0,0,0,0) && dateStamp < filter.end.setHours(23,59,59,999));
      };
  }


  // spanRow(accessor, key) {
  //   if(this.lastSpan) {
  //     var start: number = 0;
  //     var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
  //     while (end < this.dataSource.length) {
  //       this.spanWork(accessor, key, start, end);
  //       start = end;
  //       end += this.spans[start][this.lastSpan];
  //     }
  //     this.spanWork(accessor, key, start, this.dataSource.length);
  //   } else {
  //     this.spanWork(accessor, key, 0, this.dataSource.length);
  //   }
  // }
  // spanWork(accessor, key, start, end) {
  //   for (let i = start; i < end;) {
  //     let currentValue = accessor(this.dataSource[i]);
  //     let count = 1;
  //     for (let j = i + 1; j < end; j++) {
  //       if (!isEqual(currentValue, accessor(this.dataSource[j]))) {
  //         break;
  //       }
  //       count++;
  //     }
  //     if (!this.spans[i]) {
  //       this.spans[i] = {};
  //     }
  //     this.spans[i][key] = count;
  //     i += count;
  //   }  
  // }

  getRowSpan(index, key) {
    if(!key) {
      return 1;
    }
    if(!index && !(this.spans[this.paginator.pageIndex * this.paginator.pageSize] && this.spans[this.paginator.pageIndex * this.paginator.pageSize][key])) {
      for (let ind = this.paginator.pageIndex * this.paginator.pageSize -1; ; ind--) {
        if (this.spans[ind] && this.spans[ind][key]) {
          return this.spans[ind][key] -(this.paginator.pageIndex * this.paginator.pageSize -ind);
        }
      }
    } else {
      return this.spans[index+ this.paginator.pageIndex * this.paginator.pageSize] && this.spans[index+ this.paginator.pageIndex * this.paginator.pageSize][key];
    }
  }

  readySpanData() {
    this.lastSpan = null;
    this.spans = [];
    if(this.groupId) {
      this.spanRowData(d => d['id'], 'id');
      this.lastSpan = 'id';
    }
    this.localGroupOneColumns.forEach(element => {
      if(element.group === element.name) {
        this.spanRowData(d => d[element.name], element.name);
        this.lastSpan = element.name;
      }
    });
  }

  spanRowData(accessor, key) {
    if(this.lastSpan) {
      var start: number = 0;
      var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
      while (end < this.dataSource.filteredData.length) {
        this.spanWorkData(accessor, key, start, end);
        start = end;
        end += this.spans[start][this.lastSpan];
      }
      this.spanWorkData(accessor, key, start, this.dataSource.filteredData.length);
    } else {
      this.spanWorkData(accessor, key, 0, this.dataSource.filteredData.length);
    }
  }
  spanWorkData(accessor, key, start, end) {
    for (let i = start; i < end;) {
      let currentValue = accessor(this.dataSource.filteredData[i]);
      let count = 1;
      for (let j = i + 1; j < end; j++) {
        if (!isEqual(currentValue, accessor(this.dataSource.filteredData[j]))) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }  
  }


  operators = {
    // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    '>' : function(a, b) { return a > b; },
    '<' : function(a, b) { return a < b; },
    'weight' : function(a) { return a.amount < 0 },
    'date' : function(a) { return a < new Date().toISOString().substring(0, 10) },
    // '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
    //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
    // 'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
  };
  compare (element, column) {
    if(column.compare.name) {
      if(element[column.compare.name]) {
        return this.operators[column.compare.type](element[column.compare.name]);
      }
    } else {
      if(column.compare.condition && element[column.compare.condVar].includes(column.compare.condition)){
        return false;
      }
      if(element[column.name]) {
        return this.operators[column.compare.type](element[column.name]);
      }
    }
    return false;
  }

  getTotel(index) {
    if(this.spans[index]) {
      switch (this.totalColumn.type) {
        case 'weight2':
          var weightSize: number = this.dataSource.filteredData[index][this.totalColumn.name].length;
          var startNumber = 0;
          var totalAll = 0;
          var totalLoss = 0;
          if(this.dataSource.filteredData[index][this.totalColumn.name][0]['measureUnit'] === '%') {
            var startNumber = 1;
          }
          var myNumbers = new Array<number>(weightSize);
          var myMesareUnit = new Array<number>(weightSize);
          for (let i = startNumber; i < weightSize; i++) {
            myNumbers[i] = 0;
            myMesareUnit[i] = this.dataSource.filteredData[index][this.totalColumn.name][i]['measureUnit'];
          }
          for (let ind = index; ind < index+this.spans[index][this.totalColumn.group]; ind++) {
            if(this.dataSource.filteredData[ind][this.totalColumn.name]) {
              if(startNumber && this.dataSource.filteredData[ind][this.totalColumn.name][1]['amount']) {
                totalLoss += this.dataSource.filteredData[ind][this.totalColumn.name][1]['amount'];
                totalAll += this.dataSource.filteredData[ind]['usedAmounts']['amount'];
              }
              for (let m = startNumber; m < weightSize; m++) {
                myNumbers[m] += this.dataSource.filteredData[ind][this.totalColumn.name][m]['amount'];
              }
            }
          }
          var result = new Array<object>(weightSize);
          if(startNumber) {
            if(totalAll) {
              result[0] = {amount: totalLoss/totalAll, measureUnit: '%'};
            } else {
              result[0] = {amount: 0, measureUnit: '%'};
            }
          }
          for (let t = startNumber; t < weightSize; t++) {
            result[t] = {amount: myNumbers[t], measureUnit: myMesareUnit[t]};
          }
          return result;
        default:
          break;
      }
    }
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }
}