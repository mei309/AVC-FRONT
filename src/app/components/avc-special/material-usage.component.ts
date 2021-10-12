import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Genral } from 'src/app/genral.service';
import { FieldConfig } from '../../field.interface';
import { isEqual, map } from 'lodash-es';
import { diff } from 'src/app/libraries/diffArrayObjects.interface';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'material-usage',
  template: `
    <ng-container dynamicField [field]="itemConfig" [group]="form">
    </ng-container>
  <div *ngIf="dataSource.length" [formGroup]="group">
        <table mat-table [dataSource]="dataSource" [formArrayName]="field.name">
            <ng-container matColumnDef="{{column.name}}" *ngFor="let column of oneColumns">
                <th mat-header-cell *matHeaderCellDef> {{column.label}} </th>
                <td mat-cell *matCellDef="let element" style="text-align: center"> {{element[column.name]}} </td>
            </ng-container>

            <!-- Complex Column -->
            <ng-container matColumnDef="inputField">
                <th mat-header-cell *matHeaderCellDef i18n>Amount of units</th>
                <td mat-cell *matCellDef="let element; let i = index;" [formGroupName]="i">
                    <mat-form-field class="one-field">
                        <input matInput formControlName="numberUsedUnits" numeric decimals="3" type="text" maxlength="255">
                    </mat-form-field>
                </td>
            </ng-container>

            <!-- Complex Column -->
            <ng-container matColumnDef="weightAmount">
                <th mat-header-cell *matHeaderCellDef i18n></th>
                <td mat-cell *matCellDef="let element; let i = index;">
                    <button type="button" [disabled]="this.dataSource[i]['unitAmount'] === 1" mat-raised-button color="accent" (click)="openDialog(i)" i18n>Weight amount</button>
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" ></tr>
        </table>
</div>
`,
})
export class MaterialUsageComponent implements OnInit {

    form: FormGroup;

    choosedItems = [];
    itemConfig: FieldConfig;
  productItems = [];

  field: FieldConfig;
  group: FormGroup;

  dataSource;
  displayedColumns = [];
  oneColumns = [];

  constructor(@Inject(LOCALE_ID) private locale: string,
  private fb: FormBuilder, public dialog: MatDialog,
         private genral: Genral) {}
  ngOnInit() {
    this.form = this.fb.group({});
    this.form.addControl('items', this.fb.array([this.fb.group({item: null})]));

    this.form.get('items').valueChanges.pipe(distinctUntilChanged()).subscribe(selectedValue => {
        selectedValue = selectedValue.filter(ele => ele.item && ele.item.id);
        selectedValue = map(selectedValue, 'item');
        if(selectedValue.length && !isEqual(selectedValue, this.choosedItems)) {
            var result = diff(this.choosedItems, selectedValue, 'id', { updatedValues: 1});
            result['added'].forEach(el => {
                this.genral.getStorageGeneralItem(el.id).pipe(take(1)).subscribe( val => {
                    this.addToForm(val);
                });
            });
            this.choosedItems = selectedValue;
        }
    });

    this.itemConfig =
        {
            type: 'bigexpand',
            name: 'items',
            label: $localize`Item`,
            options: 'aloneInline',
            collections: [
                {
                    type: 'select',
                    label: $localize`Item descrption`,
                    name: 'item',
                    options: this.genral.findAvailableItems(),
                    collections: 'somewhere',
                },
                {
                    type: 'divider',
                    inputType: 'divide'
                },
            ]
        };


    this.dataSource = this.group.get(this.field.name).value;

    this.columnsSetup(this.field);
    this.kidSetup(this.field);
  }

  columnsSetup(tempField) {
    tempField.collections.forEach(element => {
        switch (element.type) {
            case 'selectgroup':
                this.oneColumns.push(element.collections[0]);
                this.displayedColumns.push(element.inputType);
                this.oneColumns.push(element.collections[1]);
                this.displayedColumns.push(element.collections[1].name);
                break;
            case 'inputselect':
                if(element.name) {
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
                element.collections.forEach(el => {
                        this.oneColumns.push(el);
                        this.displayedColumns.push(el.name);

                });
                break;
            default:
                this.oneColumns.push(element);
                this.displayedColumns.push(element.name);
                break;
        }
    });
    this.displayedColumns.push('inputField')
    this.displayedColumns.push('weightAmount');
    if(tempField.inputType) {
      (this.group.parent.parent.get('processItemsNormal') as FormArray).valueChanges.pipe(distinctUntilChanged()).subscribe(arr => {
        arr.forEach(ele => {
          if(ele && ele['item']['id'] && !this.productItems.includes(ele['item']['id'])) {
            this.productItems.push(ele['item']['id']);
            this.genral.getProductBomInventory(ele['item']['id']).pipe(take(1)).subscribe( val => {
              this.addToForm(val);
            });
          }
        });
      });
      (this.group.parent.parent.get('processItemsTable') as FormArray).valueChanges.pipe(distinctUntilChanged()).subscribe(arr => {
        arr.forEach(ele => {
          if(ele && ele['item']['id'] && !this.productItems.includes(ele['item']['id'])) {
            this.productItems.push(ele['item']['id']);
            this.genral.getProductBomInventory(ele['item']['id']).pipe(take(1)).subscribe( val => {
              this.addToForm(val);
            });
          }
        });
      });
    }
  }

  kidSetup(tempField) {
    tempField.collections.forEach(element => {
        switch (element.type) {
            // case 'array':
            //     break;
            case 'select':
            case 'selectNormal':
                if(element.inputType === 'multiple') {
                    this.dataSource.forEach(ele => {
                        ele[element.name] = 'arr';
                    });
                } else {
                    this.dataSource.forEach(ele => {
                        ele[element.name] = ele[element.name]? ele[element.name]['value'] : '';
                    });
                }
                break;
            case 'selectgroup':
                element.collections[0]['name'] = element.inputType;
                this.dataSource.forEach(ele => {
                    const newGroup = ele[element.collections[1].name];
                    ele[element.collections[0].name] = newGroup[element.inputType];
                    ele[element.collections[1].name] = newGroup.value;
                });
                break;
            case 'inputselect':
                if(element.name) {
                    this.dataSource.forEach(ele => {
                        const newGroup = ele[element.name];
                        ele[element.name] = newGroup[element.collections[0].name] + ' ' + newGroup[element.collections[1].name];
                    });
                }
                break;
            case 'bignotexpand':
                this.dataSource.forEach(ele => {
                    const biggroup = ele[element.name];
                    element.collections.forEach(el => {
                        switch (el.type) {
                            case 'select' || 'selectNormal':
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
                break;
            case 'date':
                this.dataSource.forEach(ele => {
                    ele[element.name] = new DatePipe(this.locale).transform(ele[element.name]);
                });
            default:
                break;
        }
    });
  }

  addToForm(val): void {
    const items = this.group.get([this.field.name]) as FormArray;
    val?.forEach(element => {
        if(element['storageForms']) {
            element['storageForms'].forEach(ele => {
                    var obj = {itemPo: element['poCode'], item: element['item'], itemProcessDate: element['itemProcessDate'], measureUnit: element['measureUnit'], storage: ele};
                    var group2 = this.fb.group({});
                    items.push(group2);
                    this.createItem(group2, this.field, obj);
            });
        }
    });
    this.dataSource = this.group.get(this.field.name).value;
    this.kidSetup(this.field);
  }

  createItem(group2: FormGroup, field: FieldConfig, value) {
    if(value.hasOwnProperty('id')) {
        group2.addControl('id', this.fb.control(value['id'], null));
    }
    if(value.hasOwnProperty('version')) {
        group2.addControl('version', this.fb.control(value['version'], null));
    }
    field.collections.forEach(kid => {
        if(kid.type === 'bignotexpand') {
            group2.addControl(kid.name, this.createBigNotExpand(kid, value.hasOwnProperty([kid.name]) ? value[kid.name] : {}));
        } else if(kid.type === 'selectgroup') {
            const control = this.fb.control(
                value.hasOwnProperty(kid.collections[1].name)? value[kid.collections[1].name] : kid.value,
                null
            );
            group2.addControl(kid.collections[1].name, control);
        } else {
            const control = this.fb.control(
                value.hasOwnProperty(kid.name)? value[kid.name] : kid.value,
                null
            );
            group2.addControl(kid.name, control);
        }
    });
    group2.addControl('numberUsedUnits', this.fb.control(null, null));
  }

  createBigNotExpand(field: FieldConfig, value): FormGroup {
    var group3 = this.fb.group({});
    if(value.hasOwnProperty('id')) {
        group3.addControl('id', this.fb.control(value['id'], null));
    }
    if(value.hasOwnProperty('version')) {
        group3.addControl('version', this.fb.control(value['version'], null));
    }
    field.collections.forEach(kid => {
        const control = this.fb.control(
            value.hasOwnProperty(kid.name)? value[kid.name] : kid.value,
            null
        );
        group3.addControl(kid.name, control);
    });
    return group3;
  }

  openDialog(index: number): void {
    const dialogRef = this.dialog.open(MaterialUsageDialog, {
      data: {weight: this.dataSource[index]['measureUnit']},
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
            (this.group.get([this.field.name]) as FormArray).at(index).get('numberUsedUnits').setValue(result/+this.dataSource[index]['unitAmount']);
            (this.group.get([this.field.name]) as FormArray).at(index).get('numberUsedUnits').markAsDirty();
        }
    });
  }

}



@Component({
    selector: 'material-usage-dialog',
    template: `
    <h1 mat-dialog-title i18n>Amount in {{weight}}</h1>
    <mat-dialog-content>
        <mat-form-field class="one-field">
            <input matInput cdkFocusInitial numeric [formControl]="amountUsed" decimals="3" placeholder="Amount" type="text">
        </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button mat-raised-button color="accent" (click)="submitAmount()" i18n>Save</button>
        <button mat-raised-button color="accent" (click)="onNoClick()" i18n>Close</button>
    </mat-dialog-actions>
    `,
  })
  export class MaterialUsageDialog {

    amountUsed = new FormControl('');

    weight;

    constructor(public dialogRef: MatDialogRef<MaterialUsageDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.weight = data.weight;
      }


    submitAmount() {
      this.dialogRef.close(this.amountUsed.value);
    }

    onNoClick() {
      this.dialogRef.close(null);
    }

  }
