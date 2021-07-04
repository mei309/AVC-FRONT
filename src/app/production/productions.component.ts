import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DropNormal, OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionService } from './production.service';
@Component({
  selector: 'app-productions',
  templateUrl: './productions.component.html',
})
export class ProductionsComponent implements OnInit {
  navigationSubscription;
  
  tabIndex: number = 0;
  
  columnsShow: OneColumn[];

  totelColumn: OneColumn = {
      type: 'weight2',
      name: 'processGain',
      label: $localize`Total difference`,
      group: 'poCodes',
  };
  type: string = '';
  
  cashewSourceColumns;

  dateRange;

  ItemsChangable1 = new ReplaySubject<any[]>();
  ItemsChangable2 = new ReplaySubject<any[]>();

  constructor(private router: Router, public dialog: MatDialog, private localService: ProductionService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
        if(params.get('number')) {
            this.tabIndex = +params.get('number');
        }
    });
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
              name: 'producedItems',
              label: $localize`Produced items`,
              search: 'listAmountWithUnit',
              options: this.ItemsChangable2,
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
              name: 'status',
              label: $localize`Status`,
              search: 'select',
              options: this.genral.getProcessStatus(),
          },
          // {
          //     type: 'date',
          //     name: 'receiptDate',
          //     label: 'Receipt date',
          //     search: 'dates',
          // },
          // {
          //     type: 'date',
          //     name: 'processDate',
          //     label: 'Process date',
          //     search: 'dates',
          // },
      ];
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this._Activatedroute.paramMap.pipe(take(1)).subscribe(params => {
            if(params.get('number')) {
              this.tabIndex = +params.get('number');
            }
            this.changedAndDate(this.tabIndex);
          });
        }
      });
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(ProductionDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === $localize`Edit`) {
          switch (this.tabIndex) {
                case 0:
                    this.router.navigate(['../Cleaning',{id: event['id'], poCode: event['poCodeIds'][0]}], { relativeTo: this._Activatedroute });
                    break;
                case 1:
                    this.router.navigate(['../Roasting',{id: event['id'], poCode: event['poCodeIds'][0]}], { relativeTo: this._Activatedroute });
                    break;
                case 2:
                    this.router.navigate(['../Toffee',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
                    break;
                case 3:
                    this.router.navigate(['../Packing',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
                    break;
                  case 2:
                    this.router.navigate(['../QcPacking',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
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
          this.cashewSourceColumns = null;
          this.localService.getAllCleaning(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Cleaning';
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getAllRoasting(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Roasting';
          this.cdRef.detectChanges();
          break;
        case 2:
          this.cashewSourceColumns = null;
          this.localService.getAllToffee(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Toffee';
          this.cdRef.detectChanges();
          break;
        case 3:
          this.cashewSourceColumns = null;
          this.localService.getAllPacking(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Packing';
          this.cdRef.detectChanges();
          break;
        case 4:
          this.cashewSourceColumns = null;
          // this.localService.getAllPacking(this.dateRange).pipe(take(1)).subscribe(value => {
          //   this.cashewSourceColumns = <any[]>value;
          // });
          this.type = 'QC Packing';
          this.cdRef.detectChanges();
          break;
        default:
          break;
      }
      this.genral.getItemsCashew(this.type == 'QC Packing'? 6 : this.tabIndex).pipe(take(1)).subscribe(val => {
        this.ItemsChangable1.next(val);
      });
      this.genral.getItemsCashew(this.tabIndex+1).pipe(take(1)).subscribe(val => {
        this.ItemsChangable2.next(val);
      });
    }


    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
      this.ItemsChangable1.unsubscribe();
      this.ItemsChangable2.unsubscribe();
    }

}
