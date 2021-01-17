import { Component, Input } from '@angular/core';

@Component({
  selector: 'in-out-total',
  template:`
  <ng-container *ngIf="shipping">
    <show-details [oneColumns]="loadingColumns" [dataSource]="dataSource">
    </show-details>
  </ng-container>
  <ng-container *ngFor="let column of oneColumns">
        <ng-container *ngIf="dataSource[column.name]">
            <ng-container [ngSwitch]="column.name">
                <table style="display: inline-block" mat-table *ngSwitchCase="'processes'" [dataSource]="dataSource[column.name]" class="mat-elevation-z2">
                    <ng-container matColumnDef="titel">
                        <th mat-header-cell *matHeaderCellDef colspan="3"><h3>{{column.label}}</h3></th>
                    </ng-container>
                    <ng-container matColumnDef="date">
                        <th mat-header-cell *matHeaderCellDef><h3>Date</h3></th>
                        <td mat-cell *matCellDef="let element"> {{element.date | date}} </td>
                    </ng-container>
                    <ng-container matColumnDef="status">
                        <th mat-header-cell *matHeaderCellDef><h4>Status</h4></th>
                        <td mat-cell *matCellDef="let element"> {{element.status}} </td>
                    </ng-container>
                    <ng-container matColumnDef="approvals">
                        <th mat-header-cell *matHeaderCellDef><h4>Approvals</h4></th>
                        <td mat-cell *matCellDef="let element"> {{element.approvals}} </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="['titel']"></tr>
                    <tr mat-header-row *matHeaderRowDef="['date', 'status', 'approvals']"></tr>
                    <tr mat-row *matRowDef="let row; columns: ['date', 'status', 'approvals']"></tr>
                </table>
                <mat-form-field appearance="none" *ngSwitchCase="'difference'" provideReadonly>
                    <mat-label>Difference</mat-label>
                    <input style="white-space: pre-wrap;" readonly matInput [value]="dataSource[column.name] | tableCellPipe: 'weight' : null">
                </mat-form-field>
                <table style="display: inline-block" mat-table *ngSwitchDefault [dataSource]="dataSource[column.name]" class="mat-elevation-z2">
                    <ng-container matColumnDef="titel">
                        <th mat-header-cell *matHeaderCellDef colspan="3"><h3>{{column.label}}</h3></th>
                    </ng-container>
                    <ng-container matColumnDef="item">
                        <th mat-header-cell *matHeaderCellDef><h4>Item</h4></th>
                        <td mat-cell *matCellDef="let element"> {{element.item.value}} </td>
                    </ng-container>
                    <ng-container matColumnDef="amount">
                        <th mat-header-cell *matHeaderCellDef><h4>Amount</h4></th>
                        <td mat-cell *matCellDef="let element"> 
                            {{element.amount | tableCellPipe: 'weight' : null}}
                        </td>
                    </ng-container>
                    <ng-container matColumnDef="weight">
                        <th mat-header-cell *matHeaderCellDef><h4>Weight</h4></th>
                        <td mat-cell *matCellDef="let element">
                            {{element.weight | tableCellPipe: 'weight2' : null}} 
                        </td>
                    </ng-container>
                    <ng-container matColumnDef="footer">
                        <th mat-footer-cell *matFooterCellDef colspan="3">
                            Total: {{dataSource[column.foot] | tableCellPipe: 'weight' : null}}
                        </th>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="['titel']"></tr>
                    <tr mat-header-row *matHeaderRowDef="getDisplayedColumns(dataSource[column.name])"></tr>
                    <tr mat-row *matRowDef="let row; columns: getDisplayedColumns(dataSource[column.name])"></tr>
                    <tr mat-footer-row *matFooterRowDef="['footer']"></tr>
                </table>
            </ng-container>
        </ng-container>
    </ng-container>
  ` ,
  styleUrls: ['./final-report-tables.css']
})
export class InOutTotalComponent {
    @Input() shipping: boolean = false;
    @Input() dataSource;
    
  constructor() {}

  oneColumns = [
    {
        name: 'processes',
        label: 'Processes',
    },
    {
        name: 'productIn',
        label: 'Product in',
        foot: 'totalProductIn',
    },
    {
        name: 'productOut',
        label: 'Product out',
        foot: 'totalProductOut',
    },
    {
        name: 'waste',
        label: 'Waste',
        foot: 'totalWaste',
    },
    {
        name: 'productCount',
        label: 'Product count',
        foot: 'totalProductCount',
    },
    {
        name: 'difference',
    },
];
loadingColumns = [
    {
        type: 'nameId',
        name: 'shipmentCode',
        label: 'Shipment code',
    },
    {
        type: 'date',
        name: 'date',
        label: 'Check date',
    },
    {
        type: 'normal',
        name: 'approvals',
        label: 'Approvals',
    },
    {
        type: 'normal',
        name: 'status',
        label: 'Status',
    },
    {
        type: 'object',
        name: 'containerDetails',
        label: 'Container details',
        collections: [
            {
                name: 'containerNumber',
                label: 'Container number',
            },
            {
                name: 'sealNumber',
                label: 'Seal number',
            },
            {
                name: 'containerType',
                label: 'Container type'
            }
        ],
    }
];
    getDisplayedColumns(myData): string[] {
        if(myData.some(a => a.amount)) {
            return ['item', 'amount', 'weight'];
        } else {
            return ['item', 'weight']
        }
    }
}

// <div class="half" *ngIf="dataSource.shipmentCode">
//             <label>Shipment code</label>
//             <span class="half">{{dataSource.shipmentCode | tableCellPipe: 'nameId' : null}}</span>
//     </div>
//     <ng-container *ngIf="dataSource.containerDetails">
//         <h3>Container details</h3>
//         <ng-container *ngFor="let key of containerColumns">
//             <div class="half" *ngIf="dataSource.containerDetails[key.name]">
//                 <label>{{key.label}}</label>
//                 <span class="half">{{dataSource.containerDetails[key.name] | tableCellPipe: 'normal' : null}}</span>
//             </div>
//         </ng-container>
//     </ng-container>
