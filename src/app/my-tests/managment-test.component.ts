import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Genral } from './../genral.service';
import { includesValdaite } from './compareService.interface';
import { ManagerService } from '../manager/manager.service';
@Component({
  selector: 'app-managment-test',
  template: `
  <div style="white-space: pre-wrap;">{{massage}}</div>
    ` ,
})
export class ManagmentTestComponent implements OnInit {
  massage = '';

  randomNum;

  constructor(private LocalService: ManagerService, private genral: Genral) { }
  
  ngOnInit(): void {
            this.randomNum = new Date().getMilliseconds();
    // this.LocalService.getPoCashewCodesActiv().pipe(take(1)).subscribe(value1 => {
    //   this.LocalService.getItemsCashew().pipe(take(1)).subscribe(value2 => {
            const roles = this.genral.getRoles();
            const mainUser = { "personName": "test user"+this.randomNum, "username": "test"+this.randomNum, "password": this.randomNum, "roles": [ roles[0], roles[1] ] };
            this.LocalService.addUser(mainUser).pipe(take(1)).subscribe(value4 => {

                this.LocalService.getUser(value4).pipe(take(1)).subscribe(value5 => {
                    console.log(value5);
                    console.log(mainUser);
                    
                    
                    delete mainUser['password'];
                    if(includesValdaite(Object.assign({}, value5), Object.assign({}, mainUser))) {
                    this.massage += 'adding user SUCSSESFUL\n';
                    } else {
                    this.massage += 'adding user not including something\n';
                    }
                });

            
            });


            // this.LocalService.getPersons().pipe(take(1)).subscribe(value6 => {
            //     const mainUserPerson = { "person": value6[0], "username": "test"+this.randomNum+1, "password": this.randomNum+2, "roles": [ roles[0] ] };
            //     this.LocalService.addUser(mainUserPerson).pipe(take(1)).subscribe(value7 => {

            //         this.LocalService.getUser(value7).pipe(take(1)).subscribe(value8 => {
                        
            //             if(includesValdaite(Object.assign({}, value8), Object.assign({}, mainUserPerson))) {
            //             this.massage += 'adding user from person SUCSSESFUL\n';
            //             } else {
            //             this.massage += 'adding user from person not including something\n';
            //             }
            //         });

                
            //     });
            // });


            // this.LocalService.getAllUsers().pipe(take(1)).subscribe(value10 => {
            //     value10[1]['roles'] = [ roles[1] ];
                
            //     this.LocalService.editUser(value10[1]).pipe(take(1)).subscribe(value11 => {

            //         this.LocalService.getUser(value11).pipe(take(1)).subscribe(value12 => {
                        
            //             if(includesValdaite(Object.assign({}, value12), Object.assign({}, value10[1]))) {
            //             this.massage += 'edit user SUCSSESFUL\n';
            //             } else {
            //             this.massage += 'edit user not including something\n';
            //             }
            //         });

                
            //     });
            // });
    //   });
    // });


    
      

    

  }
}