import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../field.interface';

@Component({
  selector: 'app-array-ordinal',
  template: `
<div [formGroup]="group" *ngIf="!field.inputType">
  {{field.label}}
  <div [formArrayName]="field.name" class="array-field-grid">
    <div *ngFor="let item of formArray.controls; let i = index;" [formGroupName]="i" (keydown)="keyDown($event, i)" class="one-cell-table">
      <span>&nbsp; {{item.get('ordinal').value}} &nbsp;</span>
      <mat-form-field style="width: 100px">
        <input matInput style="text-align: center" #input numeric formControlName="amount" [decimals]="field.options" minus="true" type="text" maxlength="255">
      </mat-form-field>
    </div>
  </div>
  <button *ngIf="group.enabled" type="button" class="add-button" (click)="addItem()">Add {{field.label}}</button>
</div>
<div [formGroup]="group" *ngIf="field.inputType">
  {{field.label}}
  <mat-checkbox [checked]="allComplete" (change)="setAll($event.checked)">Choose all</mat-checkbox>
  <div [formArrayName]="field.name" class="array-field-grid">
    <div *ngFor="let item of formArray.controls; let i = index;" [formGroupName]="i" (keydown)="keyDown($event, i)" class="one-cell-table">
      <span>&nbsp; {{item.get('ordinal').value}} &nbsp;</span>
      <mat-form-field appearance="none" provideReadonly style="width: 100px">  
        <input readonly style="text-align: center" matInput formControlName="amount">
      </mat-form-field>
      &nbsp;<mat-checkbox matSuffix formControlName="take" (ngModelChange)="updateAllComplete()"></mat-checkbox>
    </div>
  </div>
</div>
`,
})
export class ArrayOrdinalComponent implements OnInit {
  @ViewChildren('input') inputs: QueryList<ElementRef>;
  
  field: FieldConfig;
  group: FormGroup;


  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.formArray.controls.every(t => t.get('take').value);
  }

  
  setAll(completed: boolean) {
    this.allComplete = completed;
    this.formArray.controls.forEach(t => t.get('take').setValue(completed));
    this.formArray.markAsDirty();
  }


  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
  }
  
  get formArray() { return <FormArray>this.group.get(this.field.name); }

  addItem(): void {
    const longth = this.formArray.length;
    for (let ind = 0; ind < this.field.collections; ind++) {
        this.formArray.push(this.fb.group({ordinal: [ind+longth+1], amount: this.fb.control(this.field.value, this.bindValidations(this.field.validations || []) )}));
    }
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
          if(ind < 5) {
            break;
          }
          const elem1 = this.inputs.find((element, index) => index === ind-5);
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
          if(ind > this.inputs.length-5) {
            break;
          }
          const elem3 = this.inputs.find((element, index) => index === ind+5);
          elem3.nativeElement.focus();   
          break;
  }
}

}
