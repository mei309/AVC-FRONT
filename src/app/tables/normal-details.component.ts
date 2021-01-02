import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OneColumn } from '../field.interface';

@Component({
  selector: 'normal-details',
  template: `
<div class="tables mat-elevation-z8">
  <table mat-table id="ExampleTable" [dataSource]="dataSource">
    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
        <th mat-header-cell *matHeaderCellDef>
          <h3>{{column.label}}</h3>
        </th>
        <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
          <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
            {{element[column.name] | tableCellPipe: column.type : column.collections}}
          </span>
        </td>
    </ng-container>
    <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
 </table>
</div>
<mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
<div [ngStyle]="{'width':'fit-content', 'margin':'auto'}" *ngIf="dataSource?.length === 0"><h2>No records found</h2></div>
  `,
})
export class NormalDetailsComponent {
  dataTable;
  @Input() set dataSource(value) {
    if(value) {
      this.dataTable = value;
    } else {
      this.dataTable = null;
    }
  }
  get dataSource() { return this.dataTable; }

  columns: OneColumn[] = [];
  @Input() set oneColumns(value: OneColumn[]) {
    if(value) {
      value.forEach(element => {
        this.columnsDisplay.push(element.name);
      });
      this.columns =  value;
    }
  }
  get oneColumns() { return this.columns}
  
  @Output() details: EventEmitter<any> = new EventEmitter<any>();


  columnsDisplay: string[] = [];


  constructor() {
  }

  openDetails(value: any) {
    this.details.emit(value);
  }
  
  operators = {
    // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    '>' : function(a, b) { return a > b; },
    '<' : function(a, b) { return a < b; },
    // '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
    //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
    // 'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
  };
  compare (element, column) {
    if(column.compare.name) {
      if(element[column.compare.name] && element[column.name]) {
        if(column.compare.pipes) {
          return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
        } else {
          return this.operators[column.compare.type](element[column.name], element[column.compare.name]);
        }
        
      }
    } else {
      if(element[column.name]) {
        return this.operators[column.compare.type](element[column.name], column.compare.pipes);
      }
    }
    return false;
  }
}
