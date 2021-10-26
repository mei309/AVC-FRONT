import { Component, Input } from '@angular/core';
import { groupBy, mapValues, cloneDeep } from 'lodash-es';
@Component({
  selector: 'sums-product-type',
  template: `
<ng-container *ngIf="sumClumensshow.length > 1">
<h2 style="text-align:center" i18n>{{title}}</h2>
<table mat-table [dataSource]="sumDataSource" style="text-align: center !important;">

    <ng-container matColumnDef="key">
      <th mat-header-cell *matHeaderCellDef></th>
      <td mat-cell *matCellDef="let element">{{element.key}}</td>
    </ng-container>
    <ng-container matColumnDef="{{column}}" *ngFor="let column of sumClumensshow">
        <th mat-header-cell *matHeaderCellDef>
          <h3>{{column}}</h3>
        </th>
        <td mat-cell *matCellDef="let element">
          {{element[column] | tableCellPipe: type : null}}
        </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="sumClumensTable"></tr>
    <tr mat-row *matRowDef="let row; columns: sumClumensTable"></tr>
 </table>
 </ng-container>
  `,
})
export class SumsProductTypeComponent {

  dataSource;
  sumDataSource = [];
  sumCloumns = [];
  sumClumensTable: string[];
  sumClumensshow: string[];
  @Input() title;
  @Input() type;

  @Input() set mainDetailsSource(value) {
    if(value) {
        this.dataSource = cloneDeep(<any[]>value[0]);
        this.sumCloumns = value[1];
        if(this.sumCloumns.length) {
            this.sumDataSource = [];
            var nest = function (seq, keys) {
              if (!keys.length)
                  return seq;
              var first = keys[0];
              var rest = keys.slice(1);
              return mapValues(groupBy(seq, first), function (valu) {
                  return nest(valu, rest)
              });
            };
            const tempTable = nest(this.dataSource, this.sumCloumns);
            this.sumClumensTable = ['key'];

            var newSumLine = {key: $localize`Total`};

            Object.keys(tempTable).forEach(key => {
              var newLine = {};
              var sum = 0;
              var diveder = 0;
              var numChecks = 0;
              Object.keys(tempTable[key]).forEach(val => {
                var temp = tempTable[key][val].filter(f => f[value[2]] !== null && f[value[2]] !== undefined);
                if(temp.length) {
                  newLine[val] = (temp.reduce((b, c) => +b + +c[value[2]] , 0));
                  this.sumClumensTable.push(val);
                  sum += newLine[val];
                  diveder ++;
                  numChecks += temp.length;
                  newSumLine[val] = newSumLine[val]? newSumLine[val] + 1 : 1;
                }
              });
              if(numChecks) {
                newLine['key'] = (key !== 'null')? key + ' (' + numChecks +')' : 'other (' + numChecks +')';
                newLine[$localize`Total`] = sum;
                this.sumDataSource.push(newLine);
              }
            });
            this.sumClumensTable = [...new Set(this.sumClumensTable)];
            this.sumClumensTable.push($localize`Total`);

            this.sumClumensTable.forEach(newCloumn => {
              if(newCloumn === $localize`Total`) {
                var sum = 0;
                this.sumDataSource.forEach(aLine => {
                  if(aLine[newCloumn]) {
                    sum += aLine[newCloumn];
                  }
                });
                newSumLine[newCloumn] = sum;
              } else if(newCloumn !== 'key') {
                var sum = 0;
                this.sumDataSource.forEach(aLine => {
                  sum += aLine[newCloumn]? aLine[newCloumn] : 0;
                });
                newSumLine[newCloumn] = sum;
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
