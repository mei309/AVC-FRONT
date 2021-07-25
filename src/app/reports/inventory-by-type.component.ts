import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { ReportsService } from './reports.service';

@Component({
  selector: 'inventory-by-type',
  template: `
  <h1 style="text-align:center" i18n>Cashew inventory report</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Cashew material stock" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew items stock" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" [totelAll]="totelAll" [withPaginator]="false">
  </search-group-details>
    `
})
export class InventoryByTypeComponent implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;
  columnsShow: OneColumn[];

  cashewSource: any[];

  ItemsChangable = new ReplaySubject<any[]>();

  totelAll: OneColumn = {
    type: 'weight2',
    name: 'totalBalance',
    label: $localize`Total all`,
    options: ['KG', 'LBS']
  };
  

  constructor(public dialog: MatDialog, private localService: ReportsService, private genral: Genral,
    private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
      if(params.get('number')) {
        this.tabIndex = +params.get('number');
        this.changed(+params.get('number'));
      } else {
        this.changed(0);
      }
    });
    this.columnsShow = [
        {
          type: 'nameId',
          name: 'item',
          label: $localize`Item`,
          search: 'selectObjObj',
          options: this.ItemsChangable,
          group: 'item',
        },
        {
          type: 'weight2',
          name: 'totalStock',
          label: $localize`Total item`,
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
          options: this.genral.getSuppliersCashew(),
          group: 'poCode',
        },
        {
          type: 'weight2',
          name: 'totalBalance',
          label: $localize`Amount`,
          search: 'objArray',
          // group: 'poCode',
        },
        {
          type: 'arrayVal',
          name: 'warehouses',
          label: $localize`Warehouse`,
          search: 'selectObj',
          options: this.genral.getWearhouses(),
        },
        {
            type: 'date',
            name: 'receiptDate',
            label: $localize`Receipt date`,
            search: 'dates',
        },
        {
            type: 'date',
            name: 'processDate',
            label: $localize`Process date`,
            search: 'dates',
        },
        {
          name: 'poInventoryRows',
          type: 'kidArray',
        },
      ];
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
          if(params.get('number')) {
            this.tabIndex = +params.get('number');
          } else {
            this.tabIndex = 0;
          }
          this.changed(this.tabIndex);
        });
      }
    });
  }

    changed(event) {
      switch (+event) {
        case 0:
          this.cashewSource = null; 
          this.localService.getCashewInventoryBullk().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
          });
          this.localService.getBulkPackCashewItems('BULK').pipe(take(1)).subscribe(val => {
            this.ItemsChangable.next(<any[]>val);
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSource = null; 
          this.localService.getCashewInventoryPacked().pipe(take(1)).subscribe(value => {
            this.cashewSource = <any[]>value;
          });
          this.localService.getBulkPackCashewItems('PACKED').pipe(take(1)).subscribe(val => {
            this.ItemsChangable.next(<any[]>val);
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
      this.ItemsChangable.unsubscribe();
    }
    
}