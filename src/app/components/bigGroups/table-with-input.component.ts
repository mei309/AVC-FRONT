import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-table-with-input',
  template: `
  <div [formGroup]="group">
        <table mat-table [dataSource]="dataSource" [formArrayName]="field.name">
            <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
                <th mat-header-cell *matHeaderCellDef> {{column.label}} </th>
                <td mat-cell *matCellDef="let element" style="text-align: center"> {{element[column.name]}} </td>
            </ng-container>

            <!-- Complex Column -->
            <ng-container matColumnDef="inputField">
                <th mat-header-cell *matHeaderCellDef i18n>Amount</th>
                <td mat-cell *matCellDef="let element; let i = index;" [formGroupName]="i">
                    <mat-form-field class="one-field">
                        <input matInput [formControlName]="inputField" numeric decimals="3" type="text" maxlength="255">
                    </mat-form-field>
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns.concat('inputField')"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns.concat('inputField');" ></tr>
        </table>
</div>
`,
})
export class TableWithInputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  inputField: string;
  dataSource;
  displayedColumns = [];
  oneColumns = [];

  constructor(@Inject(LOCALE_ID) private locale: string) {}
  ngOnInit() {
    this.dataSource = this.group.get(this.field.name).value;
    this.kidSetup(this.field);
  }

  kidSetup(tempField) {
    tempField.collections.forEach(element => {
        switch (element.type) {
            // case 'array':
            //     this.dataSource.forEach(ele => {
            //         ele[element.name] = 'arr';
            //     });
            //     this.oneColumns.push(element);
            //     this.displayedColumns.push(element.name);
            //     break;
            case 'select' || 'selectNormal' || 'selectItem':
                if(element.inputType === 'multiple') {
                    this.dataSource.forEach(ele => {
                        ele[element.name] = 'arr';
                    });
                } else {
                    this.dataSource.forEach(ele => {
                        ele[element.name] = ele[element.name]? ele[element.name]['value'] : '';
                    });
                }
                this.oneColumns.push(element);
                this.displayedColumns.push(element.name);
                break;
            case 'selectgroup':
                element.collections[0]['name'] = element.inputType;
                this.dataSource.forEach(ele => {
                    const newGroup = ele[element.collections[1].name];
                    ele[element.collections[0].name] = newGroup[element.inputType];
                    ele[element.collections[1].name] = newGroup.value;
                });
                this.oneColumns.push(element.collections[0]);
                this.displayedColumns.push(element.collections[0].name);
                this.oneColumns.push(element.collections[1]);
                this.displayedColumns.push(element.collections[1].name);
                break;
            case 'inputselect':
                if(element.name) {
                    this.dataSource.forEach(ele => {
                        const newGroup = ele[element.name];
                        ele[element.name] = newGroup[element.collections[0].name] + ' ' + newGroup[element.collections[1].name];
                    });
                    this.oneColumns.push(element);
                    this.displayedColumns.push(element.name);
                } else {
                    this.oneColumns.push(element.collections[0]);
                    this.displayedColumns.push(element.collections[0].name);
                    this.oneColumns.push(element.collections[1]);
                    this.displayedColumns.push(element.collections[1].name);
                }
                break;
            case 'bignotexpand':
                this.dataSource.forEach(ele => {
                    const biggroup = ele[element.name];
                    element.collections.forEach(el => {
                        switch (el.type) {
                            case 'select' || 'selectNormal' || 'selectItem':
                                if(el.inputType === 'multiple') {
                                    ele[el.name] = 'arr';
                                } else {
                                    ele[el.name] = biggroup[el.name]? biggroup[el.name]['value'] : '';
                                }
                                break;
                            case 'inputselect':
                                if(el.name) {
                                    const newGroup = biggroup[el.name];
                                    ele[el.name] = newGroup[el.collections[0].name] + ' ' + newGroup[el.collections[1].name];
                                } else {
                                    ele[el.name] = biggroup[el.name];
                                }
                                break;
                            default:
                                ele[el.name] = biggroup[el.name];
                                break;
                        }
                    });
                });
                element.collections.forEach(el => {
                    // if(el.type === 'inputselect' && !el.name) {
                    //     this.oneColumns.push(el.collections[0]);
                    //     this.displayedColumns.push(el.collections[0].name);
                    //     this.oneColumns.push(el.collections[1]);
                    //     this.displayedColumns.push(el.collections[1].name);
                    // } else {
                        this.oneColumns.push(el);
                        this.displayedColumns.push(el.name);
                    // }
                });
                break;
            case 'date':
                this.dataSource.forEach(ele => {
                    ele[element.name] = new DatePipe(this.locale).transform(ele[element.name]);
                });
                this.oneColumns.push(element);
                this.displayedColumns.push(element.name);
                break;
              case 'dateTime':
                this.dataSource.forEach(ele => {
                    ele[element.name] = new DatePipe(this.locale).transform(ele[element.name], 'medium');
                });
            default:
                this.oneColumns.push(element);
                this.displayedColumns.push(element.name);
                break;
        }
    });
    if(tempField.options) {
        this.inputField = tempField.options;
        // this.displayedColumns.push('inputField');
    }
  }
}

