import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { TodoMassagesPopupComponent } from './todo-massagess-popup.component';

@Component({
  selector: 'todo-list',
  template: `
  <h1 style="text-align:center">
    Task center
  </h1>
  <search-details [dataSource]="tasksSource" [oneColumns]="columnsTasks" (details)="openDialog($event)">
  </search-details>
  `,
})
export class TodoListComponent {

  columnsTasks: OneColumn[] = [
      {
        name: 'title',
        label: 'Title',
        search: 'normal',
      },
      {
        name: 'processType',
        label: 'Process type',
        search: 'select',
        options: this.genral.getProcess(),
      },
      {
          type: 'arrayVal',
          name: 'poCodes',
          label: 'PO#',
      },
      {
          type: 'arrayVal',
          name: 'suppliers',
          label: 'Supplier',
          search: 'selectAsyncObject',
          options: this.genral.getSuppliersCashew(),
      },
      {
        type: 'dateTime',
        name: 'createdDate',
        label: 'Created date',
        search: 'dates',
      },
      {
        name: 'modifiedBy',
        label: 'Modified by',
        search: 'normal',
      },
      {
        name: 'decisionType',
        label: 'Decision type',
        search: 'select',
        options: this.genral.getDecisionType(),
      },
    ];

  tasksSource: any[];
  

  constructor(private genral: Genral, public dialog: MatDialog, private router: Router) {}
  
  ngOnInit() {
    this.genral.getUserTasks().pipe(take(1)).subscribe(value => {
      this.tasksSource = <any[]>value;
    });
  }

  
  openDialog($event: any): void {
    const dialogRef = this.dialog.open(TodoMassagesPopupComponent, {
      width: '80%',
      data: {
        allLine: $event,
      },
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        if(typeof data == 'number') {
          this.router.navigate(['Main/reports/FullPoReport',{poCode: data}]);
        }
      }
    });
  }
  
}