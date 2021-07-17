import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from '../genral.service';
import { QcService } from './qc.service';
import { QcDetailsDialogComponent } from './qc-details-dialog.component';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-all-qcs',
  templateUrl: './all-qcs.component.html',
})
export class AllQcsComponent implements OnInit {
  navigationSubscription;

  tabIndex: number = 0;

  ItemsChangable1 = new ReplaySubject<any[]>();

  columnsShow: OneColumn[];

  type: string;
  
  cashewSourceColumns;

  dateRange;

  constructor(private router: Router, public dialog: MatDialog, private localService: QcService,
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
        name: 'id',
        titel: 'id',
        type: 'idGroup',
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
        type: 'nameId',
        name: 'item',
        label: $localize`Product descrption`,
        search: 'selectObjObj',
        options: this.ItemsChangable1,
      },
      {
        type: 'percentNormal',
        name: 'totalDamage',
        label: $localize`Total damage`,
        search: 'percentage',
      },
      {
        type: 'percentNormal',
        name: 'totalDefects',
        label: $localize`Total defects`,
        search: 'percentage',
      },
      {
        type: 'percentNormal',
        name: 'totalDefectsAndDamage',
        label: $localize`Total defects + damage`,
        search: 'percentage',
      },
      {
        type: 'dateTime',
        name: 'checkDate',
        label: $localize`Check date`,
        search: 'dates',
      },
      {
        type: 'arrayVal',
        name: 'approvals',
        label: $localize`Approvals`,
        search: 'object',
      },
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
    const dialogRef = this.dialog.open(QcDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type+' QC'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
        if(this.type === 'Raw') {
          if(event['precentage']) {
            this.router.navigate(['../RawPercntage',{id: event['id']}], { relativeTo: this._Activatedroute });
          } else {
            this.router.navigate(['../Raw',{id: event['id']}], { relativeTo: this._Activatedroute });
          }
        } else {
          if(event['precentage']) {
            this.router.navigate(['../RawPercntage',{id: event['id'], roast: true}], { relativeTo: this._Activatedroute });
          } else {
            this.router.navigate(['../Raw',{id: event['id'], roast: true}], { relativeTo: this._Activatedroute });
          }
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
          this.cashewSourceColumns = null;
          this.localService.getRawQC(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Raw';
          this.localService.getItemsCashewBulk(false).pipe(take(1)).subscribe(val => {
            this.ItemsChangable1.next(val);
          });
          this.cdRef.detectChanges();
          break;
        case 1:
          this.cashewSourceColumns = null;
          this.localService.getRoastQC(this.dateRange).pipe(take(1)).subscribe(value => {
            this.cashewSourceColumns = <any[]>value;
          });
          this.type = 'Roast';
          this.localService.getItemsCashewBulk(true).pipe(take(1)).subscribe(val => {
            this.ItemsChangable1.next(val);
          });
          this.cdRef.detectChanges();
          break;
        case 2:
          break;
        default:
          break;
      }
    }



    ngOnDestroy() {
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
      this.ItemsChangable1.unsubscribe();
    }
}
