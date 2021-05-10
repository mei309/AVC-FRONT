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
            label: $localize`Orders`,
            type: 'normal',
            collections: [
                  {
                    type: 'dateTime',
                    name: 'contractDate',
                    label: $localize`Contract date`,
                  },
                  {
                    type: 'nameId',
                    name: 'item',
                    label: $localize`Product descrption`,
                  },
                  {
                    type: 'weight2',
                    name: 'numberUnits',
                    label: $localize`Amount`,
                  },
                  {
                    type: 'currency',
                    name: 'unitPrice',
                    label: $localize`Price per unit`,
                  },
                  {
                    name: 'defects',
                    label: $localize`% defects`,
                    search: 'normal',
                  },
                  {
                    type: 'date',
                    name: 'deliveryDate',
                    label: $localize`Delivery date`,
                    compare: {
                      type: 'date',
                      condition: 'RECEIVED',
                      condVar: 'orderStatus',
                    },
                  },
                  {
                    type: 'arrayVal',
                    name: 'approvals',
                    label: $localize`Approvals`,
                  },
            ]
        },
        {
            name: 'receiving',
            label: $localize`Receiving`,
            type: 'group',
            collections: [
                  {
                    type: 'weight2',
                    name: 'totalAmount',
                    label: $localize`Total receipt`,
                  },
                  {
                    type: 'nameId',
                    name: 'item',
                    label: $localize`Product descrption`,
                  },
                  {
                    type: 'weight',
                    name: 'receivedOrderUnits',
                    label: $localize`Payable units`,
                    compare: {
                      name: 'orderBalance',
                      type: 'weight',
                    },
                  },
                  {
                    type: 'weight2',
                    name: 'receiptAmount',
                    label: $localize`Item amount`,
                    compare: {
                      name: 'orderBalance',
                      type: 'weight',
                    },
                  },
                  {
                    type: 'weight',
                    name: 'extraAdded',
                    label: $localize`Extra requsted`,
                  },
                  {
                    type: 'dateTime',
                    name: 'receiptDate',
                    label: $localize`Receipt date`,
                  },
                  {
                    type: 'array',
                    name: 'storage',
                    label: $localize`Storage`,
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
            label: $localize`Receiving QC`,
            type: 'normal',
            collections: [
                  {
                    type: 'nameId',
                    name: 'item',
                    label: $localize`Product descrption`,
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
                    type: 'dateTime',
                    name: 'checkDate',
                    label: $localize`Check date`,
                  },
                  {
                    type: 'arrayVal',
                    name: 'approvals',
                    label: $localize`Approvals`,
                  },
            ]
        },
        {
            name: 'rawRelocation',
            label: $localize`Raw relocation`,
            type: 'normal',
            collections: [
                {
                    type: 'itemWeight',
                    name: 'usedItems',
                    label: $localize`Used items`,
                },
                {
                    type: 'itemWeight',
                    name: 'itemCounts',
                    label: $localize`Counted items`,
                },
                {
                    type: 'weight2',
                    name: 'usedCountDifference',
                    label: $localize`Difference`,
                },
                {
                    type: 'dateTime',
                    name: 'recordedTime',
                    label: $localize`Recorded time`,
                },
                {
                    type: 'normal',
                    name: 'status',
                    label: $localize`Status`,
                },
            ]
        },
        {
            name: 'cleaning',
            label: $localize`Cleaning`,
            type: 'normal'
        },
        {
            name: 'cleanRelocation',
            label: $localize`Cleaned relocation`,
            type: 'normal',
            collections: [
                {
                    type: 'itemWeight',
                    name: 'usedItems',
                    label: $localize`Used items`,
                },
                {
                    type: 'itemWeight',
                    name: 'itemCounts',
                    label: $localize`Counted items`,
                },
                {
                    type: 'weight2',
                    name: 'usedCountDifference',
                    label: $localize`Difference`,
                },
                {
                    type: 'dateTime',
                    name: 'recordedTime',
                    label: $localize`Recorded time`,
                },
                {
                    type: 'normal',
                    name: 'status',
                    label: $localize`Status`,
                },
            ]
        },
        {
            name: 'roasting',
            label: $localize`Roasting`,
            type: 'normal'
        },
        // {
        //     name: 'roastQC',
        //     label: 'Roasting QC',
        //     type: 'qc',
        // },
        {
            name: 'packing',
            label: $localize`Packing`,
            type: 'normal'
        },
        // {
        //   name: 'arrivals',
        //   label: $localize`Arrivals`,
        //   type: 'normal',
        //   collections: [
        //     {
        //         type: 'normal',
        //         label: $localize`Container number`,
        //         name: 'containerNumber',
        //     },
        //     {
        //         type: 'nameId',
        //         name: 'productCompany',
        //         label: $localize`Product company`,
        //     },
        //     {
        //         type: 'dateTime',
        //         name: 'recordedTime',
        //         label: $localize`Recorded time`,
        //     },
        //     {
        //         type: 'date',
        //         label: $localize`Eta`,
        //         name: 'eta',
        //     },
        //     {
        //         type: 'arrayVal',
        //         name: 'orderStatus',
        //         label: $localize`Status`,
        //     },
        //     {
        //         type: 'arrayVal',
        //         name: 'approvals',
        //         label: $localize`Approvals`,
        //     }
        //   ]
        // },
        {
            name: 'loading',
            label: $localize`Loading`,
            type: 'group',
            collections: [
              {
                  type: 'nameId',
                  name: 'shipmentCode',
                  label: $localize`Shipment code`,
                  group: 'shipmentCode',
              },
              {
                  type: 'arrayVal',
                  name: 'poCodes',
                  label: $localize`PO#`,
                  // search: 'object',
                  group: 'poCodes',
              },
              {
                  type: 'dateTime',
                  name: 'recordedTime',
                  label: $localize`Recorded time`,
                  group: 'poCodes',
              },
              {
                  type: 'nameId',
                  name: 'item',
                  label: $localize`Product descrption`,
              },
              {
                  type: 'weight2',
                  name: 'totalRow',
                  label: $localize`Loaded amounts`,
                  // type: 'object',
                  // options: 'currency',
              },
              {
                  type: 'normal',
                  name: 'status',
                  label: $localize`Status`,
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
                label: $localize`Used items`,
            },
            {
                type: 'itemWeight',
                name: 'producedItems',
                label: $localize`Produced items`,
            },
            {
                type: 'weight2',
                name: 'processGain',
                label: $localize`Difference`,
            },
            {
                type: 'dateTime',
                name: 'recordedTime',
                label: $localize`Recorded time`,
            },
            {
                type: 'normal',
                name: 'status',
                label: $localize`Status`,
            },
        ];


}