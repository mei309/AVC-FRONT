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
// version 1
  cities = new ReplaySubject<DropNormal[]>();
  countries = new ReplaySubject<DropNormal[]>();
  companyPosition = new ReplaySubject<DropNormal[]>();
  banks = new ReplaySubject<DropNormal[]>();
  ContractType = new ReplaySubject<DropNormal[]>();
  storage = new ReplaySubject<DropNormal[]>();
  standarts = new ReplaySubject<DropNormal[]>();
  ItemsRawCashew = new ReplaySubject<DropNormal[]>();
  ItemsCleanCashew = new ReplaySubject<DropNormal[]>();
  ItemsRoastCashew = new ReplaySubject<DropNormal[]>();
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
    this.getUserTasks().pipe(take(1)).subscribe(value => {
    });
    this.getUserMassages().pipe(take(1)).subscribe(value => {
    });
  } 

  backToInitil() {
    this.cities = new ReplaySubject<DropNormal[]>();
    this.countries = new ReplaySubject<DropNormal[]>();
    this.companyPosition = new ReplaySubject<DropNormal[]>();
    this.banks = new ReplaySubject<DropNormal[]>();
    this.ContractType = new ReplaySubject<DropNormal[]>();
    this.storage = new ReplaySubject<DropNormal[]>();
    this.standarts = new ReplaySubject<DropNormal[]>();
    this.ItemsRawCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsCleanCashew = new ReplaySubject<DropNormal[]>();
    this.ItemsRoastCashew = new ReplaySubject<DropNormal[]>();
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
      this.storage.next(value[5]);
      
      this.ItemsRawCashew.next(value[6].filter(word => word.category === 'RAW'));
      this.ItemsCleanCashew.next(value[6].filter(word => word.category === 'CLEAN'));
      this.ItemsRoastCashew.next(value[6].filter(word => word.category === 'ROAST'));
      this.ItemsRoastPackedCashew.next(value[6].filter(word => ['ROAST', 'PACKED'].includes(word.category)));
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
  getStorage (): Observable<any> {
    return this.storage.asObservable();
  }
  getStandarts (): Observable<any> {
    return this.standarts.asObservable();
  }
  getItemsRawCashew (): Observable<any> {
    return this.ItemsRawCashew.asObservable();
  }
  getItemsCleanCashew (): Observable<any> {
    return this.ItemsCleanCashew.asObservable();
  }
  getItemsRoastCashew (): Observable<any> {
    return this.ItemsRoastCashew.asObservable();
  }
  getItemsRoastPackedCashew (): Observable<any> {
    return this.ItemsRoastPackedCashew.asObservable();
  }
  getItemsWasteCashew (): Observable<any> {
    return this.ItemsWasteCashew.asObservable();
  }
  getItemsCashew(type: string): Observable<any> {
    switch (type) {
      case 'RAW':
        return this.getItemsRawCashew();
      case 'Clean':
        return this.getItemsCleanCashew();
      case 'Roast':
        // return this.getItemsRoastCashew();
      case 'Pack':
      case 'ROASTPACKED':
        return this.getItemsRoastPackedCashew();
      case 'WASTE':
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
    return ['NOT_ATTENDED', 'EDIT_NOT_ATTENDED', 'APPROVED', 'DECLINED', 'FINALIZED', 'SUSPENDED'	];
  }

  getApprovalType(): string[] {
    return ['APPROVAL', 'REVIEW', 'MANAGER'];
  }
  
  getSupplyGroup(): string[] {
    return ['CASHEW', 'GENERAL', 'NONE'];
  }
  
  getItemCategory(): string[] {
    return ['RAW', 'CLEAN', 'ROAST', 'PACKED', 'INGREDIENTS', 'PACKING_SUPPLYES', 'WASTE'];
  }

  getMeasureUnit(): string[] {
    return ['KG', 'LBS', 'OZ', 'GRAM'];
  }

  getQcCheckOrganzition(): string[] {
    return ['avc lab', 'supllier sample', 'supllier check', 'vina control'];
  }

  getProcessStatus(): string[] {
    return ['REJECTED', 'OPEN', 'CANCELLED', 'PARTLY RECEIVED', 'RECEIVED'];
  }
	

  getShippingContainerType(): string[] {
    return ['40\'', '20\''];
  }

}
