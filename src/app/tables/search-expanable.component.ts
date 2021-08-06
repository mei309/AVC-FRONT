import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
@Component({
  selector: 'search-expandable',
  template: `
<div class="tables mat-elevation-z8">
  <table mat-table matSort [dataSource]="dataSource" multiTemplateDataRows matTableExporter #exporter="matTableExporter">
    
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef mat-sort-header><h3>N.O.</h3> </th>
    <td mat-cell *matCellDef="let i = dataIndex">{{ this.paginator.pageIndex == 0 ?  1 + i : 1 + i + this.paginator.pageIndex * this.paginator.pageSize}}</td>
  </ng-container>
  
    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns" [formGroup]="searchGroup">
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

              <mat-date-range-input *ngSwitchCase="'dates'" placeholder="Choose dates" (focus)="picker4.open()" [rangePicker]="picker4" i18n-placeholder>
                <input matStartDate placeholder="Start date" #dateRangeStart i18n-placeholder>
                <input matEndDate placeholder="End date" #dateRangeEnd (dateChange)="inlineRangeChange(dateRangeStart.value, dateRangeEnd.value, column.name)" i18n-placeholder>
              </mat-date-range-input>
              <mat-datepicker-toggle *ngSwitchCase="'dates'" matSuffix [for]="picker4"></mat-datepicker-toggle>
              <mat-date-range-picker #picker4></mat-date-range-picker>

              <input *ngSwitchCase="'object'" autocomplete="off" matInput type="search" formControlName="val" placeholder="Search" i18n-placeholder>

              <input *ngSwitchDefault matInput autocomplete="off" type="search" formControlName="val" placeholder="Search" i18n-placeholder>
          </mat-form-field>
        </th>
        <td mat-cell class="cell-padding" *matCellDef="let element">
          <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
            {{element[column.name] | tableCellPipe: column.type : column.collections}}
          </span>
        </td>
    </ng-container>


    <ng-container matColumnDef="expandedDetail">
        <td mat-cell *matCellDef="let element" [attr.colspan]="columnsDisplay.length">
            <div class="example-element-detail"
                [@detailExpand]="element == expandedElement ? 'expanded' : 'collapsed'">
                <div class="no-print">
                  <show-details [dataSource]="expandableMassage">
                  </show-details>
                  <div style="text-align:right">
                    <ng-container *ngFor="let butt of buttons;">
                        <button mat-raised-button class="raised-margin" (click)="onClickElement(butt)">{{butt}}</button>
                    </ng-container>
                  </div>
                </div>
            </div>
        </td>
    </ng-container>

  <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
  <tr mat-row *matRowDef="let element; columns: columnsDisplay;"
      (click)="openExpanded(element)"
      [ngClass]="{'is-new': element.label === 'NEW', 'is-seen': element.label === 'SEEN'}">
  </tr>
  <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></tr>
 </table>
  <mat-toolbar>
    <mat-toolbar-row>
      <mat-icon class="no-print" (click)="exporter.exportTable('csv')" title="Export as CSV">save_alt</mat-icon>
      <span class="example-spacer"></span>
      <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
    </mat-toolbar-row>
  </mat-toolbar>
</div>
<mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
<div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2 i18n>No records found</h2></div>
  `,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['table-expandable.css'],

})
export class SearchExpandableComponent implements OnInit {
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

  @Input() oneColumns: OneColumn[] = [];
  @Input() buttons: string[] = ['Edit', 'Bouns', 'Finalize', 'Receive'];
  @Output() expanded: EventEmitter<any> = new EventEmitter<any>();
  @Output() elemnetClick: EventEmitter<any> = new EventEmitter<any>();

  
  
  dateRangeDisp = {begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25)};
  columnsDisplay: string[] = ['position'];
  
  
  
  expandedElement: any;
  

  constructor(private fb: FormBuilder, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.searchGroup = this.fb.group({});
    this.oneColumns.forEach(element => {
      this.columnsDisplay.push(element.name);
      this.searchGroup.addControl(element.name, this.fb.group({val: '', type: element.search}));
    });
    this.searchGroup.valueChanges.pipe(takeUntil(this.destroySubject$)).subscribe(filters => {
      this.setFilters(filters);
    });
  }

  expandableText;
  @Input() set expandableMassage(value) {
      this.expandableText = value;
  }
  get expandableMassage() { return this.expandableText; }

  
  openExpanded(element) {
    console.log('lll');
    
    if(this.expandedElement === element){
      this.expandedElement = null;
    } else {
      this.expandableMassage = undefined;
      this.expandedElement = element;
      this.expanded.emit(this.expandedElement);
    }
  }

  onClickElement(opartion: string): void {
        this.elemnetClick.emit({opartion: opartion, dataRow: this.expandedElement, infromtivRow: this.expandableText});
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
      const textToSearch = d[column]['value'] && d[column]['value'].toString().toLowerCase() || '';
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
  }

  inlineRangeChange($eventstart: Date, $eventend: Date, column: string) {
    if($eventend) {
      // this.setupDateFilter(column);
      // this.dataSource.filter = {begin: new Date($eventstart), end: new Date($eventend)};
      // this.readySpanData();
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

}

