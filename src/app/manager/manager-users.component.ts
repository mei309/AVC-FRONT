import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {isEqual} from 'lodash-es';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { EditDialogComponent } from './edit-dialog.component';
import { ManagerService } from './manager.service';
@Component({
    selector: 'managment-users',
    template: `
    <h1 style="text-align:center">Users Management</h1>
    <div class="centerButtons">
        <button class="raised-margin" mat-raised-button color="primary" (click)="editNewDialog()">Add User</button>
        <button class="raised-margin" mat-raised-button color="primary" (click)="newPersonDialog()">Add User For Person</button>
    </div>
    <search-details [dataSource]="usersSource" [oneColumns]="columnsUsers" (details)="editNewDialog($event)">
    </search-details>
    `
  })
export class ManagmentUsersComponent implements OnInit {

    usersSource;
    columnsUsers: OneColumn[] = [
        {
            name: 'personName',
            label: 'Name',
            search: 'normal',
        },
        {
            name: 'username',
            label: 'Username',
            search: 'normal',
        },
        {
            name: 'roles',
            label: 'Roles',
            search: 'select',
            options: this.genral.getRoles(),
        },
    ];

    

    constructor(private localService: ManagerService, private genral: Genral, public dialog: MatDialog) {
    }


    ngOnInit() {
        this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
            this.usersSource = <any[]>value;
        });
    }

  newPersonDialog(): void {
    const regConfig = [
        {
            type: 'select',
            label: 'Select person',
            name: 'person',
            options: this.localService.getPersons(),
        },
        {
            type: 'input',
            label: 'Username',
            name: 'username',
            inputType: 'text',
        },
        {
            type: 'input',
            label: 'Password',
            name: 'password',
            inputType: 'password',
            disable: true,
        },
        {
            type: 'selectNormal',
            label: 'Roles',
            name: 'roles',
            inputType: 'multiple',
            options: this.genral.getRoles(),
        },     
        {
            type: 'button',
            label: 'Submit',
            name: 'submit',
        }
    ];
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {regConfig: regConfig, mainLabel: 'Add user from existing person'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== 'closed' && data) {
        this.localService.addUserPerson(data).pipe(take(1)).subscribe( val => {
            this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                this.usersSource = <any[]>value;
            });
        });
      }
    });
  }

  editNewDialog(value: any = null): void {
    if(value) {
        value['person'] = {name: value['personName']};
    }
    const regConfig = [
        {
            type: 'bigoutside',
            name: 'person',
            collections: [
                {
                    type: 'input',
                    label: 'Name',
                    name: 'name',
                    inputType: 'text',
                    disable: true,
                },
            ]
        },
        {
            type: 'input',
            label: 'Username',
            name: 'username',
            inputType: 'text',
        },
        {
            type: 'input',
            label: 'Password',
            name: 'password',
            inputType: 'password',
            disable: true,
        },
        {
            type: 'selectNormal',
            label: 'Roles',
            name: 'roles',
            inputType: 'multiple',
            options: this.genral.getRoles(),
        },     
        {
            type: 'button',
            label: 'Submit',
            name: 'submit',
        }
    ];
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {putData: value, regConfig: regConfig, mainLabel: value? 'Edit user': 'Add user'},
    });
    dialogRef.afterClosed().subscribe(data => {
        if(!data || data === 'closed') {
        } else if(data === 'remove') {
            // this.localService.removeSetup(this.choosedOne, value).pipe(take(1)).subscribe( val => {
            //     this.setupSource.pop(value);
            // });
        } else if (!value) {
            this.localService.addUser(data).pipe(take(1)).subscribe( val => {
                this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                    this.usersSource = <any[]>value;
                });
            });
        } else if (!isEqual(value, data)) {
            this.localService.editUser(data).pipe(take(1)).subscribe( val => {
                this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                    this.usersSource = <any[]>value;
                });
            });
        }
    });
  }
    
}