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
          <file-uploader *ngIf="id" functionUrl="addQcImage" [processId]="id"></file-uploader>
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
                this.fileList = val['processFiles'];
            });
        } else {
          this.id = this.qcCheck['id'];
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
