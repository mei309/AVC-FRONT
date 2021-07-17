import { Component, Input } from '@angular/core';

@Component({
  selector: 'final-report-table',
  template:`
    <ng-container *ngFor="let process of processess">
        <ng-container *ngIf="dataSource[process.name]">
            <ng-container [ngSwitch]="process.type">
                <cells-qcs *ngSwitchCase="'qc'" [dataSource]="dataSource[process.name]" [process]="process.label">
                </cells-qcs>
                <cells-loading *ngSwitchCase="'shipping'" [dataSource]="dataSource[process.name]">
                </cells-loading>
                <cells-processes *ngSwitchCase="'inventory'" [process]="process.label" [oneColumns]="inventoryColumns" [dataSource]="dataSource[process.name]">
                </cells-processes>
                <cells-processes [process]="process.label" [dataSource]="dataSource[process.name]" *ngSwitchDefault>
                </cells-processes>
            </ng-container>
        </ng-container>
    </ng-container>
    ` ,
    styleUrls: ['./final-report-tables.css']
})
export class FinalReportTablesComponent {
    // <cells-final-report [dataSource]="dataSource[process.name]" *ngSwitchDefault>
    //             </cells-final-report>
    // <in-out-total *ngSwitchDefault [dataSource]="dataSource[process.name]">
    //             </in-out-total>
    
    @Input() dataSource;
    processess = [
        // {
        //     name: 'relocation',
        //     label: 'Relocation',
        // },
        {
            name: 'inventory',
            label: $localize`Inventory`,
            type: 'inventory',
        },
        {
            name: 'receipt',
            label: $localize`Receiving`,
        },
        {
            name: 'receiptQC',
            label: $localize`Receiving QC`,
            type: 'qc',
        },
        {
            name: 'cleaning',
            label: $localize`Cleaning`,
        },
        {
            name: 'roasting',
            label: $localize`Roasting`,
        },
        {
            name: 'toffee',
            label: $localize`Toffee`,
        },
        {
            name: 'roastQC',
            label: $localize`Roasting QC`,
            type: 'qc',
        },
        {
            name: 'packing',
            label: $localize`Packing`,
        },
        {
            name: 'loadings',
            type: 'shipping',
        },
    ];

    

      inventoryColumns = [
            {
                name: 'inventory',
                label: $localize`Inventory`,
                foot: 'totalInventory',
            },
            {
                name: 'inventoryUse',
                label: $localize`Inventory usage`,
                foot: 'totalInventoryUse',
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