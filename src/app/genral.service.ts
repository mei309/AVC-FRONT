import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { DropNormal } from './field.interface';
import { Globals } from './global-params.component';
@Injectable({
  providedIn: 'root'
})
export class Genral {
// version 4
  cities = new ReplaySubject<DropNormal[]>();
  countries = new ReplaySubject<DropNormal[]>();
  companyPosition = new ReplaySubject<DropNormal[]>();
  banks = new ReplaySubject<DropNormal[]>();
  ContractType = new ReplaySubject<DropNormal[]>();
  wearhouses = new ReplaySubject<DropNormal[]>();
  standarts = new ReplaySubject<DropNormal[]>();
  ItemsRawCashew = new ReplaySubject<DropNormal[]>();
  ItemsRawRoastCashew = new ReplaySubject<DropNormal[]>();
  ItemsCleanCashew = new ReplaySubject<DropNormal[]>();
  ItemsRoastCashew = new ReplaySubject<DropNormal[]>();
  ItemsPackedCashew = new ReplaySubject<DropNormal[]>();
  ItemsRoastPackedCashew = new ReplaySubject<DropNormal[]>();
  ItemsWasteCashew = new ReplaySubject<DropNormal[]>();
  allItemsCashew = new ReplaySubject<DropNormal[]>();
  ItemsGeneral = new ReplaySubject<DropNormal[]>();
  supplyType = new ReplaySubject<DropNormal[]>();
  branches = new ReplaySubject<DropNormal[]>();
  shippingPorts = new ReplaySubject<DropNormal[]>();
  productionLine = new ReplaySubject<DropNormal[]>();

  genralID: number;
  
  
  numOfTodo = new Subject<number>();
  numOfMassages = new Subject<number>();

  mainurl = environment.baseUrl;

  constructor(private http: HttpClient, private globels: Globals) {
    this.setInitiel();
    this.getUserTasksNumber().pipe(take(1)).subscribe(value => {
      this.setNumOfTodo(<number>value);
    });
    this.getUserMassagesNumber().pipe(take(1)).subscribe(value => {
      this.setNumOfMassages(<number>value);
    });
  } 

  backToInitil() {
    this.cities = new ReplaySubject<DropNormal[]>();
    this.countries = new ReplaySubject<DropNormal[]>();
    this.companyPosition = new ReplaySubject<DropNormal[]>();
    this.banks = new ReplaySubject<DropNormal[]>();
    this.ContractType = new ReplaySubject<DropNormal[]>();
    this.wearhouses = new ReplaySubject<DropNormal[]>();
    this.standarts = new ReplaySubject<DropNormal[]>();
    this.ItemsRawCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsCleanCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsRawRoastCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsRoastCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsPackedCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsRoastPackedCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsWasteCashew = new ReplaySubject<DropNormal[]>();
    this.allItemsCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsGeneral = new ReplaySubject<DropNormal[]>();
    this.supplyType = new ReplaySubject<DropNormal[]>();
    this.branches = new ReplaySubject<DropNormal[]>();
    this.shippingPorts = new ReplaySubject<DropNormal[]>();
    this.productionLine = new ReplaySubject<DropNormal[]>();
    this.setInitiel();
  }


  setInitiel() {
    this.getMainSetUp().pipe(take(1)).subscribe(value => {
      this.cities.next(value[0]);
      this.countries.next(value[1]);
      this.companyPosition.next(value[2]);
      this.banks.next(value[3]);
      this.ContractType.next(value[4]);
      this.wearhouses.next(value[5]);
      
      this.ItemsRawCashew.next(value[6].filter(w => w.productionUse === 'RAW_KERNEL'));
      this.ItemsRawRoastCashew.next(value[6].filter(w => ['ROAST', 'RAW_KERNEL'].includes(w.productionUse)));
      this.ItemsCleanCashew.next(value[6].filter(w => w.productionUse === 'CLEAN'));
      this.ItemsRoastCashew.next(value[6].filter(w => w.productionUse === 'ROAST'));
      this.ItemsPackedCashew.next(value[6].filter(w => w.productionUse === 'PACKED'));
      this.ItemsRoastPackedCashew.next(value[6].filter(w => ['ROAST', 'PACKED'].includes(w.productionUse)));
      // value[6].filter(word => {log['ROAST', 'PACKED'].includes(word.category)});
      this.allItemsCashew.next(value[6]);

      this.ItemsGeneral.next(value[7]);
      this.supplyType.next(value[8]);
      this.branches.next(value[9]);

      this.standarts.next(value[10]);
      
      this.globels.setGlobalProcessAuturtiy(value[11]);

      this.shippingPorts.next(value[12]);
      this.productionLine.next(value[13]);

      this.ItemsWasteCashew.next(value[14]);
    });
  }
  

  
  getUserMassages() {
    return this.http.get(this.mainurl+'getUserMassages').pipe(
      map(value => {
        this.setNumOfMassages((<any[]>value).length);
        return value;
      })
    );
  }

  getUserMassagesNumber() {
    return this.http.get(this.mainurl+'getUserMassagesNumber');
  }

  getMassage(processId, maasageId, value: string) {
    return this.http.get(this.mainurl+'getMassage/'+processId + '/' + maasageId +'/'+ value);
  }

  getUserTasks() {
    return this.http.get(this.mainurl+'getUserTasks').pipe(
      map(value => {
        this.setNumOfTodo((<any[]>value).length);
        return value;
      })
    );
  }

  getUserTasksNumber() {
    return this.http.get(this.mainurl+'getUserTasksNumber');
  }

  getTask(id:number, value: string) {
    return this.http.get(this.mainurl+'getTask/'+id +'/'+ value);
  }

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
  getCities (): Observable<any> {
    return this.cities.asObservable();
  }
  getCountries (): Observable<any> {
    return this.countries.asObservable();
  }
  getBanks (): Observable<any> {
    return this.banks.asObservable();
  }
  getCompanyPosition (): Observable<any> {
    return this.companyPosition.asObservable();
  }
  getContractType (): Observable<any> {
    return this.ContractType.asObservable();
  }
  getWearhouses (): Observable<any> {
    return this.wearhouses.asObservable();
  }
  getStandarts (): Observable<any> {
    return this.standarts.asObservable();
  }
  getItemsRawCashew (): Observable<any> {
    return this.ItemsRawCashew.asObservable();
  }
  getItemsRawRoastCashew (): Observable<any> {
    return this.ItemsRawRoastCashew.asObservable();
  }
  getItemsCleanCashew (): Observable<any> {
    return this.ItemsCleanCashew.asObservable();
  }
  getItemsRoastCashew (): Observable<any> {
    return this.ItemsRoastCashew.asObservable();
  }
  getItemsPackedCashew (): Observable<any> {
    return this.ItemsPackedCashew.asObservable();
  }
  getItemsRoastPackedCashew (): Observable<any> {
    return this.ItemsRoastPackedCashew.asObservable();
  }
  getItemsWasteCashew (): Observable<any> {
    return this.ItemsWasteCashew.asObservable();
  }
  getItemsCashew(type: string): Observable<any> {
    switch (type) {
      case 'Raw':
        return this.getItemsRawCashew();
      case 'RawRoast':
        return this.getItemsRawRoastCashew();
      case 'Clean':
        return this.getItemsCleanCashew();
      case 'Roast':
        return this.getItemsRoastCashew();
      case 'Pack':
        return this.getItemsPackedCashew();
      case 'RoastPacked':
        return this.getItemsRoastPackedCashew();
      case 'Waste':
        return this.getItemsWasteCashew();
    
      default:
        return this.getAllItemsCashew();
    }
  }
  getAllItemsCashew (): Observable<any> {
    return this.allItemsCashew.asObservable();
  }
  getItemsGeneral (): Observable<any> {
    return this.ItemsGeneral.asObservable();
  }
  getSupplyType (): Observable<any> {
    return this.supplyType.asObservable();
  }
  getBranches (): Observable<any> {
    return this.branches.asObservable();
  }
  getShippingPorts (): Observable<any> {
    return this.shippingPorts.asObservable();
  }
  getProductionLine (): Observable<any> {
    return this.productionLine.asObservable();
  }

  getSupplierCashew (): Observable<any> {
    return this.http.get(this.mainurl+'getCashewSuppliers');
  }

  findAllPoCodes (): Observable<any> {
    return this.http.get(this.mainurl+'findAllPoCodes');
  }

  getStorageGeneralItem(itemId: number): Observable<any> {
    return this.http.get(this.mainurl+'getStorageGeneralItem/'+itemId);
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
      'PACKING',
      'CONTAINER_LOADING', 'CONTAINER_BOOKING'];
  }

  getDecisionType(): string[] {
    return ['NOT_ATTENDED', 'EDIT_NOT_ATTENDED', 'APPROVED', 'DECLINED'	];
  }

  getApprovalType(): string[] {
    return ['APPROVAL', 'REVIEW', 'MANAGER'];
  }
  
  getSupplyGroup(): string[] {
    return ['CASHEW', 'GENERAL', 'NONE'];
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




//   poConfig = [
//     {
//       type: 'date',
//       label: 'Delivery date',
//       name: 'deliveryDate',
//       // options: 'withTime',
//   },
//   {
//     type: 'button',
//     label: 'Submit',
//     name: 'submit',
// }
//   ];
//   submit(val) {
//     this.submit(val).pipe(take(1)).subscribe(value => {
//       console.log(value);
      
//     });
//   }
//   <dynamic-form [fields]="poConfig" [mainLabel]="'PO# receving'" (submitForm)="submit($event)">
//     </dynamic-form>
//   checkDate(snapshot): Observable<any> {
//     console.log(snapshot);
//     return this.http.post(this.mainurl+'checkDate', snapshot);
//   }

}
