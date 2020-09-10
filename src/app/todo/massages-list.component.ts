import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';

@Component({
  selector: 'app-massages-list',
  template: `
  <h1 style="text-align:center">
    Massages center
  </h1>
  <mat-form-field style="margin-bottom:10px; margin-left:25px;" >
    <mat-select placeholder="Categories" (selectionChange)="applyFilter($event.value)">
      <mat-option value="">--all--</mat-option>
      <mat-option *ngFor="let item of myTypes" [value]="item">{{item}}</mat-option>
    </mat-select>
  </mat-form-field>
  <search-expandable [dataSource]="massagesSource" [oneColumns]="columnsMassages" [buttons]="myButtons" [expandableMassage]="poInfromtion" (expanded)="expandElement($event)" (elemnetClick)="goToOpartion($event)">
  </search-expandable>
  `,
})
export class MassagesListComponent {

    myButtons: string[] = ['mark as unseen'];
    myTypes: string[] = ['NEW', 'SEEN'];
    columnsMassages: OneColumn[] = [
      {
        type: 'nameId',
        name: 'poCode',
        label: 'PO#',
        search: 'object',
      },
      {
        name: 'title',
        label: 'Title',
        search: 'normal',
      },
      {
        name: 'processName',
        label: 'Process type',
        search: 'select',
        options: this.genral.getProcess()
      },
      {
        name: 'modifiedBy',
        label: 'Modified by',
        search: 'normal',
      },
      {
        type: 'dateTime',
        name: 'createdDate',
        label: 'Created date',
        search: 'dates',
      },
    ];

  massagesSource: any[];
  source: any[];
  poInfromtion;
  constructor(private genral: Genral) {}
  
  ngOnInit() {
    this.genral.getUserMassages().pipe(take(1)).subscribe(value => {
      this.massagesSource = <any[]>value;
      this.source = <any[]>value;
    });
  }

  expandElement($event: any){
    if($event['processId']) {
      this.genral.getMassage($event['processId'], $event['id'], $event['processName']).pipe(take(1)).subscribe(value => {
        this.poInfromtion = value;
        $event['label'] = 'SEEN';
      });
    } else {
      this.genral.setMassageTask($event['id'], 'SEEN').pipe(take(1)).subscribe(value => {
        this.poInfromtion = {};
        $event['label'] = 'SEEN';
      });
    }
  }

  goToOpartion(obj) {
    if(obj.opartion === 'mark as unseen') {
      this.genral.setMassageTask(obj.dataRow['id'], 'NEW').pipe(take(1)).subscribe(value => {
        obj.dataRow['label'] = 'NEW';
      });
    } 
  }

  applyFilter($event) {
    if($event === '') {
      this.massagesSource = this.source;
    } else {
      this.massagesSource = this.source.filter(
          book => book.label === $event);
    }
  }

}
