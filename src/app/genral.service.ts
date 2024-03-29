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
  qcItemsCashew = new ReplaySubject<DropCashewItems[]>();
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
    this.qcItemsCashew = new ReplaySubject<DropCashewItems[]>();
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


      this.allItemsCashew.next(value[2].filter(w => w.group != 'QC'));
      this.qcItemsCashew.next(value[2].filter(w => w.group === 'QC'));

      this.ItemsGeneral.next(value[3]);
      this.globels.setGlobalProcessAuturtiy(value[4]);

      this.productionLine.next(value[5]);

      this.ItemsWasteCashew.next(value[6]);

      this.suppliersCashew.next(value[7]);
      this.suppliersGeneral.next(value[8]);

    });
  }



  getUserMassages(rangeDate) {
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
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
    let params = new HttpParams().
        set('begin',  rangeDate.begin).
        set('end', rangeDate.end);
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
    cashewGrades = cashewGrades.filter(a => a);
    if(!cashewGrades.length){
      return this.getItemsCashew(type);
    }
    if(type === 'QC pack' || type === 6) {
      return this.qcItemsCashew.asObservable().pipe(
        map(value => {
          return value.filter(w => w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
        })
      );
    }
    return this.allItemsCashew.asObservable().pipe(
      map(value => {
        switch (type) {
          case 0:
          case 'Raw':
            return value.filter(w => w.productionUse === 'RAW_KERNEL' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'RawRoast':
            return value.filter(w => ['ROAST', 'RAW_KERNEL'].includes(w.productionUse) && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'Clean':
          case 1:
            return value.filter(w => w.productionUse === 'CLEAN' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'Roast':
            return value.filter(w => w.productionUse === 'ROAST' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'Pack':
            return value.filter(w => w.productionUse === 'PACKED' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'RoastPacked':
            return value.filter(w => ['ROAST', 'PACKED'].includes(w.productionUse) && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'Toffee':
            return value.filter(w => w.productionUse === 'TOFFEE' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          case 'QC pack':
            return value.filter(w => w.group === 'QC' && w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
          default:
            return value.filter(w => w.grade && cashewGrades.some(a => a['value'] === w.grade['value']));
        }
      })
    );
  }
  getItemsCashew(type: string | number): Observable<any> {
    if(type === 'QC pack' || type === 7) {
      return this.qcItemsCashew.asObservable();
    }
    if(type === 6) {
      return this.ItemsWasteCashew.asObservable();
    }
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
          case 'PRODUCT_USE':
            return value.filter(a => a.productionFunctionality === 'PRODUCT_USE');
          case 'GENERAL_USE':
            return value.filter(a => a.productionFunctionality === 'GENERAL_USE');
          case 'QC pack':
              return;
            case 'QC_CHECK':
              return value.filter(a => a.productionFunctionality === 'QUALITY_CONTROL_CHECK');
          default:
            return value.slice();
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

  findAllProductPoCodes (): Observable<any> {
    return this.http.get(this.mainurl+'findAllProductPoCodes');
  }

  getStorageGeneralItem(itemId: number): Observable<any> {
    return this.http.get(this.mainurl+'getStorageGeneralItem/'+itemId);
  }

  findAvailableItems(): Observable<any> {
    return this.http.get(this.mainurl+'findAvailableItems');
  }

  getProductBomInventoryMissing(itemId: number): Observable<any> {
    return this.http.get(this.mainurl+'getProductBomInventoryMissing/'+itemId);
  }

  getRoles(): string[] {
    return ['ROLE_MANAGER', 'ROLE_SYSTEM_MANAGER'];
  }

  getProcess(): string[] {
    return ['Vina Control Qc', 'Supplier Qc', 'Storage Transfer', 'Storage Relocation', 'Sample Receipet', 'Sample Qc',
    'Roasted Cashew Qc', 'Product Use', 'Packing', 'General Receipt', 'General Order', 'General Inventory Use',
    'Container Loading', 'Container Booking', 'Container Arrival', 'Cashew Toffee',
    'Cashew Roasting', 'Cashew Receipt Qc', 'Cashew Receipt', 'Cashew Order', 'Cashew Cleaning', 'Bad Quality Packing']

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
    return ['KG', 'LBS', 'OZ', 'GRAM', 'LOT', 'TON', 'UNIT', 'BOX', 'TANK', 'BAG', 'ROLL'];
  }
  getPackedMU(): string[] {
    return ['UNIT', 'BOX', 'TANK', 'BAG', 'ROLL'];
  }
  getBulkMU(): string[] {
    return ['KG', 'LBS', 'OZ', 'GRAM', 'LOT', 'TON'];
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
    'FINAL_PRODUCT', 'LOADING', 'PRODUCT_STORAGE', 'TOFFEE', 'PACKING_STATION', 'GENERAL_USE', 'PRODUCT_USE', 'QUALITY_CONTROL_CHECK'];
  }

}
