import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OrdersService } from './orders.service';
@Component({
    selector: 'app-order-details-dialog',
    template: `
    <button printTitle="{{type}} order details" [useExistingCss]="true" printSectionId="print-section-orders" ngxPrint class="example-icon" mat-mini-fab style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title>{{type}} order details</h1>
    <mat-dialog-content id="print-section-orders">
        <h1 class="only-print">{{type}} order details</h1>
        <show-details [dataSource]="order">
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
export class OrderDetailsDialogComponent {
    id;
    fromNew: boolean;
    order: any;
    type: string;
    buttons: string[] = [];
    constructor(private LocalService: OrdersService, public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.order = data.order;
        }

    ngOnInit() {    
        if(!this.fromNew) {
            this.LocalService.getOrder(this.id).pipe(take(1)).subscribe( val => {
                this.order = val;
                if('LOCKED' === val['editStatus']) {
                    this.buttons.push('Receive');
                } else {
                    this.buttons.push('Edit order', 'Receive');
                }
            });
        } else {
            this.buttons.push('Edit order', 'Receive');
        }
    }
    onNoClick(): void {
        this.dialogRef.close('closed');
    }

    onClickElement(opartion: string): void {
        this.dialogRef.close(opartion);
    }
}
