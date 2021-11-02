import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ReceiptService } from './receipt.service';

@Component({
    selector: 'receipt-dialog',
    template: `
    <button printTitle="{{type}} receive details" printSectionId="print-section-orders" printLazyLoad mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>{{type}} receive details</h1>
    <mat-dialog-content id="print-section-orders">
        <h1 class="only-print" i18n>{{type}} receive details</h1>
        <show-details [dataSource]="receipt" (approveChange)="setApproveChange()">
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
export class ReceiptDialog {
    id;
    fromNew: boolean;
    receipt: any;
    type: string;
    buttons: string[] = [];
    approveChange: boolean = false;

    constructor(private LocalService: ReceiptService, public dialogRef: MatDialogRef<ReceiptDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.receipt = data.receipt;
        }

    ngOnInit() {
        if(!this.fromNew) {
            this.LocalService.getReceive(this.id).pipe(take(1)).subscribe( val => {
                this.receipt = val;
                if('LOCKED' !== val['editStatus']) {
                    // if(val['referencedOrder']) {
                    //     this.buttons.push('Edit order');
                    // }
                    this.buttons.push($localize`Edit receive`);
                }
                if(this.type.includes('Cashew')) {
                  this.buttons.push($localize`Receive extra`);
                }
            });
        } else {
            // if(this.receipt['referencedOrder']) {
            //     this.buttons.push('Edit order');
            // }
            this.buttons.push($localize`Edit receive`);
            if(this.type.includes('Cashew')) {
              this.buttons.push($localize`Receive extra`);
            }
        }
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
