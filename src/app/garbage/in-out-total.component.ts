// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'in-out-total',
//   template:`
//   <div *ngIf="shipping" style="display: inline-block">
//     <show-details [oneColumns]="loadingColumns" [dataSource]="dataSource">
//     </show-details>
//   </div>
//   <ng-container *ngFor="let column of oneColumns">
//         <ng-container *ngIf="dataSource[column.name]">
//             <ng-container [ngSwitch]="column.name">
//                 <table style="margin: auto;" mat-table *ngSwitchCase="'processes'" [dataSource]="dataSource[column.name]" class="mat-elevation-z2">
//                     <ng-container matColumnDef="titel">
//                         <th mat-header-cell *matHeaderCellDef colspan="3"><h3>{{column.label}}</h3></th>
//                     </ng-container>
//                     <ng-container matColumnDef="date">
//                         <th mat-header-cell *matHeaderCellDef><h3 i18n>Date</h3></th>
//                         <td mat-cell *matCellDef="let element"> {{element.date | date}} </td>
//                     </ng-container>
//                     <ng-container matColumnDef="status">
//                         <th mat-header-cell *matHeaderCellDef><h4 i18n>Status</h4></th>
//                         <td mat-cell *matCellDef="let element"> {{element.status}} </td>
//                     </ng-container>
//                     <ng-container matColumnDef="approvals">
//                         <th mat-header-cell *matHeaderCellDef><h4 i18n>Approvals</h4></th>
//                         <td mat-cell *matCellDef="let element"> {{element.approvals}} </td>
//                     </ng-container>
//                     <tr mat-header-row *matHeaderRowDef="['titel']"></tr>
//                     <tr mat-header-row *matHeaderRowDef="['date', 'status', 'approvals']"></tr>
//                     <tr mat-row *matRowDef="let row; columns: ['date', 'status', 'approvals']"></tr>
//                 </table>
//                 <div style="text-align:center" *ngSwitchCase="'difference'">
//                           <h2>Difference: {{dataSource[column.name] | tableCellPipe: 'weight' : null}} ({{dataSource['percentageLoss']}}%)</h2>
//                 </div>
//                 <table style="display: inline-block" mat-table *ngSwitchDefault [dataSource]="dataSource[column.name]" class="mat-elevation-z2">
//                     <ng-container matColumnDef="titel">
//                         <th mat-header-cell *matHeaderCellDef colspan="3"><h3>{{column.label}}</h3></th>
//                     </ng-container>
//                     <ng-container matColumnDef="item">
//                         <th mat-header-cell *matHeaderCellDef><h4 i18n>Item</h4></th>
//                         <td mat-cell *matCellDef="let element"> {{element.item.value}} </td>
//                     </ng-container>
//                     <ng-container matColumnDef="amount">
//                         <th mat-header-cell *matHeaderCellDef><h4 i18n>Amount</h4></th>
//                         <td mat-cell *matCellDef="let element"> 
//                             {{element.amount | tableCellPipe: 'weight' : null}}
//                         </td>
//                     </ng-container>
//                     <ng-container matColumnDef="weight">
//                         <th mat-header-cell *matHeaderCellDef><h4 i18n>Weight</h4></th>
//                         <td mat-cell *matCellDef="let element">
//                             {{element.weight | tableCellPipe: 'weight2' : null}} 
//                         </td>
//                     </ng-container>
//                     <ng-container matColumnDef="footer">
//                         <th mat-footer-cell *matFooterCellDef colspan="3">
//                             Total: {{dataSource[column.foot] | tableCellPipe: 'weight' : null}}
//                         </th>
//                     </ng-container>
//                     <tr mat-header-row *matHeaderRowDef="['titel']"></tr>
//                     <tr mat-header-row *matHeaderRowDef="getDisplayedColumns(dataSource[column.name])"></tr>
//                     <tr mat-row *matRowDef="let row; columns: getDisplayedColumns(dataSource[column.name])"></tr>
//                     <tr mat-footer-row *matFooterRowDef="['footer']"></tr>
//                 </table>
//             </ng-container>
//         </ng-container>
//     </ng-container>
//   ` ,
//   styleUrls: ['./final-report-tables.css']
// })
// export class InOutTotalComponent {
//     @Input() shipping: boolean = false;
//     @Input() dataSource;
    

//     @Input() set oneColumns(value) {
//         if(value){
//             this.regShow = value;
//         }
//     }
//     get oneColumns() { return this.regShow; }

//   constructor() {}

//   regShow = [
//     {
//         name: 'processes',
//         label: $localize`Processes`,
//     },
//     {
//         name: 'productIn',
//         label: $localize`Product in`,
//         foot: 'totalProductIn',
//     },
//     {
//         name: 'ingredients',
//         label: $localize`Ingredients`,
//         foot: 'totalIngredients',
//     },
//     {
//         name: 'received',
//         label: $localize`Received`,
//         foot: 'totalReceived',
//     },
//     {
//         name: 'productOut',
//         label: $localize`Product out`,
//         foot: 'totalProductOut',
//     },
//     {
//         name: 'waste',
//         label: $localize`Waste`,
//         foot: 'totalWaste',
//     },
//     {
//         name: 'productCount',
//         label: $localize`Product count`,
//         foot: 'totalProductCount',
//     },
//     {
//         name: 'difference',
//     },
// ];
// loadingColumns = [
//     {
//         type: 'nameId',
//         name: 'shipmentCode',
//         label: $localize`Shipment code`,
//     },
//     {
//         type: 'date',
//         name: 'date',
//         label: $localize`Date and time`,
//     },
//     {
//         type: 'normal',
//         name: 'approvals',
//         label: $localize`Approvals`,
//     },
//     {
//         type: 'normal',
//         name: 'status',
//         label: $localize`Status`,
//     },
//     {
//         type: 'object',
//         name: 'containerDetails',
//         label: $localize`Container details`,
//         collections: [
//             {
//                 name: 'containerNumber',
//                 label: $localize`Container number`,
//             },
//             {
//                 name: 'sealNumber',
//                 label: $localize`Seal number`,
//             },
//             {
//                 name: 'containerType',
//                 label: $localize`Container type`
//             }
//         ],
//     }
// ];
//     getDisplayedColumns(myData): string[] {
//         if(myData.some(a => a.amount)) {
//             return ['item', 'amount', 'weight'];
//         } else {
//             return ['item', 'weight']
//         }
//     }
// }
