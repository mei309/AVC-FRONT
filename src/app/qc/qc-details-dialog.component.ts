import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QcService } from './qc.service';
import { take } from 'rxjs/operators';
import { Globals } from '../global-params.component';

@Component({
    selector: 'app-qc-details-dialog',
    template: `
    <button printTitle="{{type}} details" printSectionId="print-section-qc" printLazyLoad mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>{{type}} details</h1>
    <mat-dialog-content id="print-section-qc">
        <h1 class="only-print" i18n>{{type}} details</h1>
        <show-details [dataSource]="qcCheck" (approveChange)="setApproveChange()">
        </show-details>
        <ng-container *ngIf="globels.isMe">
          <file-uploader *ngIf="qcCheck" functionUrl="addQcImage" [processId]="id"></file-uploader>
          <file-viewer *ngIf="fileList && fileList.length" [fileList]="fileList"></file-viewer>
        </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <ng-container *ngFor="let butt of buttons;">
            <button  mat-raised-button color="accent" (click)="onClickElement(butt)">{{butt}}</button>
        </ng-container>
        <button  mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
    `,
})
export class QcDetailsDialogComponent {
    id;
    fileList;
    fromNew: boolean;
    qcCheck: any;
    type: string;
    buttons: string[] = [];
    approveChange: boolean = false;

    constructor(public globels: Globals, private LocalService: QcService, public dialogRef: MatDialogRef<QcDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.qcCheck = data.qcCheck;
        }

    ngOnInit() {
        if(!this.fromNew) {
            this.LocalService.getQcCheck(this.id).pipe(take(1)).subscribe( val => {
                this.qcCheck = val;
                this.fileList =
                // [
                //   {address: '/assets/qc-images/DECAY.jpg', file: '/assets/qc-images/DECAY.jpg'},
                //   {address: 'assets/qc-images/DEEP CUT.jpg', file: 'assets/qc-images/DEEP CUT.jpg'},
                //   {address: 'assets/qc-images/DEEP SPOT.jpg', file: 'assets/qc-images/DEEP SPOT.jpg'},
                //   {address: '/assets/qc-images/DIRTY.jpg', file: '/assets/qc-images/DIRTY.jpg'},
                //   {address: '/assets/qc-images/MOLD.jpg', file: '/assets/qc-images/MOLD.jpg'},
                //   {address: 'assets/qc-images/OFF COLOUR.jpg', file: 'assets/qc-images/OFF COLOUR.jpg'},
                //   {address: '/assets/qc-images/ROASTED TESTA.jpg', file: '/assets/qc-images/ROASTED TESTA.jpg'},
                //   {address: 'assets/qc-images/BREAKAGE.jpg', file: 'assets/qc-images/BREAKAGE.jpg'},
                //   {address: 'assets/qc-images/RAW.jpg', file: 'assets/qc-images/RAW.jpg'},
                //   {address: 'assets/qc-images/ROASTED.jpg', file: 'assets/qc-images/ROASTED.jpg'},
                //   {address: 'assets/qc-images/SMALL SIZE.jpg', file: 'assets/qc-images/SMALL SIZE.jpg'},
                //   {address: 'assets/qc-images/TOTAL DEFECT ROASTING.jpg', file: 'assets/qc-images/TOTAL DEFECT ROASTING.jpg'},
                //   {address: 'assets/qc-images/TOTAL DEFECT.jpg', file: 'assets/qc-images/TOTAL DEFECT.jpg'},
                //   {address: 'assets/qc-images/TESTA.jpg', file: 'assets/qc-images/TESTA.jpg'},
                // ];
                val['processFiles'];
            });
        } else {
            this.id = this.qcCheck['id'];
            this.fileList = this.qcCheck['processFiles'];
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
