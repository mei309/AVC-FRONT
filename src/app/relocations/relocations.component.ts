import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationsService } from './relocations.service';
// import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-relocations-reports',
  template: `
  <h1 style="text-align:center" i18n>Inventory reports</h1>
  <mat-tab-group mat-stretch-tabs [(selectedIndex)]="tabIndex"
  (selectedIndexChange)="changed($event)">
      <!-- <mat-tab label="Transfers">
      </mat-tab> -->
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

  dateRangeDisp= new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  mainSourceColumns;

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
            options: this.genral.getAllItemsCashew(),
        },
        {
            type: 'itemWeight',
            name: 'itemCounts',
            label: $localize`Counted items`,
            search: 'listAmountWithUnit',
            options: this.genral.getAllItemsCashew(),
        },
        {
            type: 'weight2',
            name: 'usedCountDifference',
            label: $localize`Difference`,
            search: 'object',
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
            this.changed(+params.get('number'));
        } else {
            this.changed(0);
        }
      });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('number')) {
              this.tabIndex = +params.get('number');
              this.changed(+params.get('number'));
            } else {
              this.changed(0);
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
      }
    });
  }


    changed(event) {
      switch (+event) {
        case 0:
          this.mainSourceColumns = null;
          this.localService.getStorageRelocations('RAW_STATION').pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.mainSourceColumns = null;
          this.localService.getStorageRelocations('ROASTER_IN').pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
    }

    

    inlineRangeChange($event) {
      let begin = $event.begin.value;
      let end = $event.end.value;
      // this.dataSource.data = this.dataSource.data.filter(e=>e[column] > begin && e[column] < end ) ;
    }

    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }

}
