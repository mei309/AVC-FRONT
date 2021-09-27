import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CountinersService } from './countiners.service';
import { SecurityExportDocComponent } from './security-export-doc.component';

@Component({
    selector: 'counteiners-details-dialog',
    template: `
    <button printTitle="{{type}} details" printSectionId="print-section-continers" printLazyLoad mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>{{type}} details</h1>
    <mat-dialog-content id="print-section-continers">
        <h1 class="only-print" i18n>{{type}} details</h1>
        <show-details [dataSource]="loading" (approveChange)="setApproveChange()">
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
export class CounteinersDetailsDialogComponent {
    id;
    fromNew: boolean;
    loading: any;
    type: string;
    buttons: string[] = [];
    approveChange: boolean = false;



    constructor(private LocalService: CountinersService, private dialog: MatDialog, public dialogRef: MatDialogRef<CounteinersDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
            this.type = data.type;
            this.loading = data.loading;
        }

    ngOnInit() {
        switch (this.type) {
            case 'Loading':
                if(!this.fromNew) {
                    this.LocalService.getLoading(this.id).pipe(take(1)).subscribe( val => {
                        this.loading = val;
                    });
                } else {
                    this.id = this.loading['id'];
                }
                this.buttons.push($localize`Security Doc`, $localize`Export Doc`);
                break;
            case 'Arrivals':
                if(!this.fromNew) {
                    this.LocalService.getContainerArrival(this.id).pipe(take(1)).subscribe( val => {
                        this.loading = val;
                    });
                }
            default:
                break;
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
        if($localize`Security Doc` === opartion) {
            const dialogRef1 = this.dialog.open(SecurityExportDocComponent, {
                width: '80%',
                data: {id: this.id, isSecurity: true},
            });
            dialogRef1.afterClosed().subscribe(data => {

            });
        } else if($localize`Export Doc` === opartion) {
            const dialogRef2 = this.dialog.open(SecurityExportDocComponent, {
                width: '80%',
                data: {id: this.id, isSecurity: false},
            });
            dialogRef2.afterClosed().subscribe(data => {
            });
        } else {
            this.dialogRef.close(opartion);
        }
    }
}
