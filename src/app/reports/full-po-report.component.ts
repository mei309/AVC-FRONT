import { Component } from '@angular/core';
import { ReportsService } from './reports.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OneColumn, FieldConfig } from '../field.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Genral } from '../genral.service';

@Component({
  selector: 'full-po-report',
  template:`
    <fieldset [ngStyle]="{'width':'90%'}">
        <legend><h1>PO# Details</h1></legend>
        <ng-container *ngFor="let field of poConfig;" dynamicField [field]="field" [group]="form">
        </ng-container>
        <div *ngIf="isDataAvailable">
            <show-details [dataSource]="poDetails" [oneColumns]="regShow">
            </show-details>
        </div>
    </fieldset>
  ` ,
})
export class fullPoReportComponent {
    
    form: FormGroup;
    poCode: number;
    poConfig: FieldConfig[];
    poDetails;
    isDataAvailable = false;

    constructor(private fb: FormBuilder, private localService: ReportsService, private _Activatedroute: ActivatedRoute, private genral: Genral) {}

    ngOnInit() {
        this.form = this.fb.group({poCode: this.fb.control('')});
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('poCode')) {
                this.poCode = +params.get('poCode');
                this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                    this.poDetails = val;
                    this.isDataAvailable = true;
                });
                this.localService.getAllPoCodes().pipe(take(1)).subscribe( val1 => {
                    this.form.get('poCode').setValue(val1.find(element => element.id === this.poCode));
                });
            }
        });  
        this.form.get('poCode').valueChanges.subscribe(selectedValue => {
            if(selectedValue && selectedValue.hasOwnProperty('id')) {
                if(selectedValue['code'] !== this.poCode) {
                    this.poCode = selectedValue['id'];
                    this.localService.getAllProcesses(this.poCode).pipe(take(1)).subscribe( val => {
                        this.poDetails = val;
                        console.log(val);
                    
                        this.isDataAvailable = true;
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
    }


    regShow = [
        {
            type: 'arrayForEach',
            label: 'All orders',
            name: 'orderItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'All receiving',
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
                {name: 'recordedTime', title: 'Date and time', pipes: 'dateTime'},
                {name: 'personInCharge', title: 'Person in charge'},
                {name: 'duration', title: 'Time duration'},
                {name: 'approvals', title: 'Approvals'},
                {name: 'numOfWorkers', title: 'Number of workers'},
                {name: 'inspector', title: 'Inspector'},
                {name: 'sampleTaker', title: 'Sample taker'},
                {name: 'processName', title: 'Checked by'},

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
                {name: 'totalDamage', title: 'Totel damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
                {name: 'scorched', title: 'Scorched', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'deepCut', title: 'Deep cut', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'offColour', title: 'Off colour', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'shrivel', title: 'Shrivel', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'desert', title: 'Desert/dark', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'deepSpot', title: 'Deep spot', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'totalDefects', title: 'Totel defects', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
                {name: 'totalDefectsAndDamage', title: 'Totel defects + damage', pipes: 'percentCollections', pipes1: 'percent', bold: 'true'},
                {name: 'rostingWeightLoss', title: 'Totel weight lost after roasting', pipes: 'percentCollections', pipes1: 'percent'},
                {name: 'colour', title: 'Rosted color', pipes: 'OK', pipes1: 'OK'},
                {name: 'flavour', title: 'Flavour', pipes: 'OK', pipes1: 'OK'},
              ]
            }
          ]
        },
        {
            type: 'arrayForEach',
            label: 'All transfers',
            name: 'transferItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'All cleanings',
            name: 'cleaningItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'All roasting',
            name: 'roastingItemsObj',
        },
        {
            type: 'arrayForEach',
            label: 'All packing',
            name: 'packingItemsObj',
        },
      ];

}