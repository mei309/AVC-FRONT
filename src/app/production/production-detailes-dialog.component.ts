import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ProductionService } from './production.service';


@Component({
    selector: 'app-production-details-dialog',
    template: `
    <button class="example-icon" mat-mini-fab (click)="printWindow()" style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title id="print">
        {{type}} details
    </h1>
    <mat-dialog-content>
        <show-details [dataSource]="productionCheck" id="print-child">
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
export class ProductionDetailsDialogComponent {
    id;
    fromNew: boolean;
    productionCheck: any;
    type: string;
    buttons: string[] = [];

    constructor(private LocalService: ProductionService, public dialogRef: MatDialogRef<ProductionDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.productionCheck = data.productionCheck;
        }

    ngOnInit() {
        if(!this.fromNew) {
            this.LocalService.getTransferProduction(this.id).pipe(take(1)).subscribe( val => {
                this.productionCheck = val;
            });
        }
        this.buttons.push('Edit');
    }
    onNoClick(): void {
        this.dialogRef.close('closed');
    }

    onClickElement(opartion: string): void {
        console.log(opartion);
        
        this.dialogRef.close(opartion);
    }

    public printWindow(): void { 
        document.getElementById("section-to-print").setAttribute("id", "newDivId");
        window.print();
        document.getElementById("newDivId").setAttribute("id", "section-to-print");
    }

    
}