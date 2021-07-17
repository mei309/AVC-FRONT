import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { DropCashewItems, DropNormal, DropNormalPLine } from './field.interface';
import { Globals } from './global-params.component';
@Injectable({
  providedIn: 'root'
})
export class Genral {

  wearhouses = new ReplaySubject<DropNormal[]>();
  standarts = new ReplaySubject<DropNormal[]>();
  ItemsWasteCashew = new ReplaySubject<DropNormal[]>();
  allItemsCashew = new ReplaySubject<DropCashewItems[]>();
  ItemsGeneral = new ReplaySubject<DropNormal[]>();
  productionLine = new ReplaySubject<DropNormalPLine[]>();
  suppliersCashew = new ReplaySubject<DropNormal[]>();
  suppliersGeneral = new ReplaySubject<DropNormal[]>();

  genralID: number;
  
  
  numOfTodo = new Subject<number>();
  numOfMassages = new Subject<number>();

  mainurl = environment.baseUrl;

  constructor(private http: HttpClient, private globels: Globals) {
  }

  doInitiel() {
    this.setInitiel();
    this.getUserTasksNumber().pipe(take(1)).subscribe(value => {
      this.setNumOfTodo(<number>value);
    });
    this.getUserMassagesNumber().pipe(take(1)).subscribe(value => {
      this.setNumOfMassages(<number>value);
    });
  } 

  backToInitil() {
    this.wearhouses = new ReplaySubject<DropNormal[]>();
    this.standarts = new ReplaySubject<DropNormal[]>();
    this.ItemsWasteCashew = new ReplaySubject<DropNormal[]>();
    this.allItemsCashew = new ReplaySubject<DropCashewItems[]>();
    this.ItemsGeneral = new ReplaySubject<DropNormal[]>();
    this.productionLine = new ReplaySubject<DropNormalPLine[]>();
    this.suppliersCashew = new ReplaySubject<DropNormal[]>();
    this.suppliersGeneral = new ReplaySubject<DropNormal[]>();
    this.setInitiel();
  }

  
  setInitiel() {
    this.getMainSetUp().pipe(take(1)).subscribe(value => {
      this.wearhouses.next(value[0]);
      this.standarts.next(value[1]);
  

      this.allItemsCashew.next(value[2]);

      this.ItemsGeneral.next(value[3]); 
      this.globels.setGlobalProcessAuturtiy(value[4]);

      this.productionLine.next(value[5]);

      this.ItemsWasteCashew.next(value[6]);

      this.suppliersCashew.next(value[7]);
      this.suppliersGeneral.next(value[8]);

    });
  }
  

  
  getUserMassages(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.mainurl+'getUserMassages', {params}).pipe(
      map(value => {
        this.setNumOfMassages((<any[]>value).length);
        return value;
      })
    );
  }

  getUserMassagesNumber() {
    return this.http.get(this.mainurl+'getUserMassagesNumber');
  }

  // getMassage(processId, maasageId, value: string) {
  //   return this.http.get(this.mainurl+'getMassage/'+processId + '/' + maasageId +'/'+ value);
  // }

  getUserTasks(rangeDate) {
    let params: HttpParams;
    if(rangeDate.begin) {
      if(rangeDate.end) {
        params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
      } else {
        params = new HttpParams().
        set('begin',  rangeDate.begin);
      }
    } else {
      params = new HttpParams()
    }
    return this.http.get(this.mainurl+'getUserTasks', {params}).pipe(
      map(value => {
        this.setNumOfTodo((<any[]>value).length);
        return value;
      })
    );
  }

  getUserTasksNumber() {
    return this.http.get(this.mainurl+'getUserTasksNumber');
  }

  // getTask(id:number, value: string) {
  //   return this.http.get(this.mainurl+'getTask/'+id +'/'+ value);
  // }

  setApprovale(id, approve: string, snapshot): Observable<any> {
    return this.http.post(this.mainurl+'approveTask/' + id + '/' + approve, snapshot);
  }

  setMassageTask(id, approve: string): Observable<any> {
    return this.http.get(this.mainurl+'setMassageTask/' + id + '/' + approve);
  }

  setNumOfTodo(value: number) {
    this.numOfTodo.next(value);
  }
  getNumOfTodo (): Observable<number> {
    return this.numOfTodo.asObservable();
  }

  setNumOfMassages(value: number) {
    this.numOfMassages.next(value);
  }
  getNumOfMassages (): Observable<number> {
    return this.numOfMassages.asObservable();
  }


  approveTaskAndManagment(approve: string, snapshot): Observable<any> {
    return this.http.post(this.mainurl+'approveTaskAndManagment/' + approve, snapshot);
  }
  taskManagment(snapshot): Observable<any> {
    return this.http.post(this.mainurl+'taskManagment', snapshot);
  }





  getMainSetUp() {
    return this.http.get(this.mainurl+'setup');
  }

  getWearhouses (): Observable<any> {
    return this.wearhouses.asObservable();
  }
  getStandarts (): Observable<any> {
    return this.standarts.asObservable();
  }
  getItemsWasteCashew (): Observable<any> {
    return this.ItemsWasteCashew.asObservable();
  }
  getItemsCashewGrades(type: string | number, cashewGrades: string[]): Observable<any> {
    if(!cashewGrades){
      return this.getItemsCashew(type);
    }
    return this.allItemsCashew.asObservable().pipe(
      map(value => { 
        switch (type) {
          case 0:
          case 'Raw':
            return value.filter(w => w.productionUse === 'RAW_KERNEL' && cashewGrades.includes(w.grade));
          case 'RawRoast':
            return value.filter(w => ['ROAST', 'RAW_KERNEL'].includes(w.productionUse) && cashewGrades.includes(w.grade));
          case 'Clean':
          case 1:
            return value.filter(w => w.productionUse === 'CLEAN' && cashewGrades.includes(w.grade));
          case 'Roast':
            return value.filter(w => w.productionUse === 'ROAST' && cashewGrades.includes(w.grade));
          case 'Pack':
            return value.filter(w => w.productionUse === 'PACKED' && cashewGrades.includes(w.grade));
          case 'RoastPacked':
            return value.filter(w => ['ROAST', 'PACKED'].includes(w.productionUse) && cashewGrades.includes(w.grade));
          case 'Toffee':
            return value.filter(w => w.productionUse === 'TOFFEE' && cashewGrades.includes(w.grade));
          case 'QC pack':
            return value.filter(w => w.group === 'QC' && cashewGrades.includes(w.grade));
          default:
            return value.filter(w => cashewGrades.includes(w.grade));
        }
      })
    );
  }
  getItemsCashew(type: string | number): Observable<any> {
    return this.allItemsCashew.asObservable().pipe(
      map(value => { 
        switch (type) {
          case 0:
          case 'Raw':
            return value.filter(w => w.productionUse === 'RAW_KERNEL');
          case 'RawRoast':
            return value.filter(w => ['ROAST', 'RAW_KERNEL'].includes(w.productionUse));
          case 'RawCleanRoast':
            return value.filter(w => ['ROAST', 'CLEAN', 'RAW_KERNEL'].includes(w.productionUse));
          case 1:
          case 'Clean':
            return value.filter(w => w.productionUse === 'CLEAN');
          case 2:
          case 'Roast':
          case 3:
            return value.filter(w => w.productionUse === 'ROAST');
          case 4:
          case 'Pack':
          case 5:
            return value.filter(w => w.productionUse === 'PACKED');
          case 'RoastPacked':
            return value.filter(w => ['ROAST', 'PACKED'].includes(w.productionUse));
          case 'Toffee':
            return value.filter(w => w.productionUse === 'TOFFEE');
          case 'QC pack':
          case 6:
            return value.filter(w => w.group === 'QC');
          default:
            return value;
        }
      })
    );
  }
     
  getAllItemsCashew (): Observable<any> {
    return this.allItemsCashew.asObservable();
  }
  getItemsGeneral (): Observable<any> {
    return this.ItemsGeneral.asObservable();
  }
  getProductionLine (type: string): Observable<any> {
    return this.productionLine.asObservable().pipe(
      map(value => { 
        switch (type) {
          case 'Clean':
            return value.filter(a => a.productionFunctionality === 'SCREEN_TABLE');
          case 'RAW_STATION':
            return value.filter(a => a.productionFunctionality === 'RAW_STATION');
          case 'Roast':
            return value.filter(a => a.productionFunctionality === 'ROASTER');
          case 'ROASTER_IN':
            return value.filter(a => a.productionFunctionality === 'ROASTER_IN');
          case 'Toffee':
            return value.filter(a => a.productionFunctionality === 'TOFFEE');
          case 'Pack':
            return value.filter(a => a.productionFunctionality === 'PACKING');
          case 'Loading':
            return value.filter(a => a.productionFunctionality === 'LOADING');
          case 'PRODUCT_STORAGE':
            return value.filter(a => a.productionFunctionality === 'PRODUCT_STORAGE');
          case 'QC pack':
              return;
          default:
            return value;
        }
      })
    );
  }
  getSuppliersCashew (): Observable<any> {
    return this.suppliersCashew.asObservable();
  }
  getSuppliersGeneral (): Observable<any> {
    return this.suppliersGeneral.asObservable();
  }

  findAllPoCodes (): Observable<any> {
    return this.http.get(this.mainurl+'findAllPoCodes');
  }

  getStorageGeneralItem(itemId: number): Observable<any> {
    return this.http.get(this.mainurl+'getStorageGeneralItem/'+itemId);
  }

  findAvailableItems(): Observable<any> {
    return this.http.get(this.mainurl+'findAvailableItems');
  }
  
  getRoles(): string[] {
    return ['ROLE_MANAGER', 'ROLE_SYSTEM_MANAGER'];
  }

  getProcess(): string[] {
    return ['CASHEW_ORDER', 'GENERAL_ORDER', 'CASHEW_RECEIPT', 'GENERAL_RECEIPT',
      'CASHEW_RECEIPT_QC', 'VINA_CONTROL_QC', 'SAMPLE_QC', 'SUPPLIER_QC',
      'ROASTED_CASHEW_QC',
      'STORAGE_TRANSFER', 'STORAGE_RELOCATION',
      'CASHEW_CLEANING',
      'CASHEW_ROASTING',
      'CASHEW_TOFFEE',
      'PACKING',
      'CONTAINER_LOADING', 'CONTAINER_BOOKING', 'CONTAINER_ARRIVAL',
      'GENERAL_USE', 'PRODUCT_USE'];
  }

  getDecisionType(): string[] {
    return ['NOT_ATTENDED', 'EDIT_NOT_ATTENDED', 'APPROVED', 'DECLINED'	];
  }

  getApprovalType(): string[] {
    return ['APPROVAL', 'REVIEW', 'MANAGER'];
  }
  
  getSupplyGroup(): string[] {
    return ['CASHEW', 'GENERAL', 'SHIPPED_PRODUCT', 'LOGISTICS', 'NONE'];
  }
  
  getItemCategory(): string[] {
    return ['RAW_KERNEL', 'CLEAN', 'ROAST', 'PACKED', 'INGREDIENTS', 'PACKING_SUPPLYES', 'WASTE'];
  }

  getMeasureUnit(): string[] {
    return ['KG', 'LBS', 'OZ', 'GRAM', 'LOT', 'UNIT', 'BOX', 'TANK', 'BAG', 'ROLL'];
  }
  getPackedMU(): string[] {
    return ['UNIT', 'BOX', 'TANK', 'BAG', 'ROLL'];
  }
  getBulkMU(): string[] {
    return ['KG', 'LBS', 'OZ', 'GRAM', 'LOT'];
  }
  
  getQcCheckOrganzition(): string[] {
    return ['avc lab', 'supllier sample', 'supllier check', 'vina control'];
  }

  getOrderStatus(): string[] {
    return ['OPEN', 'PARTLY RECEIVED', 'RECEIVED', 'REJECTED', 'CANCELLED']
  }

  getProcessStatus(): string[] {
    return ['PENDING', 'FINAL', 'CANCELLED'];
  }

  getShippingContainerType(): string[] {
    return ['40\'', '20\''];
  }

  getItemGroup(): string[] {
    return ['PRODUCT', 'GENERAL', 'WASTE', 'QC'];
  }

  getProductionFunctionality(): string[] {
    return ['RAW_STORAGE', 'RAW_STATION', 'SCREEN_TABLE', 'ROASTER_IN', 'ROASTER', 'ROASTER_OUT', 'PACKING',
    'FINAL_PRODUCT', 'LOADING', 'GENERPRODUCT_STORAGEAL_STORAGE', 'PACKING_STATION'];
  }

}
