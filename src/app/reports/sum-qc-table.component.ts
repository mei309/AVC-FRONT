import { Component, Input } from '@angular/core';
import { groupBy, mapValues } from 'lodash-es';
@Component({
  selector: 'sums-qc-table',
  template: `
<h2 style="text-align:center" i18n>Total {{type}} defects + damage</h2>
<table mat-table [dataSource]="sumDataSource" style="text-align: center !important;">
    
    <ng-container matColumnDef="key">
      <th mat-header-cell *matHeaderCellDef>
      </th>
      <td mat-cell *matCellDef="let element">
        {{element.key === 'null'? '' : element.key}}
      </td>
    </ng-container>
    <ng-container matColumnDef="{{column}}" *ngFor="let column of sumClumensshow">
        <th mat-header-cell *matHeaderCellDef>
          <h3>{{column}}</h3>
        </th>
        <td mat-cell *matCellDef="let element">
          {{element[column] | tableCellPipe: 'percentNormal' : null}}
        </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="sumClumensTable"></tr>
    <tr mat-row *matRowDef="let row; columns: sumClumensTable"></tr>
 </table>
  `,
})
export class SumsQcsTableComponent {
  
  dataSource;
  sumDataSource = [];
  sumCloumns = [];
  sumClumensTable: string[];
  sumClumensshow: string[];
  type;

  @Input() set mainDetailsSource(value) {
    if(value) {
        this.dataSource = <any[]>value[0];
        this.sumCloumns = value[1];
        value[2] === 'rawDefectsAndDamage'? this.type = $localize`raw` : this.type = $localize`roast`;
        if(this.sumCloumns.length) {
            this.sumDataSource = [];
            var nest = function (seq, keys) {
              if (!keys.length)
                  return seq;
              var first = keys[0];
              var rest = keys.slice(1);
              return mapValues(groupBy(seq, first), function (value) { 
                  return nest(value, rest)
              });
            };
            const tempTable = nest(this.dataSource, this.sumCloumns);
            this.sumClumensTable = ['key'];

            var newSumLine = {key: $localize`Totel`};

            Object.keys(tempTable).forEach(key => {
              var newLine = {key: key};
              var sum = 0;
              var diveder = 0;
              Object.keys(tempTable[key]).forEach(val => {
                var temp = tempTable[key][val].filter(f => f[value[2]] !== null && f[value[2]] !== undefined);
                if(temp.length) {
                  newLine[val] = (temp.reduce((b, c) => +b + +c[value[2]] , 0))/temp.length;
                  this.sumClumensTable.push(val);
                  sum += newLine[val];
                  diveder ++;
                  newSumLine[val] = newSumLine[val]? newSumLine[val] + 1 : 1;
                }
              });
              newLine[$localize`sum`] = sum/diveder;
              this.sumDataSource.push(newLine);
            });
            this.sumClumensTable = [...new Set(this.sumClumensTable)]; 
            this.sumClumensTable.push($localize`sum`);
            
            this.sumClumensTable.forEach(newCloumn => {
              if(newCloumn === $localize`sum`) {
                var sum = 0;
                var diveder = 0;
                this.sumDataSource.forEach(aLine => {
                  if(aLine[newCloumn]) {
                    sum += aLine[newCloumn];
                    diveder ++;
                  } 
                });
                newSumLine[newCloumn] = sum/diveder;
              } else if(newCloumn !== 'key') {
                var sum = 0;
                this.sumDataSource.forEach(aLine => {
                  sum += aLine[newCloumn]? aLine[newCloumn] : 0;
                });
                newSumLine[newCloumn] = sum/newSumLine[newCloumn];
              }
            });
            this.sumDataSource.push(newSumLine);
            this.sumClumensshow = this.sumClumensTable.slice(1);
        }
    }
  }
  
  
  constructor() {
  }
}
