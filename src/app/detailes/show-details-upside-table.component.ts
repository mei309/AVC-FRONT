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
    <table mat-table id="ExampleTable" [dataSource]="newDataSource" class="mat-elevation-z2">
      <ng-container matColumnDef="{{column.name}}" *ngFor="let column of newOneCloumns">
          <th mat-header-cell *matHeaderCellDef>
            <h3>{{column.titel}}</h3>
          </th>
          <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column), 'bold-cell': element.bold}">
            <ng-container *ngIf="column.collections; else justText">
              <ng-container *ngIf="element[column.name]">
                  {{element[column.name] | tableCellPipe: column.group? element.pipes1 : element.pipes : element.collections? element[element.collections+column.name] : column.collections}}
              
                  <ng-container *ngIf="element[column.options]">
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
    <table mat-table [dataSource]="newDataSource" class="mat-elevation-z2">
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of newOneCloumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.titel}}</h3>
            </th>
            <td mat-cell *matCellDef="let element" [ngClass]="{'is-alert': column.compare && compare(element, column), 'bold-cell': element.bold}">
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


  columnsDisplay: string[] = ['title'];
  newDataSource;
  newOneCloumns: OneColumn[] = [
      {
        titel: '',
        name: 'title',
      },
  ];

  constructor() {
  }

  ngOnInit() {
    var headerRow = this.oneColumns.splice(0,1)[0];
    var removingNodes = [];
    while (this.oneColumns[0]['type'] === 'kidArray') {
      var node = this.oneColumns.splice(0,1)[0];
      if(node['baby']) {
        this.marageArray(node['name']);
        node['baby'].forEach(element1 => {
          removingNodes.push(element1);
          this.marage(element1);
        });
      } else {
        removingNodes.push(node['name']);
        this.marage(node['name']);
      }
    }
    if(this.secondSource) {
      this.noChanges = false;
      this.setSecondSourceInit();
    }
    // headerRow = headerRow[0];
    var coonection: Observable<any> = headerRow['options'];
    coonection.pipe(take(1)).subscribe(arg => {
        this.dataSource.forEach((element, index) => {
                if(element) {
                    var nameOfRow;
                    if(headerRow.pipes === 'object') {
                      nameOfRow = element[headerRow.type]['value'];
                    } else {
                      nameOfRow = element[headerRow.type];
                    }
                    if(element['changeStatus'] && element['changeStatus'] !== 'same') {
                      if(element['changeStatus'] !== 'updated') {
                        this.oneColumns.forEach(ele => {
                          ele[nameOfRow+index] = element[0][ele.type];
                          if(!isEqual(element[0][ele.type], element[1][ele.type])) {
                            ele[nameOfRow+index+'edit'] = element[1][ele.type];
                          }
                        });
                      }
                      if(element['changeStatus'] !== 'added') {
                        this.oneColumns.forEach(ele => {
                          ele[nameOfRow+index] = element[ele.type];
                          ele[nameOfRow+index+'edit'] = undefined;
                        });
                      }
                      if(element['changeStatus'] !== 'removed') {
                        this.oneColumns.forEach(ele => {
                          ele[nameOfRow+index] = undefined;
                          ele[nameOfRow+index+'edit'] = element[ele.type];
                        });
                      }
                    } else {
                      this.oneColumns.forEach(ele => {
                        ele[nameOfRow+index] = element[ele.type];
                        if(ele.collections) {
                          ele[ele.collections+nameOfRow+index] = element[ele.collections];
                        }
                        // ele[nameOfRow+'Target'+index] = element[2][ele.type];
                      });
                    }
                    const target = headerRow['accessor'](arg, nameOfRow);
                    
                    if(target) {
                        removingNodes.forEach(element => {
                          merge(target, target[element]);
                          delete target[element];
                        });
                        this.oneColumns.forEach(ele => {
                            // ele[nameOfRow+index] = element[1][ele.type];
                            ele[nameOfRow+'Target'+index] = target[ele.type];
                        });
                        this.newOneCloumns.push(
                          {
                              titel: nameOfRow,
                              name: nameOfRow+index,
                              // pipes: true,
                              options: nameOfRow+'Target'+index,
                              collections: element[headerRow.collections],
                              compare: {
                                  name: nameOfRow+'Target'+index,
                                  type: '>',
                              },
                              group: element.precentage,
                          },
                        );
                    } else {
                      this.newOneCloumns.push(
                        {
                            titel: nameOfRow,
                            name: nameOfRow+index,
                            // pipes: true,
                            collections: element[headerRow.collections],
                            group: element.precentage,
                        },
                      );
                    }
                    this.columnsDisplay.push(nameOfRow+index);
                }
        });
      });
      this.newDataSource = this.oneColumns;
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
      // if(this.secondSource) {
      //   this.secondSource.forEach(element => {
      //     merge(element, element[node]);
      //     delete element[node];
      //   });
      // }
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
    if(column.compare.name) {
      if(element[column.compare.name] && element[column.name]) {
        if(column.compare.pipes) {
          return this.operators[column.compare.type](element[column.name][column.compare.pipes], element[column.compare.name][column.compare.pipes]);
        } else {
          switch (element.pipes) {
            case 'percentCollections':
              if(element.collections) {
                return this.operators[column.compare.type]((element[column.name]/element[element.collections+column.name])*100, element[column.compare.name]);
              } else {
                return this.operators[column.compare.type]((element[column.name]/column.collections)*100, element[column.compare.name]);
              }
            // case 'OK':
            //   return element[column.name] !== 'OK';
            default:
              return this.operators[column.compare.type](element[column.name], element[column.compare.name]);
          }
        }
        
      } else {
        switch (element.pipes) {
          // case 'percentCollections':
          //   return this.operators[column.compare.type](element[column.name]/column.collections, element[column.compare.name]);
          case 'OK':
            return element[column.name] === 'NOT_OK';
          default:
            return this.operators[column.compare.type](element[column.name], column.compare.pipes);
        }

      }
    } else if(element[column.name]) {
      return this.operators[column.compare.type](element[column.name], column.compare.pipes);
    }
    return false;
  }

  

  uniq(array: any[]) {
    return uniq(array);
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }
}
