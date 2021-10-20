import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'file-viewer',
  template: `
  <div style="text-align: center" *ngIf="!imagesShow; else seeImage">
    <h3 i18n>Images</h3>
    <mat-list style="width: 50%;margin: 0 auto;" role="list">
      <mat-list-item role="listitem" *ngFor="let item of fileList">{{item.address}}</mat-list-item>
    </mat-list>
    <button mat-raised-button color="primary" (click)="getImages()" i18n>View images</button>
</div>
  <ng-template #seeImage>
    <mat-grid-list cols="2" rowHeight="2:1.3">
      <mat-grid-tile *ngFor="let item of fileList">
        <mat-grid-tile-header>{{item.address}}</mat-grid-tile-header>
        <img mat-card-image style="width: 100%;" [src]="item.file" [alt]="item.address">
      </mat-grid-tile>
    </mat-grid-list>
  </ng-template>
    `,
    styleUrls: ['./files.component.scss']
})
export class FileViewerComponent implements OnInit {

  @Input() fileList;

  imagesShow: boolean = false;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {

  }

  async getImages() {
    this.imagesShow = true;
    this.fileList.forEach(ele => {
      const body = { fileName: ele.address }
      this.http.post(environment.baseUrl+'files/getImageQc', body).subscribe(preSignedUrl => {
        // console.log('2. PreSignedURL: ', preSignedUrl)
        // console.log('3. Get File (binary) from S3')

        // let reader = new FileReader();
        ele.file = preSignedUrl.toString();
        // window.open(preSignedUrl.toString());
        // const upload = this.httpClient.get(preSignedUrl.toString(),{ responseType: 'blob' }).toPromise();
        // upload.then(() => {
        //   this.showFile = reader.result;
        //   console.log('=> ' )
        // }).catch(err => console.log('error: ', err))
      });
    });
  }

}
