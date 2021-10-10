// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import {uniq} from 'lodash-es';
// import { OneColumn } from '../field.interface';

// @Component({
//   selector: 'normal-table',
//   template: `
// <div class="tables mat-elevation-z8">
//   <table mat-table id="ExampleTable" [dataSource]="dataSource">
    
//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//           <h3>{{column.titel}}</h3>
//         </th>
//         <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
//           <ng-container *ngIf="element[column.name]">
//               <ng-container [ngSwitch]="column.pipes">
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
//                   <span *ngSwitchCase="'2array'">{{element[column.name][0]['value']}} {{element[column.name][1]['value']}}</span>
//               </ng-container>
//           </ng-container>
//         </td>
//     </ng-container>

    
    

    

//     <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    
//     <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>

//  </table>
// </div>
// <mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
// <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.length === 0"><h2>No records found</h2></div>
//   `,
// })
// export class NormalTableComponent {
//   dataTable;
//   @Input() set dataSource(value) {
//     if(value) {
//       this.dataTable = value;
//     } else {
//       this.dataTable = null;
//     }
//   }
//   get dataSource() { return this.dataTable; }

//   columns: OneColumn[] = [];
//   @Input() set oneColumns(value: OneColumn[]) {
//     if(value) {
//       value.forEach(element => {
//         this.columnsDisplay.push(element.name);
//       });
//       this.columns =  value;
//     }
//   }
//   get oneColumns() { return this.columns}
  
//   @Output() details: EventEmitter<any> = new EventEmitter<any>();


//   columnsDisplay: string[] = [];


//   constructor() {
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

  

//   uniq(array: any[]) {
//     return uniq(array);
//   }

//   isArray(obj : any ) {
//     return Array.isArray(obj)
//   }
// }
