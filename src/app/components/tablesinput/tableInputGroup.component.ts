import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {isEqual} from 'lodash-es';
import { PopupformDialog } from '../popupform/popupform.component';
import { OneColumn } from 'src/app/field.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'table-info-group',
  template: `
  <h2>{{titel}}</h2>
  <form [formGroup]="arrayControl" (submit)="onSubmit($event)">
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z2">

        <ng-container matColumnDef="{{column.name}}" *ngFor="let column of localGroupOneColumns">
            <th mat-header-cell *matHeaderCellDef>
                <h3>{{column.label}}</h3>
            </th>
            <td mat-cell style="vertical-align: top;
                padding-left: 16px;
                padding-top: 14px;" *matCellDef="let element; let i = index"
                    [style.display]="getRowSpan(i, column.group) ? '' : 'none'"
                    [attr.rowspan]="getRowSpan(i, column.group)">
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
                <ng-container *ngIf="column.type === 'popup'">
                    <button type="button" mat-raised-button color="accent" (click)="popupForm(element)">
                        <span [hidden]="!arrayControl.get(element['id'].toString()).value"><mat-icon>done</mat-icon></span>
                        {{column.label}}
                    </button>
                </ng-container>
                <ng-container *ngIf="column.type === 'input'">
                    <mat-form-field class="one-field">
                        <input matInput *ngIf="field.inputType !== 'numeric'" [formControlName]="element['id']" [type]="field.inputType" maxlength="255">
                        <input matInput *ngIf="field.inputType === 'numeric'" numeric [formControlName]="element['id']" [decimals]="field.options" type="text" maxlength="255">
                    </mat-form-field>
                </ng-container>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnsDisplay"></tr>
        <tr mat-row *matRowDef="let row; columns: columnsDisplay"></tr>

    </table>
    <div class="margin-top" style="text-align:right">
        <button type="submit" style="min-width:150px; margin-right: 45px" mat-raised-button color="primary">Submit</button>
        <button type="button" style="min-width:150px" mat-raised-button color="primary" (click)="onReset()">Reset</button>
    </div>
</form>
  `,
  styleUrls: ['tablesinfo.css'],
})
export class TableInfoGroupComponent implements OnInit {

    @Output() submit: EventEmitter<any> = new EventEmitter<any>();
    
    @Input() titel: string;
    arrayControl = new FormGroup({});

    field;

  dataSource;
  dataCopyForGroup;
  @Input() set mainDetailsSource(value) {
        if(value) {
            this.dataSource = <any[]>value[0];
            this.oneColumns = value[1];
            this.columnsDisplay = [];
            this.localGroupOneColumns = [];
            this.lastSpan = null;
            this.spans = [];
            this.preperData();
            // this.dataSource = this.dataSource;
        } else {
          this.dataSource = null;
          this.oneColumns = [];
        }
  }

  oneColumns: any[] = [];

  lastSpan: string;
  spans = [];
  columnsDisplay: string[] = [];

  localGroupOneColumns = [];

//   componentRef: any;
  constructor(private resolver: ComponentFactoryResolver, public dialog: MatDialog, private fb: FormBuilder,
    private _snackBar: MatSnackBar) {
  }

  
  ngOnInit() {
  }

  preperData() {
    var thisLavel = false;
    this.oneColumns.forEach(element => {
        if(['popup', 'input'].includes(element.type)){
              this.field = element;
              thisLavel = true;
              this.dataSource.forEach(ele => {
                const control = this.fb.control(
                    null
                );
                this.arrayControl.addControl(ele['id'], control);
              });
              if(this.field.options) {
                this.dataCopyForGroup = Object.assign([], this.dataSource);
              }
        }
    });
    var groupId: boolean = false;
    this.oneColumns.forEach(element => {
      if(element.type === 'idGroup'){
        groupId = true;
      } else if(element.type === 'kidArray'){
          if(thisLavel) {
            this.takeCareKidArrayOutside(element);
          } else {
            this.takeCareKidArrayInside(element);
          }
      } else {
          this.localGroupOneColumns.push(element);
          this.columnsDisplay.push(element.name);
      }
    });
    if(groupId) {
      this.spanRow(d => d['id'], 'id');
      this.lastSpan = 'id';
    }
    this.localGroupOneColumns.forEach(element => {
      if(element.group === element.name) {
        this.spanRow(d => d[element.name], element.name);
        this.lastSpan = element.name;
      }
    });
  }


  takeCareKidArrayOutside(element) {
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
        if(second.type === 'kidArray') {
            this.takeCareKidArrayOutside(second);
        } else {
            this.localGroupOneColumns.push(second);
            this.columnsDisplay.push(second.name);
        }
    });
  }

  takeCareKidArrayInside(element) {
    var arr = [];
    this.dataSource.forEach(line => {
            line[element.name].forEach(obj => {
                var copied = Object.assign({}, line, obj);
                delete copied[element.name];
                arr.push(copied);
            });
    });
    this.dataSource = arr;
    
    var thisLavel = false;
    element.collections.forEach(element => {
        if(['popup', 'input'].includes(element.type)){
              this.field = element;
              thisLavel = true;
              this.dataSource.forEach(ele => {
                const control = this.fb.control(
                  null
                );
                this.arrayControl.addControl(ele['id'], control);
              });
              if(this.field.options) {
                this.dataCopyForGroup = Object.assign([], this.dataSource);
              }
        }
    });
    element.collections.forEach(second => {
        if(second.type === 'kidArray') {
            if(thisLavel) {
                this.takeCareKidArrayOutside(element);
              } else {
                this.takeCareKidArrayInside(element);
              }
        } else {
            this.localGroupOneColumns.push(second);
            this.columnsDisplay.push(second.name);
        }
    });
  }

  
  
  spanRow(accessor, key) {
    if(this.lastSpan) {
      var start: number = 0;
      var end: number = this.spans[0]? this.spans[0][this.lastSpan] : 0;
      while (end < this.dataSource.length) {
        this.spanWork(accessor, key, start, end);
        start = end;
        end += this.spans[start][this.lastSpan];
      }
      this.spanWork(accessor, key, start, this.dataSource.length);
    } else {
      this.spanWork(accessor, key, 0, this.dataSource.length);
    }

  }

  spanWork(accessor, key, start, end) {
    for (let i = start; i < end;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < end; j++) {
        if (!isEqual(currentValue, accessor(this.dataSource[j]))) {
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
 
  getRowSpan(index, key) {
    if(!key) {
      return 1;
    }
    return this.spans[index] && this.spans[index][key];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.arrayControl.valid) {
      var final = this.arrayControl.value;
      const rows = Object.keys(final);
      rows.forEach(element => {
          if(!final[element]) {
              delete final[element];
          }
      });
      this.submit.emit(final);
    } else {
      this._snackBar.open('please fill in all required fields', 'ok', {
        duration: 5000,
        // panelClass: 'blue-snackbar',
        verticalPosition:'top'
      });
    }
    this.arrayControl.markAllAsTouched();
  }

  onReset() {
    this.ngOnInit();
  }
 
  popupForm(element) {
        const stringId = element['id'].toString();
        var oldVal = null;
        if(this.arrayControl.get(stringId).value) {
          oldVal = this.arrayControl.get(stringId).value;
        } else if(this.field.options) {
          const olddata = this.dataCopyForGroup.find(ele => ele['id'] === element['id']);
          oldVal = {[this.field.options]: olddata[this.field.options]};
        }
        
        const dialogRef = this.dialog.open(PopupformDialog, {
          width: '70%',
          height: '70%',
          data: {field: this.field
            , oldValue: oldVal}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result && result !== 'closed') {
            this.arrayControl.get(stringId).setValue(result);
          }
        });  
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
  }

}

