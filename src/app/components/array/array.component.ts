import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-array',
  template: `
<div class="array-field" [formGroup]="group">
  <ng-container [formArrayName]="field.name">
    <div *ngFor="let item of formArray.controls; let i = index;">
      <mat-form-field class="one-field" [formGroupName]="i">
        <input matInput #input *ngIf="field.inputType !== 'numeric'" formControlName="value" [placeholder]="field.label" [type]="field.inputType" maxlength="255">
        <input matInput #input *ngIf="field.inputType === 'numeric'" numeric formControlName="value" [decimals]="field.options" [placeholder]="field.label" type="text" maxlength="255">
        <button *ngIf="i!=0 && group.enabled" mat-button matSuffix mat-icon-button aria-label="Clear" (click)="removeItem(i)">
          <mat-icon>close</mat-icon>
        </button>
        <mat-error *ngIf="formArray.controls[i].get('value').hasError('maxlength')">Max length 255</mat-error>
        <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
          <mat-error *ngIf="formArray.controls[i].get('value').hasError(validation.name)">{{validation.message}}</mat-error>
        </ng-container>
      </mat-form-field>
    </div>
  </ng-container>
  <button *ngIf="group.enabled" type="button" class="add-button" (click)="addItem()">Add {{field.label}}</button>
</div>



`,
})
export class ArrayComponent implements OnInit {
  @ViewChildren('input') inputs: QueryList<ElementRef>;
  
  field: FieldConfig;
  group: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    
  }
  
  get formArray() { return <FormArray>this.group.get(this.field.name); }

  addItem(): void {
      this.formArray.push(this.fb.group({value: this.fb.control(this.field.value, this.bindValidations(this.field.validations || []) )}));
      setTimeout(() => {
        this.inputs.last.nativeElement.focus();
      }, 2);
  }

  removeItem(index): void {
    this.formArray.removeAt(index);
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        if (valid.name !== 'required') {
          validList.push(valid.validator);
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }


keyDown(event: KeyboardEvent, ind) {
  switch (event.keyCode) {
      case 37: // this is the ascii of left
          if(!ind) {
            break;
          }
          const elem = this.inputs.find((element, index) => index === ind-1);
          elem.nativeElement.focus();
          break;
      case 38: // this is the ascii of arrow up
          if(ind < 6) {
            break;
          }
          const elem1 = this.inputs.find((element, index) => index === ind-6);
          elem1.nativeElement.focus();   
          break;
        case 39: // this is the ascii of right
          if(ind === this.inputs.length) {
            break;
          }
          const elem2 = this.inputs.find((element, index) => index === ind+1);
          elem2.nativeElement.focus();
          break;
      case 40: // this is the ascii of arrow down
          if(ind > this.inputs.length-6) {
            break;
          }
          const elem3 = this.inputs.find((element, index) => index === ind+6);
          elem3.nativeElement.focus();   
          break;
  }
}

}

// *ngIf="!field.collections"

// <div [formGroup]="group" *ngIf="field.collections">
//   {{field.label}}
//   <div [formArrayName]="field.name" class="array-field-grid">
//     <div *ngFor="let item of formArray.controls; let i = index;" (keydown)="keyDown($event, i)" class="one-cell-table">
//       <span matPrefix>&nbsp; {{i+1}} &nbsp;</span>
//       <mat-form-field [formGroupName]="i" style="width: 100px">
//         <input matInput #input numeric formControlName="value" [decimals]="field.options" minus="true" type="text" maxlength="255">
//       </mat-form-field>
//     </div>
//   </div>
//   <button *ngIf="group.enabled" type="button" class="add-button" (click)="addItem()">Add {{field.label}}</button>
// </div>


// const num = this.field.collections;
//     for(let i = 1; i < num; i++) {
//       this.formArray.push(this.fb.group({value: this.fb.control(this.field.value, this.bindValidations(this.field.validations || []) )}));
//     }

//     if(this.field.collections) {
//       for (let index = 0; index < this.field.collections; index++) {
//         this.formArray.push(this.fb.group({value: this.fb.control(this.field.value, this.bindValidations(this.field.validations || []) )}));
//       }
//     } else {
//     }
