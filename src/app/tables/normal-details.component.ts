import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OneColumn } from '../field.interface';

@Component({
  selector: 'normal-details',
  template: `
<div class="tables mat-elevation-z8">
  <table mat-table id="ExampleTable" [dataSource]="dataSource" matTableExporter #exporter="matTableExporter">
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

        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localItemWeightColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell *matCellDef="let element; let i = index">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                  <ng-container *ngFor="let itemElem of element[column.name]">
                    <b>{{itemElem.item.value}}: </b>
                    <ng-container *ngFor="let amountElem of itemElem['amountList']; let amou = index">
                      <span style="white-space: nowrap;" *ngIf="!amou; else notFirst">{{amountElem | tableCellPipe: 'weight' : null}}</span>
                      <ng-template #notFirst><span style="white-space: nowrap;">({{amountElem | tableCellPipe: 'weight' : null}})</span></ng-template>
                    </ng-container>
                    <small *ngIf="itemElem.warehouses">({{itemElem.warehouses}})</small>
                    <span *ngIf="itemElem.newWarehouses"> => ({{itemElem.newWarehouses}})</span>
                    <br/>
                  </ng-container>
                </span>
            </td>
        </ng-container>
    <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    <tr mat-row *matRowDef="let row; columns: columnsDisplay" (dblclick)="openDetails(row)"></tr>
 </table>
  <mat-icon class="no-print" (click)="exporter.exportTable('csv')" title="Export as CSV">save_alt</mat-icon>
</div>
<mat-spinner *ngIf="dataSource == undefined"></mat-spinner>
<h2 style="text-align:center" *ngIf="dataSource?.length === 0" i18n>No records found</h2>
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
        if(element.type === 'itemWeight') {
          this.localItemWeightColumns.push(element);
        } else {
          this.columns.push(element);
        }
        this.columnsDisplay.push(element.name);
      });
    }
  }
  get oneColumns() { return this.columns}

  @Output() details: EventEmitter<any> = new EventEmitter<any>();


  columnsDisplay: string[] = [];
  localItemWeightColumns = [];


  constructor() {
  }

  openDetails(value: any) {
    this.details.emit(value);
  }

  operators = {
    // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    '>' : function(a, b) { return a > b; },
    '<' : function(a, b) { return a < b; },
    'weight' : function(a) { return a.amount < 0 },
    'date' : function(a) { return a < new Date().toISOString().substring(0, 10) },
  };
  compare (element, column) {
    if(column.compare.name) {
      if(element[column.compare.name]) {
        return this.operators[column.compare.type](element[column.compare.name]);
      }
    } else {
      if(column.compare.condition && element[column.compare.condVar].includes(column.compare.condition)){
        return false;
      }
      if(element[column.name]) {
        return this.operators[column.compare.type](element[column.name]);
      }
    }
    return false;
  }
}
