import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UserAccountService } from './user-account.service';
@Component({
    selector: 'massages-todo-popup',
    template: `
    <ng-container *ngFor="let po of poCodes;">
      <button mat-raised-button color="accent" (click)="goFullPo(po.id)" style="float: right;" i18n>Go to full {{po.value}} details</button>
    </ng-container>
    <button printTitle="Task Details" printSectionId="print-section-task" printLazyLoad class="example-icon" mat-mini-fab style="float: right;" i18n-printTitle>
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title i18n>Task Details</h1>
    <mat-dialog-content id="print-section-task">
        <h1 class="only-print" i18n>Task Details</h1>
        <show-details [dataSource]="task" [secondSource]="processSnapshot">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">  
        <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial i18n>Close</button>
    </mat-dialog-actions>
    `,
})
export class TodoMassagesPopupComponent {
    // remarks = new FormControl(null);
    // massageId: number;
    processId: number;
    processType: string;
    processSnapshot =  null;
    lineData = null;
    task: any;

    poCodes;
    
    constructor(private LocalService: UserAccountService, public dialog: MatDialog, public dialogRef: MatDialogRef<TodoMassagesPopupComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any) {
        this.processId = data.allLine['processId'];
        this.processType = data.allLine['processName'];
        if(data.allLine['processSnapshot']) {
            this.processSnapshot = JSON.parse(data.allLine['processSnapshot']);
        }
    }
    
    ngOnInit() {
        this.LocalService.getTask(this.processId, this.processType).pipe(take(1)).subscribe(value => {
            this.task = value;
            if(value['poCode']) {
              this.poCodes = [value['poCode']]
            } else if(value['weightedPos']) {
              this.poCodes = value['weightedPos'].map(a => a.poCode);
            }
        });
    }

    goFullPo(num: number) {
      this.dialogRef.close(num);
    }

    onNoClick(): void {
      this.dialogRef.close('closed');
    }

    
    // public printWindow(): void { 
    //     let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
    //     virtualWindow.document.write('<html><head><title>Print</title>');
    //     virtualWindow.document.write('</head><body>' + document.getElementById('print-section-task').innerHTML + '</body></html>');
    //     virtualWindow.document.close();
    //     virtualWindow.focus();
    //     setTimeout(t => { virtualWindow.print();
    //     virtualWindow.close(); }, 1000);
    // //   document.getElementById("section-to-print").setAttribute("id", "newDivId");
    //   window.print();
    // //   document.getElementById("newDivId").setAttribute("id", "section-to-print");
    // }
    
    
}
