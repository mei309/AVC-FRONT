import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { ProductionDetailsDialogComponent } from '../production/production-detailes-dialog.component';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'productions-by-time',
  template: `
    <h1 style="text-align:center" i18n>Productions Report</h1>
    <date-range-select (submitRange)="getAllByDate($event)"></date-range-select>
    <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSourceColumns" [totelColumn]="totelColumn" [totelAll]="totelAll" [withPaginator]="false" (details)="openDialog($event)">
    </search-group-details>
    `,
})
export class ProductionsByTimeComponent implements OnInit {
  navigationSubscription;

  columnsShow: OneColumn[];

  dateRange;

  totelColumn: OneColumn = {
      type: 'weight2',
      name: 'processGain',
      label: $localize`Total difference`,
      group: 'poCodes',
      options: ['%', 'LBS']
  };

  totelAll: OneColumn = {
    type: 'listAmountWithUnit',
    name: 'producedItems',
    label: $localize`Total all produced`,
    options: ['LBS']
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
              search: 'selectObjArr',
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
              name: 'productionLine',
              label: $localize`Production line`,
              search: 'selectObj',
              options: this.genral.getProductionLine(''),
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
              name: 'startTime',
              label: $localize`Start time`,
              search: 'normal',
          },
          {
              type: 'normal',
              name: 'endTime',
              label: $localize`End time`,
              search: 'normal',
          },
          {
              type: 'normal',
              name: 'downtime',
              label: $localize`Down time`,
              search: 'normal',
          },
          {
              type: 'normal',
              name: 'numOfWorkers',
              label: $localize`Labor`,
              search: 'normal',
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

  openDialog(event): void {
    const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.getType(event.processName)},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === $localize`Edit`) {
          switch (event.processName) {
                case 'Cashew Cleaning':
                    this.router.navigate(['Main/production/Cleaning',{id: event['id'], poCode: event['poCodeIds'][0]}]);
                    break;
                case 'Cashew Roasting':
                    this.router.navigate(['Main/production/Roasting',{id: event['id'], poCode: event['poCodeIds'][0]}]);
                    break;
                case 'Cashew Toffee':
                    this.router.navigate(['Main/production/Toffee',{id: event['id'], poCodes: event['poCodeIds']}]);
                    break;
                case 'Packing':
                    this.router.navigate(['Main/production/Packing',{id: event['id'], poCodes: event['poCodeIds'], withPacked: dialogRef.componentInstance.withPacked,
                      addPos: dialogRef.componentInstance.addPos}]);
                    break;
                case 'Bad Quality Packing':
                    this.router.navigate(['Main/production/QcPacking',{id: event['id'], poCodes: event['poCodeIds'], withCleaned: dialogRef.componentInstance.withCleaned,
                    addPos: dialogRef.componentInstance.addPos}]);
                    break;
              default:
                  break;
          }
      } else if(dialogRef.componentInstance.approveChange) {
        this.getAllByDate(this.dateRange);
      }
    });
  }

  getAllByDate($event) {
    this.dateRange = $event;
    this.cashewSourceColumns = null;
    this.localService.allProductionByTime($event).pipe(take(1)).subscribe(value => {
      this.cashewSourceColumns = <any[]>value;
    });
    this.cdRef.detectChanges();
  }

  getType(eve) {
    switch (eve) {
      case 'Cashew Cleaning':
          return 'Cleaning';
      case 'Cashew Roasting':
          return 'Roasting';
      case 'Cashew Toffee':
          return 'Toffee';
      case 'Packing':
          return 'Packing';
      case 'Bad Quality Packing':
          return 'QC Pack';
    }
  }

    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
