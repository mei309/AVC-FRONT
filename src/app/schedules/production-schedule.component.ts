import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { SchedulesService } from './schedules.service';


@Component({
  selector: 'production-schedule',
  template: `
  <h1 style="text-align:center">
    Production schedule
  </h1>
  `,
})
export class ProductionScheduleComponent implements OnInit, OnDestroy {

  destroySubject$: Subject<void> = new Subject();

  supplySource: Supllier[];
  columnsSchedule: OneColumn[] = [
    {
      name: 'Supplier',
      titel: 'Supplier',
      type: 'normal',
    },
    {
      name: 'PO',
      titel: 'PO',
      type: 'normal',
    },
    {
      name: 'Product name',
      titel: 'Product name',
      type: 'normal',
    },
    {
      name: 'Amount',
      titel: 'Amount',
      type: 'normal',
    },
    {
      name: 'Delivery date',
      titel: 'Delivery date',
      type: 'date',
    },
    {
      name: 'Staff incharged',
      titel: 'Staff incharged',
      type: 'normal',
    },
  ];
  constructor(private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog, private localService: SchedulesService) {
  }

  ngOnInit() {
    this.localService.getCashewOrdersOpen().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
      this.supplySource = <Supllier[]>value;
    });
  }

  openDialog(value: any): void {
    // tslint:disable-next-line: no-use-before-declare
    /**const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
      width: '80%',
      height: '80%',
      data: {id: '3', fromNew: false},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'closed') {
        } else {
          this.router.navigate(['../NewSupplier/edit'], { relativeTo: this._Activatedroute });
        }
    });*/
  }


  ngOnDestroy() {
        this.destroySubject$.next();
      }

}

export interface Supllier {
  CompanyID: number;
  Name: string;
  IsActive: number;
}

