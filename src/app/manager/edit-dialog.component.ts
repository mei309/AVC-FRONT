import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { ManagerService } from './manager.service';

@Component({
    selector: 'app-edit-dialog',
    template: `
    <dynamic-form [putData]="putData" [fields]="regConfig" [mainLabel]="mainLabel | namingPipe : (type.startsWith('edit')? 'edit' : 'add')" (submitForm)="submit($event)" popup="true">
    </dynamic-form>
    `,
})
export class EditDialogComponent {
    regConfig: FieldConfig[];
    putData: any = null;
    mainLabel: string;
    type: string;

    submit(value: any) {
        this.localService.addEditNew(value, this.type, this.mainLabel).pipe(take(1)).subscribe( val => {
            this.dialogRef.close('success');
        });
    }
    
    constructor(private localService: ManagerService, public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.putData = data.putData;
            this.regConfig = data.regConfig;
            this.mainLabel = data.mainLabel;
            this.type = data.type;
        }


    onNoClick(): void {
        this.dialogRef.close('closed');
    }

}




