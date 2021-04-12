import { Component, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { ReportsService } from './reports.service';

@Component({
  selector: 'final-report-summary',
  template:`
  <ng-container *ngIf="dataSource; else noDataSum">
    <ng-container *ngFor="let process of processess">
        <fieldset *ngIf="dataSource[process.name].length">
            <legend><h1>{{process.label}}</h1></legend>
            <ng-container [ngSwitch]="process.type">
                <normal-group-details *ngSwitchCase="'group'" [mainDetailsSource]="dataSource[process.name]" [mainColumns]="process.collections? process.collections : productionShow">
                </normal-group-details>
                <normal-details *ngSwitchCase="'normal'" [dataSource]="dataSource[process.name]" [oneColumns]="process.collections? process.collections : productionShow">
                </normal-details>
            </ng-container>
        </fieldset>
    </ng-container>
  </ng-container>
  <ng-template #noDataSum>
    <mat-spinner></mat-spinner>
  </ng-template>
    ` ,
    styleUrls: ['./final-report-tables.css']
})
export class FinalReportSummaryComponent {
    
    
    
    @Input() poCode;
    dataSource;

    constructor(private localService: ReportsService) {}

    ngOnInit() {
      this.localService.getFinalSummery(this.poCode).pipe(take(1)).subscribe( val => {
          this.dataSource = val;
      });
    }

    processess = [
        {
            name: 'orders',
            label: 'Orders',
            type: 'normal',
            collections: [
                  {
                    type: 'dateTime',
                    name: 'contractDate',
                    label: 'Contract date',
                  },
                  {
                    type: 'nameId',
                    name: 'item',
                    label: 'Product descrption',
                  },
                  {
                    type: 'weight2',
                    name: 'numberUnits',
                    label: 'Amount',
                  },
                  {
                    type: 'currency',
                    name: 'unitPrice',
                    label: 'Price per unit',
                  },
                  {
                    name: 'defects',
                    label: '% defects',
                    search: 'normal',
                  },
                  {
                    type: 'date',
                    name: 'deliveryDate',
                    label: 'Delivery date',
                    compare: {
                      type: 'date',
                      condition: 'RECEIVED',
                      condVar: 'orderStatus',
                    },
                  },
                  {
                    type: 'arrayVal',
                    name: 'approvals',
                    label: 'Approvals',
                  },
            ]
        },
        {
            name: 'receiving',
            label: 'Receiving',
            type: 'group',
            collections: [
                  {
                    type: 'weight2',
                    name: 'totalAmount',
                    label: 'Total receipt',
                  },
                  {
                    type: 'nameId',
                    name: 'item',
                    label: 'Product descrption',
                  },
                  {
                    type: 'weight',
                    name: 'receivedOrderUnits',
                    label: 'Payable units',
                    compare: {
                      name: 'orderBalance',
                      type: 'weight',
                    },
                  },
                  {
                    type: 'weight2',
                    name: 'receiptAmount',
                    label: 'Item amount',
                    compare: {
                      name: 'orderBalance',
                      type: 'weight',
                    },
                  },
                  {
                    type: 'weight',
                    name: 'extraAdded',
                    label: 'Extra requsted',
                  },
                  {
                    type: 'dateTime',
                    name: 'receiptDate',
                    label: 'Receipt date',
                  },
                  {
                    type: 'array',
                    name: 'storage',
                    label: 'Storage',
                  },
                  {
                    name: 'receiptRows',
                    type: 'kidArray',
                    collections: [
                    ]
                  }
            ]
        },
        {
            name: 'qcRaw',
            label: 'Receiving QC',
            type: 'normal',
            collections: [
                  {
                    type: 'nameId',
                    name: 'item',
                    label: 'Product descrption',
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
            ]
        },
        {
            name: 'cleaning',
            label: 'Cleaning',
            type: 'normal'
        },
        {
            name: 'relocation',
            label: 'Relocation',
            type: 'normal',
            collections: [
                {
                    type: 'itemWeight',
                    name: 'usedItems',
                    label: 'Used items',
                },
                {
                    type: 'itemWeight',
                    name: 'itemCounts',
                    label: 'Counted items',
                },
                {
                    type: 'weight2',
                    name: 'usedCountDifference',
                    label: 'Difference',
                },
                {
                    type: 'dateTime',
                    name: 'recordedTime',
                    label: 'Recorded time',
                },
                {
                    type: 'normal',
                    name: 'status',
                    label: 'Status',
                },
            ]
        },
        {
            name: 'roasting',
            label: 'Roasting',
            type: 'normal'
        },
        // {
        //     name: 'roastQC',
        //     label: 'Roasting QC',
        //     type: 'qc',
        // },
        {
            name: 'packing',
            label: 'Packing',
            type: 'normal'
        },
        {
            name: 'loading',
            label: 'Loading',
            type: 'group',
            collections: [
              {
                  type: 'nameId',
                  name: 'shipmentCode',
                  label: 'Shipment code',
                  group: 'shipmentCode',
              },
              {
                  type: 'arrayVal',
                  name: 'poCodes',
                  label: 'PO#',
                  // search: 'object',
                  group: 'poCodes',
              },
              {
                  type: 'dateTime',
                  name: 'recordedTime',
                  label: 'Recorded time',
                  group: 'poCodes',
              },
              {
                  type: 'nameId',
                  name: 'item',
                  label: 'Product descrption',
              },
              {
                  type: 'weight2',
                  name: 'totalRow',
                  label: 'Loaded amounts',
                  // type: 'object',
                  // options: 'currency',
              },
              {
                  type: 'normal',
                  name: 'status',
                  label: 'Status',
              },
              {
                name: 'loadedTotals',
                type: 'kidArray',
                collections: [
                ]
              }
            ]
        },
    ];
    
    productionShow = [
            {
                type: 'itemWeight',
                name: 'usedItems',
                label: 'Used items',
            },
            {
                type: 'itemWeight',
                name: 'producedItems',
                label: 'Produced items',
            },
            {
                type: 'weight2',
                name: 'processGain',
                label: 'Difference',
            },
            {
                type: 'dateTime',
                name: 'recordedTime',
                label: 'Recorded time',
            },
            {
                type: 'normal',
                name: 'status',
                label: 'Status',
            },
        ];


}