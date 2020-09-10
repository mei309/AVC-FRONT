import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {merge} from 'lodash-es';
import { FieldConfig } from 'src/app/field.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'table-info',
  template: `
  <h2>{{titel}}</h2>
  <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
        <th mat-header-cell *matHeaderCellDef>
            <h3>{{column.label}}</h3>
        </th>
        <td mat-cell *matCellDef="let element">
            <ng-container *ngIf="element[column.name]">
                <ng-container [ngSwitch]="column.type">
                    <ng-container *ngSwitchCase="'normal'">
                            {{element[column.name]}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'nameId'">
                        <div style="display: inline" *ngIf="isArray(element[column.name]); else elseBlock">
                            <mat-chip-list>
                                <mat-chip *ngFor="let symbol of element[column.name];">{{symbol.value}} </mat-chip>
                            </mat-chip-list>
                        </div>
                        <ng-template  #elseBlock>
                            {{element[column.name]['value']}}
                        </ng-template >
                    </ng-container>
                    <ng-container *ngSwitchCase="'dateTime'">
                        {{element[column.name] | date: 'medium'}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'date'">
                        {{element[column.name] | date}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'name2'">
                        {{element[column.name]['value']}}, {{element[column.name][column.collections]}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'currency'">
                        {{element[column.name] | currency: element[column.collections]}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'weight'">
                        {{element[column.name]}} {{element[column.collections]}}
                    </ng-container>
                    <ng-container *ngSwitchCase="'check'">
                        <mat-icon *ngIf="element[column.name] == [column.collections]">done</mat-icon>
                    </ng-container>
                </ng-container>
            </ng-container>
        </td>
    </ng-container>
    

    <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
    
    <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>

 </table>
  `,
  styleUrls: ['tablesinfo.css'],
})
export class TableInfoComponent implements OnInit {
    field: FieldConfig;
    group: FormGroup;

    @Input() oneColumns = [];
    // @Input() controlField: string = null;
    // @Input() group: FormGroup;

    @Output() submit: EventEmitter<any> = new EventEmitter<any>();
    @Input() titel: string;
    @Input() dataSource;
  localOneColumns = [];
  columnsDisplay: string[] = [];
  constructor() {
  }

  ngOnInit() {
    this.field.collections.forEach(element => {
        if(element.type === 'parent') {
            this.takeCareOfParant(element.collections);
        } else {
            this.localOneColumns.push(element);
            this.columnsDisplay.push(element.name);
        }
    });
    this.setDataSourceInit();
  }

  setDataSourceInit() {
    this.dataSource = this.group.get(this.field.name).value;
    this.field.collections.forEach(element => {
          if(element.type === 'parent') {
              this.dataParantRemove(element.collections, element.name);
          }
      });
  }

  
  takeCareOfParant(element) {
    element.forEach(second => {
        if(element.type === 'parent') {
            this.takeCareOfParant(second.collections);
        } else {
            this.localOneColumns.push(second);
            this.columnsDisplay.push(second.name);
        }
    });
  }

  dataParantRemove(element, name) {
    this.dataSource.forEach(line => {
        merge(line, line[name]);
        delete line[name];
    });
    element.forEach(second => {
        if(element.type === 'parent') {
            this.dataParantRemove(second.collections, second.name);
        }
    });
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }


}
