import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './products.service';
@Component({
    selector: 'add-products',
    template: `
    <h1 style="text-align:center">
      add {{type}}
    </h1>
    <div *ngIf="isDataAvailable">
    <div *ngFor="let key of objectKeys(supllier)">{{key + ' : ' + supllier[key]}}</div>
    <pre>{{supllier | json}}</pre>
    

    </div>
    <button mat-raised-button (click)="onNoClick()">Close</button>
    <button mat-raised-button (click)="editClick()">Edit</button>
    `,
})
export class AddProductDialogComponent {
    objectKeys = Object.keys;
    type;
    supllier: any;
    isDataAvailable = false;

    constructor(private _Activatedroute: ActivatedRoute, private router: Router, private LocalService: ProductService, public dialogRef: MatDialogRef<AddProductDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.type = data.type;
        }

    async ngOnInit() {
        // await this.LocalService.getSupplier(0).toPromise().then( val => {
        //     this.supllier = {"name":"fcvgbhn","categories":[{"id":1,"name":"Raw Cashew"}, 
        //     {"id":5,"name":"Salt"}],"company":{"contactInfo":{"street":"Other Hageonim","country":{"name":"Israel","id":1},"city":{"name":"Jerusalem","id":1,"countryID":1},"phones":["549701959"],"emails":["isral309@gmail.com","isral309@gmail.com"],"faxes":[null]},"contacts":[{"person":{"contactInfo":{"name":"Sarah Lieberman","street":"Other Hageonim","country":{"name":"Israel","id":1},"city":{"name":"Jerusalem","id":1,"countryID":1},"phones":["549701959"],"emails":["isral309@gmail.com"],"faxes":[null]},"posisions":{"id":2,"name":"Driver"},"idCard":null,"dob":null},
        //     }],"legelInfo":{"englishName":null,"vietnamName":null,"companyLicence":null,"taxCode":null,"registedCode":null},"bankAccount":[{"name":null,"number":null,"bank":{"name":"Vietnam","id":2},"Branch":{"name":"Jerusalem","id":1,"countryID":1}}]}};
            
        //     this.isDataAvailable = true;
        // });
    }
    onNoClick(): void {
        this.dialogRef.close('closed');
    }



    editClick(): void {
        this.dialogRef.close('edit');
    }
}
