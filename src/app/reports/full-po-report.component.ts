import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'full-po-report',
  template:`
    <fieldset [ngStyle]="{'width':'90%'}">
        <legend><h1>PO# Details</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
        <mat-tab-group *ngIf="isDataAvailable">
            <mat-tab label="Without expanding">
                <ng-template matTabContent>
                    <show-details [dataSource]="poDetails" [oneColumns]="regShow">
                    </show-details>
                </ng-template>
            </mat-tab>
            <mat-tab label="With expanding">
                <ng-template matTabContent>
                    <div class="example-action-buttons">
                        <mat-checkbox (change)="setAll($event.checked)">Expand All</mat-checkbox>
                    </div>
                    <mat-accordion multi>
                        <mat-expansion-panel *ngIf="poDetails['orderItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Orders</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{orderItemsObj: poDetails['orderItemsObj']}" [oneColumns]="[regShow[0]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['receiptItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Receipts</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{receiptItemsObj: poDetails['receiptItemsObj']}" [oneColumns]="[regShow[1]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['testedItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Tests</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{testedItemsObj: poDetails['testedItemsObj']}" [oneColumns]="[regShow[2]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['transferItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>transport cashew</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{transferItemsObj: poDetails['transferItemsObj']}" [oneColumns]="[regShow[3]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['cleaningItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Cleanings</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{cleaningItemsObj: poDetails['cleaningItemsObj']}" [oneColumns]="[regShow[4]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['roastingItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Roastings</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{roastingItemsObj: poDetails['roastingItemsObj']}" [oneColumns]="[regShow[5]]">
                            </show-details>
                        </mat-expansion-panel>
                        <mat-expansion-panel *ngIf="poDetails['packingItemsObj'].length">
                            <mat-expansion-panel-header>
                                <mat-panel-title>Packings</mat-panel-title>
                            </mat-expansion-panel-header>
                            <show-details [dataSource]="{packingItemsObj: poDetails['packingItemsObj']}" [oneColumns]="[regShow[6]]">
                            </show-details>
                        </mat-expansion-panel>
                    </mat-accordion>
                </ng-template>
            </mat-tab>
            <mat-tab label="Graphs">
                <ng-template matTabContent>
                <!-- <app-dash-board [finalReport]="finalReport">
                    </app-dash-board> -->
                    <div style="height: 400px">
                        <h2>Total + Product Loss Per Process</h2>
                        <ngx-charts-bar-vertical-2d [results]="bothLoss" xAxis="true" yAxis="true" legend="true"
                            showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                            yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
                            <ng-template #tooltipTemplate let-model="model">
                                    <div class="tt" *ngIf="model.extra">
                                        Amount: {{ model.extra | tableCellPipe: 'weight' : null}}
                                    </div>
                                </ng-template>
                        </ngx-charts-bar-vertical-2d>
                    </div>
                    <div style="height: 400px">
                        <h2>Total Loss Per Process</h2>
                        <ngx-charts-bar-vertical [results]="totalLoss" xAxis="true" yAxis="true" legend="true"
                            showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                            yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
                            <ng-template #tooltipTemplate let-model="model">
                                    <div class="tt">
                                        Amount: {{ model.extra | tableCellPipe: 'weight' : null}}
                                    </div>
                                </ng-template>
                        </ngx-charts-bar-vertical>
                    </div>
                    <div style="height: 400px">
                        <h2>Product Loss Per Process</h2>
                        <ngx-charts-bar-vertical [view]="view" [results]="productLoss" xAxis="true" yAxis="true" legend="true"
                            showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                            yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
                        </ngx-charts-bar-vertical>
                    </div>
                </ng-template>
            </mat-tab>
            <mat-tab label="Final report">
                <ng-template matTabContent>
                    <final-report-table [dataSource]="finalReport">
                    </final-report-table>
                </ng-template>
            </mat-tab>
        </mat-tab-group>
    </fieldset>
  ` ,
})
export class fullPoReportComponent {
  xAxisLabel = 'Process';
  yAxisLabel = 'Lose';
  view: any[] = [700, 400];
  totalLoss = [];
  productLoss = [];
  bothLoss = [];
  LossDataLabel;

    @ViewChild(MatAccordion) accordion: MatAccordion;
    navigationSubscription;

    
    form: FormGroup;
    poCode: number;
    poConfig: FieldConfig[];
    poDetails;
    finalReport;
    isDataAvailable = false;

    constructor(private router: Router, private cdRef:ChangeDetectorRef, private fb: FormBuilder, private localService: ReportsService, private _Activatedroute: ActivatedRoute, private genral: Genral) {}
    public formatLoss(value) {
        return value+'%';
    };
    
    ngOnInit() {
        this.LossDataLabel = this.formatLoss.bind(this);
        
        this.form = this.fb.group({poCode: this.fb.control('')});
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('poCode')) {
                this.poCode = +params.get('poCode');
                this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                    this.poDetails = val;
                    this.isDataAvailable = true;
                });
                this.localService.getPoFinalReport(this.poCode).pipe(take(1)).subscribe( val1 => {
                    this.finalReport = val1;
                    // ['cleaning', 'roasting', 'packing'].forEach(v => {
                    //     if(val1[v] && val1[v]['difference']) {
                    //         this.single.push({
                    //             name: v,
                    //             value: val1[v]['difference']['amount']
                    //         });
                    //         console.log(this.single);
                            
                    //     }
                    // });
                });
                this.localService.getAllPoCodes().pipe(take(1)).subscribe( val1 => {
                    this.form.get('poCode').setValue(val1.find(element => element.id === this.poCode));
                });
            }
        });  
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) {
                if(selectedValue['id'] !== this.poCode) {
                    this.poCode = selectedValue['id'];
                    this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                        this.poDetails = val;
                        this.isDataAvailable = true;
                    });
                    this.localService.getPoFinalReport(this.poCode).pipe(take(1)).subscribe( val1 => {
                        this.finalReport = val1;
                        console.log(val1);
                        
                        ['cleaning', 'roasting', 'packing'].forEach(v => {
                            if(val1[v] && val1[v]['difference']) {
                                this.bothLoss.push({
                                    name: v,
                                    series: [
                                        {
                                          name: "Total",
                                          value: val1[v]['ratioLoss'],
                                          extra :  val1[v]['difference'],
                                        },
                                        {
                                          "name": "Product",
                                          value: val1[v]['productRatioLoss'],
                                        }
                                      ]
                                });
                                this.totalLoss.push({
                                    name: v,
                                    value: val1[v]['ratioLoss'],
                                    extra :  val1[v]['difference'],
                                });
                                this.productLoss.push({
                                    name: v,
                                    value: val1[v]['productRatioLoss'],
                                });
                            }
                        });
                    });
                }
                
            }
        }); 
        this.poConfig = [
            {
                type: 'selectgroup',
                inputType: 'supplierName',
                options: this.localService.getAllPoCodes(),
                collections: [
                    {
                        type: 'select',
                        label: 'Supplier',
                    },
                    {
                        type: 'select',
                        label: '#PO',
                        name: 'poCode',
                        collections: 'somewhere',
                    },
                ]
            },
        ];
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
              this.isDataAvailable = false;
              this.poDetails =  null;
              this.finalReport = null;
              this.form.get('poCode').setValue(null);
              this.cdRef.detectChanges();
              this.isDataAvailable = true;
            }
        }); 
    }

    setAll($event){
        if($event) {
            this.accordion.openAll();
        } else {
            this.accordion.closeAll();
        }
    }

    regShow = [
        {
            type: 'arrayForEach',
            label: 'Orders',
            name: 'orderItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'Receiving',
            name: 'receiptItemsObj',
        },
        {
          type: 'detailsUpside',
          label: 'Checked items',
          name: 'testedItemsObj',
          processName: 'CASHEW_RECEIPT_QC',
          collections: [
            {type: 'topGroupArray', collections: 'testedItems'},
            {type: 'kidArray', name: 'testedItems'},
            {type: 'kidObject', name: 'defects'},
            {type: 'kidObject', name: 'damage'},
            {type: 'hedear', name: 'item', title: 'Item descrption', options: this.genral.getStandarts(), pipes: 'object', collections: 'sampleWeight', accessor: (arr, elem) => arr.find(d => d['items'].some(el => {if(el['value'] === elem){return true;}}))},
            {type: 'bottomArray', collections: [
                {name: 'recordedTime', title: 'Date and time', pipes: 'dateTime', pipes1: 'dateTime'},
                {name: 'approvals', title: 'Approvals'},
                {name: 'inspector', title: 'Inspector'},
                {name: 'sampleTaker', title: 'Sample taker'},
                {name: 'checkedBy', title: 'Checked by'},

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
            type: 'arrayForEach',
            label: 'Transfers',
            name: 'transferItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'Cleanings',
            name: 'cleaningItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'Roasting',
            name: 'roastingItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'Packing',
            name: 'packingItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'Loading',
            name: 'loadingItemsObj',
        },
      ];


      finalShow = [
        {
            type: 'array',
            label: 'Receiving',
            name: 'receiving',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts',
                },
                {
                    type: 'listDates',
                    name: 'dates',
                    label: 'Receiving dates',
                },
            ]
        },
        {
            type: 'array',
            label: 'QC raw',
            name: 'qcRaw',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'normal',
                    name: 'checkedBy',
                    label: 'Checked by',
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
                    // collections: 'measureUnit',
                },
                {
                    type: 'percentNormal',
                    label: 'Total damage',
                    name: 'totalDamage',
                    // collections: 'currency',
                },
                {
                    type: 'percentNormal',
                    label: 'Total defects',
                    name: 'totalDefects',
                },
            ]
        },
        {
            type: 'array',
            label: 'Relocation',
            name: 'relocationItems',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'usedAmounts',
                    label: 'Used amounts',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts counted',
                },
                {
                    type: 'weight2',
                    name: 'changeGain',
                    label: 'Amounts gained',
                },
                {
                    type: 'date',
                    name: 'date',
                    label: 'Date',
                },
            ]
        },
        {
            type: 'array',
            label: 'Cleaning',
            name: 'cleaning',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts',
                },
                {
                    type: 'listDates',
                    name: 'dates',
                    label: 'Cleaning dates',
                },
            ]
        },
        {
            type: 'array',
            label: 'Roasting',
            name: 'roasting',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts',
                },
                {
                    type: 'listDates',
                    name: 'dates',
                    label: 'Roasting dates',
                },
            ]
        },
        {
            type: 'array',
            label: 'QC roasting',
            name: 'qcRoast',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'normal',
                    name: 'checkedBy',
                    label: 'Checked by',
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
                    // collections: 'measureUnit',
                },
                {
                    type: 'percentNormal',
                    label: 'Total damage',
                    name: 'totalDamage',
                    // collections: 'currency',
                },
                {
                    type: 'percentNormal',
                    label: 'Total defects',
                    name: 'totalDefects',
                },
            ]
        },
        {
            type: 'array',
            label: 'Packing',
            name: 'packing',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts',
                },
                {
                    type: 'listDates',
                    name: 'dates',
                    label: 'Packing dates',
                },
            ]
        },
        {
            type: 'array',
            label: 'Loading',
            name: 'loading',
            collections: [
                {
                    type: 'nameId',
                    label: 'Item descrption',
                    name: 'item',
                },
                {
                    type: 'weight2',
                    name: 'amounts',
                    label: 'Amounts',
                },
                {
                    type: 'date',
                    name: 'date',
                    label: 'Loading dates',
                },
                {
                    type: 'normal',
                    name: 'container',
                    label: 'Container number',
                },
                {
                    type: 'normal',
                    name: 'seal',
                    label: 'Seal number',
                },
            ]
        },
    ];

      ngOnDestroy() {
        if (this.navigationSubscription) {  
           this.navigationSubscription.unsubscribe();
        }
      }
}