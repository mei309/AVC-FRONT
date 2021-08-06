import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
    <table mat-table matSort [dataSource]="dataSource" matTableExporter #exporter="matTableExporter">
        
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns" [formGroup]="searchGroup">
            <th mat-header-cell *matHeaderCellDef>
                <h3 mat-sort-header>{{column.label}}</h3>
                <mat-form-field [ngSwitch]="column.search" class="no-print table-search" [formGroupName]="column.name">
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
            <td mat-cell class="cell-padding" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)"
                    [ngClass]="{'is-alert': column.compare && compare(element, column)}">
                <span *ngIf="element[column.name] && getRowSpan(i, column.group)" style="white-space: pre-wrap;">
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
            <td mat-cell class="cell-padding" *matCellDef="let element; let i = index"
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
              <td mat-cell class="cell-padding" *matCellDef="let element; let i = index"
                  [style.display]="getRowSpan(i, totalColumn.group) ? '' : 'none'"
                  [attr.rowspan]="getRowSpan(i, totalColumn.group)">
                  {{getTotel(i + this.paginator.pageIndex * this.paginator.pageSize) | tableCellPipe: totalColumn.type : totalColumn.collections}}
              </td>
          </ng-container>

        <tr mat-header-row *matHeaderRowDef="getDisplayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: getDisplayedColumns()" (dblclick)="openDetails(row)"></tr>
    </table>
    <mat-toolbar>
      <mat-toolbar-row>
        <button class="no-print"><mat-icon (click)="exporter.exportTable('csv')" title="Export as CSV">save_alt</mat-icon></button>
        <span class="example-spacer"></span>
        <span *ngIf="currentTotalAll">{{totelAll.label}}: {{currentTotalAll | tableCellPipe: 'weight2' : null}}</span>
        <mat-paginator class="no-print" [ngStyle]="{display: withPaginator ? 'block' : 'none'}" [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
      </mat-toolbar-row>
    </mat-toolbar>
  </div>
  <ng-container *ngIf="!dataSource">
    <mat-spinner *ngIf="secondToUpload"></mat-spinner>
  </ng-container>
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2 i18n>No records found</h2></div>
  `,
})
export class SearchGroupDetailsComponent {
    @HostListener('window:beforeprint', ['$event'])
    onBeforePrint(event){
      this.paginator.pageSize = this.dataSource.filteredData.length;
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    }
    @HostListener('window:afterprint', ['$event'])
    onAfterPrint(event){
      this.paginator.pageSize = 10;
      this.dataSource.paginator = this.paginator;
      this.cdRef.detectChanges();
    }
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    destroySubject$: Subject<void> = new Subject();

    @Input() withPaginator: boolean = true;

    searchGroup: FormGroup;
    
    totalColumn: OneColumn;
    @Input() set totelColumn(value) {
        this.totalColumn = value;
    }

    @Input() totelAll;
    currentTotalAll = undefined;

    // listTotal;
    @Input() listTotals: boolean = false;
    @Output() filteredInfo: EventEmitter<any> = new EventEmitter<any>();
    //   this.listTotal = val;
    // }
    // currentListTotales;

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

  paginatorSize: number = 0;
  
  constructor(private fb: FormBuilder, private cdRef:ChangeDetectorRef) {
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
        this.paginator.page.pipe(takeUntil(this.destroySubject$)).subscribe(pag => {
          this.paginatorSize = pag.pageIndex*pag.pageSize;
        });
      }
      // this.readySpanData();
      this.setFilters(this.searchGroup.value);
      if(this.secondTimer) {
        clearTimeout(this.secondTimer);
      }
      this.secondToUpload = false;
      // if(this.totelAll) {
      //   this.currentTotalAll = this.getTotelAll();
      // }
      // if(this.listTotal) {
      //   this.currentListTotales = this.getListTotales();
      // }
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
      if(this.totelAll) {
        this.currentTotalAll = this.getTotelAll();
      }
      if(this.listTotals) {
        this.filteredInfo.emit(this.dataSource.filteredData)
        // this.currentListTotales = this.getListTotales();
      }
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
      if(!data[filters[i].cloumn]) return false;
      switch (filters[i].type) {
        case 'selectObjObj':
          const fitsObjObj = data[filters[i].cloumn]['value'].includes(filters[i].val);
          if (!fitsObjObj) {
            return false;
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
          const fitsPercentage = data[filters[i].cloumn].toString().includes(((filters[i].val)/100).toString());
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
    if(!index && !(this.spans[this.paginatorSize] && this.spans[this.paginatorSize][key])) {
      for (let ind = this.paginatorSize -1; ; ind--) {
        if (this.spans[ind] && this.spans[ind][key]) {
          return this.spans[ind][key] -(this.paginatorSize -ind);
        }
      }
    } else {
      return this.spans[index+ this.paginatorSize] && this.spans[index+ this.paginatorSize][key];
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
          if(!this.dataSource.filteredData[index][this.totalColumn.name]) return;
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
              if(startNumber) {
                totalLoss += this.dataSource.filteredData[ind]['uniformTotals']['loss'];
                totalAll += this.dataSource.filteredData[ind]['uniformTotals']['used'];
              }
              for (let m = startNumber; m < weightSize; m++) {
                myNumbers[m] += this.dataSource.filteredData[ind][this.totalColumn.name][m]['amount'];
              }
            } else {
              return;
            }
          }
          var result = new Array<object>(weightSize);
          if(startNumber) {
            if(totalAll) {
              result[0] = {amount: (totalLoss/totalAll)*100, measureUnit: '%'};
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

  getTotelAll() {
    if(this.dataSource.filteredData.length) {
      switch (this.totelAll.type) {
        case 'weight2':
          const weightSize = this.totelAll.options.length;
          var result = new Array<object>(weightSize);
          for (let t = 0; t < weightSize; t++) {
            result[t] = {amount: (this.dataSource.filteredData.map(a => a[this.totelAll.name].find(b => b['measureUnit'] === this.totelAll.options[t])))
              .reduce((sum, record) => record? sum + record['amount'] : sum, 0), measureUnit: this.totelAll.options[t]};
          }
          return result;
        case 'listAmountWithUnit':
          const weightSize1 = this.totelAll.options.length;
          var result1 = new Array<object>(weightSize1);
          for (let t = 0; t < weightSize1; t++) {
            let nested = this.dataSource.filteredData.map(a => a[this.totelAll.name]? a[this.totelAll.name].map(b => b['amountList'].find(c => c['measureUnit'] === this.totelAll.options[t])) : []);
            
            let flat = [].concat.apply([], nested);
            result1[t] = {amount: flat.reduce((sum, record) => record? sum + record['amount'] : sum, 0), measureUnit: this.totelAll.options[t]};
          }
          return result1;
        case 'decimalNumber':
          var result2 = new Array<object>(1);
          result2[0] = {amount: (this.dataSource.filteredData)
            .reduce((sum, record) => sum + record[this.totelAll.name], 0), measureUnit: this.totelAll.options};
          return result2;
        default:
          break;
      }
    } else {
      return 0;
    }
  }


  // _pageData(data: T[]): T[] {
  //   if (!this.paginator) { return data; }

  //   const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //   return data.slice(startIndex, startIndex + this.paginator.pageSize);
  // }
  // this.dataSource._pageData = (data: Row[]) => {
  //   const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //   // find start/end index with groups excluded
  //   const filter = data.filter(r => !r.isGroup).splice(startIndex, this.paginator.pageSize);
  //   const start = filter[0];
  //   const end = filter[filter.length - 1];
  //   // return all data between first and last item (including groups)
  //   return data.slice().splice(data.indexOf(start), data.indexOf(end));
  // }

  // <div *ngIf="listTotal" style="float: right; margin-right: 15px;">
  //     <div style="display: inline-block; margin-right: 25px" *ngFor="let sum of listTotal">
  //       <h3>{{sum.label}}</h3>
  //       <ng-container *ngIf="sum.type.includes('Param'); else oneSum">
  //         <ng-container *ngFor="let total of sum.val">
  //           <h4 style="display: inline; margin-right: 15px;">{{total.key}}: {{total.val | tableCellPipe: 'decimalNumber' : null}}</h4>
  //         </ng-container>
  //       </ng-container>
  //       <ng-template #oneSum>
  //         <h4>{{sum.val | tableCellPipe: 'decimalNumber' : null}}</h4>
  //       </ng-template>
  //     </div>
  //   </div>

  // getListTotales(){
  //   this.listTotal.forEach(ele => {
  //     switch (ele.type) {
  //       case 'sumByParam':
  //         ele.val = this.doTotalSumParam(this.dataSource.filteredData, ele);
  //         break;
  //       case 'sum':
  //         ele.val = this.dataSource.filteredData.reduce((b, c) => +b + +c[ele.name] , 0);
  //         break;
  //       case 'recordAmountGroup':
  //         ele.val = (new Set(this.dataSource.filteredData.map(a => a[ele.name]))).size;
  //         break;
  //       case 'sumByParamCond':
  //         ele.val = this.doTotalSumParam(ele.condision(this.dataSource.filteredData), ele);
  //       default:
  //         break;
  //     }
  //   });
  // }

  // doTotalSumParam(filtered, ele) {
  //   const tempTable = mapValues(groupBy(filtered, ele.name));
  //   const weightSize1 = Object.keys(tempTable).length;
    
  //   var result1 = new Array<object>(weightSize1);
  //   for (let t = 0; t < weightSize1; t++) {
  //     result1[t] = {key: Object.keys(tempTable)[t], val: tempTable[Object.keys(tempTable)[t]].reduce((b, c) => +b + +c[ele.option] , 0)};
  //   }
  //   if (ele.collections && weightSize1) {
  //     result1.forEach(a => {
  //       a['key'] = ele.collections[a['key']];
  //     });
  //   }
  //   return result1;
  // }
  // downloadFile() {
  //   const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  //   const header = Object.keys(this.dataSource.filteredData[0]);
  //   const csv = this.dataSource.filteredData.map((row) =>
  //     header
  //       .map((fieldName) => JSON.stringify(this.tableCellPipe.transform(row[fieldName], null, null), replacer))
  //       .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   const csvArray = csv.join('\r\n');
  
  //   const a = document.createElement('a');
  //   const blob = new Blob([csvArray], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  
  //   a.href = url;
  //   a.download = 'myFile.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();
  // }

  ngOnDestroy() {
    this.destroySubject$.next();
  }
}