import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { SpecialOrdersDialogComponent } from './special-orders-dialog.component';
import { SpecialOrdersService } from './special-orders.service';

@Component({
  selector: 'app-special-orders',
  template: `
<h1 style="text-align:center">Special orders</h1>
<normal-details [dataSource]="ordersSource" [oneColumns]="columnsOrders" (details)="openDialog($event)">
</normal-details>
  `,
})
export class SpecialOrdersComponent implements OnInit, OnDestroy {

  destroySubject$: Subject<void> = new Subject();

  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};

  columnsOrders: OneColumn[] = [
    {
      name: 'Special orders',
      titel: 'Special orders',
      type: 'normal',
    },
    {
      name: 'Date',
      titel: 'Date',
      type: 'dates',
    },
    {
      name: 'Status',
      titel: 'Status',
      type: 'select',
      options: ['open', 'fufiled'],
    },
  ];

  
  
 
  
  // tslint:disable-next-line: no-use-before-declare
  ordersSource;
  
  constructor(private router: Router, public dialog: MatDialog, private localService: SpecialOrdersService, private _Activatedroute: ActivatedRoute) {
  }

  ngOnInit() {
        this.localService.getSuplliers().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
            this.ordersSource = <Supllier[]>value;
        });
  }

  openDialog(event): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(SpecialOrdersDialogComponent, {
      width: '80%',
      height: '80%',
      data: {id: '3', fromNew: false},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(data => {
        if (data === 'closed') {
            } else {
                this.router.navigate(['../NewSpecialOrder/edit'], { relativeTo: this._Activatedroute });
            }
    });
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