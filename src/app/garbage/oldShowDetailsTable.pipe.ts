// import { Component, Input, OnInit } from '@angular/core';
// import {merge, isEqualWith} from 'lodash-es';
// import { diff } from '../libraries/diffArrayObjects.interface';
// // import diff_arrays_of_objects from 'diff-arrays-of-objects';
// @Component({
//   selector: 'show-details-table',
//   template: `
//   <h2>{{titel}}</h2>
//   <ng-container *ngIf="noChanges; else elseblock">


//   <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//             <h3>{{column.label}}</h3>
//         </th>
//         <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
//             <ng-container *ngIf="element[column.name]">
//             {{element[column.name] | tableCellPipe: column.type : column.collections}}
//                 <ng-container [ngSwitch]="column.type">
//                     <ng-container *ngSwitchCase="'normal'">
//                             {{element[column.name]}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'nameId'">
//                         <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock">
//                             <mat-chip-list>
//                                 <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                             </mat-chip-list>
//                         </div>
//                         <ng-template  #elseBlock>
//                             {{element[column.name]['value']}}
//                         </ng-template >
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'dateTime'">
//                         {{element[column.name] | date: 'medium'}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'date'">
//                         {{element[column.name] | date}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'name2'">
//                         {{element[column.name]['value']}}, {{element[column.name][column.collections]}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'currency'">
//                         {{element[column.name] | currency: element[column.collections]}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'weight'">
//                         {{element[column.name]}} {{element[column.collections]}}
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'check'">
//                         <mat-icon *ngIf="element[column.name] == [column.collections]">done</mat-icon>
//                     </ng-container>
//                     <ng-container *ngSwitchCase="'array'">
//                         <show-details-table [oneColumns]="column.collections" [dataSource]="element[column.name]">
//                         </show-details-table>
//                     </ng-container>
//                 </ng-container>
//             </ng-container>
//         </td>
//     </ng-container>
    

//     <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    
//     <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>

//  </table>


//  </ng-container>
//  <ng-template  #elseblock>

//  <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//             <h3>{{column.label}}</h3>
//         </th>
//         <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element[0], column)}">
//             <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated">
//                 <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual">
//                     <ng-container *ngIf="element[0][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                 {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock>
//                                     {{element[0][column.name]['value']}}
//                                 </ng-template >
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'dateTime'">
//                                 {{element[0][column.name] | date: 'medium'}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'date'">
//                                 {{element[0][column.name] | date}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'name2'">
//                                 {{element[0][column.name]['value']}}, {{element[0][column.name][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'currency'">
//                                 {{element[0][column.name] | currency: element[0][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'weight'">
//                                 {{element[0][column.name]}} {{element[0][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'check'">
//                                 <mat-icon *ngIf="element[0][column.name] == [column.collections]">done</mat-icon>
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'array'">
//                                 <show-details-table [oneColumns]="column.collections" [dataSource]="element[0][column.name]" [secondSource]="element[1][column.name]">
//                                 </show-details-table>
//                             </ng-container>
//                         </ng-container>
//                     </ng-container>
//                 </ng-container>
//                 <ng-template  #notEqual>
//                     <div class="added-item" *ngIf="element[0][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                 {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock>
//                                     {{element[0][column.name]['value']}}
//                                 </ng-template >
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'dateTime'">
//                                 {{element[0][column.name] | date: 'medium'}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'date'">
//                                 {{element[0][column.name] | date}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'name2'">
//                                 {{element[0][column.name]['value']}}, {{element[0][column.name][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'currency'">
//                                 {{element[0][column.name] | currency: element[0][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'weight'">
//                                 {{element[0][column.name]}} {{element[0][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'check'">
//                                 <mat-icon *ngIf="element[0][column.name] == [column.collections]">done</mat-icon>
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'array'">
//                                 <show-details-table [oneColumns]="column.collections" [dataSource]="element[0][column.name]" [secondSource]="element[1][column.name]">
//                                 </show-details-table>
//                             </ng-container>
//                         </ng-container>
//                     </div>
//                     <div class="removed-item" *ngIf="element[1][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[1][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[1][column.name]); else elseBlock1">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[1][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock1>
//                                     {{element[1][column.name]['value']}}
//                                 </ng-template >
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'dateTime'">
//                                 {{element[1][column.name] | date: 'medium'}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'date'">
//                                 {{element[1][column.name] | date}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'name2'">
//                                 {{element[1][column.name]['value']}}, {{element[1][column.name][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'currency'">
//                                 {{element[1][column.name] | currency: element[1][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'weight'">
//                                 {{element[1][column.name]}} {{element[1][column.collections]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'check'">
//                                 <mat-icon *ngIf="element[1][column.name] == [column.collections]">done</mat-icon>
//                             </ng-container>
//                         </ng-container>
//                     </div>
//                 </ng-template>
//             </ng-container>

//             <ng-template  #notUpdated>
//                 <ng-container *ngIf="element[column.name]">
//                     <ng-container [ngSwitch]="column.type">
//                         <ng-container *ngSwitchCase="'normal'">
//                                 {{element[column.name]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'nameId'">
//                             <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock2">
//                                 <mat-chip-list>
//                                     <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                                 </mat-chip-list>
//                             </div>
//                             <ng-template  #elseBlock2>
//                                 {{element[column.name]['value']}}
//                             </ng-template >
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'dateTime'">
//                             {{element[column.name] | date: 'medium'}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'date'">
//                             {{element[column.name] | date}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'name2'">
//                             {{element[column.name]['value']}}, {{element[column.name][column.collections]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'currency'">
//                             {{element[column.name] | currency: element[column.collections]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'weight'">
//                             {{element[column.name]}} {{element[column.collections]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'check'">
//                             <mat-icon *ngIf="element[column.name] == [column.collections]">done</mat-icon>
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'array'">
//                             <show-details-table [oneColumns]="column.collections" [dataSource]="element[column.name]">
//                             </show-details-table>
//                         </ng-container>
//                     </ng-container>
//                 </ng-container>
//             </ng-template >
//         </td>
//     </ng-container>
 

//  <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
 
//  <tr mat-row *matRowDef="let element; columns: columnsDisplay"
//  [ngClass]="{'is-new': element.changeStatus === 'added', 'is-removed': element.changeStatus === 'removed'}"
//   ></tr>

// </table>

//  </ng-template>
//   `,
//   styleUrls: ['show-details-table.css'],
// })
// export class ShowDetailsTableComponent implements OnInit {


//   @Input() dataSource;

//   @Input() secondSource;

//   @Input() oneColumns = [];
//   @Input() titel: string;

//   noChanges: boolean = true;

//   localDataSource;
//   localOneColumns = [];
//   columnsDisplay: string[] = [];
//   constructor() {
//   }

//   ngOnInit() {
//     this.oneColumns.forEach(element => {
//         if(element.type === 'parent') {
//             this.takeCareOfParant(element.collections);
//         } else {
//             this.localOneColumns.push(element);
//             this.columnsDisplay.push(element.name);
//         }
//     });
//     this.setDataSourceInit();
//     if(this.secondSource) {
//         this.noChanges = false;
//         this.setSecondSourceInit();
//     }
//   }

//   setDataSourceInit() {
//       this.oneColumns.forEach(element => {
//           if(element.type === 'parent') {
//               this.dataParantRemove(element.collections, element.name);
//           }
//       });
//   }

//   setSecondSourceInit() {
//       this.oneColumns.forEach(element => {
//           if(element.type === 'parent') {
//               this.secondParantRemove(element.collections, element.name);
//           }
//       });
//       var result = diff(this.dataSource, this.secondSource, 'id', { updatedValues: 3, compareFunction: (o1,o2) => {
//         return isEqualWith(o1, o2, (value1, value2, key) => {
//             return key === 'version' ? true : undefined;
//         })
//       } });
//       if(result['added'].length || result['removed'].length ||result['updated'].length) {
//           var newDataSource = [];
//           result['same'].forEach(element => {
//               element['changeStatus'] = 'same';
//               newDataSource.push(element);
//           });
//           result['updated'].forEach(element => {
//             element['changeStatus'] = 'updated';
//             newDataSource.push(element);
//           });
//           result['added'].forEach(element => {
//               element['changeStatus'] = 'added';
//               newDataSource.push(element);
//           });
//           result['removed'].forEach(element => {
//               element['changeStatus'] = 'removed';
//               newDataSource.push(element);
//           });
//           this.dataSource = newDataSource;
//       }
//     }

//   takeCareOfParant(element) {
//     element.forEach(second => {
//         if(second.type === 'parent') {
//             this.takeCareOfParant(second.collections);
//         } else {
//             this.localOneColumns.push(second);
//             this.columnsDisplay.push(second.name);
//         }
//     });
//   }

//   dataParantRemove(element, name) {
//     this.dataSource.forEach(line => {
//         merge(line, line[name]);
//         delete line[name];
//     });
//     element.forEach(second => {
//         if(second.type === 'parent') {
//             this.dataParantRemove(second.collections, second.name);
//         }
//     });
//   }

//   secondParantRemove(element, name) {
//     this.secondSource.forEach(line => {
//         merge(line, line[name]);
//         delete line[name];
//     });
//     element.forEach(second => {
//         if(second.type === 'parent') {
//             this.secondParantRemove(second.collections, second.name);
//         }
//     });
//   }

//   isArray(obj : any ) {
//     return Array.isArray(obj)
//   }

//   isEqualObj(obj1 : any, obj2: any) {
//     return isEqualWith(obj1, obj2, (value1, value2, key) => {
//         return key === 'version' ? true : undefined;
//     })
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
//         return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
//       }
//     } else {
//       if(element[column.name]) {
//         return this.operators[column.compare.type](element[column.name], column.compare.pipes);
//       }
//     }
//     return false;
//   }

// }