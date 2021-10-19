import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Globals } from '../global-params.component';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
@Component({
  selector: 'app-counteiners-reports',
  templateUrl: './counteiners-reports.component.html',
})
export class CountinersReportsComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;

  withRealEta: boolean = false;

  type: string;

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];

  mainSourceColumns;

  totelColumn: OneColumn;

  dateRange;

  constructor(private router: Router, private dialog: MatDialog, private localService: CountinersService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef, public myGlobal: Globals) {
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
    const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === $localize`Edit`) {
        switch (this.tabIndex) {
              case 0:
                this.router.navigate(['../Arrival',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              case 1:
                this.router.navigate(['../Loading',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              // case 2:
              //     this.router.navigate(['../Packing',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
              //     break;
            default:
                break;
        }
      } else if(dialogRef.componentInstance.approveChange) {
        this.changedAndDate(this.tabIndex);
      }
    });
  }

  getRealEta(){
    this.localService.getAllRealEta(this.dateRange).pipe(take(1)).subscribe(value => {
      let array = [];
      Object.keys(value).forEach(a => {
        array.push({key: a, newEta: value[a]});
      });
      let merged = [];
      for(let i=0; i<this.mainSourceColumns.length; i++) {
        merged.push({
        ...this.mainSourceColumns[i],
        ...(array.find((itmInner) => itmInner.key === this.mainSourceColumns[i]['containerNumber']))}
        );
      }
      this.columnsShow.push(
        {
          type: 'date',
          label: $localize`Real ETA`,
          name: 'newEta',
          search: 'dates',
        }
      );
      this.mainSourceColumns = merged;
      this.columnsShow = this.columnsShow.slice();
      this.cdRef.detectChanges();
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
          this.totelColumn = null;
          this.columnsShow = [
            {
                type: 'nameId',
                name: 'shipmentCode',
                label: $localize`Shipment code`,
                search: 'object',
                // group: 'shipmentCode',
            },
            {
                type: 'normal',
                label: $localize`Container number`,
                name: 'containerNumber',
                search: 'normal',
                // group: 'shipmentCode',
            },
            {
                type: 'nameId',
                name: 'productCompany',
                label: $localize`Product company`,
                search: 'selectObjObj',
                options: this.localService.getShippingSuppliers(),
            },
            {
                type: 'dateTime',
                name: 'recordedTime',
                label: $localize`Recorded time`,
                search: 'dates',
            },
            // {
            //     type: 'date',
            //     label: 'Etd',
            //     name: 'etd',
            //     search: 'dates',
            // },
            {
                type: 'date',
                label: $localize`Eta`,
                name: 'eta',
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
              type: 'arrayVal',
              name: 'approvals',
              label: $localize`Approvals`,
              search: 'normal',
            }
          ];
          this.localService.findContainerArrivals(this.dateRange).pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.type = 'Arrivals';
          this.cdRef.detectChanges();
          break;
        case 1:
          this.mainSourceColumns = null;
          this.totelColumn = {
            type: 'weight2',
            name: 'totalRow',
            label: $localize`Total loaded`,
            group: 'poCodes',
            options: ['LBS', 'KG']
          };
          this.columnsShow = [
            {
                type: 'nameId',
                name: 'shipmentCode',
                label: $localize`Shipment code`,
                search: 'object',
                group: 'shipmentCode',
            },
            {
                type: 'normal',
                label: $localize`Container number`,
                name: 'containerNumber',
                search: 'normal',
                group: 'shipmentCode',
            },
            {
                type: 'arrayVal',
                name: 'poCodes',
                label: $localize`PO#`,
                search: 'normal',
                group: 'poCodes',
            },
            {
                type: 'dateTime',
                name: 'recordedTime',
                label: $localize`Recorded time`,
                search: 'dates',
                group: 'poCodes',
            },
            {
                type: 'nameId',
                name: 'item',
                label: $localize`Product descrption`,
                search: 'selectObjObj',
                options: this.genral.getItemsCashew('RoastPacked'),
            },
            {
                type: 'weight2',
                name: 'totalRow',
                label: $localize`Loaded amounts`,
                search: 'objArray',
            },
            {
                type: 'normal',
                name: 'status',
                label: $localize`Status`,
                search: 'select',
                options: this.genral.getProcessStatus(),
                group: 'shipmentCode',
            },
            // {
            //     name: 'producedItems',
            //     label: 'Produced items',
            //     // type: 'object',
            //     type: 'itemWeight',
            //     // options: 'currency',
            // },
            {
              name: 'loadedTotals',
              type: 'kidArray',
              collections: [
              ]
            }
          ];
          this.localService.getAllLoadings(this.dateRange).pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = <any[]>value;
          });
          this.type = 'Loading';
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
