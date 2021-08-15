import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isEqualWith } from 'lodash-es';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { Globals } from '../global-params.component';
import { ConfirmationDialog } from '../service/confirm-dialog.component';
@Component({
  selector: 'show-details',
  template: `
<ng-container *ngIf="dataSource; else noData">
    <button *ngIf="getUserManagment(dataSource.processName)" class="raised-margin" mat-raised-button color="accent" (click)="openManagment(dataSource.processName)">Managment</button>
    <ng-container *ngIf="secondSource; else noSecond">
        <ng-container *ngFor="let column of oneColumns">
          <ng-container *ngIf="checkNotEmpty(dataSource[column.name]) || checkNotEmpty(secondSource[column.name])">
            <ng-container *ngIf="['parent', 'object', 'arrayGroup', 'array', 'detailsUpside', 'arrayForEach', 'insideForEach'].includes(column.type); else notImportEdit"> 
                <ng-container *ngSwitchCase="'object'">
                    <h3>{{column.label}}</h3>
                    <inside-details [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                    </inside-details>
                </ng-container>
                <inside-details *ngSwitchCase="'parent'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                </inside-details>
                
                      <fieldset [ngSwitch]="column.type" [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-table>
                          <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                          </show-details-group-table>
                          <show-details-upside-table *ngSwitchCase="'detailsUpside'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]" [processName]="column.processName">
                          </show-details-upside-table>
                          
                          <inside-fe-edit *ngSwitchCase="'arrayForEach'" class="change-color" [dataSource]="dataSource[column.name][0]" [secondSource]="secondSource[column.name][0]" [oneColumns]="column.collections">
                          </inside-fe-edit> 
                      </fieldset>
            </ng-container>
            <ng-template #notImportEdit>
                  

                  <div class="half">
                        <label>{{column.label}}</label>
                        <ng-container *ngIf="isEqualObj(dataSource[column.name], secondSource[column.name]); else notEqual1">
                          <span class="half">{{dataSource[column.name] | tableCellPipe: column.type : column.collections}}</span>   
                        </ng-container>
                        <ng-template  #notEqual1>
                          <span class="half added-item">{{dataSource[column.name] | tableCellPipe: column.type : column.collections}}</span>
                          <span class="half removed-item">{{secondSource[column.name] | tableCellPipe: column.type : column.collections}}</span>
                        </ng-template>
                  </div>
            </ng-template>
          </ng-container>
        </ng-container>
    </ng-container>
    <ng-template #noSecond>
        <ng-container *ngFor="let column of oneColumns">
            <ng-container *ngIf="checkNotEmpty(dataSource[column.name])">
              <ng-container *ngIf="['parent', 'object', 'arrayGroup', 'array', 'detailsUpside', 'arrayForEach', 'insideForEach'].includes(column.type); else notImport">
                  <ng-container [ngSwitch]="column.type">
                        <ng-container *ngSwitchCase="'object'">
                            <h3>{{column.label}}</h3>
                            <inside-details [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                            </inside-details>
                        </ng-container>
                        <inside-details *ngSwitchCase="'parent'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                        </inside-details>
                        
                        <fieldset *ngSwitchDefault  [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <ng-container [ngSwitch]="column.type">
                            <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                            </show-details-table>
                            <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                            </show-details-group-table>
                            <show-details-upside-table *ngSwitchCase="'detailsUpside'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [processName]="column.processName">
                            </show-details-upside-table>
                            <ng-container *ngSwitchCase="'insideForEach'">
                              <div *ngFor="let line of dataSource[column.name]" style="width: fit-content;">
                                <inside-details class="change-color" [dataSource]="line" [oneColumns]="column.collections">
                                </inside-details>
                                <h2 *ngIf="line['totalAmount']" style="float: right">Total: {{line['totalAmount'] | tableCellPipe: 'weight2' : null}}</h2>
                              </div>
                            </ng-container>
                            <ng-container *ngSwitchCase="'arrayForEach'">
                              <div *ngFor="let line of dataSource[column.name]" style="width: fit-content;">
                                <show-details class="change-color" [dataSource]="line" [withPo]="column.collections? true : false" [oneColumns]="column.collections">
                                </show-details>
                              </div>
                              <h2 *ngIf="dataSource['totalWeight'] && column.name === 'usedItemGroups' && dataSource[column.name].length > 1" class="bottom-legend">Sum: {{dataSource['totalWeight'] | tableCellPipe: 'weight2' : null}}</h2>
                            </ng-container>
                          </ng-container>
                        </fieldset>
                  </ng-container>
              </ng-container>
              <ng-template #notImport>
                    
                    <div class="half">
                          <label>{{column.label}}</label>
                          <span class="half">{{dataSource[column.name] | tableCellPipe: column.type : column.collections}}</span>
                    </div>
                   
              </ng-template>
            </ng-container>
        </ng-container>
    </ng-template>
</ng-container>
<ng-template #noData>
  <mat-spinner></mat-spinner>
</ng-template>
  `,
  styleUrls: ['show-details-table.css'],
})
export class ShowDetailsComponent implements OnInit {
  globelType = 'CASHEW';

  @Output() approveChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  dataTable;
  @Input() set dataSource(value) {
      if(value){
        if(value.hasOwnProperty('storageMovesGroups') && value['storageMovesGroups']) {
          var titel = null;
          switch (value['processName']) {
            case 'CONTAINER_LOADING':
              titel = $localize`Loaded amounts`;
              break;
            case 'PRODUCT_USE':
            case 'GENERAL_USE':
              titel = $localize`Used amounts`;
              break;
            default:
              titel = $localize`Storage moved`;
              break;
          }
          this.regShow.splice(26, 0, {
            type: 'insideForEach',
            label: titel,
            name: 'storageMovesGroups',
          });
        }
        if(value.hasOwnProperty('processItems') && value['processItems']) {
          // var wasteView = value['processItems'].filter(eleme => eleme['groupName'] === 'waste');
          // value['processItems'] = value['processItems'].filter(eleme => eleme['groupName'] !== 'waste');
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
      if(value.hasOwnProperty('processItems') && value['processItems']) {
          // var wasteView = value['processItems'].filter(eleme => eleme['groupName'] === 'waste');
          // value['processItems'] = value['processItems'].filter(eleme => eleme['groupName'] !== 'waste');
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

  getUserManagment(process) {
    if(this.globels.isGlobalProcessAuturtiy(process)) {
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
        toCancal: this.dataSource['processStatus'] === 'CANCELLED',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result != 'closed') {
        this.approveChange.emit(true);
        result['id'] = this.dataSource['id'];
        result['processName'] = this.dataSource['processName'];
        if(result['process'] === 'confirm') {
          result['snapshot'] = this.dataSource;
          this.genral.approveTaskAndManagment('APPROVED' , result).pipe(take(1)).subscribe(value => {
            this.dataSource['approvals'] = value['approvals'];
          });
        } else if(result['process'] === 'reject') {
          result['snapshot'] = this.dataSource;
          this.genral.approveTaskAndManagment('DECLINED' , result).pipe(take(1)).subscribe(value => {
            this.dataSource['approvals'] = value['approvals'];
          });
        } else if(result['process'] === 'onSave') {
          this.genral.taskManagment(result).pipe(take(1)).subscribe(value => {
            // this.dataSource = value;
            
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
        label: $localize`#PO`,
        name: 'poCode',
        collections: 'supplierName',
    },
    {
        type: 'insideForEach',
        name: 'weightedPos',
        collections: [
          {
              type: 'name2',
              label: $localize`#PO`,
              name: 'poCode',
              collections: 'supplierName',
          },
          {
              type: 'normal',
              name: 'weight',
              label: $localize`Weight`,
          },
        ]
    },
    {
        type: 'nameId',
        label: $localize`Production line`,
        name: 'productionLine',
    },
    {
        type: 'nameId',
        label: $localize`Shipment code`,
        name: 'shipmentCode',
    },
    {
        type: 'nameId',
        label: $localize`Container`,
        name: 'arrival',
    },
    {
        type: 'dateTime',
        label: $localize`Date and time`,
        name: 'recordedTime',
    },
    {
        type: 'normal',
        name: 'personInCharge',
        label: $localize`Person in charge`,
    },
    {
        type: 'normal',
        label: $localize`Strat time`,
        name: 'startTime',
    },
    {
        type: 'normal',
        label: $localize`End time`,
        name: 'endTime',
    },
    {
        type: 'normal',
        label: $localize`Approvals`,
        name: 'approvals',
    },
    {
        type: 'normal',
        label: $localize`Number of workers`,
        name: 'numOfWorkers',
    },
    {
        type: 'nameId',
        label: $localize`Item descrption`,
        name: 'item',
    },
    {
        type: 'normal',
        label: $localize`Measure unit`,
        name: 'measureUnit',
    },
    {
        type: 'normal',
        label: $localize`Inspector`,
        name: 'inspector',
    },
    {
        type: 'normal',
        label: $localize`Sample taker`,
        name: 'sampleTaker',
    },
    {
        type: 'normal',
        label: $localize`Checked by`,
        name: 'checkedBy',
    },
    {
        type: 'normal',
        label: $localize`Remarks`,
        name: 'remarks',
    },
    {
        type: 'array',
        label: $localize`Orderd products`,
        name: 'orderItems',
        // processName: this.globelType+'_ORDER',
        collections: [
            {
                type: 'nameId',
                label: $localize`Item descrption`,
                name: 'item',
            },
            {
                type: 'weight',
                label: $localize`Weight`,
                name: 'numberUnits',
                // collections: 'measureUnit',
            },
            {
                type: 'currency',
                label: $localize`Price per unit`,
                name: 'unitPrice',
                // collections: 'currency',
            },
            {
                type: 'date',
                label: $localize`Delivery date`,
                name: 'deliveryDate',
            },
            {
                type: 'normal',
                label: $localize`Defects`,
                name: 'defects',
            },
            {
                type: 'normal',
                label: $localize`Remarks`,
                name: 'remarks',
            },
        ]
    },
    {
        type: 'arrayGroup',
        label: $localize`Received products`,
        name: 'receiptItems',
        // processName: this.globelType+'_RECEIPT',
        collections: [
            {
                type: 'nameId',
                label: $localize`Item descrption`,
                name: 'item',
            },
            {
              type: 'weight2',
              label: $localize`Sum`,
              name: 'totalAmount',
              bold: 'true',
              // collections: 'measureUnit',
            },
            {
              type: 'normal',
              label: $localize`Totel sample difference`,
              name: 'totalDifferance',
              bold: 'true',
              // collections: 'measureUnit',
            },
            {
              type: 'weight',
              label: $localize`Extra requsted`,
              name: 'extraRequested',
              // collections: 'measureUnit',
            },
            {
              type: 'weight',
              label: $localize`Payable units`,
              name: 'receivedOrderUnits',
              // collections: 'measureUnit',
            },
            {
              type: 'currency',
              label: $localize`Unit price`,
              name: 'unitPrice',
              // collections: 'measureUnit',
            },
            {
                type: 'normal',
                label: $localize`Remarks`,
                name: 'remarks',
            },
            {
              type: 'kidArray',
              name: 'storageForms',
              label: $localize`Amounts and storage`,
              collections: [
                  {
                      type: 'normal',
                      label: $localize`Bag amount`,
                      name: 'unitAmount',
                      suffix: 'measureUnit',
                  },
                  {
                      type: 'normal',
                      label: $localize`Number of bags`,
                      name: 'numberUnits',
                  },
                  {
                      type: 'nameId',
                      label: $localize`Warehouse location`,
                      name: 'warehouseLocation',
                  },
                  {
                    type: 'check',
                    label: $localize`Extra`,
                    name: 'className',
                    collections: 'ExtraAdded',
                  },
                  {
                    type: 'normal',
                    label: $localize`Empty bag weight`,
                    name: 'sampleContainerWeight',
                  },
                  {
                      type: 'normal',
                      label: $localize`Number of samples`,
                      name: 'numberOfSamples',
                  },
                  {
                    type: 'normal',
                    label: $localize`Avrage weight`,
                    name: 'avgTestedWeight',
                  },
                  {
                    type: 'normal',
                    label: $localize`Difference`,
                    name: 'weighedDifferance',
                    // collections: 'measureUnit',
                  },
                ]
            },
        ]
    },
    {
      type: 'detailsUpside',
      label: $localize`Checked items`,
      name: 'testedItems',
      // processName: 'CASHEW_RECEIPT_QC',
      collections: [
          {type: 'kidObject', name: 'defects'},
          {type: 'kidObject', name: 'damage'},
          {type: 'hedear', name: 'item', title: 'Item descrption', options: this.genral.getStandarts(), pipes: 'object', collections: 'sampleWeight', accessor: (arr, elem) => arr.find(d => d['items'].some(el => {if(el['value'] === elem){return true;}}))},
          {type: 'bottomArray', collections: [
            {name: 'numberOfSamples', title: 'Number of samples'},
            {name: 'wholeCountPerLb', title: 'Whole count per Lb'},
            {name: 'smallSize', title: 'Small size', pipes: 'percentCollections', pipes1: 'percent', collections: 'wholeCountPerLb'},
            {name: 'ws', title: 'WS', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'lp', title: 'LP', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'humidity', title: 'Humidity', pipes: 'percent', pipes1: 'percent'},
            {name: 'breakage', title: 'Breakage', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'foreignMaterial', title: 'Foreign material', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'mold', title: 'Mold', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'dirty', title: 'Dirty', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'lightDirty', title: 'Light dirty', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'decay', title: 'Decay', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'insectDamage', title: 'Insect damage', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'testa', title: 'Testa', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'totalDamage', title: 'Total damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
            {name: 'scorched', title: 'Scorched', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'deepCut', title: 'Deep cut', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'offColour', title: 'Off colour', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'shrivel', title: 'Shrivel', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'desert', title: 'Desert/dark', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'deepSpot', title: 'Deep spot', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'totalDefects', title: 'Total defects', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
            {name: 'totalDefectsAndDamage', title: 'Total defects + damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
            {name: 'rostingWeightLoss', title: 'Total weight lost after roasting', pipes: 'percentCollections', pipes1: 'percent'},
            {name: 'colour', title: 'Rosted color', pipes: 'OK', pipes1: 'OK'},
            {name: 'flavour', title: 'Flavour', pipes: 'OK', pipes1: 'OK'},
          ]
        }
      ]
    },

    {
      type: 'object',
      name: 'shipingDetails',
      label: $localize`Shiping details`,
      // side: 'left',
      collections: [
        {
            type: 'normal',
            label: $localize`Booking number`,
            name: 'bookingNumber',
        },
        {
            type: 'normal',
            label: $localize`Vessel`,
            name: 'vessel',
        },
        {
            type: 'normal',
            label: $localize`Shipping company`,
            name: 'shippingCompany',
        },
        {
            type: 'nameId',
            label: $localize`Port of loading`,
            name: 'portOfLoading',
        },
        {
            type: 'date',
            label: $localize`etd`,
            name: 'etd',
        },
        {
            type: 'nameId',
            label: $localize`Port of discharge`,
            name: 'portOfDischarge',
        },
        {
            type: 'date',
            label: $localize`eta`,
            name: 'eta',
        },
      ]
    },
    {
      type: 'object',
      name: 'containerDetails',
      label: $localize`Container details`,
      // side: 'left',
      collections: [
        {
            type: 'normal',
            label: $localize`Container number`,
            name: 'containerNumber',
        },
        {
            type: 'normal',
            label: $localize`Container type`,
            name: 'containerType',
        },
        {
            type: 'normal',
            label: $localize`Seal number`,
            name: 'sealNumber',
        },
      ]
    },

    {
      type: 'insideForEach',
      label: $localize`Used amounts`,
      name: 'usedItemGroups',
    },
    {
      type: 'insideForEach',
      label: $localize`Produced amounts`,
      name: 'processItemsTable',
    },
    {
      type: 'arrayGroup',
      label: $localize`Produced amounts`,
      name: 'processItems',
      collections: [
          {
              type: 'nameId',
              label: $localize`Item descrption`,
              name: 'item',
          },
          {
            type: 'kidArray',
            name: 'storageForms',
            label: $localize`Amounts and storage`,
            collections: [
                {
                    type: 'normal',
                    label: $localize`Unit`,
                    name: 'unitAmount',
                    suffix: 'measureUnit',
                },
                {
                    type: 'normal',
                    label: $localize`Number of units`,
                    name: 'numberUnits',
                },
                {
                    type: 'nameId',
                    label: $localize`Warehouse location`,
                    name: 'warehouseLocation',
                },
              ]
          },
          {
            type: 'weight2',
            label: $localize`Weight sum`,
            name: 'totalAmount',
            bold: 'true',
            // collections: 'measureUnit',
          }, 
        ]
    },
    {
      type: 'arrayGroup',
      label: $localize`Waste amounts`,
      name: 'wasteItems',
      collections: [
          {
              type: 'nameId',
              label: $localize`Item descrption`,
              name: 'item',
          },
          {
            type: 'kidArray',
            name: 'storageForms',
            label: $localize`Amounts and storage`,
            collections: [
                {
                    type: 'normal',
                    label: $localize`Unit`,
                    name: 'unitAmount',
                    suffix: 'measureUnit',
                },
                {
                    type: 'normal',
                    label: $localize`Number of units`,
                    name: 'numberUnits',
                },
                {
                    type: 'nameId',
                    label: $localize`Warehouse location`,
                    name: 'warehouseLocation',
                },
              ]
          }, 
        ]
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
    // {
    //   type: 'arrayGroup',
    //   name: 'storageForms',
    //   // label: 'Amounts and storage',
    //   collections: [
    //           // {
    //           //     type: 'normal',
    //           //     label: 'Name',
    //           //     name: 'name',
    //           // },
    //           // {
    //           //     type: 'normal',
    //           //     label: 'Measure unit',
    //           //     name: 'measureUnit',
    //           // },
    //           {
    //               type: 'normal',
    //               label: 'Unit weight',
    //               name: 'unitAmount',
    //               // collections: 'measureUnit',
    //           },
    //           {
    //               type: 'normal',
    //               label: 'Number of units',
    //               name: 'numberUnits',
    //           },
    //           {
    //               type: 'nameId',
    //               label: 'Warehouse location',
    //               name: 'warehouseLocation',
    //           },
    //       ]
    // },
    //     ]
    // },
    


    {
      type: 'insideForEach',
      name: 'itemCounts',
      label: $localize`Item counts`,
      collections: [
        {
            type: 'nameId',
            label: $localize`Item descrption`,
            name: 'item',
        },
        // {
        //     type: 'normal',
        //     label: 'Container weight',
        //     name: 'containerWeight',
        // },
        {
            type: 'normal',
            label: $localize`Measure unit`,
            name: 'measureUnit',
        },
        {
            type: 'nameId',
            label: $localize`Warehouse location`,
            name: 'warehouseLocation',
        },
        {
            type: 'normal',
            label: $localize`All bags weight`,
            name: 'accessWeight',
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