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
              {type: 'item', title: 'Item descrption', options: this.genral.getStandarts(), pipes: 'object', collections: 'sampleWeight', accessor: (arr, elem) => arr.find(d => d['items'].some(el => {if(el['value'] === elem){return true;}}))},
              {type: 'kidArray', name: 'testedItems', baby: ['defects', 'damage']},
              // {type: 'processName', title: 'Checked by'},
              {type: 'numberOfSamples', title: 'Number of samples'},
              {type: 'wholeCountPerLb', title: 'Whole count per Lb'},
              {type: 'smallSize', title: 'Small size', pipes: 'percentCollections', collections: 'wholeCountPerLb'},
              {type: 'ws', title: 'WS', pipes: 'percentCollections'},
              {type: 'lp', title: 'LP', pipes: 'percentCollections'},
              {type: 'humidity', title: 'Humidity', pipes: 'percent'},
              {type: 'breakage', title: 'Breakage', pipes: 'percentCollections'},
              {type: 'foreignMaterial', title: 'Foreign material', pipes: 'percentCollections'},
              {type: 'mold', title: 'Mold', pipes: 'percentCollections'},
              {type: 'dirty', title: 'Dirty', pipes: 'percentCollections'},
              {type: 'lightDirty', title: 'Light dirty', pipes: 'percentCollections'},
              {type: 'decay', title: 'Decay', pipes: 'percentCollections'},
              {type: 'insectDamage', title: 'Insect damage', pipes: 'percentCollections'},
              {type: 'testa', title: 'Testa', pipes: 'percentCollections'},
              {type: 'totalDamage', title: 'Totel damage', pipes: 'percentCollections'},
              {type: 'scorched', title: 'Scorched', pipes: 'percentCollections'},
              {type: 'deepCut', title: 'Deep cut', pipes: 'percentCollections'},
              {type: 'offColour', title: 'Off colour', pipes: 'percentCollections'},
              {type: 'shrivel', title: 'Shrivel', pipes: 'percentCollections'},
              {type: 'desert', title: 'Desert/dark', pipes: 'percentCollections'},
              {type: 'deepSpot', title: 'Deep spot', pipes: 'percentCollections'},
              {type: 'totalDefects', title: 'Totel defects', pipes: 'percentCollections'},
              {type: 'totalDefectsAndDamage', title: 'Totel defects + damage', pipes: 'percentCollections'},
              {type: 'rostingWeightLoss', title: 'Totel weight lost after roasting', pipes: 'percentCollections'},
              {type: 'colour', title: 'Rosted color', pipes: 'OK'},
              {type: 'flavour', title: 'Flavour', pipes: 'OK'},
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