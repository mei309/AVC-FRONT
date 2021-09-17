import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


@Component({
  selector: 'export-report',
  template: `
    <h1 style="text-align:center" i18n>Export Report</h1>
    <date-range-select (submitRange)="setDateRange($event)"></date-range-select>
    <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
      (selectedIndexChange)="changed($event)" class="spac-print">
        <mat-tab label="Exported by container" i18n-label>
        </mat-tab>
        <mat-tab label="Exported bagged items" i18n-label>
        </mat-tab>
    </mat-tab-group>
    <search-group-details [mainColumns]="columnsShow"  [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotals]="tabIndex? false : true" [withPaginator]="false" (filteredInfo)="filteredSums($event)">
    </search-group-details>
    <sum-list-tables *ngIf="!tabIndex" [mainDetailsSource]="[sumsSource, totelByType]">
    </sum-list-tables>
    `,
})
export class ExportReportComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;

  dateRange;
  totelByType;

  // isDataAvailable: boolean = false;

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Sum`,
    options: 'LBS',
  };

  columnsShow: OneColumn[];

  cashewSource;
  sumsSource;

  constructor(public dialog: MatDialog, private localService: ReportsService, private router: Router,
    private genral: Genral, private cdRef:ChangeDetectorRef, private _Activatedroute: ActivatedRoute) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
        if(params.get('number')) {
            this.tabIndex = +params.get('number');
        }
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
          if(params.get('number')) {
            this.tabIndex = +params.get('number');
          } else {
            this.tabIndex = 0;
          }
          this.changedAndDate(this.tabIndex);
        });
      }
    });
  }

  filteredSums($event) {
    this.sumsSource = $event;
  }

  changed(event) {
    this.changedAndDate(event);
  }
  setDateRange($event) {
    this.dateRange = $event;
    this.changedAndDate(this.tabIndex);
  }

  changedAndDate(event) {
      switch (+event) {
        case 0:
          this.cashewSource = null;
          this.localService.getCashewExportReport(this.dateRange).pipe(take(1)).subscribe(value => {
              (<any[]>value).forEach(element => {
                if(element['itemGroup'] === 'QC'){
                  element['qcBox'] = element['boxQuantity'];
                  delete element['boxQuantity'];
                }
              });
              this.cashewSource = <any[]>value;
          });
          this.totelByType = [
            {
              type: 'sumByParamCond',
              name: 'whole',
              label: $localize`25/50 LBS packaging (LBS)`,
              option: 'weightInLbs',
              collections: {true: 'WHOLE', false: 'H&P'},
              condision: (arr) => arr.filter(d => d['bagSize']['amount'] === 25 || d['bagSize']['amount'] === 50),
            },
            {
              type: 'sumByParamCond',
              name: 'whole',
              label: $localize`Items packaging`,
              option: 'weightInLbs',
              collections: {true: 'WHOLE', false: 'H&P'},
              condision: (arr) => arr.filter(d => d['bagSize']['amount'] !== 25 && d['bagSize']['amount'] !== 50),
            },
            {
              type: 'sumByParam',
              name: 'whole',
              label: $localize`all (LBS)`,
              option: 'weightInLbs',
              collections: {true: 'WHOLE', false: 'H&P'}
            },
            {
              type: 'recordAmountParam',
              name: 'containerSize',
              option: 'containerNumber',
              label: $localize`Containers`,
            }
          ];
          this.columnsShow = [
            {
                type: 'normal',
                name: 'containerNumber',
                label: $localize`Container number`,
                search: 'normal',
                group: 'containerNumber',
            },
            {
                type: 'nameId',
                name: 'shipmentCode',
                label: $localize`Shipment code`,
                search: 'object',
                group: 'containerNumber',
            },
            {
                type: 'normal',
                name: 'containerSize',
                label: $localize`Container size`,
                search: 'select',
                options: this.genral.getShippingContainerType(),
                group: 'containerNumber',
            },
            {
                type: 'date',
                name: 'processDate',
                label: $localize`Process dates`,
                search: 'dates',
                group: 'containerNumber',
            },
            {
                type: 'normal',
                name: 'poCode',
                label: $localize`PO#`,
                search: 'normal',
                group: 'poCode',
            },
            {
                type: 'nameId',
                name: 'item',
                label: $localize`Commodity`,
                search: 'selectObjObj',
                options: this.genral.getItemsCashew('RoastPacked'),
            },
            {
                name: 'saltLevel',
                label: $localize`Salt level`,
                search: 'select',
                options: ['NS', 'S', 'LS'],
            },
            {
                type: 'decimalNumber',
                name: 'boxQuantity',
                label: $localize`Box quantity`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'qcBox',
                label: $localize`QC box`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'bagQuantity',
                label: $localize`Bag quantity`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'weightInLbs',
                label: $localize`LBS weight`,
                search: 'normal',
            },
            {
                type: 'checkBool',
                name: 'roast',
                label: $localize`Roast`,
                search: 'none',
            },
            {
                type: 'normal',
                name: 'remarks',
                label: $localize`Remarks`,
                search: 'normal',
            },
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSource = null;
          this.totelByType = [
            {
              type: 'sum',
              name: 'boxQuantity',
              label: $localize`Total box quantity`,
            },
            {
              type: 'sum',
              name: 'bagQuantity',
              label: $localize`Total bag quantity`,
            },
            {
              type: 'sumByParam',
              name: 'type',
              label: $localize`Total by type`,
              option: 'weightInLbs'
            }
          ];
          this.localService.getCashewExportBagged(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
          });
          this.columnsShow = [
            {
                type: 'normal',
                name: 'brand',
                label: $localize`Brand`,
                search: 'normal',
                group: 'brand',
            },
            {
                type: 'normal',
                name: 'code',
                label: $localize`Code`,
                search: 'normal',
                group: 'code',
            },
            {
                type: 'normal',
                name: 'type',
                label: $localize`Type`,
                search: 'normal',
                group: 'type',
            },
            {
                type: 'weight',
                name: 'bagSize',
                label: $localize`Bag size`,
                search: 'object',
            },
            {
                type: 'normal',
                name: 'saltLevel',
                label: $localize`Salt level`,
                search: 'select',
                options: ['NS', 'S', 'LS'],
            },
            {
                type: 'decimalNumber',
                name: 'bagsInBox',
                label: $localize`Bags in box`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'boxQuantity',
                label: $localize`Box quantity`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'bagQuantity',
                label: $localize`Bag quantity`,
                search: 'normal',
            },
            {
                type: 'decimalNumber',
                name: 'weightInLbs',
                label: $localize`LBS weight`,
                search: 'normal',
            },

          ];
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
