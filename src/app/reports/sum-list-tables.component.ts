import { Component, Input } from '@angular/core';
import { groupBy, mapValues, cloneDeep } from 'lodash-es';
@Component({
  selector: 'sum-list-tables',
  template: `
  <div *ngIf="listTotal" style="float: right; margin-right: 15px;">
      <div style="display: inline-block; margin-right: 25px" *ngFor="let sum of listTotal">
        <ng-container *ngIf="sum.type.includes('Param'); else oneSum">

            <table mat-table [dataSource]="sum.val" style="text-align: center !important;">
    
                <ng-container matColumnDef="head">
                    <th mat-header-cell *matHeaderCellDef colspan="2">{{sum.label}}</th>
                </ng-container>
                <ng-container matColumnDef="key">
                    <td mat-cell *matCellDef="let element">{{element.key === 'null'? 'other' : element.key}}</td>
                </ng-container>
                <ng-container matColumnDef="val" >
                    <td mat-cell *matCellDef="let element">{{element.val | tableCellPipe: 'decimalNumber' : null}}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['head']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['key', 'val']"></tr>
            </table>

        </ng-container>
        <ng-template #oneSum>
            <table mat-table [dataSource]="[sum.val]" style="text-align: center !important;">
                <ng-container matColumnDef="head">
                    <th mat-header-cell *matHeaderCellDef>{{sum.label}}</th>
                </ng-container>
                <ng-container matColumnDef="val" >
                    <td mat-cell *matCellDef="let element">{{element | tableCellPipe: 'decimalNumber' : null}}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['head']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['val']"></tr>
            </table>
        </ng-template>
      </div>
    </div>
  `,
})
export class SumListTablesComponent {
  
  dataSource;
  listTotal = [];

  @Input() set mainDetailsSource(value) {
    if(value[0]) {
        this.dataSource = cloneDeep(<any[]>value[0]);
        this.listTotal = value[1];
        this.listTotal.forEach(ele => {
            switch (ele.type) {
              case 'sumByParam':
                ele.val = this.doTotalSumParam(this.dataSource, ele);
                break;
              case 'sum':
                ele.val = this.dataSource.reduce((b, c) => +b + +c[ele.name] , 0);
                break;
              case 'recordAmountGroup':
                ele.val = (new Set(this.dataSource.map(a => a[ele.name]))).size;
                break;
              case 'sumByParamCond':
                ele.val = this.doTotalSumParam(ele.condision(this.dataSource), ele);
              default:
                break;
            }
        });
    }
  }
  
  doTotalSumParam(filtered, ele) {
    const tempTable = mapValues(groupBy(filtered, ele.name));
    // const weightSize1 = Object.keys(tempTable).length;
    
    var result1 = new Array<object>();

    Object.keys(tempTable).sort().forEach(a => {
      result1.push({key: a, val: tempTable[a].reduce((b, c) => +b + +c[ele.option] , 0)})
    })
    // for (let t = 0; t < weightSize1; t++) {
    //   result1[t] = {key: Object.keys(tempTable)[t], val: tempTable[Object.keys(tempTable)[t]].reduce((b, c) => +b + +c[ele.option] , 0)};
    // }
    if (ele.collections && result1.length) {
      result1.forEach(a => {
        a['key'] = ele.collections[a['key']];
      });
    }
    return result1;
  }

}


