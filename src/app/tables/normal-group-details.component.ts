import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OneColumn } from '../field.interface';
import {isEqual} from 'lodash-es';
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
                <ng-container *ngIf="element[column.name]">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </ng-container>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
    </table>
  </div>
  <mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
  <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2>No records found</h2></div>
  `,
})
export class NormalGroupDetailsComponent {
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // <mat-paginator [pageSizeOptions]="[15, 25, 50, 100]" showFirstLastButtons></mat-paginator>

    dataSource;

  @Input() set mainDetailsSource(value) {
        if(value) {
            this.dataSource = <any[]>value[0];
            this.oneColumns = value[1];
            this.columnsDisplay = [];
            this.localGroupOneColumns = [];
            this.lastSpan = null;
            this.spans = [];
            this.preperData();
            this.dataSource = new MatTableDataSource(this.dataSource);
            this.dataSource.sort = this.sort;
            // this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource = null;
          this.oneColumns = [];
        }
  }

  oneColumns: OneColumn[] = [];
  

  @Output() details: EventEmitter<any> = new EventEmitter<any>();

  lastSpan: string;
  spans = [];
  columnsDisplay: string[] = [];

  localGroupOneColumns = [];

  constructor() {
  }
  preperData() {
    // var groupId: boolean = false;
    // if(element.type === 'idGroup'){
    //     groupId = true;
    //   } else 
    //   if(groupId) {
    //     this.spanRow(d => d['id'], 'id');
    //     this.lastSpan = 'id';
    //   }
    this.oneColumns.forEach(element => {
      if(element.type === 'kidArray'){
          this.takeCareKidArray(element);
      } else {
          this.localGroupOneColumns.push(element);
          this.columnsDisplay.push(element.name);
      }
    });
    this.localGroupOneColumns.forEach(element => {
      if(element.group === element.name) {
        this.spanRow(d => d[element.name], element.name);
        this.lastSpan = element.name;
      }
    });
  }

  takeCareKidArray(element) {
    var arr = [];
    this.dataSource.forEach(line => {
            line[element.name].forEach(obj => {
                var copied = Object.assign({}, obj, line);
                delete copied[element.name];
                arr.push(copied);
            });
    });
    this.dataSource = arr;
    element.collections?.forEach(second => {
        if(second.type === 'kidArray') {
            this.takeCareKidArray(second);
        }
    });
  }


  openDetails(value: any) {
    this.details.emit(value);
  }

  spanRow(accessor, key) {
    if(this.lastSpan) {
      var start: number = 0;
      var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
      while (end < this.dataSource.length) {
        this.spanWork(accessor, key, start, end);
        start = end;
        end += this.spans[start][this.lastSpan];
      }
      this.spanWork(accessor, key, start, this.dataSource.length);
    } else {
      this.spanWork(accessor, key, 0, this.dataSource.length);
    }
  }
  spanWork(accessor, key, start, end) {
    for (let i = start; i < end;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;
      for (let j = i + 1; j < end; j++) {
        if (!isEqual(currentValue, accessor(this.dataSource[j]))) {
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


//   operators = {
//     // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
//     '>' : function(a, b) { return a > b; },
//     '<' : function(a, b) { return a < b; },
//     // '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
//     //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
//     // 'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
//     '>lbkg' : function(a, b) { 
//       if(a['measureUnit'] === b['measureUnit']) {
//         return a['amount'] > b['amount'];
//       } else if(a['measureUnit'] === 'KG') {
//           return a['amount'] > b['amount']*0.4536;
//       } else {
//         return a['amount']*0.4536 > b['amount'];
//       }
//     },
//     '<lbkg' : function(a, b) {  if(a['measureUnit'] === b['measureUnit']) {
//         return a['amount'] < b['amount'];
//       } else if(a['measureUnit'] === 'KG') {
//         return a['amount'] < b['amount']*0.4536;
//       } else {
//         return a['amount']*0.4536 < b['amount'];
//       }
//     },
//   };
//   compare (element, column) {
//     if(column.compare.name) {
//       if(element[column.compare.name] && element[column.name]) {
//         if(column.compare.pipes) {
//           return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
//         } else {
//           return this.operators[column.compare.type](element[column.name], element[column.compare.name]);
//         }
        
//       }
//     } else {
//       if(element[column.name]) {
//         return this.operators[column.compare.type](element[column.name], column.compare.pipes);
//       }
//     }
//     return false;
//   }

//   getTotel(cloumen, index, key) {
//     if(this.spans[index]) {
//       var number = 0;
//       for (let ind = index; ind < index+this.spans[index][key]; ind++) {
//         number += this.dataSource.data[ind][cloumen]['amount'];
//       }
//       return number + ' ' + this.dataSource.data[index][cloumen]['measureUnit'];
//     }
//   }
}