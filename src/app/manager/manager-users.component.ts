import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { OneColumn } from '../field.interface';
import { Genral } from './../genral.service';
import { EditDialogComponent } from './edit-dialog.component';
import { ManagerService } from './manager.service';

@Component({
    selector: 'managment-users',
    template: `
    <h1 style="text-align:center" i18n>Users Management</h1>
    <div class="centerButtons">
        <button mat-raised-button color="primary" (click)="newUserDialog()">{{'User' | namingPipe : 'add'}}</button>
        <button mat-raised-button color="primary" (click)="newPersonDialog()">{{'UserPerson' | namingPipe : 'add'}}</button>
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
            label: $localize`Name`,
            search: 'normal',
        },
        {
            name: 'username',
            label: $localize`Username`,
            search: 'normal',
        },
        {
            name: 'roles',
            label: $localize`Roles`,
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
    this.regConfig = [
        {
            type: 'select',
            label: $localize`Select person`,
            name: 'person',
            options: this.localService.getPersons(),
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: $localize`Person Required`
                }
            ]
        },
    ];
    this.addUserConfig();
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '80%',
      height: '80%',
      data: {regConfig: this.regConfig, mainLabel: 'UserPerson', type: 'userPerson'},
    });
    dialogRef.afterClosed().subscribe(data => {
        if(data === 'success') {
            this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                this.usersSource = <any[]>value;
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
      data: {regConfig: this.regConfig, mainLabel: 'User', type: 'user'},
    });
    dialogRef.afterClosed().subscribe(data => {
        if(data === 'success') {
            this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                this.usersSource = <any[]>value;
            });
        }
    });
  }

  editNewDialog(user): void {
    this.localService.getUser(user['id']).pipe(take(1)).subscribe(value => {
        const myRegConfig = [
            {
                type: 'bigoutside',
                name: 'person',
                collections: [
                    {
                        type: 'input',
                        label: $localize`Name`,
                        name: 'name',
                        inputType: 'text',
                        disable: true,
                    },
                ]
            },
            {
                type: 'input',
                label: $localize`Username`,
                name: 'username',
                inputType: 'text',
                disable: true,
                validations: [
                    {
                        name: 'required',
                        validator: Validators.required,
                        message: $localize`Username Required`
                    }
                ]
            },
            {
                type: 'selectNormalMultiple',
                label: $localize`Roles`,
                name: 'roles',
                options: this.genral.getRoles(),
            },     
            {
                type: 'button',
                label: $localize`Submit`,
                name: 'submit',
            }
        ];
        const dialogRef = this.dialog.open(EditDialogComponent, {
            width: '80%',
            height: '80%',
            data: {putData: value, regConfig: myRegConfig, mainLabel: 'User', type: 'editUser'},
        });
        dialogRef.afterClosed().subscribe(data => {
            if(data === 'success') {
                this.localService.getAllUsers().pipe(take(1)).subscribe(value => {
                    this.usersSource = <any[]>value;
                });
            }
        });
    });
  }

  addUserConfig() {
      this.regConfig.push(
        {
            type: 'bigoutside',
            name: 'person',
            collections: [
                {
                    type: 'input',
                    label: $localize`Name`,
                    name: 'name',
                    inputType: 'text',
                    disable: true,
                },
            ]
        },
        {
            type: 'input',
            label: $localize`Username`,
            name: 'username',
            inputType: 'text',
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: $localize`Username Required`
                }
            ]
        },
        {
            type: 'input',
            label: $localize`Password`,
            name: 'password',
            inputType: 'password',
            validations: [
                {
                    name: 'required',
                    validator: Validators.required,
                    message: $localize`Password Required`
                }
            ]
        },
        {
            type: 'selectNormalMultiple',
            label: $localize`Roles`,
            name: 'roles',
            options: this.genral.getRoles(),
        },     
        {
            type: 'button',
            label: $localize`Submit`,
            name: 'submit',
        }
      );
  }
    
}