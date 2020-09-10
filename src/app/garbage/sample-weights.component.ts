// import { Component, OnInit } from '@angular/core';
// import { Validators } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
// import { take } from 'rxjs/operators';
// import { FieldConfig } from '../field.interface';
// import { OrderDetailsDialogComponent } from './order-details-dialog-component';
// import { OrdersService } from './orders.service';
// import { Genral } from '../genral.service';
// @Component({
//     selector: 'sample-weight',
//     template: `
//     <dynamic-form [fields]="regConfig" [putData]="putData" [mainLabel]="'Sample weights'" (submit)="submit($event)">
//     </dynamic-form> 
//     `
//   })
// export class SampleWeightsComponent implements OnInit {

//     regConfig: FieldConfig[];
//     putData;
//     constructor(private router: Router, private _Activatedroute:ActivatedRoute,  private genral: Genral, private localService: OrdersService, private dialog: MatDialog) {
//     }


//   ngOnInit() {
//     this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
//         if(params.get('poCode')) {
//             this.putData = {poCode: JSON.parse(params.get('poCode'))};
//         }
//     });

//     this.regConfig = [
//         {
//             type: 'selectgroup',
//             inputType: 'supplierName',
//             options: this.localService.getPoCashewCodesOpenPending(),
//             disable: true,
//             collections: [
//                 {
//                     type: 'select',
//                     label: 'Supllier',
//                 },
//                 {
//                     type: 'select',
//                     label: '#PO',
//                     name: 'poCode',
//                     collections: 'somewhere',
//                     validations: [
//                         {
//                             name: 'required',
//                             validator: Validators.required,
//                             message: '#PO Required',
//                         }
//                     ]
//                 },
//             ]
//         },
//         {
//             type: 'date',
//             label: 'Date',
//             value: new Date(),
//             name: 'recordedTime',
//             options: 'withTime',
//             validations: [
//                 {
//                     name: 'required',
//                     validator: Validators.required,
//                     message: 'Date Required',
//                 }
//             ]
//         },
//         {
//             type: 'bigexpand',
//             label: 'Receive amounts and sampale weights',
//             name: 'sampleItems',
//             value: 'required',
//             collections: [
//                 {
//                     type: 'select',
//                     label: 'Item descrption',
//                     name: 'item',
//                     options: this.genral.getItemsCashew(),
//                 },
//                 {
//                     type: 'selectNormal',
//                     label: 'Weight unit',
//                     name: 'measureUnit',
//                     options: ['KG', 'LBS'],
//                 },
//                 {
//                     type: 'array',
//                     label: 'Empty bag weight',
//                     name: 'emptyContainerWeight',
//                     inputType: 'numeric',
//                     options: 3,
//                 },
//                 {
//                     type: 'bigexpand',
//                     label: 'Amounts',
//                     name: 'itemWeights',
//                     options: 'Inline',
//                     collections: [
//                         {
//                             type: 'input',
//                             label: 'Bag weight',
//                             name: 'unitAmount',
//                             inputType: 'numeric',
//                             options: 3,
//                         },
//                         {
//                             type: 'input',
//                             label: 'Number of bags',
//                             name: 'numberUnits',
//                             inputType: 'numeric',
//                             options: 3,
//                         },
//                         // {
//                         //     type: 'input',
//                         //     label: 'Number of samples',
//                         //     name: 'numberOfSamples',
//                         //     inputType: 'numeric',
//                         // },
//                         {
//                             type: 'popup',
//                             label: 'Avrage or samples',
//                             name: 'avgTestedWeight',
//                             collections: [
//                                 {
//                                     type: 'array',
//                                     label: 'Samples',
//                                     inputType: 'numeric',
//                                     name: 'aLotSamples',
//                                     options: 3,
//                                     collections: 50,
//                                 },
//                                 {
//                                     type: 'input',
//                                     label: 'Or avrage weight',
//                                     name: 'avgWeight',
//                                     inputType: 'numeric',
//                                     options: 3,
//                                 },
//                                 {
//                                     type: 'button',
//                                     label: 'Submit',
//                                     name: 'submit',
//                                 }
//                             ]
//                         },
//                         {
//                             type: 'divider',
//                             inputType: 'divide'
//                         },
//                     ],
//                     validations: [
//                         {
//                             name: 'unitAmount',
//                             massage: 'a item weight must contain Unit weight, number of bags, number of samples and avrage tested weight',
//                         },
//                         {
//                             name: 'numberUnits',
//                         },
//                         // {
//                         //     name: 'numberOfSamples',
//                         // },
//                         // {
//                         //     name: 'avgTestedWeight',
//                         // },
//                     ]
//                 },
//                 {
//                     type: 'divider',
//                     inputType: 'divide'
//                 },
//             ],
//             validations: [
//                 {
//                     name: 'item',
//                     message: 'a received and sample must have an item, measure unit, empty container weight and at least one item weight',
//                 },
//                 {
//                     name: 'emptyContainerWeight',
//                 },
//                 {
//                     name: 'measureUnit',
//                 },
//                 {
//                     name: 'itemWeights',
//                     validator: [
//                         {
//                             name: 'unitAmount',
//                         },
//                         {
//                             name: 'numberUnits',
//                         },
//                         // {
//                         //     name: 'numberOfSamples',
//                         // },
//                         // {
//                         //     name: 'avgTestedWeight',
//                         // },
//                     ],
//                 }
//             ]
//         },
//         {
//             type: 'button',
//             label: 'Submit',
//             name: 'submit',
//         }
//     ];

//   }

//     submit(value: any) {
//         value['sampleItems'].forEach(element => {
//             element['emptyContainerWeight'] = (element['emptyContainerWeight'].reduce((b, c) => +b + +c['value'], 0))/element['emptyContainerWeight'].length;
//             element['itemWeights'].forEach(ele => {
//                 if(ele['avgTestedWeight']) {
//                     if(ele['avgTestedWeight'].hasOwnProperty('avgWeight')) {
//                         ele['avgTestedWeight'] = ele['avgTestedWeight']['avgWeight'];
//                     } else if(ele['avgTestedWeight'].hasOwnProperty('aLotSamples')) {
//                         ele['avgTestedWeight'] = (ele['avgTestedWeight']['aLotSamples'].reduce((b, c) => +b + +c['value'] + +ele['unitAmount'], 0))/ele['avgTestedWeight']['aLotSamples'].length;
//                     }
//                 }
//             });
//         });
//         this.localService.addEditReceiveSample(value, true).pipe(take(1)).subscribe( val => {
//             const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
//                 width: '80%',
//                 data: {order: val, fromNew: true, type: 'sample'}
//             });
//             dialogRef.afterClosed().subscribe(data => {
//                 this.router.navigate(['../CashewOrders'], { relativeTo: this._Activatedroute });
//             });
//         });
//     }
      

//   }


