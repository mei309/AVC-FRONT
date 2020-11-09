import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { QcService } from '../qc/qc.service';
import { Genral } from './../genral.service';
import { includesValdaite } from './compareService.interface';
@Component({
  selector: 'app-qc-test',
  template: `
  <div style="white-space: pre-wrap;">{{massage}}</div>
    ` ,
})
export class QcTestComponent implements OnInit {
  massage = '';

  constructor(private LocalService: QcService, private genral: Genral) { }
  
  ngOnInit(): void {
    this.LocalService.getPoCashew(false).pipe(take(1)).subscribe(value1 => {
      this.genral.getAllItemsCashew().pipe(take(1)).subscribe(value2 => {
        this.genral.getStorage().pipe(take(1)).subscribe(value3 => {
            const mainRecivingQc = { "poCode": value1[0], "recordedTime": "2020-05-25T06:24:41.489Z", "processItems": [ { "item": value2[1], "storageForms": [ { "unitAmount": {"amount": "111", "measureUnit": "OZ"}, "numberUnits": "11", "warehouseLocation": value3[1] } ] }], "testedItems": [{"item": value2[1], "humidity": "2", "count": "222", "breakage": "2", "foreignMaterial": "2", "smallKernels": "2", "mold": "2", "dirty": "2", "decay": "2", "insectDamage": "2", "testa": "2", "scorched": "2", "deepCut": "2", "offColour": "2", "shrivel": "2", "deepSpot": "2", "desert": "2", "weightLoss": "2", "defectsAfterRoasting": "2", "colour": "OK", "flavour": "NOT_OK" } ] };
            this.LocalService.addEditCashewReceiveCheck(mainRecivingQc, true).pipe(take(1)).subscribe(value4 => {

                mainRecivingQc['recordedTime'] = value4['recordedTime'];
                console.log(value4);
                console.log(mainRecivingQc);
                
                if(includesValdaite(Object.assign({}, value4), Object.assign({}, mainRecivingQc))) {
                  this.massage += 'adding receiving qc SUCSSESFUL\n';
                } else {
                  this.massage += 'adding receiving qc not including something\n';
                }

            
            });
        });
      });
    });


    
      

    

  }
}