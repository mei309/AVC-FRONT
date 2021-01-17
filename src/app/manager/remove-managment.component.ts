import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ManagerService } from './manager.service';

@Component({
    selector: 'remove-managment',
    template: `
    JUST FILL ONE OF THEM
    <ng-container *ngFor="let field of removalConfig;" dynamicField [field]="field" [group]="form">
    </ng-container>
    <button type="button" class="raised-margin" mat-raised-button color="accent" (click)="submit()">Submit</button>
    `
  })
export class RemoveManagment {
    form: FormGroup;
    removalConfig;

    constructor(private localService: ManagerService, private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({});
        this.form.addControl('removeAllProcesses', this.fb.control(''));
        this.form.addControl('removeProcess', this.fb.control(''));

        this.removalConfig = [
            {
                type: 'input',
                label: 'Remove all processes',
                name: 'removeAllProcesses',
                inputType: 'numeric',
            },
            {
                type: 'input',
                label: 'Remove process',
                name: 'removeProcess',
                inputType: 'numeric',
            },
        ];
    }
    
    

    submit() {
        let val = this.form.value;
        if(val.removeAllProcesses) {
            if(window.confirm('are you sure you want to delete all processes of this #PO?')) {
                this.localService.removeAllProcesses(+val.removeAllProcesses).pipe(take(1)).subscribe(value => {
                    console.log('succes');
                });
            }
        } else if(val.removeProcess) {
            if(window.confirm('are you sure you want to delete this process?')) {
                this.localService.removeProcess(+val.removeProcess).pipe(take(1)).subscribe(value => {
                    console.log('succes');
                });
            }
        }
    }
}