import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {isEqualWith} from 'lodash-es';
import { Genral } from '../genral.service';
import { Globals } from '../global-params.component';
import { ConfirmationDialog } from '../service/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
@Component({
  selector: 'show-details',
  template: `
<ng-container *ngIf="dataSource; else noData">
    <button *ngIf="getPremmisions(dataSource.processName)" class="raised-margin" mat-raised-button color="accent" (click)="openManagment(dataSource.processName)">Managment</button>
    <ng-container *ngIf="secondSource; else noSecond">
        <ng-container *ngFor="let column of oneColumns">
          <ng-container *ngIf="checkNotEmpty(dataSource[column.name]) || checkNotEmpty(secondSource[column.name])">
            <ng-container *ngIf="['object', 'parent', 'parentArray', 'parentArrayObject', 'arrayGroup', 'array', 'detailsUpside'].includes(column.type); else notImportEdit"> 
                <ng-container *ngIf="['parent', 'parentArray', 'object', 'arrayOrdinal'].includes(column.type); else legendBoxEdit">
                      <ng-container *ngIf="'arrayOrdinal' === column.type; else notArrayOrdinalEdit">
                          <show-details-ordinal [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-ordinal>
                      </ng-container>
                      <ng-template #notArrayOrdinalEdit>
                        <h4 *ngIf="column.type === 'object'">{{column.label}}</h4>
                        <ng-container *ngIf="['parent', 'object'].includes(column.type); else onlyzero">
                          <show-details [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details>
                        </ng-container>
                        <ng-template #onlyzero>
                          <show-details [oneColumns]="column.collections" [dataSource]="dataSource[column.name][0]" [secondSource]="secondSource[column.name][0]">
                          </show-details>
                        </ng-template>
                      </ng-template>
                </ng-container>
                <ng-template #legendBoxEdit>
                      <fieldset [ngSwitch]="column.type" [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-table>
                          <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-group-table>
                          <show-details-upside-table *ngSwitchCase="'detailsUpside'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-upside-table>
                          <show-details *ngSwitchCase="'parentArrayObject'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name][0]" [secondSource]="secondSource[column.name][0]">
                          </show-details>

                          <for-each-edit *ngSwitchCase="'arrayForEach'" class="change-color" [dataSource]="dataSource[column.name][0]" [secondSource]="secondSource[column.name][0]">
                          </for-each-edit> 
                      </fieldset>
                </ng-template>
            </ng-container>
            <ng-template #notImportEdit>
                  <mat-form-field appearance="none" provideReadonly>
                      <mat-label>{{column.label}}</mat-label>
                      <ng-container *ngIf="isEqualObj(dataSource[column.name], secondSource[column.name]); else notEqual1">      
                        <input *ngIf="dataSource[column.name]" readonly matInput [value]="dataSource[column.name] | tableCellPipe: column.type : column.collections">
                      </ng-container>
                      <ng-template  #notEqual1>
                        <input class="added-item" *ngIf="dataSource[column.name]" readonly matInput [value]="dataSource[column.name] | tableCellPipe: column.type : column.collections">
                        <input class="removed-item" *ngIf="secondSource[column.name]" readonly matInput [value]="secondSource[column.name] | tableCellPipe: column.type : column.collections" >
                      </ng-template>
                  </mat-form-field>
            </ng-template>
          </ng-container>
        </ng-container>
    </ng-container>
    <ng-template #noSecond>
        <ng-container *ngFor="let column of oneColumns">
            <ng-container *ngIf="checkNotEmpty(dataSource[column.name])">
              <ng-container *ngIf="['object', 'parent', 'parentArray', 'parentArrayObject', 'arrayGroup', 'array', 'detailsUpside', 'arrayForEach', 'arrayOrdinal'].includes(column.type); else notImport">
                  <ng-container *ngIf="['parent', 'parentArray', 'object', 'arrayOrdinal'].includes(column.type); else legendBox">
                        <ng-container *ngIf="'arrayOrdinal' === column.type; else notArrayOrdinal">
                            <show-details-ordinal [dataSource]="dataSource[column.name]" >
                            </show-details-ordinal>
                        </ng-container>
                        <ng-template #notArrayOrdinal>
                          <h4 *ngIf="column.type === 'object'">{{column.label}}</h4>
                          <show-details [oneColumns]="column.collections" [dataSource]="['parent', 'object'].includes(column.type)? dataSource[column.name] : dataSource[column.name][0]">
                          </show-details>
                        </ng-template>
                  </ng-container>
                  <ng-template #legendBox>
                        <fieldset [ngSwitch]="column.type" [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                          </show-details-table>
                          <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                          </show-details-group-table>
                          <show-details-upside-table *ngSwitchCase="'detailsUpside'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" >
                          </show-details-upside-table>
                          <show-details *ngSwitchCase="'parentArrayObject'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name][0]">
                          </show-details>

                          <div *ngSwitchCase="'arrayForEach'">
                            <show-details class="change-color" *ngFor="let line of dataSource[column.name]" [dataSource]="line" [withPo]="false">
                            </show-details>
                          </div> 
                        </fieldset>
                  </ng-template>
              </ng-container>
              <ng-template #notImport>
                    <mat-form-field appearance="none" provideReadonly>
                        <mat-label>{{column.label}}</mat-label>
                        <input readonly matInput [value]="dataSource[column.name] | tableCellPipe: column.type : column.collections">
                    </mat-form-field>
              </ng-template>
            </ng-container>
        </ng-container>
    </ng-template>
    <h2 *ngIf="dataSource['totalAmount']" style="float: right">Totel: {{dataSource['totalAmount'] | tableCellPipe: 'weight' : null}}  {{dataSource['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
</ng-container>
<ng-template #noData>
  <mat-spinner></mat-spinner>
</ng-template>
  `,
  styleUrls: ['show-details-table.css'],
})
export class ShowDetailsComponent implements OnInit {
  globelType = 'CASHEW';

  dataTable;
  @Input() set dataSource(value) {
      if(value){
        if(value.hasOwnProperty('processItems')) {
          var tableView = [];
          var normalView = [];
          var wasteView = [];
          value['processItems'].forEach(eleme => {
            if(eleme['groupName'] === 'waste') {
              wasteView.push(eleme);
            } else if(eleme['storage']) {
              tableView.push(eleme);
            } else {
              normalView.push(eleme);
            }
          });
          value['processItems'] = [];
          if(tableView.length) {
            value['processItemsTable'] = tableView;
          }
          if(normalView.length) {
            value['processItems'] = normalView;
          }
          if(wasteView.length) {
            value['wasteItems'] = wasteView;
          }
        }
        this.dataTable = value;
        if(this.secondSource && this.secondSource['version'] === this.dataTable['version']) {
          this.secondSourceTemp = undefined;
        }
      }
  }
  get dataSource() { return this.dataTable; }

  secondSourceTemp;
  @Input() set secondSource(value) {
    if(value){
      if(value.hasOwnProperty('processItems')) {
        var tableView = [];
          var normalView = [];
          var wasteView = [];
          value['processItems'].forEach(eleme => {
            if(eleme['groupName'] === 'waste') {
              wasteView.push(eleme);
            } else if(eleme['storage']) {
              tableView.push(eleme);
            } else {
              normalView.push(eleme);
            }
          });
          value['processItems'] = [];
          if(tableView.length) {
            value['processItemsTable'] = tableView;
          }
          if(normalView.length) {
            value['processItems'] = normalView;
          }
          if(wasteView.length) {
            value['wasteItems'] = wasteView;
          }
      }
      this.secondSourceTemp = value;
      if(this.dataSource && this.secondSourceTemp['version'] === this.dataSource['version']) {
        this.secondSourceTemp = undefined;
      }
    }
  }
  get secondSource() { return this.secondSourceTemp; }
  
  
  @Input() set oneColumns(value) {
    if(value){
      this.regShow = value;
    }
  }
  get oneColumns() { return this.regShow; }

  @Input() withPo: boolean = true;

  constructor(private genral: Genral, private globels: Globals, public dialog: MatDialog) {
  }

  getPremmisions(process) {
    if(this.globels.getGlobalProcessAuturtiy(process)) {
      return (this.globels.getGlobalProcessAuturtiy(process)).some(r=> ['APPROVAL', 'MANAGER'].indexOf(r) >= 0);
    } else {
      return false;
    }
    
  }

  ngOnInit() {
    if(!this.withPo) {
      this.regShow.splice(0, 1);
    }
  }

  openManagment(processName) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '80%',
      data: {
        premmisions: this.globels.getGlobalProcessAuturtiy(processName),
        toLock: this.dataSource['editStatus'] === 'LOCKED',
        toFinal: this.dataSource['processStatus'] === 'FINAL',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result != 'closed') {
        result['id'] = this.dataSource['id'];
        result['processName'] = this.dataSource['processName'];
        if(result['process'] === 'confirm') {
          result['snapshot'] = this.dataSource;
          this.genral.approveTaskAndManagment('APPROVED' , result).pipe(take(1)).subscribe(value => {
            this.dataSource['approvals'] = value['approvals'];
            console.log(value);
          });
        } else if(result['process'] === 'reject') {
          result['snapshot'] = this.dataSource;
          this.genral.approveTaskAndManagment('DECLINED' , result).pipe(take(1)).subscribe(value => {
            this.dataSource['approvals'] = value['approvals'];
            console.log(value);
          });
        } else if(result['process'] === 'onSave') {
          this.genral.taskManagment(result).pipe(take(1)).subscribe(value => {
            // this.dataSource = value;
            console.log(value);
            
          });
        }
      }
    });
  }

  isArray(obj : any ) {
   return Array.isArray(obj)
  }

  checkNotEmpty(myObject): boolean {
    if(!myObject) {
      return false;
    } else if(Array.isArray(myObject)) {
      if(!myObject.length){
        return false;
      }
    }
    return true;
  }

  isEqualObj(obj1 : any, obj2: any) {
    return isEqualWith(obj1, obj2, (value1, value2, key) => {
        return key === 'version' ? true : undefined;
    })
  }

  // isFullObjects(obj1 : any, obj2: any) : boolean {
  //   if(!obj1 || !obj1.length) {
  //     if(!obj2 || !obj2.length) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  regShow = [
    {
        type: 'name2',
        label: '#PO',
        name: 'poCode',
        collections: 'supplierName',
    },
    {
        type: 'dateTime',
        label: 'Date and time',
        name: 'recordedTime',
    },
    {
        type: 'normal',
        name: 'personInCharge',
        label: 'Person in charge',
    },
    {
        type: 'normal',
        label: 'Strat time',
        name: 'startTime',
    },
    {
        type: 'normal',
        label: 'End time',
        name: 'endTime',
    },
    {
        type: 'normal',
        label: 'Approvals',
        name: 'approvals',
    },
    {
        type: 'normal',
        label: 'Number of workers',
        name: 'numOfWorkers',
    },
    {
        type: 'nameId',
        label: 'Item descrption',
        name: 'item',
    },
    {
        type: 'array',
        label: 'Orderd products',
        name: 'orderItems',
        processName: this.globelType+'_ORDER',
        collections: [
            {
                type: 'nameId',
                label: 'Item descrption',
                name: 'item',
            },
            {
                type: 'weight',
                label: 'Weight',
                name: 'numberUnits',
                // collections: 'measureUnit',
            },
            {
                type: 'currency',
                label: 'Price per unit',
                name: 'unitPrice',
                // collections: 'currency',
            },
            {
                type: 'normal',
                label: 'Delivery date',
                name: 'deliveryDate',
            },
            {
                type: 'normal',
                label: 'Defects',
                name: 'defects',
            },
            {
                type: 'normal',
                label: 'Remarks',
                name: 'remarks',
            },
        ]
    },
    {
        type: 'arrayGroup',
        label: 'Received products',
        name: 'receiptItems',
        processName: this.globelType+'_RECEIPT',
        collections: [
            {
                type: 'nameId',
                label: 'Item descrption',
                name: 'item',
            },
            {
              type: 'weight2',
              label: 'Sum',
              name: 'totalAmount',
              bold: 'true',
              // collections: 'measureUnit',
            },
            {
              type: 'weight',
              label: 'Totel sample difference',
              name: 'totalDifferance',
              bold: 'true',
              // collections: 'measureUnit',
            },
            {
              type: 'weight',
              label: 'Extra requsted',
              name: 'extraRequested',
              // collections: 'measureUnit',
            },
            {
              type: 'kidArray',
              name: 'storageForms',
              label: 'Amounts and storage',
              collections: [
                  {
                      type: 'weight',
                      label: 'Bag amount',
                      name: 'unitAmount',
                      // collections: 'measureUnit',
                  },
                  {
                      type: 'normal',
                      label: 'Number of bags',
                      name: 'numberUnits',
                  },
                  {
                      type: 'nameId',
                      label: 'Warehouse location',
                      name: 'warehouseLocation',
                  },
                  {
                    type: 'check',
                    label: 'Extra',
                    name: 'className',
                    collections: 'ExtraAdded',
                  },
                  {
                    type: 'normal',
                    label: 'Empty bag weight',
                    name: 'emptyContainerWeight',
                  },
                  {
                      type: 'normal',
                      label: 'Number of samples',
                      name: 'numberOfSamples',
                  },
                  {
                    type: 'normal',
                    label: 'Avrage weight',
                    name: 'avgTestedWeight',
                  },
                  {
                    type: 'weight',
                    label: 'Difference',
                    name: 'weighedDifferance',
                    // collections: 'measureUnit',
                  },
                ]
            },
            {
              type: 'weight',
              label: 'Payable units',
              name: 'receivedOrderUnits',
              // collections: 'measureUnit',
            },
            {
              type: 'currency',
              label: 'Unit price',
              name: 'unitPrice',
              // collections: 'measureUnit',
            },
            {
                type: 'normal',
                label: 'Remarks',
                name: 'remarks',
            },
        ]
    },
    {
      type: 'detailsUpside',
      label: 'Checked items',
      name: 'testedItems',
      processName: 'CASHEW_RECEIPT_QC',
      collections: [
          {type: 'item', title: 'Item descrption', options: this.genral.getStandarts(), pipes: 'object', collections: 'sampleWeight', accessor: (arr, elem) => arr.find(d => d['items'].some(el => {if(el['value'] === elem){return true;}}))},
          {type: 'kidArray', name: 'defects'},
          {type: 'kidArray', name: 'damage'},
          {type: 'processName', title: 'Checked by'},
          {type: 'inspector', title: 'Inspector'},
          {type: 'sampleTaker', title: 'Sample taker'},
          {type: 'numberOfSamples', title: 'Number of samples'},
          {type: 'wholeCountPerLb', title: 'Whole count per Lb'},
          {type: 'smallSize', title: 'Small size', pipes: 'percentCollections', pipes1: 'percent', collections: 'wholeCountPerLb'},
          {type: 'ws', title: 'WS', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'lp', title: 'LP', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'humidity', title: 'Humidity', pipes: 'percent', pipes1: 'percent'},
          {type: 'breakage', title: 'Breakage', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'foreignMaterial', title: 'Foreign material', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'mold', title: 'Mold', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'dirty', title: 'Dirty', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'lightDirty', title: 'Light dirty', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'decay', title: 'Decay', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'insectDamage', title: 'Insect damage', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'testa', title: 'Testa', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'totalDamage', title: 'Totel damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
          {type: 'scorched', title: 'Scorched', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'deepCut', title: 'Deep cut', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'offColour', title: 'Off colour', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'shrivel', title: 'Shrivel', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'desert', title: 'Desert/dark', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'deepSpot', title: 'Deep spot', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'totalDefects', title: 'Totel defects', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
          {type: 'totalDefectsAndDamage', title: 'Totel defects + damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
          {type: 'rostingWeightLoss', title: 'Totel weight lost after roasting', pipes: 'percentCollections', pipes1: 'percent'},
          {type: 'colour', title: 'Rosted color', pipes: 'OK', pipes1: 'OK'},
          {type: 'flavour', title: 'Flavour', pipes: 'OK', pipes1: 'OK'},
      ]
    },
    {
      type: 'arrayForEach',
      label: 'Used amounts',
      name: 'usedItemGroups',
    },
    {
      type: 'array',
      // label: 'Used amounts',
      name: 'usedItems',
      // side: 'left',
      // processName: this.globelType+'_CLEANING',
      collections: [
          {
              type: 'nameId',
              label: 'Item descrption',
              name: 'item',
          },
          {
              type: 'nameId',
              label: 'Bag weight',
              name: 'unitAmount',
              // collections: 'measureUnit',
          },
          {
              type: 'normal',
              label: 'Number of bags',
              name: 'numberUsedUnits',
          },
          {
              type: 'nameId',
              label: 'Warehouse location',
              name: 'warehouseLocation',
          },
        ]
    },
    {
      type: 'parent',
      name: 'usedItem',
      // side: 'left',
      collections: [
        {
            type: 'nameId',
            label: 'Item descrption',
            name: 'item',
        },
        {
            type: 'normal',
            label: 'Container weight',
            name: 'containerWeight',
        },
        {
            type: 'normal',
            label: 'Measure unit',
            name: 'measureUnit',
        },
        {
            type: 'nameId',
            label: 'Warehouse location',
            name: 'warehouseLocation',
        },
        {
          type: 'arrayOrdinal',
          // label: 'Produced amounts',
          name: 'amounts',
        },
      ]
    },
    {
      type: 'arrayForEach',
      label: 'Produced amounts',
      name: 'processItemsTable',
      side: 'right',
    },
    {
      type: 'arrayForEach',
      label: 'Produced amounts',
      name: 'processItems',
    },
    {
      type: 'arrayForEach',
      label: 'Waste amounts',
      name: 'wasteItems',
    },
    // {
    //   type: 'arrayGroup',
    //   label: 'Produced amounts',
    //   name: 'processItems',
    //   // side: 'right',
    //   collections: [
    //       {
    //           type: 'nameId',
    //           label: 'Item descrption',
    //           name: 'item',
    //       },
    {
      type: 'array',
      name: 'storageForms',
      // label: 'Amounts and storage',
      collections: [
              // {
              //     type: 'normal',
              //     label: 'Name',
              //     name: 'name',
              // },
              {
                  type: 'nameId',
                  label: 'Unit weight',
                  name: 'unitAmount',
                  // collections: 'measureUnit',
              },
              {
                  type: 'normal',
                  label: 'Number of units',
                  name: 'numberUnits',
              },
              {
                  type: 'nameId',
                  label: 'Warehouse location',
                  name: 'warehouseLocation',
              },
          ]
    },
    //     ]
    // },
    {
      type: 'parent',
      name: 'storage',
      // side: 'right',
      collections: [
        {
            type: 'normal',
            label: 'Container weight',
            name: 'containerWeight',
        },
        {
            type: 'normal',
            label: 'Measure unit',
            name: 'measureUnit',
        },
        {
            type: 'nameId',
            label: 'Warehouse location',
            name: 'warehouseLocation',
        },
        {
          type: 'arrayOrdinal',
          // label: 'Produced amounts',
          name: 'amounts',
        },
      ]
    },




    {
      type: 'parentArrayObject',
      name: 'itemCounts',
      label: 'Item counts',
      collections: [
        {
            type: 'nameId',
            label: 'Item descrption',
            name: 'item',
        },
        {
            type: 'normal',
            label: 'Container weight',
            name: 'containerWeight',
        },
        {
            type: 'normal',
            label: 'Measure unit',
            name: 'measureUnit',
        },
        {
            type: 'nameId',
            label: 'Warehouse location',
            name: 'warehouseLocation',
        },
        {
          type: 'arrayOrdinal',
          // label: 'Produced amounts',
          name: 'amounts',
        },
      ]
    },
  ];
}