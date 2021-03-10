import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { OneColumn } from './../field.interface';
import { Genral } from './../genral.service';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersService } from './countiners.service';
@Component({
  selector: 'app-counteiners-reports',
  templateUrl: './counteiners-reports.component.html',
})
export class CountinersReportsComponent implements OnInit {
  tabIndex: number = 0;

  type: string;

  columnsShow: OneColumn[];

  columnsOpenPending: OneColumn[];
  
  mainSourceColumns;

  totelColumn: OneColumn = {
    type: 'weight2',
    name: 'totalRow',
    label: 'Total loaded',
    group: 'poCodes',
  };

  constructor(private router: Router, private dialog: MatDialog, private localService: CountinersService,
    private _Activatedroute: ActivatedRoute, private genral: Genral, private cdRef:ChangeDetectorRef) {
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
            name: 'shipmentCode',
            label: 'Shipment code',
            search: 'object',
            group: 'shipmentCode',
        },
        {
            type: 'arrayVal',
            name: 'poCodes',
            label: 'PO#',
            // search: 'object',
            group: 'poCodes',
        },
        {
            type: 'dateTime',
            name: 'recordedTime',
            label: 'Recorded time',
            search: 'dates',
            group: 'poCodes',
        },
        {
            type: 'nameId',
            name: 'item',
            label: 'Product descrption',
            search: 'selectAsyncObject',
            options: this.genral.getItemsRawCashew(),
        },
        {
            type: 'weight2',
            name: 'totalRow',
            label: 'Loaded amounts',
            // type: 'object',
            // options: 'currency',
        },
        {
            type: 'normal',
            name: 'status',
            label: 'Status',
            search: 'select',
            options: this.genral.getProcessStatus(),
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
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(CounteinersDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: this.type},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
        switch (this.tabIndex) {
              case 0:
                this.router.navigate(['../Loading',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              case 1:
                this.router.navigate(['../Arrival',{id: event['id']}], { relativeTo: this._Activatedroute });
                break;
              // case 2:
              //     this.router.navigate(['../Packing',{id: event['id'], poCodes: event['poCodeIds']}], { relativeTo: this._Activatedroute });
              //     break;
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
          this.localService.getAllLoadings().pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'Loading';
          this.cdRef.detectChanges();
          break;
        case 1:
          this.mainSourceColumns = null;
          this.localService.findFreeArrivals().pipe(take(1)).subscribe(value => {
            this.mainSourceColumns = [<any[]>value, this.columnsShow];
          });
          this.type = 'Arrivals';
          this.cdRef.detectChanges();
          break;
        case 2:
        //   this.mainSourceColumns = null;
        //   this.localService.getAllPacking().pipe(take(1)).subscribe(value => {
        //     this.mainSourceColumns = [<any[]>value, this.columnsShow];
        //   });
        //   this.type = 'Packing';
        //   this.cdRef.detectChanges();
        //   break;
        default:
          break;
      }
    }

    

    inlineRangeChange($event) {
      let begin = $event.begin.value;
      let end = $event.end.value;
      // this.dataSource.data = this.dataSource.data.filter(e=>e[column] > begin && e[column] < end ) ;
    }

}
