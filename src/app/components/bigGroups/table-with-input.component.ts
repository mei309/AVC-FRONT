import { Component, OnInit } from '@angular/core';
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
                <th mat-header-cell *matHeaderCellDef> Amount </th>
                <td mat-cell *matCellDef="let element; let i = index;" [formGroupName]="i">
                    <mat-form-field class="one-field">
                        <input matInput [formControlName]="inputField" numeric type="text" maxlength="255">
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

  constructor() {}
  ngOnInit() {
    this.dataSource = this.group.get(this.field.name).value; 
    this.kidSetup(this.field);
  }

  kidSetup(tempField) {
    tempField.collections.forEach(element => {
        switch (element.type) {
            // case 'kidInput':
            //     var arr = [];
            //     this.dataSource.forEach(line => {
            //             line[element.name].forEach(obj => {
            //                 var copied = Object.assign({}, obj, line);
            //                 delete copied[element.name];
            //                 arr.push(copied);
            //             });
            //     });
            //     this.dataSource = arr;
            //     this.kidSetup(element);
            //     break;
            case 'array':
                this.dataSource.forEach(ele => {
                    ele[element.name] = 'arr';
                });
                this.oneColumns.push(element);
                this.displayedColumns.push(element.name);
                break;
            case 'select' || 'selectNormal':
                if(this.field.inputType === 'multiple') {
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
            // case 'bignotexpand':
            //     this.dataSource.forEach(ele => {
            //         ele[element.name] = 'arr';
            //     });
            //     this.oneColumns.push(element);
            //     this.displayedColumns.push(element.name);
            //     break;
            case 'nothing':
                break;
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

