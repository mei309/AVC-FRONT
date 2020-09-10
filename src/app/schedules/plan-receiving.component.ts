import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { SchedulesService } from './schedules.service';

@Component({
  selector: 'plan-receiving',
  template: `
  <h1 style="text-align:center">
    Plan receiving
  </h1>

  <div cdkDropListGroup >
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

	<!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

	<!-- Position Column -->
	<ng-container matColumnDef="position">
		<th mat-header-cell *matHeaderCellDef> No. </th>
		<td mat-cell *matCellDef="let element"> {{element.position}} </td>
	</ng-container>

	<!-- Name Column -->
	<ng-container matColumnDef="name">
		<th mat-header-cell *matHeaderCellDef> Name </th>
		<td mat-cell *matCellDef="let element"> {{element.name}} </td>
	</ng-container>

	<!-- Weight Column -->
	<ng-container matColumnDef="weight">
		<th mat-header-cell *matHeaderCellDef> Weight </th>
		<td mat-cell *matCellDef="let element"> {{element.weight}} </td>
	</ng-container>

	<!-- Symbol Column -->
	<ng-container matColumnDef="symbol">
		<th mat-header-cell *matHeaderCellDef> Symbol </th>
		<td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
	</ng-container>

	<!-- analytical_Function Column -->
	<ng-container matColumnDef="analytical_Function" >
		<th mat-header-cell *matHeaderCellDef> analytical_Function </th>
		<td mat-cell *matCellDef="let element">
			<div cdkDropList [cdkDropListData]="element.analytical_Function" (cdkDropListDropped)="drop($event)">
        <div *ngFor="let item of element.analytical_Function" cdkDrag>
          <button mat-button  color="primary">{{item.name}}</button>
          <mat-form-field style="width:90%">
            <input matInput placeholder="Amount" [value]="item.amount" [(ngModel)]="item.amount">
          </mat-form-field>
        </div>
        <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element.analytical_Function.length === 0">empty list ...</button>
      </div>
		</td>
	</ng-container>


  <!-- Symbol Column -->
	<ng-container matColumnDef="sum">
		<th mat-header-cell *matHeaderCellDef> Sum </th>
		<td mat-cell *matCellDef="let element">
      {{calculateMealTotal(element.analytical_Function)}}
    </td>
	</ng-container>
  

	<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
	<tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<div class="example-container" >
  <h2>To do</h2>

  <div
    cdkDropList
    [cdkDropListData]="todo"
    class="example-list"
    (cdkDropListDropped)="drop($event)">
    <div class="example-box" *ngFor="let item of todo" cdkDrag>
      <button mat-button  color="primary">{{item.name}}</button>
      <mat-form-field>
        <input matInput placeholder="Amount" [value]="item.amount" [(ngModel)]="item.amount">
      </mat-form-field>
    </div>
    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
  </div>
</div>
</div>
  `,
  // styleUrls: ['cdk.css'],
})
export class PlanReceivingComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'analytical_Function', 'sum'];
  dataSource = ELEMENT_DATA;

  todo: Elemnt[] = [{name: 'ggg', amount: 3}, {name: 'hhh', amount: 74}]; 
  


  destroySubject$: Subject<void> = new Subject();

  supplySource: Supllier[];
  columnsSchedule: OneColumn[] = [
    {
      name: 'Supplier',
      label: 'Supplier',
      type: 'normal',
    },
    {
      name: 'PO',
      label: 'PO',
      type: 'normal',
    },
    {
      name: 'Product name',
      label: 'Product name',
      type: 'normal',
    },
    {
      name: 'Amount',
      label: 'Amount',
      type: 'normal',
    },
    {
      name: 'Delivery date',
      label: 'Delivery date',
      type: 'date',
    },
    {
      name: 'Staff incharged',
      label: 'Staff incharged',
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
calculateMealTotal(products: Elemnt[]): number {
  return products.reduce((acc, product) => acc + product.amount, 0)
}

drop(event: CdkDragDrop<any>) {
  console.log(event);
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

    }
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


const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', analytical_Function: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}] },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', analytical_Function: [{name: 'function6', amount: 8}] },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', analytical_Function: [{name: 'function14', amount: 3}, {name: 'function17', amount: 9}] },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', analytical_Function: [] },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', analytical_Function: [{name: 'function1', amount: 3}] },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', analytical_Function: [{name: 'function155', amount: 3}] },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', analytical_Function: [{name: 'function1', amount: 3}] },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', analytical_Function: [] },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', analytical_Function: [] },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', analytical_Function: [{name: 'function51', amount: 3}, {name: 'function81', amount: 66}] },
];


export interface Elemnt {
  name: string;
  amount: number;
}
export interface PeriodicElement {
  name?: string;
  position?: number;
  weight?: number;
  symbol?: string;
  analytical_Function: Elemnt[];
}



