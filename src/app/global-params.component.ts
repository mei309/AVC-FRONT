import { Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Globals {
  globalPermission: string[] = [];
  globalProcessAuturtiy: Map<string, string[]>;
  // standarts: any[] = [];
  isSysManager: boolean = false;
  isManager: boolean = false;
  isMe: boolean = false;
  // setGlobalPermission(value) {
  //   value.forEach(element => {
  //     this.globalPermission.push(element['authority']);
  //   });
  //   this.isManager = this.globalPermission.includes('ROLE_SYSTEM_MANAGER');
  // }
  setGlobalProcessAuturtiy(value) {
    this.globalProcessAuturtiy = new Map<string, string[]>();
    for (var process in value) {
      this.globalProcessAuturtiy.set(process, value[process]);
    }
  }
  getGlobalProcessAuturtiy(processName) {
    return this.globalProcessAuturtiy.get(processName);
  }
  isGlobalProcessAuturtiy(processName): boolean {
    if(this.globalProcessAuturtiy) {
      return this.globalProcessAuturtiy.has(processName);
    }
    // else if(sessionStorage.getItem('processAuturtiy')) {
    //   this.setGlobalProcessAuturtiy(<any[]> JSON.parse(sessionStorage.getItem('processAuturtiy')));
    //   return this.globalProcessAuturtiy.has(processName);
    // }
    else {
      return false;
    }
  }
  // setGlobalStandarts(value) {
  //   this.standarts = value;
  // }
  // getGlobalStandarts() {
  //   return this.standarts;
  // }
  constructor() {
    if (sessionStorage.getItem('username') === 'isral') {
      this.isMe = true;
    }
    if (sessionStorage.getItem('roles').includes('SYSTEM_MANAGER')) {
      this.isSysManager = true;
    }
    if (sessionStorage.getItem('roles').includes('MANAGER')) {
      this.isManager = true;
    }
  }
}
