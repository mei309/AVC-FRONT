import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FieldConfig } from '../../field.interface';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-popupform',
  template: `
<button type="button" mat-raised-button color="accent" (click)="openDialog()">
  <span [hidden]="isadd"><mat-icon>done</mat-icon></span>
  {{show}}
</button>
`,
})
export class PopupformComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  show: string;
  isadd: boolean = true;

  constructor(public dialog: MatDialog) {
  }
  ngOnInit() {
      this.show = this.field.label;
      if(this.group.controls[this.field.name].value) {
        this.isadd = false;
        this.show = 'Edit ' + this.field.label;
      }
  }

  openDialog(): void {
    var disa = this.group.controls[this.field.name].disabled && !this.field.inputType;
    const dialogRef = this.dialog.open(PopupformDialog, {
      width: '70%',
      height: '70%',
      data: {field: this.field, oldValue: this.group.controls[this.field.name].value,
      disable: disa},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'closed' || !result) {
        } else {
          this.show = 'Edit ' + this.field.label;
          this.group.controls[this.field.name].setValue(result);
          this.isadd = false;
        }
    });
  }

}
@Component({
  selector: 'app-popupform-dialog',
  template: `
    <dynamic-form [putData]="putData" [fields]="regConfig" [mainLabel]="info" (submit)="submit($event)">
    </dynamic-form>
  `,
})
// tslint:disable-next-line: component-class-suffix
export class PopupformDialog implements AfterViewInit {

  @ViewChild(DynamicFormComponent, {static: false}) form: DynamicFormComponent;

  putData: any;
  regConfig: FieldConfig[];
  info: string;
  disable: boolean;
  

  constructor(private cdRef:ChangeDetectorRef,
    public dialogRef: MatDialogRef<PopupformDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.putData = data.oldValue;
      this.regConfig = Object.assign([], data.field.collections);
      this.info = data.field.label;
      this.disable = data.disable;
    }

  ngAfterViewInit() {
    if(this.disable) {
        this.form.disable();
        this.cdRef.detectChanges();
      }
  }
  submit(value: any) {
    this.dialogRef.close(value);
  }

  onNoClick() {
    this.dialogRef.close('closed');
  }

}
