import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { TodoMassagesService } from './massages-todo.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-massages-todo-popup',
    template: `
    <button mat-raised-button color="accent" (click)="goFullPo()" style="float: right;">Go to full PO# details</button>
    <button printTitle="Task Details" [useExistingCss]="true" printSectionId="print-section-task" ngxPrint class="example-icon" mat-mini-fab style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title>Task Details</h1>
    <mat-dialog-content id="print-section-task">
        <h1 class="only-print">Task Details</h1>
        <show-details [dataSource]="task" [secondSource]="processSnapshot">
        </show-details>
    </mat-dialog-content>
    <mat-dialog-actions align="end">  
        <button class="raised-margin" mat-raised-button color="accent" (click)="onNoClick()" cdkFocusInitial>Close</button>
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
    
    constructor(private LocalService: TodoMassagesService, private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog, public dialogRef: MatDialogRef<TodoMassagesPopupComponent>,
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
        });
    }

    goFullPo() {
      this.dialogRef.close('fullDetails');
    }

    onNoClick(): void {
      this.dialogRef.close('closed');
    }

    
    // public printWindow(): void { 
    //   <button class="example-icon" mat-mini-fab (click)="printWindow()" style="float: right;">
    //   <mat-icon>print</mat-icon>
    // </button>
    // <h1 mat-dialog-title id="print">
    //   Task Details
    // </h1>
    // <mat-dialog-content>
    //   <show-details [dataSource]="task" [secondSource]="processSnapshot" id="print-child">
    //   </show-details>
    // </mat-dialog-content>
        // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800'); 
        // virtualWindow.document.write('<html><head><title>Print</title>');
        // virtualWindow.document.write('</head><body>' + document.getElementById('mmss').innerHTML + '</body></html>');
        // virtualWindow.document.close();
        // virtualWindow.focus();
        // setTimeout(t => { virtualWindow.print();
        // virtualWindow.close(); }, 1000);
    //   document.getElementById("section-to-print").setAttribute("id", "newDivId");
    //   window.print();
    //   document.getElementById("newDivId").setAttribute("id", "section-to-print");
    // }
    
    
}
