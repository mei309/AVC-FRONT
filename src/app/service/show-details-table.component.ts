import { Component, Input, OnInit } from '@angular/core';
import {merge, isEqualWith} from 'lodash-es';
import { diff } from '../libraries/diffArrayObjects.interface';
@Component({
  selector: 'show-details-table',
  template: `
  <ng-container *ngIf="noChanges; else elseblock">
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column)}">
                <ng-container *ngIf="element[column.name]">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </ng-container>
            </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>
    </table>
 </ng-container>
 <ng-template  #elseblock>
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element[0], column)}">
                <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated">
                    <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual">
                        <ng-container *ngIf="element[0][column.name]">
                            {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                        </ng-container>
                    </ng-container>
                    <ng-template  #notEqual>
                        <div class="added-item" *ngIf="element[0][column.name]">
                            {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                        </div>
                        <div class="removed-item" *ngIf="element[1][column.name]">
                            {{element[1][column.name] | tableCellPipe: column.type : column.collections}}
                        </div>
                    </ng-template>
                </ng-container>
                <ng-template  #notUpdated>
                    <ng-container *ngIf="element[column.name]">
                        {{element[column.name] | tableCellPipe: column.type : column.collections}}
                    </ng-container>
                </ng-template >
            </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let element; columns: columnsDisplay"
        [ngClass]="{'is-new': element.changeStatus === 'added', 'is-removed': element.changeStatus === 'removed'}"></tr>
    </table>
 </ng-template>
  `,
  styleUrls: ['show-details-table.css'],
})
export class ShowDetailsTableComponent implements OnInit {

  @Input() dataSource;

  @Input() secondSource;

  @Input() oneColumns = [];

  noChanges: boolean = true;

  localDataSource;
  localOneColumns = [];
  columnsDisplay: string[] = [];
  constructor() {
  }
  
  ngOnInit() {
    this.oneColumns.forEach(element => {
        if(element.type === 'parent') {
            this.takeCareOfParant(element.collections);
        } else {
            this.localOneColumns.push(element);
            this.columnsDisplay.push(element.name);
        }
    });
    this.setDataSourceInit();
    if(this.secondSource) {
        this.noChanges = false;
        this.setSecondSourceInit();
    }
  }

  setDataSourceInit() {
      this.oneColumns.forEach(element => {
          if(element.type === 'parent') {
              this.dataParantRemove(element.collections, element.name);
          }
      });
  }

  setSecondSourceInit() {
      this.oneColumns.forEach(element => {
          if(element.type === 'parent') {
              this.secondParantRemove(element.collections, element.name);
          }
      });
      var result = diff(this.dataSource, this.secondSource, 'id', { updatedValues: 3, compareFunction: (o1,o2) => {
        return isEqualWith(o1, o2, (value1, value2, key) => {
            return key === 'version' ? true : undefined;
        })
      } });
      if(result['added'].length || result['removed'].length ||result['updated'].length) {
          var newDataSource = [];
          result['same'].forEach(element => {
              element['changeStatus'] = 'same';
              newDataSource.push(element);
          });
          result['updated'].forEach(element => {
            element['changeStatus'] = 'updated';
            newDataSource.push(element);
          });
          result['added'].forEach(element => {
              element['changeStatus'] = 'added';
              newDataSource.push(element);
          });
          result['removed'].forEach(element => {
              element['changeStatus'] = 'removed';
              newDataSource.push(element);
          });
          this.dataSource = newDataSource;
      }
    }

  takeCareOfParant(element) {
    element.forEach(second => {
        if(second.type === 'parent') {
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
        if(second.type === 'parent') {
            this.dataParantRemove(second.collections, second.name);
        }
    });
  }

  secondParantRemove(element, name) {
    this.secondSource.forEach(line => {
        merge(line, line[name]);
        delete line[name];
    });
    element.forEach(second => {
        if(second.type === 'parent') {
            this.secondParantRemove(second.collections, second.name);
        }
    });
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }

  isEqualObj(obj1 : any, obj2: any) {
    return isEqualWith(obj1, obj2, (value1, value2, key) => {
        return key === 'version' ? true : undefined;
    })
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
        return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
      }
    } else {
      if(element[column.name]) {
        return this.operators[column.compare.type](element[column.name], column.compare.pipes);
      }
    }
    return false;
  }

}