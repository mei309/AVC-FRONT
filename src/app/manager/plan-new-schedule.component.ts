import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take } from 'rxjs';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { PlanScheduleService } from './plan-schedule.service';
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
                <span>{{item.item}} </span><span>{{item.poCode}} </span><span>{{item.amount}}</span>
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
          <span>{{item.item}}</span>
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
      type: 'Raw',
      label: 'Cleaning',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'Clean',
      label: 'Small roaster',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'Clean',
      label: 'Big roaster',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'Roast',
      label: 'Hand pack',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'Roast',
      label: 'Machine pack',
      rowArray: {sunn: [], mond: [], monn: [], thed: [], then: [], wedd: [], wedn: [], thud: [], thun: [], fri: []}
    },
    {
      type: 'Pack',
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
      type: 'Raw'
    },
    {
      title: 'Clean materiel',
      type: 'Clean'
    },
    {
      title: 'Roast materiel',
      type: 'Roast'
    },
    {
      title: 'Packed materiel',
      type: 'Pack'
    }
  ];

  dictionary = {
    'Raw': this.rawList,
    'Clean': this.cleanList,
    'Roast': this.roastList,
    'Pack': this.packList
  };

  destroySubject$: Subject<void> = new Subject();


  constructor(public dialog: MatDialog, private localService: PlanScheduleService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.localService.getCashewInventoryRaw().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(a => {
        this.rawList.push({item: a['item'], amount: a['weightInLbs'], poCode: a['poCode'], type: 'Raw'});
      });
    });
    this.localService.getCashewInventoryClean().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(a => {
        this.cleanList.push({item: a['item']['value'], amount: a['weightInLbs'], poCode: a['poCodes'], type: 'Clean'});
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
      // const newCopy: Elemnt = cloneDeep();
      this.getNext(event.item.data);
    }
  }


  onChange(item, eve, type) {
    if(eve.target.value < this.localLimit) {
      this.dictionary[type].push({item: item.item, amount: this.localLimit-eve.target.value, poCode: item.poCode, type: type});
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

  getNext(ele: Elemnt) {
    const dialogRef = this.dialog.open(PlanScheduleDialogComponent, {
      width: '80%',
      height: '80%',
      data: {item: ele, type: this.getNextType(ele.type)},
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data && data !== 'closed'){
        data.type = this.getNextType(ele.type);
        data.item = data.item.value;
        data.poCode = ele.poCode;
        switch (ele.type) {
          case 'Raw':
            this.cleanList.push(data);
            break;
          case 'Clean':
            this.roastList.push(data);
            break;
          case 'Roast':
            this.packList.push(data);
            break;
          default:
            break;
        }
      }
    });
  }
  getNextType(type: string){
    switch (type) {
      case 'Raw':
        return 'Clean';
      case 'Clean':
        return 'Roast';
      case 'Roast':
        return 'Pack';
    }
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}


export interface Elemnt {
  item: string;
  amount: number;
  poCode: string;
  type: string;
}




@Component({
  selector: 'plan-schedule-dialog',
  template: `
  <dynamic-form [fields]="regConfig" mainLabel="Plan outcome" (submitForm)="submit($event)" popup="true">
  </dynamic-form>
  `,
})
export class PlanScheduleDialogComponent {

  regConfig: FieldConfig[];
  putData: any = null;
  item: Elemnt;
  type: string;

  ngOnInit(){
    this.regConfig = [
      {
          type: 'selectItem',
          label: $localize`Item descrption`,
          name: 'item',
          // for packing and QC pack
          // collections: this.mainLabel.endsWith('ack')? false : true,
          options: this.genral.getItemsCashewGrades(this.type, []),
      },
      {
          type: 'inputselect',
          // name: 'numberUnits',
          options: 'item',
          inputType: 'second',
          collections: [
              {
                  type: 'input',
                  label: $localize`Weight`,
                  name: 'amount',
                  inputType: 'numeric',
                  options: 3,
              },
              {
                  type: 'select',
                  label: $localize`Weight unit`,
                  name: 'measureUnit',
                  value: 'LBS',
                  options: this.genral.getMeasureUnit(),
              },
          ]
      },
      {
          name: 'submit',
          label: $localize`Submit`,
          type: 'button',
      }
    ];
  }

  constructor(private genral: Genral, public dialogRef: MatDialogRef<PlanScheduleDialogComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any) {
          this.type = data.type;
          this.item = data.item;
  }

  submit(value: any) {
    this.dialogRef.close(value);
  }


  onNoClick(): void {
      this.dialogRef.close('closed');
  }

}



