import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';
import * as moment from 'moment';

@Component({
  selector: 'inventory-by-time',
  template: `
    <h1 style="text-align:center" class="no-print" i18n>Inventory History Report</h1>
    <h1 style="text-align:center" class="only-print" i18n>Inventory At {{dateDay.value | date : 'medium':"+0000"}}</h1>
    <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Cashew raw material stock" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew clean material stock" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew items stock (bagged)" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew finished stock" i18n-label>
      </mat-tab>
    </mat-tab-group>
    <div style="text-align:center" class="no-print">
      <h1 style="display: inline" i18n>Inventory At </h1>
      <mat-form-field appearance="fill" class="no-print">
          <mat-label i18n>Day & time</mat-label>
          <input matInput [ngxMatDatetimePicker]="picker" (dateChange)="chosenDayHandler($event.value)" [formControl]="dateDay">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <ngx-mat-datetime-picker #picker [showSpinners]="false"></ngx-mat-datetime-picker>
      </mat-form-field>
    </div>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotals]="true" [withPaginator]="false" (filteredInfo)="filteredSums($event)">
      </search-group-details>
      <sum-list-tables *ngIf="totelByType" class="sums-qc" [mainDetailsSource]="[sumsSource, totelByType]">
      </sum-list-tables>
      <sums-product-type *ngIf="tabIndex < 1" class="sums-qc" [mainDetailsSource]="[sumsSource, ['productCompany', 'type'], 'weightInLbs']" title="Total LBS by product company" type="decimalNumber" i18n-title>
      </sums-product-type>
    </div>
    `,
})
export class InventoryByTimeComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;

  isDataAvailable: boolean = false;

  dateDay = new FormControl(moment().utc().add(moment().utcOffset(), 'm'));

  columnsShow: OneColumn[];

  cashewSource;
  sumsSource;

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Sum`,
    options: 'LBS',
  };

  totelByType;



  constructor(private router: Router, public dialog: MatDialog, private localService: ReportsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
      if(params.get('number')) {
        this.tabIndex = +params.get('number');
      }
      this.changedAndDate(this.tabIndex, this.dateDay.value);
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
            if(this.dateDay.value){
              this.changedAndDate(this.tabIndex, this.dateDay.value);
            }
          });
        }
      });
  }

  chosenDayHandler(normalizedDay: moment.Moment) {
    this.changedAndDate(this.tabIndex, normalizedDay);
  }

  changed(event) {
    if(this.dateDay.value) {
      this.changedAndDate(+event, this.dateDay.value);
    } else {
      this.isDataAvailable = false;
    }
  }
  changedAndDate(event, normalizedDay: moment.Moment) {
    this.isDataAvailable = true;
    switch (+event) {
      case 0:
        this.cashewSource = null;
        this.localService.getCashewInventoryRaw(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.setRaw();
        break;
      case 1:
        this.cashewSource = null;
        this.localService.getCashewInventoryClean(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.setFinished(true);
        break;
      case 2:
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
        this.localService.getCashewInventoryBagged(normalizedDay).pipe(take(1)).subscribe(value => {
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
      case 3:
        this.cashewSource = null;
        this.localService.getCashewInventoryFinished(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.setFinished(false);
        this.cdRef.detectChanges();
        break;
      default:
        break;
    }
  }

  setRaw() {
        this.totelByType = [
          {
            type: 'sumByParam',
            name: 'productionFunctionality',
            label: $localize`Total LBS`,
            option: 'weightInLbs',
            collections: {RAW_STATION: 'RAW STATION', null: 'STORAGE'}
          },
          // {
          //   type: 'sumByParam',
          //   name: 'productCompany',
          //   label: $localize`Total LBS by product company`,
          //   option: 'weightInLbs',
          // }
        ];
        this.columnsShow = [
          {
              type: 'normal',
              name: 'supplier',
              label: $localize`Supplier`,
              search: 'selectObj',
              options: this.genral.getSuppliersCashew(),
          },
          {
              type: 'select',
              label: $localize`Product company`,
              name: 'productCompany',
              search: 'selectObj',
              options: this.localService.getSuppliersGroups(),
          },
          {
              type: 'normal',
              name: 'item',
              label: $localize`Material`,
              search: 'selectObj',
              options: this.genral.getItemsCashew('Raw'),
          },
          {
              type: 'normal',
              name: 'poCode',
              label: $localize`PO#`,
              search: 'normal',
          },
          {
              type: 'date',
              name: 'receiptDate',
              label: $localize`Receipt date`,
              search: 'dates',
          },
          {
              type: 'arrayVal',
              name: 'bags',
              label: $localize`Bags`,
              search: 'normal',
          },
          {
              type: 'decimalNumber',
              name: 'weightInLbs',
              label: $localize`LBS weight`,
              search: 'normal',
          },
          {
              type: 'currency',
              name: 'unitPrice',
              label: $localize`Price per unit`,
              search: 'object',
          },
          {
              type: 'normal',
              name: 'currency',
              label: $localize`Currency`,
              search: 'select',
              options: ['USD', 'VND'],
          },
          {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Storage`,
              search: 'selectObjArr',
              options: this.genral.getWearhouses(),
          },
          {
              type: 'percentNormal',
              name: 'rawDefectsAndDamage',
              label: $localize`Defects + damage`,
              search: 'percentage',
          },
          {
              type: 'normal',
              name: 'status',
              label: $localize`Status`,
              search: 'select',
              options: this.genral.getProcessStatus(),
          },
        ];
        this.cdRef.detectChanges();
  }

  setFinished(isCleaned: boolean) {
        this.totelByType = null;

        this.columnsShow = [
          {
              type: 'nameId',
              name: 'item',
              label: $localize`product`,
              search: 'selectObjObj',
              options: this.genral.getItemsCashew('RoastPacked'),
              group: 'item',
          },
          {
              type: 'arrayVal',
              name: 'poCodes',
              label: $localize`PO#`,
              search: 'normal',
              group: 'poCodes',
          },
          {
              type: 'arrayVal',
              name: 'receiptDates',
              label: $localize`Receipt dates`,
              search: 'dates',
          },
          {
              type: 'arrayVal',
              name: 'processDates',
              label: $localize`Process dates`,
              search: 'dates',
          },
          ...isCleaned? []: [
            {
                type: 'decimalNumber',
                name: 'boxes',
                label: $localize`Box quantity`,
                search: 'normal',
            },
            {
                type: 'weight',
                name: 'boxWeight',
                label: $localize`Box weight`,
                search: 'object',
            },
          ],
          {
              type: 'decimalNumber',
              name: 'weightInLbs',
              label: $localize`LBS weight`,
              search: 'normal',
          },
          ...isCleaned? [
            {
                type: 'percentNormal',
                name: 'rawDefectsAndDamage',
                label: $localize`Defects + damage`,
                search: 'percentage',
            },
          ] : [],
          {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Storage`,
              search: 'selectObjArr',
              options: this.genral.getWearhouses(),
          },
        ];
  }

  filteredSums($event) {
    this.sumsSource = $event;
  }



    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
