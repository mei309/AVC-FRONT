import { Component, Input, OnInit } from '@angular/core';
import {merge, isEqualWith} from 'lodash-es';
import { diff } from '../libraries/diffArrayObjects.interface';

@Component({
  selector: 'show-details-group-table',
  template: `
<ng-container *ngIf="noChanges; else elseblockmain">
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpanParent(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpanParent(i, column.group)"
                    [ngClass]="{'bold-cell': column.bold}">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </td>
        </ng-container>
        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell *matCellDef="let element" [ngClass]="{'bold-cell': column.bold}">
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>
    </table>
</ng-container>
<ng-template  #elseblockmain>

    <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
        <th mat-header-cell *matHeaderCellDef>
            <h3>{{column.label}}</h3>
        </th>
        <td mat-cell style="vertical-align: top;
            padding-left: 16px;
            padding-top: 14px;" *matCellDef="let element; let i = index"
                [style.display]="getRowSpan(i) ? '' : 'none'"
                [attr.rowspan]="getRowSpan(i)"
                [ngClass]="{'bold-cell': column.bold}">
            <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated">
                <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual">      
                    <span *ngIf="element[0][column.name]" style="white-space: pre-wrap;">
                        {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                </ng-container>
                <ng-template  #notEqual>
                    <span class="removed-item" *ngIf="element[0][column.name]" style="white-space: pre-wrap;">
                        {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                    <span class="added-item" *ngIf="element[1][column.name]" style="white-space: pre-wrap;">
                        {{element[1][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                </ng-template>
            </ng-container>
            <ng-template #notUpdated>
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </ng-template>
        </td>
    </ng-container>


    <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localOneColumns">
        <th mat-header-cell *matHeaderCellDef>
            <h3>{{column.label}}</h3>
        </th>
        <td mat-cell *matCellDef="let element" [ngClass]="{'bold-cell': column.bold}">
            <ng-container *ngIf="element.changeStatus === 'updated'; else notUpdated1">
                <ng-container *ngIf="isEqualObj(element[1][column.name], element[0][column.name]); else notEqual1">      
                    <span *ngIf="element[0][column.name]" style="white-space: pre-wrap;">
                        {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                </ng-container>
                <ng-template  #notEqual1>
                    <span class="removed-item" *ngIf="element[0][column.name]" style="white-space: pre-wrap;">
                        {{element[0][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                    <span class="added-item" *ngIf="element[1][column.name]" style="white-space: pre-wrap;">
                        {{element[1][column.name] | tableCellPipe: column.type : column.collections}}
                    </span>
                </ng-template>
            </ng-container>
            <ng-template #notUpdated1>
                <span *ngIf="element[column.name]" style="white-space: pre-wrap;">
                    {{element[column.name] | tableCellPipe: column.type : column.collections}}
                </span>
            </ng-template>
        </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>

    <tr mat-row *matRowDef="let element; columns: columnsDisplay"
    [ngClass]="{'is-new': element.changeStatus === 'added', 'is-removed': element.changeStatus === 'removed'}"
    ></tr>

    </table>

</ng-template>
  `,
  styleUrls: ['show-details-table.css'],
})
export class ShowDetailsTableGroupComponent implements OnInit {
    
  @Input() dataSource;

  @Input() secondSource;

  @Input() oneColumns = [];
  
  noChanges: boolean = true;
  
  localOneColumns = [];
  localGroupOneColumns = [];
  columnsDisplay: string[] = [];
  spans = [];
  constructor() {
  }
  
  ngOnInit() {
    // var parent = false;
    this.oneColumns.forEach(element => {
        // parent for now only after arrays
        if(element.type === 'parent') {
            this.cloumnCareParant(element.collections, this.localGroupOneColumns);
        } else if(element.type === 'kidArray'){
            this.cloumnCareKidArray(element);
        } 
        // else if(element.type === 'parentArray'){
        //     parent = true;
        //     if(this.getPremmisions(this.processName).includes('MANAGER')) {
        //         this.localGroupOneColumns.push({
        //             type: 'button',
        //             label: 'MANAGER',
        //             name: 'MANAGER',
        //         });
        //         this.columnsDisplay.push('MANAGER');
        //     }
        //     if(this.getPremmisions(this.processName).includes('APPROVAL')) {
        //         this.localGroupOneColumns.push({
        //             type: 'button',
        //             label: 'APPROVAL',
        //             name: 'APPROVAL',
        //         });
        //         this.columnsDisplay.push('APPROVAL');
        //     }
        //     this.cloumnCareParentArray(element);
        // } 
        else {
            this.localGroupOneColumns.push(element);
            this.columnsDisplay.push(element.name);
        }
    });
    if(this.secondSource) {
        this.noChanges = false;
        this.setSecondSourceInit();
        this.spanRow(d => {
            if(d['changeStatus'] === 'updated'){
                return d[0]['id'];
            } else {
                return d['id'];
            }
        }, 'id');
    } else {
        this.setDataSourceInit();
        // if(parent) {
        //     this.spanRow(d => d['parentId'], 'parentId');
        // }
        this.spanRow(d => d['id'], 'id');
    }
  }


    setDataSourceInit() {
            this.oneColumns.forEach(element => {
                if(element.type === 'parent') {
                    this.dataParantRemove(element.collections, element.name);
                } else if(element.type === 'kidArray'){
                    this.dataCareKidArray(element);
                } 
                // else if(element.type === 'parentArray'){
                //     this.dataCareParentArray(element);
                // }
            });
    }

    dataCareKidArray(element) {
        var arr = [];
        this.dataSource.forEach(line => {
            line[element.name].forEach(obj => {
                var copied = Object.assign({}, obj, line);
                delete copied[element.name];
                arr.push(copied);
            });
        });
        this.dataSource = arr;
        element.collections.forEach(second => {
            if(second.type === 'parent') {
                this.dataParantRemove(second.collections, second.name);
            }
        });
    }
    // dataCareParentArray(element) {
    //     var arr = [];
    //     this.dataSource.forEach(line => {
    //         line['parentId'] = line['id'];
    //         line[element.name].forEach(obj => {
    //             var copied = Object.assign({}, line, obj);
    //             delete copied[element.name];
    //             arr.push(copied);
    //         });
    //     });
    //     this.dataSource = arr;
    //     element.collections.forEach(second => {
    //         if(second.type === 'parent') {
    //             this.dataParantRemove(second.collections, second.name);
    //         } else if(second.type === 'kidArray'){
    //             this.dataCareKidArray(second);
    //         } else {
    //             second['group'] = true;
    //         }
    //     });
    // }
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

    cloumnCareKidArray(element) {
        element.collections.forEach(second => {
            if(second.type === 'parent') {
                this.cloumnCareParant(second.collections, this.localOneColumns);
            } else {
                this.localOneColumns.push(second);
                this.columnsDisplay.push(second.name);
            }
        });
    }
    // cloumnCareParentArray(element) {
    //     element.collections.forEach(second => {
    //         if(second.type === 'parent') {
    //             this.cloumnCareParant(second.collections, this.localGroupOneColumns);
    //         } else if(second.type === 'kidArray'){
    //             this.cloumnCareKidArray(second);
    //         } else {
    //             this.localGroupOneColumns.push(second);
    //             this.columnsDisplay.push(second.name);
    //         }
    //     });
    // }
    cloumnCareParant(element, coulmns) {
        element.forEach(second => {
            if(second.type === 'parent') {
                this.cloumnCareParant(second.collections, coulmns);
            } else {
                coulmns.push(second);
                this.columnsDisplay.push(second.name);
            }
        });
    }

    setSecondSourceInit() {
        var result = diff(this.secondSource, this.dataSource, 'id', { updatedValues: 3, compareFunction: (o1,o2)  =>{
                return isEqualWith(o1, o2, (value1, value2, key) => {
                    return key === 'version' ? true : undefined;
                })
            } });
        if(result['added'].length || result['removed'].length ||result['updated'].length) {
            this.noChanges = false;
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
            
            this.oneColumns.forEach(element => {
                if(element.type === 'parent') {
                    this.dataParantUpdatedRemove(element.collections, element.name);
                } else if(element.type === 'kidArray'){
                    this.takeCareKidArray(element);
                }
            });
        }
    }

  dataParantUpdatedRemove(element, name) {
    this.dataSource.forEach(line => {
        if(line['changeStatus'] === 'updated') {
            merge(line[0], line[0][name]);
            delete line[0][name];
            merge(line[1], line[1][name]);
            delete line[1][name];
        } else {
            merge(line, line[name]);
            delete line[name];
        }
    });
    element.forEach(second => {
        if(second.type === 'parent') {
            this.dataParantUpdatedRemove(second.collections, second.name);
        } else if(element.type === 'kidArray'){
            this.takeCareKidArray(element);
        }
    });
  }

  takeCareKidArray(element) {
    var arr = [];
    this.dataSource.forEach(line => {
        if(line['changeStatus'] === 'updated') {
              // var result1 = diffArray(line[0][element.name], line[1][element.name], 'id', { updatedValues: diffArray.updatedValues.both });
              var result1 = diff(line[0][element.name], line[1][element.name], 'id', { updatedValues: 3, compareFunction: (o1,o2) => {
                      return isEqualWith(o1, o2, (value1, value2, key) => {
                          return key === 'version' ? true : undefined;
                      })
              } });
              
              result1['same'].forEach(element => {
                  var copied1 = Object.assign({}, element, line[0]);
                  delete copied1[element.name];
                  var copied2 = Object.assign({}, element, line[1]);
                  delete copied2[element.name];
                  var newnewarr = [copied1, copied2];
                  newnewarr['changeStatus'] = 'updated';
                  arr.push(newnewarr);
              });
              result1['updated'].forEach(element => {
                  var copied1 = Object.assign({}, element[0], line[0]);
                  delete copied1[element.name];
                  var copied2 = Object.assign({}, element[1], line[1]);
                  delete copied2[element.name];
                  var newnewarr = [copied1, copied2];
                  newnewarr['changeStatus'] = 'updated';
                  arr.push(newnewarr);
              });
              result1['added'].forEach(element => {
                  var copied1 = Object.assign({}, {}, line[0]);
                  delete copied1[element.name];
                  var copied2 = Object.assign({}, element, line[1]);
                  delete copied2[element.name];
                  var newnewarr = [copied1, copied2];
                  newnewarr['changeStatus'] = 'updated';
                  arr.push(newnewarr);
              });
              result1['removed'].forEach(element => {
                  var copied1 = Object.assign({}, element, line[0]);
                  delete copied1[element.name];
                  var copied2 = Object.assign({}, {}, line[1]);
                  delete copied2[element.name];
                  var newnewarr = [copied1, copied2];
                  newnewarr['changeStatus'] = 'updated';
                  arr.push(newnewarr);
              });
        } else {
            line[element.name].forEach(obj => {
                var copied = Object.assign({}, obj, line);
                delete copied[element.name];
                arr.push(copied);
            });
        }
    });
    this.dataSource = arr;
    element.collections.forEach(second => {
        if(second.type === 'parent') {
            this.dataParantUpdatedRemove(second.collections, this.localOneColumns);
        }
    });
  }

  
  spanRow(accessor, key) {
    for (let i = 0; i < this.dataSource.length;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;
 
      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.dataSource.length; j++) {
        if (currentValue != accessor(this.dataSource[j])) {
          break;
        }
 
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }
 
      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }  
  }
 
  getRowSpan(index) {
    return this.spans[index] && this.spans[index]['id'];
  }

  getRowSpanParent(index, parent) {
      if(parent) {
        return this.spans[index] && this.spans[index]['parentId'];
      } else {
        return this.spans[index] && this.spans[index]['id'];
      }
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }

  isEqualObj(obj : any, obj2: any) {
    // return isEqual(obj, obj2);
    return isEqualWith(obj, obj2, (value1, value2, key) => {
        return key === 'version' ? true : undefined;
    })
  }

}
