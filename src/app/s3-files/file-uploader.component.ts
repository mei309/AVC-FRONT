import { HttpBackend, HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./files.component.scss']
})
export class FileUploaderComponent implements OnInit {

  allFileProcess = { all: 0, done: 0, err: 0 };

  functionUrl;
  processId;
  type: string;
  fileNames: string[] = [];

  files: any[] = [];

  newFiles: boolean = true;

  private httpClient: HttpClient;
    constructor(private http: HttpClient, private handler: HttpBackend, public dialogRef: MatDialogRef<FileUploaderComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: any) {
          this.functionUrl = data.functionUrl;
          this.processId = data.processId;
          this.type = data.type;
          this.fileNames = data.fileNames
          this.httpClient = new HttpClient(handler);
    }

  ngOnInit(): void {
  }


  /**
   * on file drop handler
   */
  onFileDropped($event, name?: string) {
    this.prepareFilesList($event, name);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files, name?: string) {
    this.prepareFilesList(files, name);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this.files.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.files[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.files[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>, name?: string) {
    for (const item of files) {

      if(name) {
        item.name = name+'.jpg';
      }
      console.log(this.files);

      if(this.files.some(a => a.name === item.name)) {
        alert('Avoiding duplicates');
      } else {
        item.progress = 0;
        this.files.push(item);
      }
    }
  }


  uploadFilesList() {
    this.newFiles = false;
    this.allFileProcess.all = this.files.length;
    for (const item of this.files) {
      // console.log('1. SelectedFile: ', item.name);
      const body = { processId: this.processId, address: item.name }
      this.http.post(environment.baseUrl+'files/'+this.functionUrl, body).subscribe(preSignedUrl => {
        // console.log('2. PreSignedURL: ', preSignedUrl)
        // console.log('3. Upoloading File (binary) to S3')


        this.httpClient.put(preSignedUrl.toString(), item, {
          reportProgress: true,
          observe: 'events'
        })
        .subscribe({
          next: (event) => {
            switch (event.type) {
              case HttpEventType.Sent:
                console.log('Request has been made!');
                break;
              case HttpEventType.ResponseHeader:
                console.log('Response header has been received!');
                break;
              case HttpEventType.UploadProgress:
                item.progress = Math.round(event.loaded / event.total * 100);
                console.log(`Uploaded! ${item.progress}%`);
                break;
              case HttpEventType.Response:
                console.log('File successfully uploaded!', event.body);
                setTimeout(() => {
                  item.progress = 100;
                  this.allFileProcess.done += 1;
                }, 1500);
            }
          },
          error: (e) => {
            item.error = e.statusText;
            this.allFileProcess.err += 1;
          }
        });
      });
    }
    // this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onNoClick(): void {
    this.dialogRef.close('closed');
  }

  ngOnDestroy() {
    // this.oneClickOnlySubscription.unsubscribe();
  }

}
