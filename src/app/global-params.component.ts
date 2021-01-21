import { Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
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
    if(sessionStorage.getItem('roles')) {
      this.setGlobalPermission(<any[]> JSON.parse(sessionStorage.getItem('roles')));
    }
  }
}