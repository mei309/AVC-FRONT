import { Component, Input } from '@angular/core';

@Component({
  selector: 'final-report-table',
  template:`
    <ng-container *ngFor="let process of processess">
        <fieldset *ngIf="dataSource[process.name]">
            <legend><h1>{{process.label}}</h1></legend>
            <ng-container [ngSwitch]="process.type">
                <normal-details *ngSwitchCase="'qc'" [dataSource]="dataSource[process.name]" [oneColumns]="columnsQc">
                </normal-details>
                <ng-container *ngSwitchCase="'shipping'">
                    <in-out-total  *ngFor="let line of dataSource[process.name]" [dataSource]="line" shipping="true">
                    </in-out-total>
                </ng-container>
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
            name: 'receipt',
            label: 'Receiving',
        },
        {
            name: 'receiptQC',
            label: 'Receiving QC',
            type: 'qc',
        },
        {
            name: 'cleaning',
            label: 'Cleaning',
        },
        {
            name: 'roasting',
            label: 'Roasting',
        },
        {
            name: 'roastQC',
            label: 'Roasting QC',
            type: 'qc',
        },
        {
            name: 'packing',
            label: 'Packing',
        },
        {
            name: 'loadings',
            label: 'Loadings',
            type: 'shipping',
        },
    ];

    
    columnsQc = [
        {
          type: 'nameId',
          name: 'item',
          label: 'Product descrption',
        },
        {
            type: 'percent',
            label: 'Humidity',
            name: 'humidity',
        },
        {
            type: 'percentNormal',
            label: 'Breakage',
            name: 'breakage',
        },
        {
          type: 'percentNormal',
          name: 'totalDamage',
          label: 'Total damage',
        },
        {
          type: 'percentNormal',
          name: 'totalDefects',
          label: 'Total defects',
        },
        {
          type: 'percentNormal',
          name: 'totalDefectsAndDamage',
          label: 'Total defects + damage',
        },
        {
          type: 'dateTime',
          name: 'checkDate',
          label: 'Check date',
        },
      ];

    getDisplayedColumns(myData): string[] {
        if(myData.some(a => a.amount)) {
            return ['item', 'amount', 'weight'];
        } else {
            return ['item', 'weight']
        }
    }
}