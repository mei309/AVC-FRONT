import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isEqual } from 'lodash-es';
import { OneColumn } from '../field.interface';
@Component({
  selector: 'normal-group-details',
  template: `
  <div class="tables mat-elevation-z8">
    <table mat-table matSort [dataSource]="dataSource">
        
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3 mat-sort-header>{{column.label}}</h3>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </td>
        </ng-container>

        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localItemWeightColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3 mat-sort-header>{{column.label}}</h3>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px; padding-right: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)">
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

        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
    </table>
  </div>
  <mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2 i18n>No records found</h2></div>
  `,
})
export class NormalGroupDetailsComponent {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // <mat-paginator [pageSizeOptions]="[15, 25, 50, 100]" showFirstLastButtons></mat-paginator>


    oneColumns: OneColumn[];
  @Input() set mainColumns(value) {
    if(value) {
        this.oneColumns = value;
        this.columnsDisplay = [];
        this.localGroupOneColumns = [];
        this.localItemWeightColumns = [];
        this.lastSpan = null;
        this.preperColumns();
        if(this.waitForCols) {
          this.settingDataSource();
        }
    } else {
      this.oneColumns = null;
    }
  }


    dataSource;
  @Input() set mainDetailsSource(value) {
        if(value) {
            this.dataSource = <any[]>value;
            if(this.oneColumns) {
              this.settingDataSource();
            } else {
              this.waitForCols = true;
            }
        } else {
          this.dataSource = null;
        }
  }

  @Output() details: EventEmitter<any> = new EventEmitter<any>();

  lastSpan: string;
  spans = [];
  columnsDisplay: string[] = [];
  groupId: boolean = false;

  localGroupOneColumns = [];
  localItemWeightColumns = [];

  waitForCols: boolean = false;

  constructor() {
  }

  settingDataSource() {
    this.preperData();
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.sort = this.sort;
    this.readySpanData();
    // this.dataSource.paginator = this.paginator;
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
      } else {
          this.localGroupOneColumns.push(element);
          this.columnsDisplay.push(element.name);
      }
    });
  }

  // columnsKidArray(element) {
  //   element.collections?.forEach(second => {
  //       if(second.type === 'kidArray') {
  //           this.columnsKidArray(second);
  //       }
  //   });
  // }


  openDetails(value: any) {
    this.details.emit(value);
  }

  spanRow(accessor, key) {
    if(this.lastSpan) {
      var start: number = 0;
      var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
      while (end < this.dataSource.filteredData.length) {
        this.spanWork(accessor, key, start, end);
        start = end;
        end += this.spans[start][this.lastSpan];
      }
      this.spanWork(accessor, key, start, this.dataSource.filteredData.length);
    } else {
      this.spanWork(accessor, key, 0, this.dataSource.filteredData.length);
    }
  }
  spanWork(accessor, key, start, end) {
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

  getRowSpan(index, key) {
    if(!key) {
      return 1;
    }
    return this.spans[index] && this.spans[index][key];
  }

  readySpanData() {
    this.lastSpan = null;
    this.spans = [];
    if(this.groupId) {
      this.spanRow(d => d['id'], 'id');
      this.lastSpan = 'id';
    }
    this.localGroupOneColumns.forEach(element => {
      if(element.group === element.name) {
        this.spanRow(d => d[element.name], element.name);
        this.lastSpan = element.name;
      }
    });
  }
}