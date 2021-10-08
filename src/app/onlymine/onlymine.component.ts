import { HttpBackend, HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-onlymine',
  templateUrl: './onlymine.component.html'
})
export class OnlymineComponent implements OnInit {

  progress: number = 0;

  selectedFile: File = null;
  fileUrl = null;
  images = ['mmexport1568785553247.jpg'];
  private httpClient: HttpClient;
    constructor(private http: HttpClient, private handler: HttpBackend) {
          this.httpClient = new HttpClient(handler);

    }

  ngOnInit(): void {
  }


  onFileSelected(event:any){
    this.selectedFile = <File> event.target.files[0];
  }

  async onUpload() {
    console.log('1. SelectedFile: ', this.selectedFile);
    const body = { fileName: this.selectedFile.name }
    this.http.post(environment.baseUrl+'urli', body).subscribe(preSignedUrl => {
      console.log('2. PreSignedURL: ', preSignedUrl)
      console.log('3. Upoloading File (binary) to S3')


      this.httpClient.put(preSignedUrl.toString(), this.selectedFile, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);

        }
      });
      // upload.then(data => {
      //   console.log('=> ', data )
      // }).catch(err => console.log('error: ', err))
    });


  }

  async onGet(path: string) {
    const body = { fileName: path }
    this.http.post(environment.baseUrl+'getUrls', body).subscribe(preSignedUrl => {
      console.log('2. PreSignedURL: ', preSignedUrl)
      console.log('3. Get File (binary) from S3')

      // let reader = new FileReader();
      this.fileUrl = preSignedUrl.toString();
      // window.open(preSignedUrl.toString());
      // const upload = this.httpClient.get(preSignedUrl.toString(),{ responseType: 'blob' }).toPromise();
      // upload.then(() => {
      //   this.showFile = reader.result;
      //   console.log('=> ' )
      // }).catch(err => console.log('error: ', err))
    });
  }

}
