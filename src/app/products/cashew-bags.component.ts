import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { AddProductDialogComponent } from './add-one.component';
import { ProductService } from './products.service';
@Component({
  selector: 'cashew-bags',
  template: `
  <h1 style="text-align:center">
      Cashew bags
    </h1>
    <button mat-raised-button color="primary" (click)="openDialog()">Add</button>
  `,
})
export class CashewBagsComponent implements OnInit, OnDestroy {

  destroySubject$: Subject<void> = new Subject();

  // tslint:disable-next-line: no-use-before-declare
  supplySource;
  columnsSupply: OneColumn[] = [
    {
      name: 'Name',
      titel: 'Bag code',
      type: 'normal',
    },
    {
      name: 'phone',
      titel: 'Item type',
      type: 'select',
      options: ['Whole', 'pieces'],
    },
    {
      name: 'phone1',
      titel: 'Toffe',
      type: 'select',
      options: ['yes', 'no'],
    },
    {
      name: 'phone2',
      titel: 'Roasted',
      type: 'select',
      options: ['yes', 'no'],
    },
    {
      name: 'phone3',
      titel: 'Salted',
      type: 'select',
      options: ['yes', 'no', 'less'],
    },
    {
      name: 'Email1',
      titel: 'Unit weight',
      type: 'normal',
    },
    {
      name: 'Email2',
      titel: 'Defult per case',
      type: 'normal',
    },
    {
      name: 'Email3',
      titel: 'Image',
      type: 'normal',
    },
  ];
  constructor(private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog, private localService: ProductService) {
  }

  ngOnInit() {
    // this.localService.getSuplliers().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
    //   this.supplySource = <Supllier[]>value;
    // });
  }

  openDialog(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '80%',
      height: '80%',
      data: {type: 'cashew'},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== 'closed') {
          this.router.navigate(['../NewSupplier/edit'], { relativeTo: this._Activatedroute });
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

