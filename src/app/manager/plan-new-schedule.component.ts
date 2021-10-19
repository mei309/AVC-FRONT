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
            <div cdkDropList [cdkDropListData]="em.value" (cdkDropListDropped)="drop($event, line.type, em.key)" class="example-list-line">
              <div [cdkDragData]="item" (mouseout)="setLocalCheck(0)" (mouseover)="setLocalCheck(item.id)" [ngStyle]="{'background-color':item.id === localCheck ? 'red' : 'white' }" *ngFor="let item of em.value" cdkDrag class="example-line">
                {{item.color}}<span>{{item.item}} </span><span>{{item.poCode}} </span><span>{{item.amount}}</span>
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
        <div [cdkDragData]="item" (mouseout)="setLocalCheck(0)" (mouseover)="setLocalCheck(item.id)" [ngStyle]="{'background-color':item.id === localCheck ? 'red' : 'white' }" class="example-box" *ngFor="let item of dictionary[process.type]" cdkDrag>
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

  daysArray = ['sunn', 'mond', 'monn', 'thed', 'then', 'wedd', 'wedn', 'thud', 'thun', 'fri'];
  rawList: Elemnt[] = [];
  cleanList: Elemnt[] = [];
  roastList: Elemnt[] = [];
  packList: Elemnt[] = [];

  regConfig: FieldConfig[];

  localLimit: number;
  localCheck: number;

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
        this.rawList.push({item: a['item'], amount: a['weightInLbs'], poCode: a['poCode'], type: 'Raw', id: a['id'], parent: true});
      });
    });
    this.localService.getCashewInventoryClean().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(a => {
        this.cleanList.push({item: a['item']['value'], amount: a['weightInLbs'], poCode: a['poCodes'], type: 'Clean', id: a['poCodeId'], parent: true});
      });
    });
  }


  drop(event: CdkDragDrop<any>, type: string, dateShift?) {
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
      if(dateShift) {
        if(event.item.data.parent || this.lonePosibblities(type, dateShift, event.item.data.id)) {
          event.item.data.color = '';
        } else {
          event.item.data.color = 'yellow';
        }
        this.kidPosibblities(type, dateShift, event.item.data.id);
        if(!event.item.data.kid && event.item.data.type !== 'Pack') {
          this.getNext(event.item.data);
        }
        event.item.data.kid = true;
      } else {
        event.item.data.kid = false;
        this.kidsRemove(type, event.item.data.id);
      }
    }
  }

  lonePosibblities(type: string, dateShift: string, id) {
    // take care of self
    const prevTypeList = this.productionLinesList.filter(a => a.type === this.getPrevType(type));
    if(prevTypeList.some(b => {
      for(const key in b.rowArray) {
        if((b.rowArray[key]).some(c => c.id === id)) {
          const distance = this.daysArray.indexOf(dateShift) - this.daysArray.indexOf(key);
          if(distance > 0){return true;}
        }
      }
    })) {
      return true;
    }
    return false;
  }

  kidPosibblities(type: string, dateShift: string, id){
    // moving in line take care of chileds
    const sameTypeList = this.productionLinesList.filter(a => a.type === type);
    let highesetDistance;
    if(sameTypeList.some(b => {
      for(const key in b.rowArray) {
        if((b.rowArray[key]).some(c => c.id === id)) {
          const distance = this.daysArray.indexOf(dateShift) - this.daysArray.indexOf(key);
          if(distance === 0){
            return true;
          }
          if(distance > highesetDistance) {
            highesetDistance = distance;
          }
        }
      }
    })) {
      return true;
    }
    if(highesetDistance && highesetDistance < 0) {
      const nextTypeList = this.productionLinesList.filter(a => this.getNextType(type) === a.type);
      nextTypeList.forEach(b => {
        for(const key in b.rowArray) {
          if(between(this.daysArray.indexOf(key), this.daysArray.indexOf(dateShift)+1, this.daysArray.indexOf(key)) && (b.rowArray[key]).some(c => c.id === id)) {
            (b.rowArray[key]).forEach(c => {
              if(c.id === id) {
                c.color = 'yellow';
              }
            });
          }
        }
      });
      return true;
    } else if(highesetDistance) {
      const nextTypeList = this.productionLinesList.filter(a => this.getNextType(type) === a.type);
      nextTypeList.forEach(b => {
        for(const key in b.rowArray) {
          if(between(this.daysArray.indexOf(key), this.daysArray.indexOf(key)+1, this.daysArray.indexOf(dateShift)) && (b.rowArray[key]).some(c => c.id === id)) {
            (b.rowArray[key]).forEach(c => {
              if(c.id === id) {
                c.color = '';
              }
            });
          }
        }
      });
      return true;
    }
  }
  kidsRemove(type: string, id){
    // moved outside take care of childs
    const nextTypeList = this.productionLinesList.filter(a => this.getNextType(type) === a.type);
    nextTypeList.forEach(b => {
      for(const key in b.rowArray) {
        if((b.rowArray[key]).some(c => c.id === id)) {
          (b.rowArray[key]).forEach(c => {
            if(c.id === id) {
              c.color = 'yellow';
            }
          });
        }
      }
    });
  }


  onChange(item, eve, type) {
    if(eve.target.value < this.localLimit) {
      this.dictionary[type].push({item: item.item, amount: this.localLimit-eve.target.value, poCode: item.poCode, type: type, id: item.id, parent: item.parent});
    }
  }

  valideta(item, eve) {
    if(eve.target.value > this.localLimit) {
      item.amount = this.localLimit;
    }
  }

  setLocalCheck(item: number) {
    this.localCheck = item;
  }

  setLocalLimit(choosed: number) {
    this.localLimit = choosed;
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
        data.id = ele.id;
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

  getPrevType(type: string){
    switch (type) {
      case 'Raw':
        return '';
      case 'Clean':
        return 'Raw';
      case 'Roast':
        return 'Clean';
      case 'Pack':
        return 'Roast';
    }
  }

  isBiggerType(oldType: string, newType: string){
    switch (oldType) {
      case 'Raw':
        return newType !== 'Raw';
      case 'Clean':
        return newType !== 'Raw' && newType !== 'Clean';
      case 'Roast':
        return newType === 'Pack';
      case 'Pack':
        return false;
    }
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}

function between(x, min, max) {
  return x >= min && x <= max;
}
export interface Elemnt {
  item: string;
  amount: number;
  poCode: string;
  type: string;
  id: number;
  color?: string;
  parent?: boolean;
  kid?: boolean;
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



