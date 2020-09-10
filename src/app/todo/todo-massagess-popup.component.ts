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
    <button class="example-icon" mat-mini-fab (click)="printWindow()" style="float: right;">
      <mat-icon>print</mat-icon>
    </button>
    <h1 mat-dialog-title id="print">
      Task Details
    </h1>
    <mat-dialog-content>
      <show-details [dataSource]="task" [secondSource]="processSnapshot" id="print-child">
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


    // <mat-form-field class="one-field">
    //         <textarea autocomplete="chrome-off" matInput [formControl]="remarks" placeholder="Remarks"></textarea>
    //     </mat-form-field>
    //     <button class="raised-margin" mat-raised-button color="accent" (click)="confirm()">Confirm</button>       
    //     <button class="raised-margin" mat-raised-button color="accent" (click)="reject()">Reject</button>
    // confirm() {
    //   var dialogConfirm = this.dialog.open(ConfirmationDialog, {
    //     data: {
    //       confirmMessage: 'Are you sure you want to confirm?',
    //     },
    //   });
    //   dialogConfirm.afterClosed().subscribe(result => {
    //     if(result) {
    //       const remarkSnapshot = {snapshot: this.task, remarks: this.remarks.value};
    //       remarkSnapshot['id'] = this.task['id'];
    //       if(result['toLock']) {
    //         remarkSnapshot['toLock'] = true;
    //       }
    //       if(result['toFinal']) {
    //         remarkSnapshot['toFinal'] = true;
    //       }
            
    //       // } else {
    //       //   this.LocalService.setApprovale(this.massageId, 'APPROVED' , remarkSnapshot).pipe(take(1)).subscribe(value => {
    //       //     this.dialogRef.close({status: 'APPROVED', processSnapshot: this.task});
    //       //   });
    //       // }
    //       this.LocalService.approveTaskAndManagment(this.massageId, 'APPROVED' , remarkSnapshot).pipe(take(1)).subscribe(value => {
    //         this.dialogRef.close({status: 'APPROVED', processSnapshot: this.task});
    //       });
    //     }
    //     dialogConfirm = null;
    //   });
    // }

    // confirmPlusManagment(manage: string) {
    //   const remarkSnapshot = {snapshot: this.task, remarks: this.remarks.value, id: this.task['id']};
    //   this.LocalService.setApprovale(this.massageId, 'APPROVED' , remarkSnapshot).pipe(take(1)).subscribe(value => {
    //     this.dialogRef.close({status: 'APPROVED', processSnapshot: this.lineData});
    //   });
    // }
    
    // reject() {
    //   var dialogConfirm = this.dialog.open(ConfirmationDialog, {
    //     data: {
    //       confirmMessage: 'Are you sure you want to decline?',
    //       type: 'reject',
    //     },
    //   });
    //   dialogConfirm.afterClosed().subscribe(result => {
    //     if(result) {
    //       const remarkSnapshot = {snapshot: this.task, remarks: this.remarks.value};
    //       remarkSnapshot['id'] = this.task['id'];
    //       if(result['toCancal']) {
    //         remarkSnapshot['toCancal'] = true;
    //       }
    //       // if(result['toFinal']) {
    //       //   remarkSnapshot['toFinal'] = true;
    //       // }
    //       this.LocalService.approveTaskAndManagment(this.massageId, 'DECLINED' , remarkSnapshot).pipe(take(1)).subscribe(value => {
    //         this.dialogRef.close({status: 'DECLINED', processSnapshot: this.task});
    //       });
    //       // if(result['mainLock']) {
    //       //   remarkSnapshot['id'] = this.task['id'];
    //       //   remarkSnapshot['lockType'] = result['mainLock'];
    //       //   this.LocalService.approveTaskAndManagment(this.massageId, 'DECLINED' , remarkSnapshot).pipe(take(1)).subscribe(value => {
    //       //     this.dialogRef.close({status: 'DECLINED', processSnapshot: this.task});
    //       //   });
    //       // } else {
    //       //   this.LocalService.setApprovale(this.massageId, 'DECLINED', remarkSnapshot).pipe(take(1)).subscribe(value => {
    //       //     this.dialogRef.close({status: 'DECLINED', data: this.lineData});
    //       //   });
    //       // }
    //     }
    //     dialogConfirm = null;
    //   });
    // }

    goFullPo() {
      this.dialogRef.close('fullDetails');
    }

    onNoClick(): void {
      this.dialogRef.close('closed');
    }

    
    public printWindow(): void { 
      document.getElementById("section-to-print").setAttribute("id", "newDivId");
      window.print();
      document.getElementById("newDivId").setAttribute("id", "section-to-print");
    }
    
    
}
