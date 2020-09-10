import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { OneColumn } from './../field.interface';
import { InventoryService } from './inventory.service';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';

@Component({
  selector: 'app-genral-inventory',
  templateUrl: './genral-inventory.component.html',
})
export class GenralInventoryComponent implements OnInit {

  dateRangeDisp = {begin: new Date(2020, 7, 5), end: new Date(2020, 7, 25)};
  tabIndex: number;
  columnsShow: OneColumn[];

  generalSource: any[];
  generalSourceColumns: any[];

  constructor(private router: Router, public dialog: MatDialog, private localService: InventoryService, private genral: Genral,
    private _Activatedroute: ActivatedRoute, private cdRef:ChangeDetectorRef) {
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
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(InventoryDetailsDialogComponent, {
      width: '80%',
      data: {id: event['id'], fromNew: false, type: 'Inventory item'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data === 'Edit') {
          switch (this.tabIndex) {
                
              default:
                  break;
          }
      }
    });
  }

    changed(event) {
      switch (+event) {
        case 0:
          this.generalSourceColumns = null; 
          this.localService.getGeneralInventoryItem().pipe(take(1)).subscribe(value => {
            this.generalSource = <any[]>value;
            this.generalSourceColumns = [this.generalSource, this.columnsShow];
          });
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'item',
              label: 'Product',
              search: 'selectAsyncObject',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: 'Total stock',
              search: 'object',
              group: 'item',
            },
            {
              type: 'nameId',
              name: 'poCode',
              label: 'PO#',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Total balance',
              search: 'object',
              // group: 'poCode',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: 'Storage',
              search: 'selectAsyncObject',
              options: this.genral.getStorage(),
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            },
          ];
          this.cdRef.detectChanges();
          break;
        case 1:
          this.generalSourceColumns = null; 
          this.localService.getGeneralInventoryByPo().pipe(take(1)).subscribe(value => {
            this.generalSource = <any[]>value;
            this.generalSourceColumns = [this.generalSource, this.columnsShow];
          });
          this.columnsShow = [
            {
              type: 'nameId',
              name: 'poCode',
              label: 'PO#',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'weight2',
              name: 'totalStock',
              label: 'Total stock',
              search: 'object',
              group: 'poCode',
            },
            {
              type: 'nameId',
              name: 'item',
              label: 'Product',
              search: 'selectAsyncObject',
              options: this.genral.getAllItemsCashew(),
              group: 'item',
            },
            {
              type: 'weight2',
              name: 'totalBalance',
              label: 'Total balance',
              search: 'object',
              // group: 'item',
            },
            {
              type: 'arrayVal',
              name: 'warehouses',
              label: 'Storage',
              search: 'selectAsyncObject',
              options: this.genral.getStorage(),
            },
            {
              name: 'poInventoryRows',
              type: 'kidArray',
            }
          ];
          this.cdRef.detectChanges();
          break;
        case 2:
        
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
    
}