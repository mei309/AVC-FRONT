import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from '../field.interface';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'inventory-reports',
  template: `
  <div class="centerButtons">
    <button mat-raised-button color="primary" routerLink='../MaterialUse' i18n>New Material Usage</button>
    <button mat-raised-button color="primary" routerLink='../CashewUse' i18n>New Cashew Usage</button>
    <button mat-raised-button color="primary" routerLink='../Relocation' i18n>New Relocation</button>
  </div>
  <h1 style="text-align:center" i18n>Inventory reports</h1>
  <date-range-select (submitRange)="setDateRange($event)"></date-range-select>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex" (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Material usages" i18n-label>
      </mat-tab>
      <mat-tab label="Cashew usages" i18n-label>
      </mat-tab>
      <mat-tab label="Relocations" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="inventorySource" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class InventoryReportsComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;
  columnsShow: OneColumn[];

  inventorySource;

  type;

  dateRange;

  constructor(public dialog: MatDialog, private localService: InventoryService, private genral: Genral,
    private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef, private router: Router) {
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

  openDialog(event): void {
    const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === $localize`Edit`) {
          switch (this.tabIndex) {
              case 0:
                this.router.navigate(['../MaterialUse',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              case 1:
                this.router.navigate(['../CashewUse',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              case 2:
                this.router.navigate(['../Relocation',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              default:
                  break;
          }
      } else if(dialogRef.componentInstance.approveChange) {
        this.changedAndDate(this.tabIndex);
      }
    });
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
          this.inventorySource = null;
          this.setUsageCols();
          this.localService.getMaterialUses(this.dateRange).pipe(take(1)).subscribe(value => {
            this.inventorySource = <any[]>value;
          });
          this.type = $localize`Material usage`;
          this.cdRef.detectChanges();
          break;
        case 1:
          this.inventorySource = null;
          this.setUsageCols();
          this.localService.getCashewUses(this.dateRange).pipe(take(1)).subscribe(value => {
            this.inventorySource = <any[]>value;
          });
          this.type = $localize`Cashew usage`;
          this.cdRef.detectChanges();
          break;
        case 2:
          this.inventorySource = null;
          this.columnsShow = [
            {
                type: 'arrayVal',
                name: 'poCodes',
                label: $localize`PO#`,
                group: 'poCodes',
                search: 'normal',
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
                type: 'itemWeight',
                name: 'usedItems',
                label: $localize`Used items`,
                search: 'listAmountWithUnit',
                options: this.genral.getAllItemsCashew(),
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
          this.localService.getStorageRelocations('PRODUCT_STORAGE', this.dateRange).pipe(take(1)).subscribe(value => {
            this.inventorySource = <any[]>value;
          });
          this.type = $localize`Relocation`;
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
    }

    setUsageCols() {
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
            type: 'itemWeight',
            name: 'usedItems',
            label: $localize`Used items`,
            search: 'listAmountWithUnit',
            options: this.genral.getAllItemsCashew(),
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
        {
          type: 'normal',
          label: $localize`Remarks`,
          name: 'remarks',
          search: 'normal',
        },
      ];
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {
         this.navigationSubscription.unsubscribe();
      }
    }

}
