import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { RelocationsService } from './relocations.service';

@Component({
    selector: 'app-relocations-details-dialog',
    template: `
    <button printTitle="{{type}} details" printSectionId="print-section-relocations" printLazyLoad class="example-icon" mat-mini-fab style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title>{{type}} details</h1>
    <mat-dialog-content id="print-section-relocations">
        <h1 class="only-print">{{type}} details</h1>
        <show-details [dataSource]="relocationsItem">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <ng-container *ngFor="let butt of buttons;">
            <button class="raised-margin" mat-raised-button color="accent" (click)="onClickElement(butt)">{{butt}}</button>
        </ng-container>
        <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial>Close</button>
    </mat-dialog-actions>
    `,
})
export class RelocationsDetailsDialogComponent {
    id;
    fromNew: boolean;
    relocationsItem: any;
    type: string;
    buttons: string[] = [];

    

    constructor(private LocalService: RelocationsService, public dialogRef: MatDialogRef<RelocationsDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.relocationsItem = data.relocationsItem;
        }

    ngOnInit() {
        if(!this.fromNew) {
            this.LocalService.getStorageRelocation(this.id).pipe(take(1)).subscribe( val => {
                this.relocationsItem = val;
            });
        }
        this.buttons.push('Edit');
    }
    onNoClick(): void {
        this.dialogRef.close('closed');
    }

    onClickElement(opartion: string): void {
        this.dialogRef.close(opartion);
    }
}