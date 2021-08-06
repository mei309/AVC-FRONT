import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from '../field.interface';
import { UserAccountService } from './user-account.service';

@Component({
  selector: 'massages-list',
  template: `
  <h1 style="text-align:center" i18n>Messages center</h1>
  <date-range-select class="no-print" (submitRange)="getAllByDate($event)"></date-range-select>
  <mat-form-field style="margin-bottom:10px; margin-left:25px;" class="no-print">
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
        name: 'title',
        label: $localize`Title`,
        search: 'normal',
      },
      {
        name: 'processType',
        label: $localize`Process type`,
        search: 'select',
        options: this.genral.getProcess()
      },
      {
          type: 'arrayVal',
          name: 'poCodes',
          label: $localize`PO#`,
          // search: 'object',
          group: 'poCodes',
      },
      {
          type: 'arrayVal',
          name: 'suppliers',
          label: $localize`Supplier`,
          search: 'selectObj',
          options: this.genral.getSuppliersCashew(),
      },
      {
        name: 'modifiedBy',
        label: $localize`Modified by`,
        search: 'normal',
      },
      {
        type: 'dateTime',
        name: 'createdDate',
        label: $localize`Created date`,
        search: 'dates',
      },
    ];

  massagesSource: any[];
  source: any[];
  poInfromtion;
  constructor(private genral: Genral, private LocalService: UserAccountService) {}
  
  ngOnInit() {
  }

  getAllByDate($event) {
    this.genral.getUserMassages($event).pipe(take(1)).subscribe(value => {
      this.massagesSource = <any[]>value;
      this.source = <any[]>value;
    });
  }

  expandElement($event: any){
    this.poInfromtion = {};
    if($event['processId']) {
      this.LocalService.getMassage($event['processId'], $event['id'], $event['processName']).pipe(take(1)).subscribe(value => {
        this.poInfromtion = value;
        $event['label'] = 'SEEN';
      });
    } else {
      this.genral.setMassageTask($event['id'], 'SEEN').pipe(take(1)).subscribe(value => {
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
