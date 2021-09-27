import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { InventoryService } from './inventory.service';

@Component({
    selector: 'app-inventory-details-dialog',
    template: `
    <button printTitle="{{type}} details" printSectionId="print-section-inventory" printLazyLoad mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>{{type}} details</h1>
    <mat-dialog-content id="print-section-inventory">
        <h1 class="only-print" i18n>{{type}} details</h1>
        <show-details [dataSource]="inventoryItem" (approveChange)="setApproveChange()">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <ng-container *ngFor="let butt of buttons;">
            <button  mat-raised-button color="accent" (click)="onClickElement(butt)">{{butt}}</button>
        </ng-container>
        <button  mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
    `,
})
export class InventoryDetailsDialogComponent {
    id;
    fromNew: boolean;
    inventoryItem: any;
    type: string;
    buttons: string[] = [];
    approveChange: boolean = false;


    constructor(private LocalService: InventoryService, public dialogRef: MatDialogRef<InventoryDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.inventoryItem = data.inventoryItem;
        }

    ngOnInit() {
        if(!this.fromNew) {
            switch (this.type) {
                case $localize`Material usage`:
                    this.LocalService.getStroageUse(this.id).pipe(take(1)).subscribe( val => {
                        this.inventoryItem = val;
                    });
                    break;
                case $localize`Cashew usage`:
                    this.LocalService.getStroageUse(this.id).pipe(take(1)).subscribe( val => {
                        this.inventoryItem = val;
                    });
                    break;
                case $localize`Relocation`:
                    this.LocalService.getStorageRelocation(this.id).pipe(take(1)).subscribe( val => {
                        this.inventoryItem = val;
                    });
                default:
                    break;
            }
        }
        this.buttons.push($localize`Edit`);
    }

    onNoClick(): void {
        this.dialogRef.close('closed');
    }

    setApproveChange() {
        this.approveChange = true;
    }

    onClickElement(opartion: string): void {
        this.dialogRef.close(opartion);
    }
}
