import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationsService } from './relocations.service';
import { ReplaySubject } from 'rxjs';
// import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-relocations-reports',
  template: `
  <div class="centerButtons">
    <button mat-raised-button color="primary" [routerLink]="['../RelocationCount', {num: 0}]" i18n>Raw Relocation Count</button>
    <button mat-raised-button color="primary" [routerLink]="['../RelocationCount', {num: 1}]" i18n>New Cleaned Relocation Count</button>
  </div>
  <h1 style="text-align:center" i18n>Relocations reports</h1>
  <date-range-select class="no-print" (submitRange)="setDateRange($event)"></date-range-select>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)" class="spac-print">
      <mat-tab label="Raw relocation with weighing" i18n-label>
      </mat-tab>
      <mat-tab label="Cleaned relocation with weighing" i18n-label>
      </mat-tab>
  </mat-tab-group>
  <search-group-details [mainColumns]="columnsShow" [detailsSource]="mainSourceColumns" (details)="openDialog($event)">
  </search-group-details>
    `
})
export class RelocationsComponent implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  mainSourceColumns;

  ItemsChangable1 = new ReplaySubject<any[]>();

  dateRange;

  constructor(private router: Router, private dialog: MatDialog, private localService: RelocationsService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
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
            search: 'selectObj',
            options: this.genral.getSuppliersCashew(),
            group: 'poCodes',
        },
        {
            type: 'itemWeight',
            name: 'usedItems',
            label: $localize`Used items`,
            search: 'listAmountWithUnit',
            options: this.ItemsChangable1,
        },
        {
            type: 'itemWeight',
            name: 'itemCounts',
            label: $localize`Counted items`,
            search: 'listAmountWithUnit',
            options: this.ItemsChangable1,
        },
        {
            type: 'weight2',
            name: 'usedCountDifference',
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
              this.changedAndDate(+params.get('number'));
            } else {
              this.changedAndDate(0);
            }
          });
        }
      });
  }


  openDialog(event): void {
    const dialogRef = this.dialog.open(RelocationsDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.tabIndex? $localize`Cleaned transfer`: $localize`Raw transfer`},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === $localize`Edit`) {
          switch (this.tabIndex) {
                case 0:
                    this.router.navigate(['../RelocationCount',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
                    break;
                case 1:
                    this.router.navigate(['../RelocationCount',{id: event['id'], poCodes: event['poCodeIds'], num: 1}], { relativeTo: this._Activatedroute });
                    break;
              default:
                  break;
          }
      } else if(data === 'reload') {
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
          this.mainSourceColumns = null;
          this.localService.getStorageRelocations('RAW_STATION', this.dateRange).pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.mainSourceColumns = null;
          this.localService.getStorageRelocations('ROASTER_IN', this.dateRange).pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
      this.genral.getItemsCashew(this.tabIndex).pipe(take(1)).subscribe(val => {
        this.ItemsChangable1.next(val);
      });
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
      this.ItemsChangable1.unsubscribe();
    }

}
