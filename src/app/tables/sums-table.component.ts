import { Component, Input } from '@angular/core';
import { groupBy, mapValues } from 'lodash-es';
@Component({
  selector: 'sums-table',
  template: `
<table mat-table [dataSource]="sumDataSource">
    
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
          {{element[column] | number : '1.0-3'}}
        </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="sumClumensTable"></tr>
    <tr mat-row *matRowDef="let row; columns: sumClumensTable"></tr>
 </table>
  `,
})
export class SumsTableComponent {
  
  dataSource;
  sumDataSource = [];
  sumCloumns = [];
  sumClumensTable: string[];
  sumClumensshow: string[];

  @Input() set mainDetailsSource(value) {
    if(value) {
        this.dataSource = <any[]>value[0];
        this.sumCloumns = value[1];
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
            
            Object.keys(tempTable).forEach(key => {
              var newLine = {key: key};
              var sum = 0;
              Object.keys(tempTable[key]).forEach(val => {
                newLine[val] = tempTable[key][val].reduce((b, c) => +b + +c['numberUnits'][1]['amount'], 0);
                this.sumClumensTable.push(val);
                sum += newLine[val];
              });
              newLine['sum'] = sum;
              this.sumDataSource.push(newLine);
            });
            this.sumClumensTable = [...new Set(this.sumClumensTable)]; 
            this.sumClumensTable.push('sum');
            var newSumLine = {key: 'Totel'};
            this.sumClumensTable.forEach(newCloumn => {
              if(newCloumn !== 'key') {
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
