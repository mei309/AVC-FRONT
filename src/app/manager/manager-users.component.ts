import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
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
        <button class="raised-margin" mat-raised-button color="primary" (click)="newUserDialog()">Add User</button>
        <button class="raised-margin" mat-raised-button color="primary" (click)="newPersonDialog()">Add User For Person</button>
    </div>
    <search-details [dataSource]="usersSource" [oneColumns]="columnsUsers" (details)="editNewDialog($event)">
    </search-details>
    `
  })
export class ManagmentUsersComponent implements OnInit {

    regConfig = [];
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
    this.regConfig = [];
    this.regConfig.push(
        {
            type: 'select',
            label: 'Select person',
            name: 'person',
            options: this.localService.getPersons(),
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: 'Person Required'
                }
            ]
        },
    );
    this.addUserConfig();
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {regConfig: this.regConfig, mainLabel: 'Add user from existing person'},
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


  newUserDialog(): void {
    this.regConfig = [];
    this.addUserConfig();
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {regConfig: this.regConfig, mainLabel: 'Add user'},
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== 'closed' && data) {
        this.localService.addUser(data).pipe(take(1)).subscribe( val => {
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
    const myRegConfig = [
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
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: 'Username Required'
                }
            ]
        },
        {
            type: 'selectNormalMultiple',
            label: 'Roles',
            name: 'roles',
            options: this.genral.getRoles(),
        },     
        {
            type: 'button',
            label: 'Submit',
            name: 'submit',
        }
    ];
    this.addUserConfig();
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {putData: value, regConfig: myRegConfig, mainLabel: value? 'Edit user': 'Add user'},
    });
    dialogRef.afterClosed().subscribe(data => {
        if(!data || data === 'closed') {
        } else if(data === 'remove') {
            // this.localService.removeSetup(this.choosedOne, value).pipe(take(1)).subscribe( val => {
            //     this.setupSource.pop(value);
            // });
        }else if (!isEqual(value['roles'], data['roles']) || value['username'] !== data['username']) {
            this.localService.editUser(data).pipe(take(1)).subscribe( val => {
                this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                    this.usersSource = <any[]>value;
                });
            });
        }
    });
  }

  addUserConfig() {
      this.regConfig.push(
        {
            type: 'input',
            label: 'Username',
            name: 'username',
            inputType: 'text',
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: 'Username Required'
                }
            ]
        },
        {
            type: 'input',
            label: 'Password',
            name: 'password',
            inputType: 'password',
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: 'Password Required'
                }
            ]
        },
        {
            type: 'selectNormalMultiple',
            label: 'Roles',
            name: 'roles',
            options: this.genral.getRoles(),
        },     
        {
            type: 'button',
            label: 'Submit',
            name: 'submit',
        }
      );
  }
    
}