import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldConfig } from '../field.interface';

@Component({
    selector: 'app-edit-dialog',
    template: `
    <dynamic-form [putData]="putData" [fields]="regConfig" [mainLabel]="mainLabel" (submit)="submit($event)">
    </dynamic-form>
    `,
})
export class EditDialogComponent {
    // @ViewChild(DynamicFormComponent, {static: true}) form: DynamicFormComponent;
    // <div>{{form.value | json}}</div>
    regConfig: FieldConfig[];
    putData: any = null;
    mainLabel: string;

    submit(value: any) {
        this.dialogRef.close(value);
    }

    remove() {
        // this.localService.removeSetup(this.putData).pipe(take(1)).subscribe( val => {
        //     this.dialogRef.close('removed');
        //  });<button mat-raised-button color="primary" (click)="remove()">Remove</button>
    }
    
    constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.putData = data.putData;
            this.regConfig = data.regConfig;
            this.mainLabel = data.mainLabel;
        }


    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}




