import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { SupplierDetailsDialogComponent } from './supplier-details-dialog-component';
import { SuppliersService } from './suppliers.service';
import { Genral } from '../genral.service';

@Component({
  selector: 'app-suppliers',
  template: `
  <h1 style="text-align:center">Suppliers</h1>
  <div class="centerButtons">
      <button class="raised-margin" mat-raised-button color="primary" routerLink='../NewSupplier'>New Supplier</button>
  </div>
  <search-details [dataSource]="supplySource" [oneColumns]="columnsSupply" (details)="openDialog($event)">
  </search-details>
  `,
})
export class SuppliersComponent implements OnInit {
  
  supplySource: any[];
  columnsSupply: OneColumn[];
  

  constructor(private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private localService: SuppliersService, private genral: Genral) {
  }

  ngOnInit() {
    this.localService.getSuplliers().pipe(take(1)).subscribe(value => {
      this.supplySource = <any[]>value;
    });
    this.columnsSupply = [
      {
        name: 'name',
        label: 'Name',
        search: 'normal',
      },
      {
        type: 'nameId',
        name: 'phones',
        label: 'Phone',
        search: 'normal',
      },
      {
        type: 'nameId',
        name: 'emails',
        label: 'Email',
        search: 'normal',
      },
      {
        type: 'arrayVal',
        name: 'supplyCategories',
        label: 'Supply category',
        search: 'selectAsyncObject',
        options: this.genral.getSupplyType(),
      },
    ];
  }

  openDialog(value: any): void {
    const dialogRef = this.dialog.open(SupplierDetailsDialogComponent, {
      width: '80%',
      data: {id: value['id'], fromNew: false},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data !== 'closed') {
          this.router.navigate(['../EditSupplier', {id: value['id']}], { relativeTo: this._Activatedroute });
      }
    });
  }

}

// this.columnsSupply = [
//   {
//     name: 'name',
//     titel: 'Name',
//     type: 'normal',
//   },
//   {
//     name: 'phones',
//     titel: 'Phone',
//     type: 'normal',
//     pipes: 'arrayObject',
//   },
//   {
//     name: 'emails',
//     titel: 'Email',
//     type: 'normal',
//     pipes: 'arrayObject',
//   },
//   {
//     name: 'supplyCategories',
//     titel: 'Supply category',
//     type: 'selectAsync',
//     options: this.genral.getSupplyType(),
//     pipes: 'arrayObject',
//   },
// ];
