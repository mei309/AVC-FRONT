import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { ReportsService } from './reports.service';


@Component({
  selector: 'inventory-by-time',
  template: `
    <h1 style="text-align:center" i18n>All inventory in point of time</h1>
    <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Cashew raw material stock" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew items stock (bagged)" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew finished stock" i18n-label>
      </mat-tab>
    </mat-tab-group>
    <mat-form-field appearance="fill">
        <mat-label i18n>Day</mat-label>
        <input matInput [matDatepicker]="picker1" (focus)="picker1.open()" (dateChange)="chosenDayHandler($event.value)" [formControl]="dateDay" readonly>
        <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
        <mat-datepicker #picker1></mat-datepicker>
    </mat-form-field>
    <div *ngIf="isDataAvailable">
      <search-group-details [mainColumns]="columnsShow" [detailsSource]="cashewSource" [totelAll]="totelAll" [listTotales]="totelByType" [withPaginator]="false">
      </search-group-details>
    </div>
    `,
})
export class InventoryByTimeComponent implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;
  
  isDataAvailable: boolean = false;

  dateDay = new FormControl();

  columnsShow: OneColumn[];
  
  cashewSource;

  totelAll: OneColumn = {
    type: 'decimalNumber',
    name: 'weightInLbs',
    label: $localize`Total all`,
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
    });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('number')) {
              this.tabIndex = +params.get('number');
            }
            if(this.dateDay.value){
              this.changedAndDate(this.tabIndex, this.dateDay.value);
            }
          });
        }
      });
  }

  chosenDayHandler(normalizedDay: Date) {
    this.changedAndDate(this.tabIndex, normalizedDay);
  }

  changed(event) {
    if(this.dateDay.value) {
      this.changedAndDate(+event, this.dateDay.value);
    } else {
      this.isDataAvailable = false;
    }
  }
  changedAndDate(event, normalizedDay: Date) {
    this.isDataAvailable = true;
    switch (+event) {
      case 0:
        this.cashewSource = null; 
        this.totelByType = null;
        this.localService.getCashewInventoryRaw(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.columnsShow = [
          {
              type: 'normal',
              name: 'supplier',
              label: $localize`Supplier`,
              search: 'normal',
              options: this.genral.getSuppliersCashew(),
          },
          {
              type: 'normal',
              name: 'item',
              label: $localize`Material`,
              search: 'selectObj',
              options: this.genral.getItemsRawCashew(),
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
              search: 'selectObj',
              options: this.genral.getWearhouses(),
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
        break;
      case 1:
        this.cashewSource = null; 
        this.totelByType = ['type', 'weightInLbs'];
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
              search: 'normal',
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
      case 2:
        this.cashewSource = null; 
        this.totelByType = null;
        this.localService.getCashewInventoryFinished(normalizedDay).pipe(take(1)).subscribe(value => {
          this.cashewSource = <any[]>value;
        });
        this.columnsShow = [
          {
              type: 'nameId',
              name: 'item',
              label: $localize`product`,
              search: 'selectObjObj',
              options: this.genral.getItemsRoastPackedCashew(),
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
          {
              type: 'decimalNumber',
              name: 'boxQuantity',
              label: $localize`Box quantity`,
              search: 'normal',
          },
          {
              type: 'weight',
              name: 'BoxWeight',
              label: $localize`Box weight`,
              search: 'object',
          },
          {
              type: 'decimalNumber',
              name: 'weightInLbs',
              label: $localize`LBS weight`,
              search: 'normal',
          },
          {
              type: 'arrayVal',
              name: 'warehouses',
              label: $localize`Storage`,
              search: 'selectObj',
              options: this.genral.getWearhouses(),
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
