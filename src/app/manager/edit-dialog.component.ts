import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldConfig } from '../field.interface';

@Component({
    selector: 'app-edit-dialog',
    template: `
    <dynamic-form [putData]="putData" [fields]="regConfig" [mainLabel]="mainLabel" (submitForm)="submit($event)" popup="true">
    </dynamic-form>
    `,
})
export class EditDialogComponent {
    regConfig: FieldConfig[];
    putData: any = null;
    mainLabel: string;

    submit(value: any) {
        this.dialogRef.close(value);
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




