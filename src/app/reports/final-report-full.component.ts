import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'final-report-full',
  template:`
  <ng-container *ngIf="poDetails; else noDataFull">
        <div class="example-action-buttons">
            <mat-checkbox (change)="setAll($event.checked)" i18n>Expand All</mat-checkbox>
        </div>
        <mat-accordion multi>
            <mat-expansion-panel *ngIf="poDetails['orderItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Orders</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{orderItemsObj: poDetails['orderItemsObj']}" [oneColumns]="[regShow[0]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['receiptItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Receipts</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{receiptItemsObj: poDetails['receiptItemsObj']}" [oneColumns]="[regShow[1]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['testedItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>QC Tests</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{testedItemsObj: poDetails['testedItemsObj']}" [oneColumns]="[regShow[2]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['relocationItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Relocation cashew</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{relocationItemsObj: poDetails['relocationItemsObj']}" [oneColumns]="[regShow[3]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['cleaningItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Cleanings</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{cleaningItemsObj: poDetails['cleaningItemsObj']}" [oneColumns]="[regShow[4]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['roastingItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Roastings</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{roastingItemsObj: poDetails['roastingItemsObj']}" [oneColumns]="[regShow[5]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['toffeeItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Toffee</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{toffeeItemsObj: poDetails['toffeeItemsObj']}" [oneColumns]="[regShow[6]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['packingItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Packings</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{packingItemsObj: poDetails['packingItemsObj']}" [oneColumns]="[regShow[7]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['arrivalsItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Arrivals</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{arrivalsItemsObj: poDetails['arrivalsItemsObj']}" [oneColumns]="[regShow[8]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
            <mat-expansion-panel *ngIf="poDetails['loadingItemsObj'].length">
                <mat-expansion-panel-header>
                    <mat-panel-title i18n>Loading</mat-panel-title>
                </mat-expansion-panel-header>
                <ng-template matExpansionPanelContent>
                    <show-details [dataSource]="{loadingItemsObj: poDetails['loadingItemsObj']}" [oneColumns]="[regShow[9]]">
                    </show-details>
                </ng-template>
            </mat-expansion-panel>
        </mat-accordion>
    </ng-container>
  <ng-template #noDataFull>
    <mat-spinner></mat-spinner>
  </ng-template>
  ` ,
  styleUrls: ['./final-report-tables.css']
})
export class FinalReportFullComponent {

    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    poDetails;
    @Input() poCode;

    constructor(private localService: ReportsService, private genral: Genral) {}
    
    ngOnInit() {
        this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
            this.poDetails = val;
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
            label: $localize`Orders`,
            name: 'orderItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Receiving`,
            name: 'receiptItemsObj',
        },
        {
          type: 'detailsUpside',
          label: $localize`Checked items`,
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
            label: $localize`Relocations`,
            name: 'relocationItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Cleanings`,
            name: 'cleaningItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Roasting`,
            name: 'roastingItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Toffee`,
            name: 'toffeeItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Packing`,
            name: 'packingItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Arrivals`,
            name: 'arrivalsItemsObj',
        },
        {
            type: 'arrayForEach',
            label: $localize`Loading`,
            name: 'loadingItemsObj',
        },
      ];



      ngOnDestroy() {
      }
}