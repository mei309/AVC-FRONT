import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { SuppliersService } from '../suppliers/suppliers.service';
import {uniq} from 'lodash-es';
import { ManagerService } from '../manager/manager.service';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OrdersService } from '../orders/orders.service';
import { QcService } from '../qc/qc.service';
import { XlxsService } from './xlxs-imports.service';

@Component({
  selector: 'app-xlxs-import',
  template: `
  <input type="file" (change)="onFileChange($event)" multiple="false" />
  <mat-button-toggle-group [(ngModel)]="choosedOne">
        <mat-button-toggle value="SupplyCategories">SupplyCategories</mat-button-toggle>
        <mat-button-toggle value="ContractTypes">ContractTypes</mat-button-toggle>
        <mat-button-toggle value="ItemsCashew">ItemsCashew</mat-button-toggle>
        <mat-button-toggle value="SuppliersCashew">SuppliersCashew</mat-button-toggle>
        <mat-button-toggle value="OrdersCashew">OrdersCashew</mat-button-toggle>
        <mat-button-toggle value="QcRawCashew">QcRawCashew</mat-button-toggle>
        <mat-button-toggle value="RostedQcCashew">RostedQcCashew</mat-button-toggle>
        <mat-button-toggle value="receiveAllCashewOrders">receiveAllCashewOrders</mat-button-toggle>
        <mat-button-toggle value="approveFinal">approveFinal</mat-button-toggle>
    </mat-button-toggle-group>
    <h2>{{choosedOne}}</h2>
    {{data | json}}
    ` ,
})
export class XlxsImportsComponent {

    choosedOne: string;
    data;

    constructor(private genral: Genral,
        private ordersService: OrdersService, private qcService: QcService, private localservice: XlxsService) { }
    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
    
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    // console.log(XLSX.utils.sheet_to_json(ws, {raw: true}));
    
          /* save data */
          this.data = <Array<Array<any>>>(XLSX.utils.sheet_to_json(ws, {raw: true}));
          switch (this.choosedOne) {
            case 'SupplyCategories':
                this.putSupplyType();
                break;
            case 'ContractTypes':
                this.putContractTypes();
                break;
            case 'ItemsCashew':
                this.putItemsCashew();
                break;
            case 'SuppliersCashew':
                this.putSuppliersCashew();
                break;
            case 'OrdersCashew':
                this.setOrdersCashew();
                break;
            case 'QcRawCashew':
                this.setQcRawCashew();
                break;
            case 'RostedQcCashew':
                this.setRostedQcCashew();
                break;
            case 'receiveAllCashewOrders':
                this.receiveAllCashewOrders();
                break;
            case 'approveFinal':
                this.approveFinalAllCashewReceived();
                break;
              default:
                  break;
          }
        };
        reader.readAsBinaryString(target.files[0]);
      }

      putSuppliersCashew() {
        var arr = [];
        this.data.forEach(element => {
            arr.push(element.supplier);
        });
        var newArr = [];
        this.genral.getSupplyType().pipe(take(1)).subscribe(value4 => {
            uniq(arr).forEach(elem => {
                newArr.push({name: elem, supplyCategories: [value4[0]]});
            });
            this.localservice.addAllSupplier(newArr).pipe(take(1)).subscribe(value4 => {
                console.log(value4);
             });
        });
    }
    putItemsCashew() {
        var arr = [];
        this.data.forEach(element => {
            arr.push(element.item);
        });
        var newArr = [];
        uniq(arr).forEach(eleme => {
            newArr.push({measureUnit: 'KG', value: eleme, supplyGroup: 'CASHEW', category: 'RAW'});
            newArr.push({measureUnit: 'KG', value: eleme+'-CLEANED', supplyGroup: 'CASHEW', category: 'CLEAN'});
            newArr.push({measureUnit: 'KG', value: eleme+'-ROASTED', supplyGroup: 'CASHEW', category: 'ROAST'});
        });
        this.localservice.addAllNewSetup('Items', newArr).pipe(take(1)).subscribe(value4 => {
            console.log(value4); 
        });
    }
    putSupplyType() {
        var newArr = [];
        newArr.push({supplyGroup: 'CASHEW', value: 'CASHEW'});
        newArr.push({supplyGroup: 'GENERAL', value: 'GENERAL'});
        this.localservice.addAllNewSetup('SupplyCategories', newArr).pipe(take(1)).subscribe(value4 => {
            console.log(value4);
        });
    }
    putContractTypes() {
        var arr = [];
        this.data.forEach(element => {
            arr.push(element.code.replace(/\d/g, ""));
        });
        var newArr = [];
        uniq(arr).forEach(eleme => {
            newArr.push({code: eleme, currency: 'USD', value: eleme, suffix: ''});
        });
        newArr.push({code: 'PO', currency: 'VND', value: 'PO-VND', suffix: 'V'});
        newArr.push({code: 'ABE', currency: 'VND', value: 'ABE-VND', suffix: 'V'});
        this.localservice.addAllNewSetup('ContractTypes', newArr).pipe(take(1)).subscribe(value4 => {
            console.log(value4);
        });
    }

    setOrdersCashew() {
        this.genral.getSupplierCashew().pipe(take(1)).subscribe(value1 => {
            this.genral.getItemsRawCashew().pipe(take(1)).subscribe(value2 => {
                this.genral.getContractType().pipe(take(1)).subscribe(value3 => {
                    this.data.forEach(element => {
                        var poCo = {};
                        poCo['supplier'] = value1.find(su => su.value === element['supplier']);
                        var cont = element.code.replace(/\d/g, "");
                        if(element['cuurency']) {
                            cont += '-VND';
                        }
                        poCo['contractType'] = value3.find(su => su.value === cont);
                        poCo['code'] = element.code.replace(/\D/g, "");
                        element['poCode'] = poCo;
                        
                        var dateParts = element['deliveryDate'].split("/");
                        // month is 0-based, that's why we need dataParts[1] - 1
                        element['recordedTime'] = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) -1, parseInt(dateParts[0])); 
                        var newIso = (new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) -1, parseInt(dateParts[0]))).toISOString().substring(0,10);
                        
                        // var isoDate: string = (+dateParts[2] + '-'+ dateParts[1] - 1 + '-'+ +dateParts[0]).toString(); 
                        // element['recordedTime'] = new Date(element['deliveryDate']);
                        element['orderItems'] = [{item: value2.find(su => su.value === element['item']), deliveryDate: newIso, remarks: element['remarks'], "numberUnits": {"amount": "35000", "measureUnit": "LBS"}}];
                    });
                    console.log(this.data);
                    
                    this.localservice.addAllCashewOrders(this.data).pipe(take(1)).subscribe(value4 => {
                        console.log(value4);
                    });
                });
            });
        });
    }

    setQcRawCashew() {
        // po	deliveryDate
        var arr = [];
        this.qcService.getPoCashewCodesOpenPending().pipe(take(1)).subscribe(value1 => {
            this.genral.getItemsRawCashew().pipe(take(1)).subscribe(value2 => {
                this.data.forEach(element => {
                    var damage = {mold: (element['mold']*16)/100, dirty: (element['dirty']*16)/100, lightDirty: (element['lightDirty']*16)/100, decay: (element['decay']*16)/100, insectDamage: (element['insectDamage']*16)/100, testa: (element['testa']*16)/100};
                    var defects = {scorched: (element['scorched']*16)/100, deepCut: (element['deepCut']*16)/100, offColour: (element['offColour']*16)/100, shrivel: (element['shrivel']*16)/100, desert: (element['desert']*16)/100, deepSpot: (element['deepSpot']*16)/100};
                    
                    var qcItem = {measureUnit: 'OZ', sampleWeight: 16, wholeCountPerLb: element['wholeCountPerLb'], numberOfSamples: element['numberOfSamples'], humidity: element['humidity'], ws: (element['ws']*16)/100 , lp: (element['lp']*16)/100, breakage: (element['breakage']*16)/100};
                    qcItem['smallSize'] = (element['smallSize']*element['wholeCountPerLb'])/100;
                    qcItem['item'] = value2.find(su => su.value === element['item']);
                    qcItem['defects'] = defects;
                    qcItem['damage'] = damage;

                    var qcRaw = {testedItems: [qcItem]};
                    var dateParts = element['deliveryDate'].split("/");
                        // month is 0-based, that's why we need dataParts[1] - 1
                    qcRaw['recordedTime'] = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) -1, parseInt(dateParts[0])); 
                    const eelll = +element['po'].replace(/\D/g, "");
                    qcRaw['poCode'] = value1.find(su => su['code'] === eelll);
                    if(!qcRaw['poCode']) {
                        qcRaw['poCode'] = element['po'];
                    }
                    arr.push(qcRaw);
                });

                this.localservice.addAllCashewReceiveCheck(arr).pipe(take(1)).subscribe(value4 => {
                    console.log(value4);
                    
                });
            });
        });
    }


    setRostedQcCashew() {
        // po	deliveryDate
        var arr = [];
        this.qcService.getPoCashewCodesOpenPending().pipe(take(1)).subscribe(value1 => {
            this.genral.getItemsRawCashew().pipe(take(1)).subscribe(value2 => {
                this.data.forEach(element => {
                    var damage = {mold: (element['mold']*16)/100, dirty: (element['dirty']*16)/100, lightDirty: (element['lightDirty']*16)/100, decay: (element['decay']*16)/100, insectDamage: (element['insectDamage']*16)/100, testa: (element['testa']*16)/100};
                    var defects = {scorched: (element['scorched']*16)/100, deepCut: (element['deepCut']*16)/100, offColour: (element['offColour']*16)/100, shrivel: (element['shrivel']*16)/100, desert: (element['desert']*16)/100, deepSpot: (element['deepSpot']*16)/100};
                    
                    var qcItem = {measureUnit: 'OZ', sampleWeight: 16, wholeCountPerLb: element['wholeCountPerLb'], numberOfSamples: element['numberOfSamples'], humidity: element['humidity'], ws: (element['ws']*16)/100 , lp: (element['lp']*16)/100, breakage: (element['breakage']*16)/100};
                    qcItem['smallSize'] = (element['smallSize']*element['wholeCountPerLb'])/100;
                    qcItem['item'] = value2.find(su => su.value === (element['item']+'-ROASTED'));
                    qcItem['defects'] = defects;
                    qcItem['damage'] = damage;

                    var qcRaw = {testedItems: [qcItem]};
                    var dateParts = element['deliveryDate'].split("/");
                        // month is 0-based, that's why we need dataParts[1] - 1
                    qcRaw['recordedTime'] = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) -1, parseInt(dateParts[0])); 
                    const eelll = +element['po'].replace(/\D/g, "");
                    qcRaw['poCode'] = value1.find(su => su['code'] === eelll);
                    if(!qcRaw['poCode']) {
                        qcRaw['poCode'] = element['po'];
                    }
                    arr.push(qcRaw);
                });

                this.localservice.addAllCashewReceiveCheck(arr).pipe(take(1)).subscribe(value4 => {
                    console.log(value4);
                    
                });
            });
        });
    }


    receiveAllCashewOrders() {
        var arr = [];
        this.ordersService.getPoCashewCodesOpenPending().pipe(take(1)).subscribe(value1 => {
            var lenn = value1.length-1;
            value1.forEach(element => {
                this.ordersService.getOrderPO(element['id']).pipe(take(1)).subscribe( value2 => {
                    var reipt = {poCode: element, recordedTime: value2['recordedTime']};
                    var storage = [{unitAmount: {amount: 50, measureUnit: 'KG'}, numberUnits: 317}, {unitAmount: {amount: 26, measureUnit: 'KG'}, numberUnits: 1}];
                    var itemmmss = [{orderItem: value2['orderItems'][0], item: value2['orderItems'][0]['item'], storageForms: storage}];
                    reipt['receiptItems'] = itemmmss;
                    arr.push(reipt);
                    if(lenn === 0) {
                        console.log(arr);
                        this.localservice.addAllReceiveCashewOrder(arr).pipe(take(1)).subscribe( value4 => {
                            console.log(value4);
                        });
                    } else {
                        lenn--;
                    }
                });
            });
            
        });
    }

    approveFinalAllCashewReceived() {
        var arr = [];
        this.ordersService.getPendingCashew().pipe(take(1)).subscribe(value1 => {
            var lenn = value1.length-1;
            value1.forEach(element => {
                this.ordersService.getReceive(element['id']).pipe(take(1)).subscribe( value2 => {
                    arr.push(value2);
                    if(lenn === 0) {
                        console.log(arr);
                        this.localservice.addAllAproveFinal(arr).pipe(take(1)).subscribe( value4 => {
                            console.log(value4);
                        });
                    } else {
                        lenn--;
                    }
                });
            });
            
        });
    }
      
}
