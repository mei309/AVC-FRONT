import { Injectable} from '@angular/core';

@Injectable()
export class Globals {
  globalPermission: string[] = [];
  globalProcessAuturtiy: Map<string, string[]>;
  // standarts: any[] = [];
  isManager: boolean = false;
  setGlobalPermission(value) {
    value.forEach(element => {
      this.globalPermission.push(element['authority']);
    });
    this.isManager = this.globalPermission.includes('ROLE_SYSTEM_MANAGER');
  }
  setGlobalProcessAuturtiy(value) {
    this.globalProcessAuturtiy = value;
  }
  getGlobalProcessAuturtiy(processName) {
    return this.globalProcessAuturtiy[processName];
  }
  // setGlobalStandarts(value) {
  //   this.standarts = value;
  // }
  // getGlobalStandarts() {
  //   return this.standarts;
  // }
  constructor() {
    if(sessionStorage.getItem('roles')) {
      this.setGlobalPermission(<any[]> JSON.parse(sessionStorage.getItem('roles')));
    }
  }
}