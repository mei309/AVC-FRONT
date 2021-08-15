import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isEqualWith } from 'lodash-es';
@Component({
  selector: 'inside-details',
  template: `
  <ng-container *ngIf="dataSource">
    <ng-container *ngIf="secondSource; else noSecond">
        <ng-container *ngFor="let column of oneColumns">
          <ng-container *ngIf="checkNotEmpty(dataSource[column.name]) || checkNotEmpty(secondSource[column.name])">
            <ng-container *ngIf="['parent', 'arrayGroup', 'array', 'arrayOrdinal', 'putArray'].includes(column.type); else notImportEdit"> 
                <ng-container [ngSwitch]="column.type">
                        <show-details-ordinal *ngSwitchCase="'arrayOrdinal'" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                        </show-details-ordinal>
                        <inside-details *ngSwitchCase="'parent'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                        </inside-details>
                        

                        <fieldset *ngSwitchDefault  [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <ng-container [ngSwitch]="column.type">
                            <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                            </show-details-table>
                            <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [secondSource]="secondSource[column.name]">
                            </show-details-group-table>
                          </ng-container>
                        </fieldset>
                  </ng-container>
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
              <ng-container *ngIf="['parent', 'arrayGroup', 'array', 'arrayOrdinal', 'putArray'].includes(column.type); else notImport">
                  <ng-container [ngSwitch]="column.type">
                        <show-details-ordinal *ngSwitchCase="'arrayOrdinal'" [dataSource]="dataSource[column.name]" >
                        </show-details-ordinal>
                        <inside-details *ngSwitchCase="'parent'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                        </inside-details>
                        

                        <fieldset *ngSwitchDefault  [ngClass]="{'no-legend': !column.label}">
                          <legend><h1>{{column.label}}</h1></legend>
                          <ng-container [ngSwitch]="column.type">
                            <show-details-table *ngSwitchCase="'array'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                            </show-details-table>
                            <show-details-group-table *ngSwitchCase="'arrayGroup'" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]">
                            </show-details-group-table>
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
  `,
  styleUrls: ['show-details-table.css'],
})
export class InsideDetailsComponent implements OnInit {
  globelType = 'CASHEW';

  @Output() approveChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  dataTable;
  @Input() set dataSource(value) {
      if(value){
        if(!this.regShow) {
          if(value.hasOwnProperty('groupName') && value['groupName']) {
            if(value['groupName'].includes('Used') || value['groupName'].endsWith('Relocation') || value['groupName'].endsWith('Loading')) {
              this.setReloaction(value['groupName']);
            } else {
              this.setUsed(value['groupName']);
            }
          } else {
            this.setStorage();
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
  
  regShow;
 

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
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

  setReloaction(process: string) {
    const withPos = process.endsWith('Loading') || process.endsWith('Pos');
    this.regShow = [
      {
        type: 'array',
        // label: 'Used amounts',
        name: 'storageMoves',
        // side: 'left',
        // processName: this.globelType+'_CLEANING',
        collections: [
            ...withPos? [
              {
                  type: 'input',
                  label: $localize`#PO`,
                  name: 'itemPoCodes',
              },
              {
                  type: 'input',
                  label: $localize`Supplier`,
                  name: 'itemSuppliers',
              }
            ]: [],
            {
                type: 'nameId',
                label: $localize`Item descrption`,
                name: 'item',
            },
            {
                type: 'normal',
                label: $localize`Unit`,
                name: 'unitAmount',
                suffix: 'measureUnit',
            },
            {
                type: 'normal',
                label: $localize`Number of units`,
                name: 'numberUsedUnits',
            },
            ...process.endsWith('Relocation')? [
              {
                  type: 'fromObj',
                  name: 'storage',
                  suffix: 'warehouseLocation',
                  collections: {
                      type: 'nameId',
                      label: $localize`Old warehouse location`,
                      name: 'oldWarehouseLocation',
                  },
              },
              {
                  type: 'nameId',
                  label: $localize`New warehouse location`,
                  name: 'warehouseLocation',
              },
            ]: [
              {
                  type: 'fromObj',
                  name: 'storage',
                  suffix: 'warehouseLocation',
                  collections: {
                      type: 'nameId',
                      label: $localize`Warehouse location`,
                      name: 'warehouseLocation',
                  },
              },
            //   {
            //     type: 'nameId',
            //     label: $localize`Warehouse location`,
            //     name: 'warehouseLocation',
            // },
            ]
          ]
      },
      {
        type: 'parent',
        name: 'storageMove',
        // side: 'left',
        collections: [
          ...withPos? [
            {
                type: 'input',
                label: $localize`#PO`,
                name: 'itemPoCodes',
            },
            {
                type: 'input',
                label: $localize`Supplier`,
                name: 'itemSuppliers',
            }
          ]: [],
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
          // {
          //     type: 'nameId',
          //     label: 'Old warehouse location',
          //     name: 'warehouseLocation',
          // },
          ...process.endsWith('Relocation')? [
            {
                type: 'nameId',
                label: $localize`Old warehouse location`,
                name: 'warehouseLocation',
            },
            {
                type: 'nameId',
                label: $localize`New warehouse location`,
                name: 'newWarehouseLocation',
            },
          ]: [
            {
              type: 'nameId',
              label: $localize`Warehouse location`,
              name: 'warehouseLocation',
            },
          ],
          {
            type: 'arrayOrdinal',
            // label: 'Produced amounts',
            name: 'amounts',
          },
        ]
      },
    ];
  }

  setUsed(process: string) {
    this.regShow = [
      {
        type: 'arrayGroup',
        // label: 'Used amounts',
        name: 'usedItems',
        // side: 'left',
        // processName: this.globelType+'_CLEANING',
        collections: [
            ...process.endsWith('Pos')? [
              {
                  type: 'input',
                  label: $localize`#PO`,
                  name: 'itemPoCodes',
              },
              {
                  type: 'input',
                  label: $localize`Supplier`,
                  name: 'itemSuppliers',
              }
            ]: [],
            {
                type: 'nameId',
                label: $localize`Item descrption`,
                name: 'item',
            },
            {
              type: 'parent',
              name: 'storage',
              label: $localize`Amounts and storage`,
              collections: [
                  {
                      type: 'normal',
                      label: $localize`Unit`,
                      name: 'unitAmount',
                      suffix: 'measureUnit',
                  },
                  {
                      type: 'nameId',
                      label: $localize`Warehouse location`,
                      name: 'warehouseLocation',
                  },
                ]
            },
            {
                type: 'normal',
                label: $localize`Number of units`,
                name: 'numberUsedUnits',
            },
            {
                type: 'date',
                label: $localize`Last process date`,
                name: 'itemProcessDate',
            },
          ]
      },
      {
        type: 'parent',
        name: 'usedItem',
        // side: 'left',
        collections: [
          ...process.endsWith('Pos')? [
            {
                type: 'input',
                label: $localize`#PO`,
                name: 'itemPoCodes',
            },
            {
                type: 'input',
                label: $localize`Supplier`,
                name: 'itemSuppliers',
            }
          ]: [],
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
              type: 'nameId',
              label: $localize`Warehouse location`,
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

  setStorage() {
    this.regShow = [
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
        type: 'parent',
        name: 'storage',
        // side: 'right',
        collections: [
          {
              type: 'nameId',
              label: $localize`Warehouse location`,
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

}