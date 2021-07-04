import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'productions-by-time',
  template: `
    <h1 style="text-align:center" i18n>All production</h1>
    <date-range-select class="no-print" (submitRange)="getAllByDate($event)"></date-range-select>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSourceColumns" [totelColumn]="totelColumn" [totelAll]="totelAll" [withPaginator]="false">
      </search-group-details>
    </div>
    `,
})
export class ProductionsByTimeComponent implements OnInit {
  navigationSubscription;
  
  isDataAvailable: boolean = false;

  columnsShow: OneColumn[];
  
  totelColumn: OneColumn = {
      type: 'weight2',
      name: 'processGain',
      label: $localize`Total difference`,
      group: 'poCodes',
  };

  totelAll: OneColumn = {
    type: 'listAmountWithUnit',
    name: 'producedItems',
    label: $localize`Total all produced`,
    options: ['KG', 'LBS']
  };
  
  cashewSourceColumns;

  constructor(private router: Router, public dialog: MatDialog, private localService: ReportsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.columnsShow = [
          {
              type: 'arrayVal',
              name: 'poCodes',
              label: $localize`PO#`,
              search: 'normal',
              group: 'poCodes',
          },
          {
              type: 'arrayVal',
              name: 'suppliers',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersCashew(),
              group: 'poCodes',
          },
          {
              name: 'processName',
              label: $localize`Process name`,
              search: 'select',
              options: this.genral.getProcess(),
          },
          {
              type: 'itemWeight',
              name: 'usedItems',
              label: $localize`Used items`,
              search: 'listAmountWithUnit',
              options: this.genral.getItemsCashew('All'),
          },
          {
              type: 'itemWeight',
              name: 'producedItems',
              label: $localize`Produced items`,
              search: 'listAmountWithUnit',
              options: this.genral.getItemsCashew('All'),
          },
          {
              type: 'weight2',
              name: 'processGain',
              label: $localize`Difference`,
              search: 'objArray',
          },
          {
              type: 'dateTime',
              name: 'recordedTime',
              label: $localize`Recorded time`,
              search: 'dates',
          },
          {
              type: 'normal',
              name: 'status',
              label: $localize`Status`,
              search: 'select',
              options: this.genral.getProcessStatus(),
          },
      ];
  }

  getAllByDate($event) {
    this.isDataAvailable = true;
    this.cashewSourceColumns = null;
    this.localService.allProductionByTime($event).pipe(take(1)).subscribe(value => {
      this.cashewSourceColumns = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

}