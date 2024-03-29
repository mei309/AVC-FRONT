import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Globals } from '../global-params.component';
import { ProductionService } from './production.service';


@Component({
    selector: 'app-production-details-dialog',
    template: `
    <button printTitle="{{type}} details" printSectionId="print-section-production" printLazyLoad mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>{{type}} details</h1>
    <mat-dialog-content id="print-section-production">
        <h1 class="only-print" i18n>{{type}} details</h1>
        <show-details [dataSource]="productionCheck" (approveChange)="setApproveChange()">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <ng-container *ngIf="this.type.includes('Pack')">
            <mat-checkbox *ngIf="!this.type.includes('QC')" style="padding-right: 10px" [(ngModel)]="withPacked" i18n>Edit with packed</mat-checkbox>
            <mat-checkbox *ngIf="this.type.includes('QC')" style="padding-right: 10px" [(ngModel)]="withCleaned" i18n>Edit with all QC waste</mat-checkbox>
            <mat-checkbox *ngIf="productionCheck && productionCheck['weightedPos']" style="padding-right: 10px" [(ngModel)]="addPos" i18n>Edit add POS</mat-checkbox>
        </ng-container>
        <ng-container *ngFor="let butt of buttons;">
            <button  mat-raised-button color="accent" (click)="onClickElement(butt)">{{butt}}</button>
        </ng-container>
        <button  mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
    `,
})
export class ProductionDetailsDialogComponent {
    id;
    fromNew: boolean;
    productionCheck: any;
    type: string;
    buttons: string[] = [];
    approveChange: boolean = false;

    withPacked: boolean = false;
    withCleaned: boolean = false;
    addPos: boolean = false;

    constructor(private LocalService: ProductionService, private myGlobal: Globals,
      public dialogRef: MatDialogRef<ProductionDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.productionCheck = data.productionCheck;
        }

    ngOnInit() {
        if(!this.fromNew) {
            this.LocalService.getProduction(this.id).pipe(take(1)).subscribe( val => {
                this.productionCheck = val;
            });
        } else if(this.myGlobal.isManager) {
          this.buttons.push($localize`Go to full production report`);
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
