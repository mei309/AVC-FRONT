// import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
// import { isEqual, uniq, groupBy, values, mapValues } from 'lodash-es';
// import { OneColumn } from '../field.interface';
// @Component({
//   selector: 'normal-group-table',
//   template: `
// <div class="tables mat-elevation-z8">
//   <table mat-table id="ExampleTable" [dataSource]="dataSource">
    
//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//           <h3>{{column.titel}}</h3>
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
//                   <span *ngSwitchCase="'group'">{{getTotel(column.name, i, column.group)}}</span>
//               </div>
//           </ng-container>
//         </td>
//     </ng-container>
//     <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
//     <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>

//  </table>
// </div>
// <mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
// <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.length === 0"><h2>No records found</h2></div>


// <table mat-table [dataSource]="sumDataSource">
    
//     <ng-container matColumnDef="{{column}}" *ngFor="let column of sumClumensTable">
//         <th mat-header-cell *matHeaderCellDef>
//           <h3>{{column}}</h3>
//         </th>
//         <td mat-cell *matCellDef="let element">
//           {{element[column]}}
//         </td>
//     </ng-container>
//     <tr mat-header-row *matHeaderRowDef="sumClumensTable"></tr>
//     <tr mat-row *matRowDef="let row; columns: sumClumensTable"></tr>
//  </table>
//   `,
// })
// export class NormalGroupTableComponent {
//   // @ViewChild(MatSort) sort: MatSort;
//   dataSource;

//   sumDataSource = [];
//   @Input() sumCloumns = [];
//   sumClumensTable: string[];

//   @Input() set mainDetailsSource(value) {
//         if(value) {
//             this.dataSource = <any[]>value[0];
//             this.oneColumns = value[1];
//             this.columnsDisplay = [];
//             this.localGroupOneColumns = [];
//             this.lastSpan = null;
//             this.spans = [];
//             this.preperData();
//            if(this.sumCloumns.length) {
//             this.sumDataSource = [];
//             var nest = function (seq, keys) {
//               if (!keys.length)
//                   return seq;
//               var first = keys[0];
//               var rest = keys.slice(1);
//               return mapValues(groupBy(seq, first), function (value) { 
//                   return nest(value, rest)
//               });
//             };
//             const tempTable = nest(this.dataSource, this.sumCloumns);
//             this.sumClumensTable = ['key'];
//             Object.keys(tempTable).forEach(key => {
//               var newLine = {key: key};
//               var sum = 0;
//               Object.keys(tempTable[key]).forEach(val => {
//                 newLine[val] = tempTable[key][val].reduce((b, c) => +b + +c['lots']['amount'], 0);
//                 this.sumClumensTable.push(val);
//                 sum += newLine[val];
//               });
//               newLine['sum'] = sum;
//               this.sumDataSource.push(newLine);
//             });
//             this.sumClumensTable = [...new Set(this.sumClumensTable)]; 
//             this.sumClumensTable.push('sum');
//             var newSumLine = {key: 'Totel'};
//             this.sumClumensTable.forEach(newCloumn => {
//               if(newCloumn !== 'key') {
//                 var sum = 0;
//                 this.sumDataSource.forEach(aLine => {
//                   sum += aLine[newCloumn]? aLine[newCloumn] : 0;
//                 });
//                 newSumLine[newCloumn] = sum;
//               }
//             });
//             this.sumDataSource.push(newSumLine);
//            }
//             // this.dataSource = new MatTableDataSource(this.dataSource);
//         } else {
//           this.dataSource = null;
//           this.oneColumns = [];
//         }
//   }
  
//   @Output() details: EventEmitter<any> = new EventEmitter<any>();

//   oneColumns: OneColumn[] = [];

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

  
//   operators = {
//     // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
//     '>' : function(a, b) { return a > b; },
//     '<' : function(a, b) { return a < b; },
//     // '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
//     //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
//     // 'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
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
//     element.collections.forEach(second => {
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
//         number += this.dataSource[ind][cloumen]['amount'];
//       }
//       return number + ' ' + this.dataSource[index][cloumen]['measureUnit'];
//     }
//   }
// }
