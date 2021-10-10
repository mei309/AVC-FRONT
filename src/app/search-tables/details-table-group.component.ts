// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { OneColumn } from '../field.interface';
// import {uniq, isEqual} from 'lodash-es';
// import { MatTableDataSource } from '@angular/material/table';
// @Component({
//   selector: 'table-details-group',
//   template: `
// <div class="tables mat-elevation-z8">
//   <table mat-table [dataSource]="dataSource">

//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//           <h3>{{column.titel}}</h3>
//           <mat-form-field style="width:90%" [ngSwitch]="column.type">
//               <mat-select *ngSwitchCase="'select'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
//                 <mat-option value="">--all--</mat-option>
//                 <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
//               </mat-select>

//               <mat-select *ngSwitchCase="'selectAsync'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
//                 <mat-option value="">--all--</mat-option>
//                 <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
//               </mat-select>

//               <mat-select *ngSwitchCase="'selectObject'" placeholder="Search" (focus)="setupFilterObject(column.name)" (selectionChange)="applyFilter($event.value)">
//               <mat-option value="">--all--</mat-option>
//               <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
//               </mat-select>

//               <mat-select *ngSwitchCase="'selectAsyncObject'" placeholder="Search" (focus)="setupFilterObject(column.name)" (selectionChange)="applyFilter($event.value)">
//               <mat-option value="">--all--</mat-option>
//               <mat-option *ngFor="let item of column.options | async" [value]="item.value">{{item.value}}</mat-option>
//               </mat-select>
            
//               <input *ngSwitchCase="'object'" autocomplete="off" matInput type="search" (keyup)="applyFilter($event.target.value)" (focus)="setupFilterObject(column.name)" placeholder="Search">

//               <input *ngSwitchDefault matInput autocomplete="off" type="search" (keyup)="applyFilter($event.target.value)" (focus)="setupFilter(column.name)" placeholder="Search">
//           </mat-form-field>
//         </th>
//         <td mat-cell style="vertical-align: top;
//             padding-left: 16px;
//             padding-top: 14px;" *matCellDef="let element; let i = index"
//                 [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
//                 [attr.rowspan]="getRowSpan(i, column.group)" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
//           <ng-container *ngIf="element[column.name]">
//               <div [ngSwitch]="column.pipes" >
//                   <span *ngSwitchCase="undefined">{{element[column.name]}}</span>
//                   <mat-chip-list *ngSwitchCase="'arrayObject'">
//                       <mat-chip *ngFor="let symbols of uniq(element[column.name])">{{symbols}}</mat-chip>
//                   </mat-chip-list>
//                   <mat-chip-list *ngSwitchCase="'array'">
//                       <mat-chip *ngFor="let symbols of uniq(element[column.name].split(','))">{{symbols}}</mat-chip>
//                   </mat-chip-list>
//                   <span *ngSwitchCase="'object'">{{element[column.name]['value']}}</span>
//                   <span *ngSwitchCase="'currency'">{{element[column.name] | currency: element[column.options]}}</span>
//                   <span *ngSwitchCase="'dates'">{{element[column.name] | date}}</span>
//                   <span *ngSwitchCase="'datesTime'">{{element[column.name] | date: 'medium'}}</span>
//                   <span *ngSwitchCase="'weight'">{{element[column.name]}} {{element[column.options]}}</span>
//                   <span *ngSwitchCase="'percent'">{{element[column.name] | percent: '1.0-3'}}</span>
//                   <span *ngSwitchCase="'amountWithUnit'">
//                       <ng-container  *ngFor="let parcel of element[column.name]"> 
//                             <li>{{parcel.item.value}}: {{parcel.amountWithUnit[0]['value']}} ({{parcel.amountWithUnit[1]['value']}})</li>
//                       </ng-container>
//                   </span>
//                   <span *ngSwitchCase="'group'">{{getTotel(column.name, i, column.group)}}</span>
//                   <span *ngSwitchCase="'2array'">{{element[column.name][0]['value']}} ({{element[column.name][1]['value']}})</span>
//               </div>
//           </ng-container>
//         </td>
//     </ng-container>

//     <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    
//     <tr mat-row *matRowDef="let row; columns: columnsDisplay"
//      (dblclick)="openDetails(row)"></tr>

//  </table>
// </div>
// <mat-spinner *ngIf="!dataSource"></mat-spinner>
// <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data?.length === 0"><h2>No records found</h2></div>
//   `,
// })
// export class DetailsTableGroupComponent {
  
//   dataSource;

//   @Input() set mainDetailsSource(value) {
//         if(value) {
//             this.dataSource = <any[]>value[0];
//             this.oneColumns = value[1];
//             this.columnsDisplay = [];
//             this.localGroupOneColumns = [];
//             this.lastSpan = null;
//             this.spans = [];
//             this.preperData();
//             this.dataSource = new MatTableDataSource(this.dataSource);
//         } else {
//           this.dataSource = null;
//           this.oneColumns = [];
//         }
//   }

//   oneColumns: OneColumn[] = [];
  

//   @Output() details: EventEmitter<any> = new EventEmitter<any>();

//   lastSpan: string;
//   spans = [];
//   columnsDisplay: string[] = [];

//   localGroupOneColumns = [];

//   constructor() {
//   }
//   preperData() {
//     var groupId: boolean = false;
//     this.oneColumns.forEach(element => {
//       if(element.type === 'idGroup'){
//         groupId = true;
//       } else if(element.type === 'kidArray'){
//           this.takeCareKidArray(element);
//       } else {
//           this.localGroupOneColumns.push(element);
//           this.columnsDisplay.push(element.name);
//       }
//     });
//     if(groupId) {
//       this.spanRow(d => d['id'], 'id');
//       this.lastSpan = 'id';
//     }
//     this.localGroupOneColumns.forEach(element => {
//       if(element.group === element.name) {
//         this.spanRow(d => d[element.name], element.name);
//         this.lastSpan = element.name;
//       }
//     });
//   }


//   openDetails(value: any) {
//     this.details.emit(value);
//   }


//   setupFilter(column: string) {
//     this.dataSource.filterPredicate = (d: any, filter: string) => {
//       const textToSearch = d[column] && d[column].toString().toLowerCase() || '';
//       return textToSearch.indexOf(filter) !== -1;
//     };
//   }

//   setupFilterObject(column: string) {
//     this.dataSource.filterPredicate = (d: any, filter: string) => {
//       const textToSearch = d[column] && d[column]['value'] && d[column]['value'].toString().toLowerCase() || '';
//       return textToSearch.indexOf(filter) !== -1;
//     };
//   }



//   applyFilter(filterValue: any) {
//       this.dataSource.filter = filterValue.trim().toLowerCase();
//       if (this.dataSource.paginator) {
//         this.dataSource.paginator.firstPage();
//       }
//       this.lastSpan = null;
//       this.spans = [];
//       this.localGroupOneColumns.forEach(element => {
//         if(element.group === element.name) {
//           this.spanRowData(d => d[element.name], element.name);
//           this.lastSpan = element.name;
//         }
//       });
//   }

//   inlineRangeChange($event, column: string) {
//     this.setupDateFilter(column);
//     this.dataSource.filter = $event;
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//     this.lastSpan = null;
//     this.spans = [];
//     this.localGroupOneColumns.forEach(element => {
//       if(element.group === element.name) {
//         this.spanRowData(d => d[element.name], element.name);
//         this.lastSpan = element.name;
//       }
//     });
//   }
//   setupDateFilter(column: string) {
//     this.dataSource.filterPredicate = (data, filter: any) => {
//         var dateStamp = (new Date(data[column])).getTime();
//         return (dateStamp > filter.begin.getTime() && dateStamp < filter.end.getTime());
//       };
//   }
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
  
//   takeCareKidArray(element) {
//     var arr = [];
//     this.dataSource.forEach(line => {
//             line[element.name].forEach(obj => {
//                 var copied = Object.assign({}, obj, line);
//                 delete copied[element.name];
//                 arr.push(copied);
//             });
//     });
//     this.dataSource = arr;
//     element.collections?.forEach(second => {
//         if(second.type === 'kidArray') {
//             this.takeCareKidArray(second);
//         }
//     });
//   }


//   spanRow(accessor, key) {
//     if(this.lastSpan) {
//       var start: number = 0;
//       var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
//       while (end < this.dataSource.length) {
//         this.spanWork(accessor, key, start, end);
//         start = end;
//         end += this.spans[start][this.lastSpan];
//       }
//       this.spanWork(accessor, key, start, this.dataSource.length);
//     } else {
//       this.spanWork(accessor, key, 0, this.dataSource.length);
//     }

//   }

//   spanWork(accessor, key, start, end) {
//     for (let i = start; i < end;) {
//       let currentValue = accessor(this.dataSource[i]);
//       let count = 1;

//       // Iterate through the remaining rows to see how many match
//       // the current value as retrieved through the accessor.
//       for (let j = i + 1; j < end; j++) {
//         if (!isEqual(currentValue, accessor(this.dataSource[j]))) {
//           break;
//         }
//         count++;
//       }

//       if (!this.spans[i]) {
//         this.spans[i] = {};
//       }

//       // Store the number of similar values that were found (the span)
//       // and skip i to the next unique row.
//       this.spans[i][key] = count;
//       i += count;
//     }  
//   }
 
//   getRowSpan(index, key) {
//     if(!key) {
//       return 1;
//     }
//     return this.spans[index] && this.spans[index][key];
//   }


//   spanRowData(accessor, key) {
//     if(this.lastSpan) {
//       var start: number = 0;
//       var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
//       while (end < this.dataSource.filteredData.length) {
//         this.spanWorkData(accessor, key, start, end);
//         start = end;
//         end += this.spans[start][this.lastSpan];
//       }
//       this.spanWorkData(accessor, key, start, this.dataSource.filteredData.length);
//     } else {
//       this.spanWorkData(accessor, key, 0, this.dataSource.filteredData.length);
//     }

//   }

//   spanWorkData(accessor, key, start, end) {
//     for (let i = start; i < end;) {
//       let currentValue = accessor(this.dataSource.filteredData[i]);
//       let count = 1;

//       // Iterate through the remaining rows to see how many match
//       // the current value as retrieved through the accessor.
//       for (let j = i + 1; j < end; j++) {
//         if (!isEqual(currentValue, accessor(this.dataSource.filteredData[j]))) {
//           break;
//         }
//         count++;
//       }

//       if (!this.spans[i]) {
//         this.spans[i] = {};
//       }

//       // Store the number of similar values that were found (the span)
//       // and skip i to the next unique row.
//       this.spans[i][key] = count;
//       i += count;
//     }  
//   }


//   uniq(array: any[]) {
//     return uniq(array);
//   }

//   isArray(obj : any ) {
//     return Array.isArray(obj)
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

// }