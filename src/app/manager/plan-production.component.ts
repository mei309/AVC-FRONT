import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ManagerService } from './manager.service';
@Component({
  selector: 'plan-production',
  template: `
  <h1 style="text-align:center">
    Plan production
  </h1>
<mat-horizontal-stepper [linear]="true" #stepper>
  <mat-step label="Orders and productivty">
    <div class="form">
        <dynamic-form [fields]="regConfig" (submit)="goNext($event)" (cancel)="cancel()">
        </dynamic-form>
    </div>
  </mat-step>
  <mat-step label="Workforce">
    <table mat-table [dataSource]="dataSource2" class="mat-elevation-z8">
        <ng-container matColumnDef="day">
          <th mat-header-cell *matHeaderCellDef> Day </th>
          <td mat-cell *matCellDef="let element"> {{element.day}} </td>
        </ng-container>
        <ng-container [matColumnDef]="column" *ngFor="let column of displayedWorkforce">
          <th mat-header-cell *matHeaderCellDef> {{column}} </th>
          <td mat-cell *matCellDef="let element"> 
            <mat-form-field style="width:90%">
              <input matInput [value]="element[column]" [(ngModel)]="element[column]">
            </mat-form-field>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="realDisplayedWorkforce"></tr>
        <tr mat-row *matRowDef="let row; columns: realDisplayedWorkforce;"></tr>
    </table>
  </mat-step>
  <mat-step label="Plan amounts">
      <div cdkDropListGroup >
        <table mat-table [dataSource]="dataSource1" class="mat-elevation-z8">
          <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns1">
            <th mat-header-cell *matHeaderCellDef> {{column}} </th>
            <td mat-cell *matCellDef="let element"> {{element[column]}} </td>
          </ng-container>
          <!-- analytical_Function Column -->
          <ng-container matColumnDef="analytical_Function" >
            <th mat-header-cell *matHeaderCellDef> analytical_Function </th>
            <td mat-cell *matCellDef="let element">
              <div cdkDropList [cdkDropListData]="element.analytical_Function" (cdkDropListDropped)="drop($event)" class="example-list">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element.analytical_Function" cdkDrag class="example-box">
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field style="width:90%">
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element.analytical_Function.length === 0">empty list ...</button>
              </div>
            </td>
          </ng-container>
          <!-- Sum Column -->
          <ng-container matColumnDef="sum">
            <th mat-header-cell *matHeaderCellDef> Sum </th>
            <td mat-cell *matCellDef="let element">
              {{calculateTotal(element.analytical_Function)}}
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="realDisplayedColumns1"></tr>
          <tr mat-row *matRowDef="let row; columns: realDisplayedColumns1;"></tr>
        </table>

        <div class="example-container" >
          <h2>To do</h2>
          <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
            <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag>
              <button mat-button  color="primary">{{item.name}}</button>
              <mat-form-field>
                <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
              </mat-form-field>
            </div>
            <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
          </div>
        </div>
      </div>
    </mat-step>
    <mat-step label="plan">
      <mat-tab-group >
        <mat-tab label="Plan cleaning">
          <div cdkDropListGroup >
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
              <ng-container matColumnDef="days">
                <th mat-header-cell *matHeaderCellDef> Days </th>
                <td mat-cell *matCellDef="let element"> {{element.days}} </td>
              </ng-container>
              <!-- analytical_Function Column -->
              <ng-container [matColumnDef]="column" *ngFor="let column of cleaningColumns">
                <th mat-header-cell *matHeaderCellDef> {{column}} </th>
                <td mat-cell *matCellDef="let element">
                  <div cdkDropList [cdkDropListData]="element[column]" (cdkDropListDropped)="drop($event)" class="example-list">
                    <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element[column]" cdkDrag class="example-box">
                      <button mat-button  color="primary">{{item.name}}</button>
                      <mat-form-field style="width:90%">
                        <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                      </mat-form-field>
                    </div>
                    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element[column].length === 0">empty list ...</button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="realCleaningColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: realCleaningColumns;"></tr>
            </table>
            <div class="example-container" >
              <h2>To do</h2>
              <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag>
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field>
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Plan roasting">
          <div cdkDropListGroup >
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
              <ng-container matColumnDef="days">
                <th mat-header-cell *matHeaderCellDef> Days </th>
                <td mat-cell *matCellDef="let element"> {{element.days}} </td>
              </ng-container>
              <!-- analytical_Function Column -->
              <ng-container [matColumnDef]="column" *ngFor="let column of roasterColumns">
                <th mat-header-cell *matHeaderCellDef> {{column}} </th>
                <td mat-cell *matCellDef="let element">
                  <div cdkDropList [cdkDropListData]="element[column]" (cdkDropListDropped)="drop($event)">
                    <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element[column]" cdkDrag>
                      <button mat-button  color="primary">{{item.name}}</button>
                      <mat-form-field style="width:90%">
                        <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                      </mat-form-field>
                    </div>
                    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element[column].length === 0">empty list ...</button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="realRoasterColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: realRoasterColumns;"></tr>
            </table>
            <div class="example-container" >
              <h2>To do</h2>
              <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)" class="example-list">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag class="example-box">
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field>
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Plan packing">
          <div cdkDropListGroup >
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
              <ng-container matColumnDef="days">
                <th mat-header-cell *matHeaderCellDef> Days </th>
                <td mat-cell *matCellDef="let element"> {{element.days}} </td>
              </ng-container>
              <!-- analytical_Function Column -->
              <ng-container [matColumnDef]="column" *ngFor="let column of packColumns">
                <th mat-header-cell *matHeaderCellDef> {{column}} </th>
                <td mat-cell *matCellDef="let element">
                  <div cdkDropList [cdkDropListData]="element[column]" (cdkDropListDropped)="drop($event)" class="example-list">
                    <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element[column]" cdkDrag class="example-box">
                      <button mat-button  color="primary">{{item.name}}</button>
                      <mat-form-field style="width:90%">
                        <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                      </mat-form-field>
                    </div>
                    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element[column].length === 0">empty list ...</button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="realPackColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: realPackColumns;"></tr>
            </table>
            <div class="example-container" >
              <h2>To do</h2>
              <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag>
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field>
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Plan loading">
          <div cdkDropListGroup >
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
              <ng-container matColumnDef="days">
                <th mat-header-cell *matHeaderCellDef> Days </th>
                <td mat-cell *matCellDef="let element"> {{element.days}} </td>
              </ng-container>
              <!-- analytical_Function Column -->
              <ng-container [matColumnDef]="column" *ngFor="let column of loadingColumns">
                <th mat-header-cell *matHeaderCellDef> {{column}} </th>
                <td mat-cell *matCellDef="let element">
                  <div cdkDropList [cdkDropListData]="element[column]" (cdkDropListDropped)="drop($event)" class="example-list">
                    <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element[column]" cdkDrag class="example-box">
                      <button mat-button  color="primary">{{item.name}}</button>
                      <mat-form-field style="width:90%">
                        <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                      </mat-form-field>
                    </div>
                    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element[column].length === 0">empty list ...</button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="realLoadingColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: realLoadingColumns;"></tr>
            </table>
            <div class="example-container" >
              <h2>To do</h2>
              <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag>
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field>
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Final plan">
          <div cdkDropListGroup >
            <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
              <ng-container matColumnDef="days">
                <th mat-header-cell *matHeaderCellDef> Days </th>
                <td mat-cell *matCellDef="let element"> {{element.days}} </td>
              </ng-container>
              <!-- analytical_Function Column -->
              <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns">
                <th mat-header-cell *matHeaderCellDef> {{column}} </th>
                <td mat-cell *matCellDef="let element">
                  <div cdkDropList [cdkDropListData]="element[column]" (cdkDropListDropped)="drop($event)" class="example-list">
                    <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" *ngFor="let item of element[column]" cdkDrag class="example-box">
                      <button mat-button  color="primary">{{item.name}}</button>
                      <mat-form-field style="width:90%">
                        <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                      </mat-form-field>
                    </div>
                    <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="element[column].length === 0">empty list ...</button>
                  </div>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="realDisplayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: realDisplayedColumns;"></tr>
            </table>
            <div class="example-container" >
              <h2>To do</h2>
              <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">
                <div (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.name)" [ngStyle]="{'background-color':item.name === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of todo" cdkDrag>
                  <button mat-button  color="primary">{{item.name}}</button>
                  <mat-form-field>
                    <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event)" placeholder="Amount" [(ngModel)]="item.amount">
                  </mat-form-field>
                </div>
                <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="todo.length === 0">empty list ...</button>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-step>
  </mat-horizontal-stepper>
  `,
  styleUrls: ['cdk.css'],
})
export class PlanProductionComponent implements OnInit, OnDestroy {

  @ViewChild('stepper', {static: false}) private myStepper: MatStepper;

  displayedColumns: string[] = ['cleaning', 'smallRoaster', 'bigRoaster', 'handPack', 'machinePack', 'loading'];
  realDisplayedColumns: string[] = ['days', 'cleaning', 'smallRoaster', 'bigRoaster', 'handPack', 'machinePack', 'loading'];
  cleaningColumns: string[] = ['cleaning'];
  realCleaningColumns: string[] = ['days', 'cleaning'];
  roasterColumns: string[] = ['smallRoaster', 'bigRoaster'];
  realRoasterColumns: string[] = ['days', 'smallRoaster', 'bigRoaster'];
  packColumns: string[] = ['handPack', 'machinePack'];
  realPackColumns: string[] = ['days', 'handPack', 'machinePack'];
  loadingColumns: string[] = ['loading'];
  realLoadingColumns: string[] = ['days', 'loading'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['bag', 'orders', 'previous', 'previousPlan'];
  realDisplayedColumns1: string[] = ['bag', 'orders', 'previous', 'previousPlan', 'analytical_Function', 'sum'];
  dataSource1 = ELEMENT_DATA1;


  displayedWorkforce: string[] = ['workforceDay', 'workforceNight', 'countinerLimt', 'workingTime'];
  realDisplayedWorkforce: string[] = ['day', 'workforceDay', 'workforceNight', 'countinerLimt', 'workingTime'];
  dataSource2 = ELEMENT_DATA2;
  
  todo: Elemnt[] = [{name: 'ggg', amount: 3}, {name: 'hhh', amount: 74}]; 
  
  regConfig: FieldConfig[];

  localLimit: number;
  localCheck: string;

  destroySubject$: Subject<void> = new Subject();

  
  constructor(private _Activatedroute: ActivatedRoute, private router: Router, public dialog: MatDialog, private localService: ManagerService,
    private location: Location, private genral: Genral) {
  }

  ngOnInit() {
    this.regConfig = [
            {
                type: 'select',
                label: 'Special orders',
                name: 'weightThhype',
                inputType: 'multiple',
                options: this.genral.getCountries(),
            },
            {
                type: 'date',
                label: 'From date',
                name: 'degliveryDate',
                value: new Date(),
            },
            {
                type: 'date',
                label: 'To date',
                name: 'deliveryDate',
                value: new Date(),
            },
            {
                type: 'bigexpand',
                label: 'Shift productivty',
                name: 'ggg',
                collections: [
                    {
                        type: 'select',
                        label: 'Line',
                        name: 'weightType',
                        options: this.genral.getCountries(),
                    },
                    {
                        type: 'input',
                        label: 'Number of workers',
                        name: 'EC1',
                        inputType: 'number'
                    },
                    {
                        type: 'input',
                        label: 'Productivty',
                        name: 'EhC1',
                        inputType: 'number'
                    },
                    {
                        type: 'divider',
                        inputType: 'divide'
                    },
                ]
            },
            {
                type: 'button',
                label: 'Submit',
                name: 'submit',
            }
        ];
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  goNext(value) {
        this.myStepper.next();
    }

    cancel() {
        this.location.back();
       }

  onChange(item, eve) {
    if(eve.target.value < this.localLimit) {
      this.todo.push({name: item.name, amount: this.localLimit-eve.target.value})
    }
  }

  valideta(item, eve) {
    if(eve.target.value > this.localLimit) {
      item.amount = this.localLimit;
    }
  }

  setLocalCheck(item: string) {
    this.localCheck = item;
  }
  
  setLocalLimit(item: number) {
    this.localLimit = item;
  }
  calculateTotal(products: Elemnt[]): number {
    return products.reduce((acc, product) => acc + product.amount, 0)
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


const ELEMENT_DATA: ProductionList[] = [
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}]},
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}] },
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}] },
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}] },
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}] },
  { days: 'sun', cleaning: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], smallRoaster: [{name: 'function2', amount: 4}], bigRoaster: [{name: 'function2', amount: 4}], handPack: [{name: 'function2', amount: 4}], machinePack: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}], loading: [{name: 'function2', amount: 4}] },
];

const ELEMENT_DATA1: PeriodicElement[] = [
  { bag: 1, orders: 'Hydrogen', previous: 1.0079, previousPlan: 'H', analytical_Function: [{name: 'function1', amount: 3}, {name: 'function2', amount: 4}] },
  { bag: 2, orders: 'Helium', previous: 4.0026, previousPlan: 'He', analytical_Function: [{name: 'function6', amount: 8}] },
  { bag: 3, orders: 'Lithium', previous: 6.941, previousPlan: 'Li', analytical_Function: [{name: 'function14', amount: 3}, {name: 'function17', amount: 9}] },
  { bag: 4, orders: 'Beryllium', previous: 9.0122, previousPlan: 'Be', analytical_Function: [] },
  { bag: 5, orders: 'Boron', previous: 10.811, previousPlan: 'B', analytical_Function: [{name: 'function1', amount: 3}] },
  { bag: 6, orders: 'Carbon', previous: 12.0107, previousPlan: 'C', analytical_Function: [{name: 'function155', amount: 3}] },
  { bag: 7, orders: 'Nitrogen', previous: 14.0067, previousPlan: 'N', analytical_Function: [{name: 'function1', amount: 3}] },
  { bag: 8, orders: 'Oxygen', previous: 15.9994, previousPlan: 'O', analytical_Function: [] },
  { bag: 9, orders: 'Fluorine', previous: 18.9984, previousPlan: 'F', analytical_Function: [] },
  { bag: 10, orders: 'Neon', previous: 20.1797, previousPlan: 'Ne', analytical_Function: [{name: 'function51', amount: 3}, {name: 'function81', amount: 66}] },
];

const ELEMENT_DATA2: Workforce[] = [
  {day: 'sun', workforceDay: 5, workforceNight: 5, countinerLimt: 5, workingTime: 6},
]
export interface PeriodicElement {
  bag?: number;
  orders?: string;
  previous?: number;
  previousPlan?: string;
  analytical_Function: Elemnt[];
}

export interface Elemnt {
  name: string;
  amount: number;
}
export interface ProductionList {
  days: string;
  cleaning: Elemnt[];
  smallRoaster: Elemnt[];
  bigRoaster: Elemnt[];
  handPack: Elemnt[];
  machinePack: Elemnt[];
  loading: Elemnt[];
}

export interface Workforce {
  day: string; workforceDay: number; workforceNight: number; countinerLimt: number; workingTime: number;
}

