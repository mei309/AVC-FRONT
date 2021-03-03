import { Pipe, PipeTransform } from "@angular/core";

const namesMapper = {
    Countries: 'Country',
    Cities: 'City',
    Banks: 'Bank',
    BankBranches: 'Bank branch',
    Warehouses: 'Warehouse',
    SupplyCategories: 'Supply category',
    CompanyPositions: 'Company position',
    ContractTypes: 'Contract type',
    ProductionLines: 'Production line',
    CashewStandards: 'Cashew standard',
    ShippingPorts: 'Shipping port',
    Cbulk: 'Cashew bulk item',
    Cpacked: 'Cashew packed item',
    Gbulk: 'General bulk item',
    Gpacked: 'General packed item',
    waste: 'Waste item',
    User: 'User',
    UserPerson: 'User for person'
  };
@Pipe({
    name: 'namingPipe'
})
export class NamingPipe implements PipeTransform {

    transform(element: string, isEdit: boolean) {
        if(isEdit) {
            return 'Edit ' + namesMapper[element];
        } else {
            return 'Add ' + namesMapper[element];
        }
    }
}