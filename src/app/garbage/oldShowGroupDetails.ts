// import { Component, Input, OnInit } from '@angular/core';
// import {merge, isEqualWith} from 'lodash-es';
// import { diff } from '../libraries/diffArrayObjects.interface';
// // import diff_arrays_of_objects from 'diff-arrays-of-objects';

// @Component({
//   selector: 'show-details-group-table',
//   template: `
//   <h2>{{titel}}</h2>
// <ng-container *ngIf="noChanges; else elseblockmain">
//     <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

//         <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
//             <th mat-header-cell *matHeaderCellDef>
//                 <h3>{{column.label}}</h3>
//             </th>
//             <td mat-cell style="vertical-align: top;
//                 padding-left: 16px;
//                 padding-top: 14px;" *matCellDef="let element; let i = index"
//                     [style.display]="getRowSpan(i) ? '' : 'none'"
//                     [attr.rowspan]="getRowSpan(i)">
//                 <ng-container *ngIf="element[column.name]">
//                 {{element[column.name] | tableCellPipe: column.type : column.collections}}
//                     <ng-container [ngSwitch]="column.type">
//                         <ng-container *ngSwitchCase="'normal'">
//                                 {{element[column.name]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'nameId'">
//                             <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock">
//                                 <mat-chip-list>
//                                     <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                                 </mat-chip-list>
//                             </div>
//                             <ng-template  #elseBlock>
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
//             </td>
//         </ng-container>


//         <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
//             <th mat-header-cell *matHeaderCellDef>
//                 <h3>{{column.label}}</h3>
//             </th>

//             <td mat-cell *matCellDef="let element">
//                 <ng-container *ngIf="element[column.name]">
//                     <ng-container [ngSwitch]="column.type">
//                         <ng-container *ngSwitchCase="'normal'">
//                                 {{element[column.name]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'nameId'">
//                             <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock1">
//                                 <mat-chip-list>
//                                     <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                                 </mat-chip-list>
//                             </div>
//                             <ng-template  #elseBlock1>
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
//             </td>

//         </ng-container>


        
        

//         <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        
//         <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>

//     </table>

// </ng-container>
// <ng-template  #elseblockmain>

//     <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//             <h3>{{column.label}}</h3>
//         </th>
//         <td mat-cell style="vertical-align: top;
//             padding-left: 16px;
//             padding-top: 14px;" *matCellDef="let element; let i = index"
//                 [style.display]="getRowSpan(i) ? '' : 'none'"
//                 [attr.rowspan]="getRowSpan(i)">
//             <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated">
//                 <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual">      
//                     <ng-container *ngIf="element[0][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock2">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock2>
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
//                         </ng-container>
//                     </ng-container>
//                 </ng-container>
//                 <ng-template  #notEqual>
//                     <div class="removed-item" *ngIf="element[0][column.name]">
//                     {{element[0][column.name] | json}}
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock3">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock3>
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
//                         </ng-container>
//                     </div>
//                     <div class="added-item" *ngIf="element[1][column.name]">
//                     {{element[1][column.name] | json}}
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[1][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[1][column.name]); else elseBlock4">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[1][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock4>
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
//             <ng-template #notUpdated>
//                 <ng-container *ngIf="element[column.name]">
//                     <ng-container [ngSwitch]="column.type">
//                         <ng-container *ngSwitchCase="'normal'">
//                                 {{element[column.name]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'nameId'">
//                             <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock5">
//                                 <mat-chip-list>
//                                     <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                                 </mat-chip-list>
//                             </div>
//                             <ng-template  #elseBlock5>
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
//                     </ng-container>
//                 </ng-container>
//             </ng-template>
//         </td>
//     </ng-container>


//     <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
//         <th mat-header-cell *matHeaderCellDef>
//             <h3>{{column.label}}</h3>
//         </th>
//         <td mat-cell *matCellDef="let element">
//             <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated1">
//                 <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual1">      
//                     <ng-container *ngIf="element[0][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock6">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock6>
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
//                         </ng-container>
//                     </ng-container>
//                 </ng-container>
//                 <ng-template  #notEqual1>
//                     <div class="removed-item" *ngIf="element[0][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[0][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[0][column.name]); else elseBlock7">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[0][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock7>
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
//                         </ng-container>
//                     </div>
//                     <div class="added-item" *ngIf="element[1][column.name]">
//                         <ng-container [ngSwitch]="column.type">
//                             <ng-container *ngSwitchCase="'normal'">
//                                     {{element[1][column.name]}}
//                             </ng-container>
//                             <ng-container *ngSwitchCase="'nameId'">
//                                 <div style="display: inline" *ngIf="isArray(element[1][column.name]); else elseBlock8">
//                                     <mat-chip-list>
//                                         <mat-chip *ngFor="let symbol of element[1][column.name];">{{symbol.value}} </mat-chip>
//                                     </mat-chip-list>
//                                 </div>
//                                 <ng-template  #elseBlock8>
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
//             <ng-template #notUpdated1>
//                 <ng-container *ngIf="element[column.name]">
//                     <ng-container [ngSwitch]="column.type">
//                         <ng-container *ngSwitchCase="'normal'">
//                                 {{element[column.name]}}
//                         </ng-container>
//                         <ng-container *ngSwitchCase="'nameId'">
//                             <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock9">
//                                 <mat-chip-list>
//                                     <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
//                                 </mat-chip-list>
//                             </div>
//                             <ng-template  #elseBlock9>
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
//                     </ng-container>
//                 </ng-container>
//             </ng-template>
//         </td>
//     </ng-container>

//     <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>

//     <tr mat-row *matRowDef="let element; columns: columnsDisplay"
//     [ngClass]="{'is-new': element.changeStatus === 'added', 'is-removed': element.changeStatus === 'removed'}"
//     ></tr>

//     </table>

// </ng-template>
//   `,
//   styleUrls: ['show-details-table.css'],
// })
// export class ShowDetailsTableGroupComponent implements OnInit {


//   @Input() dataSource;

//   @Input() secondSource;

//   @Input() oneColumns = [];
//   @Input() titel: string;

//   noChanges: boolean = true;
  
// //   localDataSource;
//   localOneColumns = [];
//   localGroupOneColumns = [];
//   columnsDisplay: string[] = [];
//   spans = [];
//   constructor() {
//   }

//   ngOnInit() {
//     this.oneColumns.forEach(element => {
//         if(element.type === 'parent') {
//             this.takeCareOfParant(element.collections, this.localGroupOneColumns);
//         } else if(element.type === 'kidArray'){
//             element.collections.forEach(second => {
//                 if(second.type === 'parent') {
//                     this.takeCareOfParant(second.collections, this.localOneColumns);
//                 } else {
//                     this.localOneColumns.push(second);
//                     this.columnsDisplay.push(second.name);
//                 }
//             });
//         } else {
//             this.localGroupOneColumns.push(element);
//             this.columnsDisplay.push(element.name);
//         }
//     });
//     if(this.secondSource) {
//         this.noChanges = false;
//         this.setSecondSourceInit();
//         this.spanRow(d => {
//             if(d['changeStatus'] === 'updated'){
//                 return d[0]['id'];
//             } else {
//                 return d['id'];
//             }
//         });
//     } else {
//         this.setDataSourceInit();
//         this.spanRow(d => d['id']);
//     }
//   }


//   setDataSourceInit() {
//         this.oneColumns.forEach(element => {
//             if(element.type === 'parent') {
//                 this.dataParantRemove(element.collections, this.localGroupOneColumns);
//             } else if(element.type === 'kidArray'){
//                 var arr = [];
//                 this.dataSource.forEach(line => {
//                     line[element.name].forEach(obj => {
//                         var copied = Object.assign({}, obj, line);
//                         delete copied[element.name];
//                         arr.push(copied);
//                     });
//                 });
//                 this.dataSource = arr;
//                 element.collections.forEach(second => {
//                     if(second.type === 'parent') {
//                         this.dataParantRemove(second.collections, this.localOneColumns);
//                     }
//                 });
//             }
//         });
//   }

//   setSecondSourceInit() {
      
//       var result = diff(this.secondSource, this.dataSource, 'id', { updatedValues: 3, compareFunction: (o1,o2)  =>{
//             return isEqualWith(o1, o2, (value1, value2, key) => {
//                 return key === 'version' ? true : undefined;
//             })
//         } });
//       if(result['added'].length || result['removed'].length ||result['updated'].length) {
//           this.noChanges = false;
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
          
//           this.oneColumns.forEach(element => {
//               if(element.type === 'parent') {
//                   this.dataParantUpdatedRemove(element.collections, this.localGroupOneColumns);
//               } else if(element.type === 'kidArray'){
//                 this.takeCareKidArray(element);
//               }
//           });
//       }
//     //   console.log(this.dataSource);
      
//   }

//   takeCareOfParant(element, coulmns) {
//     element.forEach(second => {
//         if(second.type === 'parent') {
//             this.takeCareOfParant(second.collections, coulmns);
//         } else {
//             coulmns.push(second);
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

//   dataParantUpdatedRemove(element, name) {
//     this.dataSource.forEach(line => {
//         if(line['changeStatus'] === 'updated') {
//             merge(line[0], line[0][name]);
//             delete line[0][name];
//             merge(line[1], line[1][name]);
//             delete line[1][name];
//         } else {
//             merge(line, line[name]);
//             delete line[name];
//         }
//     });
//     element.forEach(second => {
//         if(second.type === 'parent') {
//             this.dataParantUpdatedRemove(second.collections, second.name);
//         } else if(element.type === 'kidArray'){
//             this.takeCareKidArray(element);
//         }
//     });
//   }

//   takeCareKidArray(element) {
    
//     var arr = [];
//     this.dataSource.forEach(line => {
//         if(line['changeStatus'] === 'updated') {
//               // var result1 = diffArray(line[0][element.name], line[1][element.name], 'id', { updatedValues: diffArray.updatedValues.both });
//               var result1 = diff(line[0][element.name], line[1][element.name], 'id', { updatedValues: 3, compareFunction: (o1,o2) => {
//                       return isEqualWith(o1, o2, (value1, value2, key) => {
//                           return key === 'version' ? true : undefined;
//                       })
//               } });
              
//               result1['same'].forEach(element => {
//                   var copied1 = Object.assign({}, element, line[0]);
//                   delete copied1[element.name];
//                   var copied2 = Object.assign({}, element, line[1]);
//                   delete copied2[element.name];
//                   var newnewarr = [copied1, copied2];
//                   newnewarr['changeStatus'] = 'updated';
//                   arr.push(newnewarr);
//               });
//               result1['updated'].forEach(element => {
//                   var copied1 = Object.assign({}, element[0], line[0]);
//                   delete copied1[element.name];
//                   var copied2 = Object.assign({}, element[1], line[1]);
//                   delete copied2[element.name];
//                   var newnewarr = [copied1, copied2];
//                   newnewarr['changeStatus'] = 'updated';
//                   arr.push(newnewarr);
//               });
//               result1['added'].forEach(element => {
//                   var copied1 = Object.assign({}, {}, line[0]);
//                   delete copied1[element.name];
//                   var copied2 = Object.assign({}, element, line[1]);
//                   delete copied2[element.name];
//                   var newnewarr = [copied1, copied2];
//                   newnewarr['changeStatus'] = 'updated';
//                   arr.push(newnewarr);
//               });
//               result1['removed'].forEach(element => {
//                   var copied1 = Object.assign({}, element, line[0]);
//                   delete copied1[element.name];
//                   var copied2 = Object.assign({}, {}, line[1]);
//                   delete copied2[element.name];
//                   var newnewarr = [copied1, copied2];
//                   newnewarr['changeStatus'] = 'updated';
//                   arr.push(newnewarr);
//               });
//         } else {
//             line[element.name].forEach(obj => {
//                 var copied = Object.assign({}, obj, line);
//                 delete copied[element.name];
//                 arr.push(copied);
//             });
//         }
//     });
//     this.dataSource = arr;
//     element.collections.forEach(second => {
//         if(second.type === 'parent') {
//             this.dataParantUpdatedRemove(second.collections, this.localOneColumns);
//         }
//     });
//   }

  
//   spanRow(accessor) {
//     for (let i = 0; i < this.dataSource.length;) {
//       let currentValue = accessor(this.dataSource[i]);
//       let count = 1;
 
//       // Iterate through the remaining rows to see how many match
//       // the current value as retrieved through the accessor.
//       for (let j = i + 1; j < this.dataSource.length; j++) {
//         if (currentValue != accessor(this.dataSource[j])) {
//           break;
//         }
 
//         count++;
//       }

//       if (!this.spans[i]) {
//         this.spans[i] = {};
//       }
 
//       // Store the number of similar values that were found (the span)
//       // and skip i to the next unique row.
//       this.spans[i]['id'] = count;
//       i += count;
//     }  
//   }
 
//   getRowSpan(index) {
//     return this.spans[index] && this.spans[index]['id'];
//   }

//   isArray(obj : any ) {
//     return Array.isArray(obj)
//   }

//   isEqualObj(obj : any, obj2: any) {
//     // return isEqual(obj, obj2);
//     return isEqualWith(obj, obj2, (value1, value2, key) => {
//         return key === 'version' ? true : undefined;
//     })
//   }

// }
