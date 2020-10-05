import { Component, Input } from '@angular/core';
import {uniq} from 'lodash-es';
import { OneColumn } from '../field.interface';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {merge, isEqualWith, isEqual} from 'lodash-es';
import { diff } from '../libraries/diffArrayObjects.interface';
@Component({
  selector: 'show-details-upside-table',
  template: `
 <ng-container *ngIf="noChanges; else elseblock">
    <table mat-table id="ExampleTable" [dataSource]="bottomDataSource" class="mat-elevation-z2">
      <ng-container matColumnDef="{{column.name}}" *ngFor="let column of bottomCloumns; let iCol = index">
          <th mat-header-cell *matHeaderCellDef>
            <h3>{{column.titel}}</h3>
          </th>
          <td mat-cell *matCellDef="let element; let iRow = index" 
            [attr.colspan]="getColSpan(iRow, iCol)"
            [style.display]="getColSpan(iRow, iCol) ? '' : 'none'"
           [ngClass]="{'is-alert': column.compare && compare(element, column), 'bold-cell': element.bold}">
            <ng-container *ngIf="column.collections; else justText">
              <ng-container *ngIf="element[column.name]">
                  {{element[column.name] | tableCellPipe: column.group? element.pipes1 : element.pipes : element.collections? element[element.collections+column.name] : column.collections}}
              
                  <ng-container *ngIf="element[column.compare]">
                    ({{element[column.options] | tableCellPipe: element.pipes : 100}})
                  </ng-container>
              </ng-container>
            </ng-container>
            <ng-template  #justText>
              {{element[column.name] | tableCellPipe: column.pipes : column.collections}}
            </ng-template>
          </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
      <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>
    </table>
 </ng-container>
 <ng-template  #elseblock>
    <table mat-table [dataSource]="bottomDataSource" class="mat-elevation-z2">
      <ng-container matColumnDef="{{column.name}}" *ngFor="let column of bottomCloumns; let iCol = index">
          <th mat-header-cell *matHeaderCellDef>
              <h3>{{column.titel}}</h3>
          </th>
          <td mat-cell *matCellDef="let element; let iRow = index" 
          [attr.colspan]="getColSpan(iRow, iCol)"
          [style.display]="getColSpan(iRow, iCol) ? '' : 'none'" [ngClass]="{'is-alert': column.compare && compare(element, column), 'bold-cell': element.bold}">
            <ng-container *ngIf="column.collections; else justTextEdit"> 
              <ng-container *ngIf="element.hasOwnProperty(column.name+'edit'); else notUpdated">
                      <div class="added-item" *ngIf="element[column.name]">
                          {{element[column.name] | tableCellPipe: column.type : element.collections? element[element.collections+column.name] : column.collections}}
                      </div>
                      <div class="removed-item" *ngIf="element[column.name+'edit']">
                          {{element[column.name+'edit'] | tableCellPipe: column.type : element.collections? element[element.collections+column.name] : column.collections}}
                      </div>
              </ng-container>
              <ng-template  #notUpdated>
                  <ng-container *ngIf="element[column.name]">
                      {{element[column.name] | tableCellPipe: column.type : element.collections? element[element.collections+column.name] : column.collections}}
                  </ng-container>
              </ng-template >

              <ng-container *ngIf="element[column.name] && element[column.options]">
                ({{element[column.options] | tableCellPipe: element.pipes : 100}})
              </ng-container>
            </ng-container>
            <ng-template  #justTextEdit>
              {{element[column.name] | tableCellPipe: column.pipes : column.collections}}
            </ng-template>
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
export class ShowDetailsUpsideTableComponent {
 
  @Input() dataSource;

  @Input() secondSource;

  @Input() oneColumns;
  
  noChanges: boolean = true;

  topGroups = [];
  isWithTop = false;

  columnsDisplay: string[] = ['title'];
  bottomDataSource;
  bottomCloumns: OneColumn[] = [
      {
        titel: '',
        name: 'title',
      },
  ];

  constructor() {
  }

  ngOnInit() {
    if(this.oneColumns[0]['type'] === 'topGroupArray') {
      this.prepareTopArray(this.oneColumns[0]['collections']);
      this.marageArray(this.oneColumns[1]['name']);
      this.marage(this.oneColumns[2]['name']);
      this.marage(this.oneColumns[3]['name']);
      this.isWithTop = true;
      if(this.secondSource) {
        this.noChanges = false;
        this.setSecondSourceInit();
      }
      this.prepareBottomArray(this.oneColumns[5]['collections'], this.oneColumns[4], [this.oneColumns[2]['name'], this.oneColumns[3]['name']]);
    } else {
      this.marage(this.oneColumns[0]['name']);
      this.marage(this.oneColumns[1]['name']);
      if(this.secondSource) {
        this.noChanges = false;
        this.setSecondSourceInit();
      }
      this.prepareBottomArray(this.oneColumns[3]['collections'], this.oneColumns[2], [this.oneColumns[0]['name'], this.oneColumns[1]['name']]);
    }
  }

    marage(node) {
      this.dataSource.forEach(element => {
        merge(element, element[node]);
        delete element[node];
      });
      if(this.secondSource) {
        this.secondSource.forEach(element => {
          merge(element, element[node]);
          delete element[node];
        });
      }
    }

    marageArray(node) {
      var arr = [];
      this.dataSource.forEach(element => {
        element[node].forEach(eleme => {
          var copied = Object.assign({},element, eleme);
          delete copied[element.name];
          arr.push(copied);
        });
      });
      this.dataSource = arr;
      if(this.secondSource) {
        var arr1 = [];
        this.secondSource.forEach(element => {
          element[node].forEach(eleme => {
            var copied = Object.assign({},element, eleme);
            delete copied[element.name];
            arr1.push(copied);
          });
        });
        this.secondSource = arr1;
      }
    }

    setSecondSourceInit() {
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

  
  operators = {
    // '+' : function(a: number[]) { return a.reduce((b, c) => { return b + c}, 0); },
    '>' : function(a, b) { return a > b; },
    '<' : function(a, b) { return a < b; },
    // '*' : function(a: number[]) { return a.reduce((b, c) => { return b * c}); },
    //'/' : function(a) { return a.reduce((b, c) => { return b + c}, 0); },
    // 'avg' : function(a: number[]) { return (a.reduce((b, c) => { return b + c}))/a.length; },
  };
  compare (element, column) {
    if(column.group) {
      switch (element.pipes1) {
        case 'percentCollections':
          if(element.collections) {
            return (element[column.name]/element[element.collections+column.name])*100 > element[column.compare];
          } else {
            return (element[column.name]/column.collections)*100 > element[column.compare];
          }
        case 'percent':
          return element[column.name] > element[column.compare];
        case 'OK':
          return element[column.name] !== 'OK';
      }
    } else {
      switch (element.pipes1) {
        case 'percentCollections':
          if(element.collections) {
            return (element[column.name]/element[element.collections+column.name])*100 > element[column.compare];
          } else {
            return (element[column.name]/column.collections)*100 > element[column.compare];
          }
        case 'percent':
          return element[column.name] > element[column.compare];
        case 'OK':
          return element[column.name] !== 'OK';
      }
    }
    return false;
  }

  

  uniq(array: any[]) {
    return uniq(array);
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }


  prepareTopArray(kids) {
    this.topGroups.push(1);
    this.dataSource.forEach((element, index) => {
      this.topGroups.push(element.testedItems.length);
      for (let index = 1; index < element.testedItems.length; index++) {
        this.topGroups.push(0);
      }
    });
  }

  prepareBottomArray(kids, heder, removingNodes) {
    var coonection: Observable<any> = heder['options'];
    coonection.pipe(take(1)).subscribe(arg => {
        this.dataSource.forEach((element, index) => {
                if(element) {
                    var nameOfRow;
                    if(heder.pipes === 'object') {
                      nameOfRow = element[heder.name]['value'];
                    } else {
                      nameOfRow = element[heder.name];
                    }
                    
                    if(element['changeStatus'] && element['changeStatus'] !== 'same') {
                      if(element['changeStatus'] !== 'updated') {
                        kids.forEach(ele => {
                          ele[nameOfRow+index] = element[0][ele.name];
                          if(!isEqual(element[0][ele.name], element[1][ele.name])) {
                            ele[nameOfRow+index+'edit'] = element[1][ele.name];
                          }
                        });
                      }
                      if(element['changeStatus'] !== 'added') {
                        kids.forEach(ele => {
                          ele[nameOfRow+index] = element[ele.name];
                          ele[nameOfRow+index+'edit'] = undefined;
                        });
                      }
                      if(element['changeStatus'] !== 'removed') {
                        kids.forEach(ele => {
                          ele[nameOfRow+index] = undefined;
                          ele[nameOfRow+index+'edit'] = element[ele.name];
                        });
                      }
                    } else {
                      kids.forEach(ele => {
                        ele[nameOfRow+index] = element[ele.name];
                      });
                    }

                    const target = heder['accessor'](arg, nameOfRow);
                    
                    if(target) {
                        removingNodes.forEach(element => {
                          merge(target, target[element]);
                          delete target[element];
                        });
                        kids.forEach(ele => {
                            ele[nameOfRow+'Target'+index] = target[ele.name];
                        });
                        this.bottomCloumns.push(
                          {
                              titel: nameOfRow,
                              name: nameOfRow+index,
                              // options: nameOfRow+'Target'+index,
                              collections: element[heder.collections],
                              compare: nameOfRow+'Target'+index,
                              group: element.precentage,
                          },
                        );
                    } else {
                      this.bottomCloumns.push(
                        {
                            titel: nameOfRow,
                            name: nameOfRow+index,
                            collections: element[heder.collections],
                            group: element.precentage,
                        },
                      );
                    }
                    this.columnsDisplay.push(nameOfRow+index);
                }
        });
        this.bottomDataSource = kids;
    });
  }

  getColSpan(iRow, iCol) {
    if(!this.isWithTop || iRow > 7) {
      return 1;
    } else {
      return this.topGroups[iCol];
    }
  }
}
