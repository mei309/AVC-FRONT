import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpecialOrdersService } from './special-orders.service';
@Component({
    selector: 'special-orders-dialog',
    template: `
    <button mat-mini-fab (click)="printWindow()">
      <mat-icon >print</mat-icon>
    </button>
    <div id="mmss">
        <h1 style="text-align:center">
            Special orders
        </h1>
    </div>
    <button mat-raised-button (click)="onNoClick()">Close</button>
    <button mat-raised-button (click)="editClick()">Edit</button>
    `,
})
export class SpecialOrdersDialogComponent {
    id;
    fromNew: boolean;
    supllier: any;

    constructor(private LocalService: SpecialOrdersService, public dialogRef: MatDialogRef<SpecialOrdersDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any) {
            this.id = data.id;
            this.fromNew = data.fromNew;
        }

    ngOnInit() {
        this.LocalService.getSupplier(this.id).toPromise().then( val => {
            this.supllier = {"name":"fcvgbhn","categories":[{"id":1,"name":"Raw Cashew"},
            {"id":5,"name":"Salt"}],"company":{"contactInfo":{"street":"Other Hageonim","country":{"name":"Israel","id":1},"city":{"name":"Jerusalem","id":1,"countryID":1},"phones":["549701959"],"emails":["isral309@gmail.com","isral309@gmail.com"],"faxes":[null]},"contacts":[{"person":{"contactInfo":{"name":"Sarah Lieberman","street":"Other Hageonim","country":{"name":"Israel","id":1},"city":{"name":"Jerusalem","id":1,"countryID":1},"phones":["549701959"],"emails":["isral309@gmail.com"],"faxes":[null]},"posisions":{"id":2,"name":"Driver"},"idCard":null,"dob":null},
            }],"legelInfo":{"englishName":null,"vietnamName":null,"companyLicence":null,"taxCode":null,"registedCode":null},"bankAccount":[{"name":"bbbb","number":null,"bank":{"name":"Vietnam","id":2},"Branch":{"name":"Jerusalem","id":1,"countryID":1}}, {"name":"aaaa","number":null,"bank":{"name":"Vietnam","id":2},"Branch":{"name":"Jerusalem","id":1,"countryID":1}}]}};
        });
    }

    onNoClick(): void {
        this.dialogRef.close('closed');
    }



    editClick(): void {
        if (!this.fromNew) {
            this.LocalService.keepData(this.supllier);
        }
        this.dialogRef.close('edit');
    }


    public printWindow(): void {
        // let virtualWindow: any = window.open('', 'PRINT', 'height=400,width=800');
        // virtualWindow.document.write('<html><head><title>Print</title>');
        // virtualWindow.document.write('</head><body>' + document.getElementById('mmss').innerHTML + '</body></html>');
        // virtualWindow.document.close();
        // virtualWindow.focus();
        // setTimeout(t => { virtualWindow.print();
        // virtualWindow.close(); }, 1000);
    }


}
