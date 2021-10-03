import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take } from 'rxjs';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { PlanScheduleService } from './plan-schedule.service';
import { cloneDeep } from 'lodash-es';
@Component({
  selector: 'plan-schedule',
  template: `
  <h1 style="text-align:center">Plan production</h1>
  <div cdkDropListGroup >
    <mat-grid-list cols="21" rowHeight="40px">
      <mat-grid-tile colspan="1"></mat-grid-tile>
      <mat-grid-tile colspan="2">Sunday</mat-grid-tile>
      <mat-grid-tile colspan="4">Monday</mat-grid-tile>
      <mat-grid-tile colspan="4">Tuesday</mat-grid-tile>
      <mat-grid-tile colspan="4">Wednesday</mat-grid-tile>
      <mat-grid-tile colspan="4">Thursday</mat-grid-tile>
      <mat-grid-tile colspan="2">Friday</mat-grid-tile>

      <mat-grid-tile colspan="1"></mat-grid-tile>
      <mat-grid-tile colspan="2">Night</mat-grid-tile>
      <mat-grid-tile colspan="2">Day</mat-grid-tile>
      <mat-grid-tile colspan="2">Night</mat-grid-tile>
      <mat-grid-tile colspan="2">Day</mat-grid-tile>
      <mat-grid-tile colspan="2">Night</mat-grid-tile>
      <mat-grid-tile colspan="2">Day</mat-grid-tile>
      <mat-grid-tile colspan="2">Night</mat-grid-tile>
      <mat-grid-tile colspan="2">Day</mat-grid-tile>
      <mat-grid-tile colspan="2">Night</mat-grid-tile>
      <mat-grid-tile colspan="2">Day</mat-grid-tile>

      <ng-container *ngFor="let line of productionLinesList">
        <mat-grid-tile colspan="1" rowspan="3">{{line.label}}</mat-grid-tile>
        <mat-grid-tile *ngFor="let em of line.rowArray | keyvalue" colspan="2" rowspan="3">
          <div class="example-parent-scroll" cdkScrollable>
            <div cdkDropList [cdkDropListData]="em.value" (cdkDropListDropped)="drop($event, line.type)" class="example-list-line">
              <div [cdkDragData]="item" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.poCode)" [ngStyle]="{'background-color':item.poCode === localCheck ? 'red' : 'white' }" *ngFor="let item of em.value" cdkDrag class="example-line">
                <span>{{item.name}} </span><span>{{item.poCode}} </span><span>{{item.amount}}</span>
              </div>
              <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="em.value.length === 0">empty list ...</button>
            </div>
          </div>
        </mat-grid-tile>
      </ng-container>

    </mat-grid-list>


    <div *ngFor="let process of processList" class="example-container" >
      <h2>{{process.title}}</h2>
      <div cdkDropList [cdkDropListData]="dictionary[process.type]" class="example-list" (cdkDropListDropped)="drop($event, process.type)">
        <div [cdkDragData]="item" (mouseout)="setLocalCheck('')" (mouseover)="setLocalCheck(item.poCode)" [ngStyle]="{'background-color':item.poCode === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of dictionary[process.type]" cdkDrag>
          <span>{{item.name}}</span>
          <span>{{item.poCode}}</span>
          <mat-form-field style="width:80px">
            <input matInput type="number" (focus)="setLocalLimit(item.amount)" (keyup)="valideta(item, $event)" (blur)="onChange(item, $event, process.type)" placeholder="Amount" [(ngModel)]="item.amount">
          </mat-form-field>
        </div>
        <button mat-button [ngStyle]="{'color': 'red'}" *ngIf="dictionary[process.type].length === 0">empty list ...</button>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['cdk.css'],
})
export class PlanScheduleComponent implements OnInit, OnDestroy {



  productionLinesList = [
    {
      type: 'raw',
      label: 'Cleaning',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'clean',
      label: 'Small roaster',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'clean',
      label: 'Big roaster',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'roast',
      label: 'Hand pack',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'roast',
      label: 'Machine pack',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'pack',
      label: 'Loading',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    }
  ]

  rawList: Elemnt[] = [];
  cleanList: Elemnt[] = [];
  roastList: Elemnt[] = [];
  packList: Elemnt[] = [];

  regConfig: FieldConfig[];

  localLimit: number;
  localCheck: string;

  processList = [
    {
      title: 'Raw materiel',
      type: 'raw'
    },
    {
      title: 'Clean materiel',
      type: 'clean'
    },
    {
      title: 'Roast materiel',
      type: 'roast'
    },
    {
      title: 'Packed materiel',
      type: 'pack'
    }
  ];

  dictionary = {
    'raw': this.rawList,
    'clean': this.cleanList,
    'roast': this.roastList,
    'pack': this.packList
  };

  destroySubject$: Subject<void> = new Subject();


  constructor(public dialog: MatDialog, private localService: PlanScheduleService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.localService.getCashewInventoryRaw().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(a => {
        this.rawList.push({name: a['item'], amount: a['weightInLbs'], poCode: a['poCode'], type: 'raw'});
      });
    });
    this.localService.getCashewInventoryClean().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(a => {
        this.cleanList.push({name: a['item']['value'], amount: a['weightInLbs'], poCode: a['poCodes'], type: 'clean'});
      });
    });
  }


  // dropUsed(event: CdkDragDrop<any>, type: string) {
  //   // if(!(event.container.id).startsWith(event.previousContainer.id)) {

  //   this.drop(event);

  // }
  // dropAvailable(event: CdkDragDrop<any>) {
  //   if(!(event.previousContainer.id).startsWith(event.container.id)) {
  //     this._snackBar.open($localize`The chosen material cannot be processed in this process`, 'ok', {
  //       duration: 5000,
  //       verticalPosition:'top'
  //     });
  //     return;
  //   }
  //   this.drop(event);
  //   // this.dictionary[type].push({name: item.name, amount: this.localLimit-eve.target.value, poCode: item.poCode});
  // }
  drop(event: CdkDragDrop<any>, type: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if(type !== event.item.data.type){
      this._snackBar.open($localize`The chosen material cannot be processed in this process`, 'ok', {
        duration: 5000,
        verticalPosition:'top'
      });
      return;
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const newCopy: Elemnt = cloneDeep(event.item.data);
      this.getNext(newCopy, type);
    }
  }


  onChange(item, eve, type) {
    if(eve.target.value < this.localLimit) {
      this.dictionary[type].push({name: item.name, amount: this.localLimit-eve.target.value, poCode: item.poCode, type: type});
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

  getNext(ele: Elemnt, type: string) {
    switch (type) {
      case 'raw':
        ele.type = 'clean';
        this.cleanList.push(ele);
        break;
      case 'clean':
        ele.type = 'roast';
        this.roastList.push(ele);
        break;
      case 'roast':
        ele.type = 'pack';
        this.packList.push(ele);
        break;
      default:
        break;
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
  poCode: string;
  type: string;
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

