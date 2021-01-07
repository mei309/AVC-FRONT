import { Component, Input } from '@angular/core';

@Component({
  selector: 'in-out-total',
  template:`
  <ng-container *ngIf="shipping">
    <div class="half" *ngIf="dataSource.shipmentCode">
            <label>Shipment code</label>
            <span class="half">{{dataSource.shipmentCode | tableCellPipe: 'nameId' : null}}</span>
    </div>
    <ng-container *ngIf="dataSource.containerDetails">
        <h3>Container details</h3>
        <ng-container *ngFor="let key of containerColumns">
            <div class="half" *ngIf="dataSource.containerDetails[key.name]">
                <label>{{key.label}}</label>
                <span class="half">{{dataSource.containerDetails[key.name] | tableCellPipe: 'normal' : null}}</span>
            </div>
        </ng-container>
    </ng-container>
  </ng-container>
  <ng-container *ngFor="let column of oneColumns">
        <ng-container *ngIf="dataSource[column.name]">
            <ng-container [ngSwitch]="column.name">
                <table style="display: inline-block" mat-table *ngSwitchCase="'dates'" [dataSource]="dataSource[column.name]" class="mat-elevation-z2">
                    <ng-container matColumnDef="dates">
                        <th mat-header-cell *matHeaderCellDef><h3>Dates</h3></th>
                        <td mat-cell *matCellDef="let element"> {{element | date}} </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="['dates']"></tr>
                    <tr mat-row *matRowDef="let row; columns: ['dates']"></tr>
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
        name: 'dates',
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
containerColumns = [
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
];
  getDisplayedColumns(myData): string[] {
    if(myData.some(a => a.amount)) {
        return ['item', 'amount', 'weight'];
    } else {
        return ['item', 'weight']
    }
}
}
