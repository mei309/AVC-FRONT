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
  selector: 'inventory-general-time',
  template: `
    <h1 style="text-align:center" class="no-print" i18n>General Inventory History Report</h1>
    <h1 style="text-align:center" class="only-print" i18n>Inventory At {{dateDay.value | date : 'medium':"+0000"}}</h1>
    <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="General stock by item" i18n-label>
      </mat-tab>
      <mat-tab label="General stock by PO#" i18n-label>
      </mat-tab>
      <mat-tab label="General stock and orders" i18n-label>
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
    <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" [withPaginator]="false">
    </search-group-details>
    `,
})
export class InventoryGeneralTimeComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;

  dateDay = new FormControl(moment().utc().add(moment().utcOffset(), 'm'));

  columnsShow: OneColumn[];

  cashewSource;
  sumsSource;



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
    }
  }
  changedAndDate(event, normalizedDay: moment.Moment) {
    switch (+event) {
      case 0:
        this.cashewSource = null;
        this.localService.getGeneralInventoryByTime(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.columnsShow = [
          {
            type: 'nameId',
            name: 'item',
            label: $localize`Item`,
            search: 'selectObjObj',
            options: this.genral.getItemsGeneral(),
            group: 'item',
          },
          {
            type: 'weight2',
            name: 'totalStock',
            label: $localize`Total stock`,
            search: 'objArray',
            group: 'item',
          },
          {
            type: 'nameId',
            name: 'poCode',
            label: $localize`PO#`,
            search: 'object',
            group: 'poCode',
          },
          {
            name: 'supplierName',
            label: $localize`Supplier`,
            search: 'selectObj',
            options: this.genral.getSuppliersGeneral(),
            group: 'poCode',
          },
          {
            type: 'weight2',
            name: $localize`totalBalance`,
            label: 'Total balance',
            search: 'objArray',
            // group: 'poCode',
          },
          {
            type: 'arrayVal',
            name: 'warehouses',
            label: $localize`Warehouse`,
            search: 'selectObjArr',
            options: this.genral.getWearhouses(),
          },
          {
              type: 'date',
              name: 'receiptDate',
              label: $localize`Receipt date`,
              search: 'dates',
          },
          {
            name: 'poInventoryRows',
            type: 'kidArray',
          },
        ];
        this.cdRef.detectChanges();
        break;
      case 1:
        this.cashewSource = null;
        this.columnsShow = [
          {
            type: 'nameId',
            name: 'poCode',
            label: $localize`PO#`,
            search: 'object',
            group: 'poCode',
          },
          {
            name: 'supplierName',
            label: $localize`Supplier`,
            search: 'selectObj',
            options: this.genral.getSuppliersGeneral(),
            group: 'poCode',
          },
          // {
          //   type: 'weight2',
          //   name: 'totalStock',
          //   label: 'Total stock',
          //   search: 'object',
          //   group: 'poCode',
          // },
          {
            type: 'nameId',
            name: 'item',
            label: $localize`Item`,
            search: 'selectObjObj',
            options: this.genral.getItemsGeneral(),
            group: 'item',
          },
          {
            type: 'weight2',
            name: 'totalBalance',
            label: $localize`Total balance`,
            search: 'objArray',
            // group: 'item',
          },
          {
            type: 'arrayVal',
            name: 'warehouses',
            label: $localize`Warehouse`,
            search: 'selectObjArr',
            options: this.genral.getWearhouses(),
          },
          {
              type: 'date',
              name: 'receiptDate',
              label: $localize`Receipt date`,
              search: 'dates',
          },
          {
            name: 'poInventoryRows',
            type: 'kidArray',
          }
        ];
        this.localService.getGeneralInventoryByPo(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.cdRef.detectChanges();
        break;
    case 2:
        this.cashewSource = null;
        this.columnsShow = [
          {
            type: 'nameId',
            name: 'item',
            label: $localize`Item`,
            search: 'selectObjObj',
            options: this.genral.getItemsGeneral(),
            group: 'item',
          },
          {
            type: 'weight',
            name: 'inventoryAmount',
            label: $localize`Inventory amount`,
            search: 'object',
          },
          {
            type: 'weight',
            name: 'orderedAmount',
            label: $localize`Orderd amount`,
            search: 'object',
          },
        ];
        this.localService.getGeneralInventoryOrder(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
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
