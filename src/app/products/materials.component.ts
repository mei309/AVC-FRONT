import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { AddProductDialogComponent } from './add-one.component';
import { ProductService } from './products.service';
@Component({
  selector: 'materials',
  template: `
  <h1 style="text-align:center">
      Materials
    </h1>
    <button mat-raised-button color="primary" (click)="openDialog()">Add</button>
    <normal-details [dataSource]="supplySource" [oneColumns]="columnsSupply">
    </normal-details>
  `,
})
export class MaterialsComponent implements OnInit, OnDestroy {

  destroySubject$: Subject<void> = new Subject();

  // tslint:disable-next-line: no-use-before-declare
  supplySource: MatTableDataSource<Supllier>;
  columnsSupply: OneColumn[] = [
    {
      name: 'Name',
      label: 'Item descrption',
      type: 'normal',
    },
    {
      name: 'phone1',
      label: 'Unit type',
      type: 'normal',
    },
    {
      name: 'phone',
      label: 'Minimal stock alert',
      type: 'normal',
    },
  ];
  constructor(private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog, private localService: ProductService) {
  }

  ngOnInit() {
    // this.localService.getSuplliers().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
    //   this.supplySource = new MatTableDataSource(<Supllier[]>value);
    // });
  }

  openDialog(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '80%',
      height: '80%',
      data: {type: 'materials'},
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

