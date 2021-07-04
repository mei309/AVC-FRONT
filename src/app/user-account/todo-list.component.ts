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
  <h1 style="text-align:center" i18n>Task center</h1>
  <date-range-select class="no-print" (submitRange)="getAllByDate($event)"></date-range-select>
  <search-details [dataSource]="tasksSource" [oneColumns]="columnsTasks" (details)="openDialog($event)">
  </search-details>
  `,
})
export class TodoListComponent {

  columnsTasks: OneColumn[] = [
      {
        name: 'title',
        label: $localize`Title`,
        search: 'normal',
      },
      {
        name: 'processType',
        label: $localize`Process type`,
        search: 'select',
        options: this.genral.getProcess(),
      },
      {
          type: 'arrayVal',
          name: 'poCodes',
          label: $localize`PO#`,
      },
      {
          type: 'arrayVal',
          name: 'suppliers',
          label: $localize`Supplier`,
          search: 'selectObj',
          options: this.genral.getSuppliersCashew(),
      },
      {
        type: 'dateTime',
        name: 'createdDate',
        label: $localize`Created date`,
        search: 'dates',
      },
      {
        name: 'modifiedBy',
        label: $localize`Modified by`,
        search: 'normal',
      },
      {
        name: 'decisionType',
        label: $localize`Decision type`,
        search: 'select',
        options: this.genral.getDecisionType(),
      },
    ];

  tasksSource: any[];
  
  dateRange;

  constructor(private genral: Genral, public dialog: MatDialog, private router: Router) {}
  
  ngOnInit() {
  }

  getAllByDate($event) {
    this.dateRange = $event;
    this.genral.getUserTasks($event).pipe(take(1)).subscribe(value => {
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
        } else if(data === 'reload') {
          this.genral.getUserTasks(this.dateRange).pipe(take(1)).subscribe(value => {
            this.tasksSource = <any[]>value;
          });
        }
      }
    });
  }
  
}