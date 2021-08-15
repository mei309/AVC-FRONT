import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Genral } from '../genral.service';
import { ManagerService } from './manager.service';
import { diff } from '../libraries/diffArrayObjects.interface';
// import diff_arrays_of_objects from 'diff-arrays-of-objects';
@Component({
    selector: 'managment-notifications',
    template: `
    <div style="text-align: center;">
      <h1>Notification managment</h1>
      <div class="example-card" *ngFor="let process of proccesTypes">
        <mat-card (click)="editProcessAlerts(process)">
          <mat-card-header>
            <mat-card-title>{{process}}</mat-card-title>
          </mat-card-header>
          <mat-card-content *ngIf="putNotfictions">
            <ul>
              <li *ngFor="let item of putNotfictions[process]">
                  {{item['username']['value']}}: [
                    <ng-container *ngFor="let proccesAlert of item['procecces']">
                        {{proccesAlert['value']}}
                    </ng-container>
                  ]
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
    
    `
  })
export class ManagmentNotificationsComponent implements OnInit {
    
    proccesTypes;
    putNotfictions;

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
      }

    ngOnInit() {
      this.localService.getAllProcessTypeAlerts().pipe(take(1)).subscribe(value => {
        this.putNotfictions = value;
      });
      this.proccesTypes = ['CASHEW_ORDER', 'GENERAL_ORDER', 'CASHEW_RECEIPT', 'GENERAL_RECEIPT',
      'CASHEW_RECEIPT_QC', 'VINA_CONTROL_QC', 'SAMPLE_QC', 'SUPPLIER_QC',
      'ROASTED_CASHEW_QC',
      'STORAGE_TRANSFER', 'STORAGE_RELOCATION',
      'CASHEW_CLEANING',
      'CASHEW_ROASTING',
      'CASHEW_TOFFEE',
      'PACKING',
      'CONTAINER_LOADING', 'CONTAINER_BOOKING', 'CONTAINER_ARRIVAL',
      'GENERAL_USE', 'PRODUCT_USE'];
    }


    editProcessAlerts(localValue: any) {
      const dialogRef = this.dialog.open(EditNotifictionsDialogComponent, {
        width: '80%',
        height: '80%',
        data: {putData: this.putNotfictions[localValue], proccesName: localValue},
      });
      dialogRef.afterClosed().subscribe(data => {
        if(data === 'succses') {
          this.localService.getAllProcessTypeAlerts().pipe(take(1)).subscribe(value => {
            this.putNotfictions = value;
          });
        }
      });
    }
}

@Component({
  selector: 'app-edit-notifiction-dialog',
  template: ` 
  <h1 style="text-align:center" i18n>Alert for {{proccesName}}</h1>
  <div *ngIf="isDataAvailable" class="tables mat-elevation-z8">
    <table mat-table [dataSource]="dataSource">

        <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>
              <h3 i18n>User</h3>
            </th>
            <td mat-cell *matCellDef="let element"> {{element['user']}} </td>
        </ng-container>
        <ng-container matColumnDef="{{column}}" *ngFor="let column of displayedColumns">
            <th style="text-align: center;" mat-header-cell *matHeaderCellDef>{{column}}</th>
            <td style="text-align: center;" mat-cell *matCellDef="let element">
                    <mat-checkbox [(ngModel)]="element[column]"></mat-checkbox>
            </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['user'].concat(displayedColumns)"></tr>
        
        <tr mat-row *matRowDef="let row; columns: ['user'].concat(displayedColumns)"></tr>

    </table>
  </div>
  <div style="text-align: right;">
    <button class="raised-margin" mat-raised-button color="primary" (click)="submit()" i18n>Submit</button>
  </div>
  `,
})
export class EditNotifictionsDialogComponent {

  isDataAvailable = false;
  
  displayedColumns: string[] = [];

  firstSource: any[] = [];
  dataSource: any[] = [];
  putData: any = null;
  proccesName;
 
  submit() {
    var addAlerts = [];
    var removeAlerts = [];
    var result = diff(this.firstSource, this.dataSource, 'user', { updatedValues: 3});
    
    result['updated'].forEach(element => {
      const userExisting = this.putData.find(elem => elem['username']['id'] === element[0]['id']);
      Object.keys(element[0]).forEach(ele => {
        if(element[0][ele] !== element[1][ele]){
          if(element[1][ele]) {
            addAlerts.push({managementType: ele, userId: element[0]['id']})
          } else {
            const proccesRemoving = userExisting['procecces'].find(eleme => eleme['value'] === ele);
            removeAlerts.push(proccesRemoving['id'])
          }
        }
      });
    });
    result['added'].forEach(element => {
      this.genral.getApprovalType().forEach(ele => {
        if(element[ele]) {
          addAlerts.push({managementType: ele, userId: element['id']});
        }
      });
    });
    this.localService.addAlertUsers({adding: addAlerts, removing: removeAlerts, processName: this.proccesName}).pipe(take(1)).subscribe(value => {
      this.dialogRef.close('succses');
    });
  }

  ngOnInit(){
    this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
      (<any[]>value).forEach(element => {
        var user = {user: element['value'], id: element['id']};
        this.genral.getApprovalType().forEach(ele => {
          user[ele] = false;
        });
        const userExisting = this.putData.find(elem => elem['username']['value'] === element['value']);
        if(userExisting) {
          user['fromExist'] = true;
          userExisting['procecces'].forEach(prooc => {
            user[prooc['value']] = true;
          });
          this.firstSource.push(Object.assign({}, user));
        }
        this.dataSource.push(user);
      });
      this.isDataAvailable = true;
      // this.firstSource = this.dataSource.map(x => Object.assign({}, x));
    });
    this.displayedColumns = this.genral.getApprovalType();
  }
  
  constructor(private localService: ManagerService, private genral: Genral, public dialogRef: MatDialogRef<EditNotifictionsDialogComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any) {
          this.putData = data.putData;
          this.proccesName = data.proccesName;
          if(!this.putData) {
            this.putData = [];
          }
      }


  onNoClick(): void {
      this.dialogRef.close('closed');
  }

}

