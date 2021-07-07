import { Component, Input } from '@angular/core';

@Component({
  selector: 'final-report-table',
  template:`
    <ng-container *ngFor="let process of processess">
        <fieldset *ngIf="dataSource[process.name]">
            <legend><h1>{{process.label}}</h1></legend>
            <ng-container [ngSwitch]="process.type">
                <normal-group-details *ngSwitchCase="'qc'" [mainDetailsSource]="dataSource[process.name]" [mainColumns]="columnsQc">
                </normal-group-details>
                <ng-container *ngSwitchCase="'shipping'">
                    <in-out-total  *ngFor="let line of dataSource[process.name]" [dataSource]="line" shipping="true">
                    </in-out-total>
                </ng-container>
                <in-out-total *ngSwitchCase="'inventory'" [oneColumns]="inventoryColumns" [dataSource]="dataSource[process.name]">
                </in-out-total>
                <in-out-total *ngSwitchDefault [dataSource]="dataSource[process.name]">
                </in-out-total>
            </ng-container>
        </fieldset>
    </ng-container>
    ` ,
    styleUrls: ['./final-report-tables.css']
})
export class FinalReportTablesComponent {
    
    
    
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
            label: `Loadings`,
            type: 'shipping',
        },
    ];

    
    columnsQc = [
        {
            type: 'normal',
            name: 'checkedBy',
            label: $localize`Checked by`,
            group: 'checkedBy'
        },
        {
            type: 'date',
            name: 'date',
            label: $localize`Check date`,
            group: 'checkedBy'
        },
        {
            type: 'normal',
            name: 'approvals',
            label: $localize`Approvals`,
            group: 'checkedBy'
        },
        {
            type: 'normal',
            name: 'status',
            label: $localize`Status`,
            group: 'checkedBy'
        },
        {
          type: 'nameId',
          name: 'item',
          label: $localize`Product descrption`,
        },
        {
            type: 'percent',
            label: $localize`Humidity`,
            name: 'humidity',
        },
        {
            type: 'percentNormal',
            label: $localize`Breakage`,
            name: 'breakage',
        },
        {
          type: 'percentNormal',
          name: 'totalDamage',
          label: $localize`Total damage`,
        },
        {
          type: 'percentNormal',
          name: 'totalDefects',
          label: $localize`Total defects`,
        },
        {
          type: 'percentNormal',
          name: 'totalDefectsAndDamage',
          label: $localize`Total defects + damage`,
        },
        {
            type: 'kidArray',
            name: 'itemQcs',
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


        regShow = [
            // {
            //     name: 'processes',
            //     label: $localize`Processes`,
            // },
            {
                type: 'itemWeight',
                name: 'productIn',
                label: $localize`Product in`,
                foot: 'totalProductIn',
            },
            {
                type: 'itemWeight',
                name: 'ingredients',
                label: $localize`Ingredients`,
                foot: 'totalIngredients',
            },
            {
                type: 'itemWeight',
                name: 'received',
                label: $localize`Received`,
                foot: 'totalReceived',
            },
            {
                type: 'itemWeight',
                name: 'productOut',
                label: $localize`Product out`,
                foot: 'totalProductOut',
            },
            {
                type: 'itemWeight',
                name: 'waste',
                label: $localize`Waste`,
                foot: 'totalWaste',
            },
            {
                type: 'itemWeight',
                name: 'productCount',
                label: $localize`Product count`,
                foot: 'totalProductCount',
            },
            // {
            //     name: 'difference',
            // },
        ];
    getDisplayedColumns(myData): string[] {
        if(myData.some(a => a.amount)) {
            return ['item', 'amount', 'weight'];
        } else {
            return ['item', 'weight']
        }
    }
}