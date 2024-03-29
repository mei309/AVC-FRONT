// import { animate, state, style, transition, trigger } from '@angular/animations';
// import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';

// import { OneColumn } from '../field.interface';
// import {uniq} from 'lodash-es';
// @Component({
//   selector: 'table-expandable',
//   template: `
// <div class="tables mat-elevation-z8">
//   <table mat-table matSort [dataSource]="dataSource" multiTemplateDataRows>
    
//   <ng-container matColumnDef="position">
//     <th mat-header-cell *matHeaderCellDef mat-sort-header><h3>N.O.</h3> </th>
//     <td mat-cell *matCellDef="let i = dataIndex">{{ this.paginator.pageIndex == 0 ?  1 + i : 1 + i + this.paginator.pageIndex * this.paginator.pageSize}}</td>
//   </ng-container>
  
//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//           <h3 mat-sort-header>{{column.titel}}</h3>
//           <mat-form-field style="width:90%" [ngSwitch]="column.type">
//               <mat-select *ngSwitchCase="'select'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
//                 <mat-option value="">--all--</mat-option>
//                 <mat-option *ngFor="let item of column.options" [value]="item">{{item}}</mat-option>
//               </mat-select>

//               <mat-select *ngSwitchCase="'selectAsync'" placeholder="Search" (focus)="setupFilter(column.name)" (selectionChange)="applyFilter($event.value)">
//                 <mat-option value="">--all--</mat-option>
//                 <mat-option *ngFor="let item of column.options | async" [value]="item">{{item}}</mat-option>
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
//         <td mat-cell *matCellDef="let element">
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
//               </ng-container>
//           </ng-container>
//         </td>
//     </ng-container>


//     <ng-container matColumnDef="expandedDetail">
//         <td mat-cell *matCellDef="let element" [attr.colspan]="columnsDisplay.length">
//             <div class="example-element-detail"
//                 [@detailExpand]="element == expandedElement ? 'expanded' : 'collapsed'">
//                 <div >
//                   <show-details [dataSource]="expandableMassage">
//                   </show-details>
//                   <div style="text-align:right">
//                     <ng-container *ngFor="let butt of buttons;">
//                         <button mat-raised-button class="raised-margin" (click)="onClickElement(butt)">{{butt}}</button>
//                     </ng-container>
//                   </div>
//                 </div>
//             </div>
//         </td>
//     </ng-container>

//   <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
//   <tr mat-row *matRowDef="let element; columns: columnsDisplay;"
//       class="example-element-row"
//       [class.example-expanded-row]="expandedElement === element"
//       (click)="openExpanded(element)"
//       [ngClass]="{'is-new': element.label === 'NEW', 'is-seen': element.label === 'SEEN'}">
//   </tr>
//   <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></tr>
//  </table>
//  <mat-paginator [pageSizeOptions]="[15, 25, 50, 100]" showFirstLastButtons></mat-paginator>
// </div>
// <mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
// <div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.data.length === 0"><h2>No records found</h2></div>
//   `,
//   animations: [
//     trigger('detailExpand', [
//       state('collapsed', style({height: '0px', minHeight: '0'})),
//       state('expanded', style({height: '*'})),
//       transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
//     ]),
//   ],
//   styleUrls: ['table-expandable.css'],

// })
// export class ExpandableTableComponent implements OnInit {
//   @ViewChild(MatSort, {static: true}) sort: MatSort;
//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
// // <div style="white-space: pre-wrap;" [innerHtml]="expandableMassage | proceccDetailsPipe : null"></div>
//   dataTable;
//   @Input() set dataSource(value) {
//     if(value) {
//       this.dataTable = new MatTableDataSource(value);
//       this.dataTable.sort = this.sort;
//       this.dataTable.paginator = this.paginator;
//     } else {
//       this.dataTable = null;
//     }
//   }
//   get dataSource() { return this.dataTable; }

//   @Input() oneColumns: OneColumn[] = [];
//   @Input() buttons: string[] = ['Edit', 'Bouns', 'Finalize', 'Receive'];
//   @Output() expanded: EventEmitter<any> = new EventEmitter<any>();
//   @Output() elemnetClick: EventEmitter<any> = new EventEmitter<any>();

  
  
//   dateRangeDisp = {begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25)};
//   columnsDisplay: string[] = ['position'];
  
  
  
//   expandedElement: any;
  

//   constructor() {
//   }

//   ngOnInit() {
//     this.oneColumns.forEach(element => {
//       this.columnsDisplay.push(element.name);
//     });
//   }

//   expandableText;
//   @Input() set expandableMassage(value) {
//       this.expandableText = value;
//   }
//   get expandableMassage() { return this.expandableText; }

  
//   openExpanded(element) {
//     if(this.expandedElement === element){
//       this.expandedElement = null;
//     } else {
//       this.expandableMassage = undefined;
//       this.expandedElement = element;
//       this.expanded.emit(this.expandedElement);
//     }
//   }

//   onClickElement(opartion: string): void {
//         this.elemnetClick.emit({opartion: opartion, dataRow: this.expandedElement, infromtivRow: this.expandableText});
//     }
//   setupFilter(column: string) {
//     this.dataSource.filterPredicate = (d: any, filter: string) => {
//       const textToSearch = d[column] && d[column].toString().toLowerCase() || '';
//       return textToSearch.indexOf(filter) !== -1;
//     };
//   }

//   setupFilterObject(column: string) {
//     this.dataSource.filterPredicate = (d: any, filter: string) => {
//       const textToSearch = d[column]['value'] && d[column]['value'].toString().toLowerCase() || '';
//       return textToSearch.indexOf(filter) !== -1;
//     };
//   }

//   applyFilter(filterValue: any) {
//       this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

//   inlineRangeChange($event, column: string) {
//     this.setupDateFilter(column);
//     this.dataSource.filter = $event;
//   }
//   setupDateFilter(column: string) {
//     this.dataSource.filterPredicate = (data, filter: any) => {
//         var dateStamp = (new Date(data[column])).getTime();
//         return (dateStamp > filter.begin.getTime() && dateStamp < filter.end.getTime());
//       };
//   }

//   uniq(array: any[]) {
//     return uniq(array);
//   }

//   isArray(obj : any ) {
//     return Array.isArray(obj)
//   }

// }

