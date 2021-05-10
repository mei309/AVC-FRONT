import { Pipe, PipeTransform } from "@angular/core";

const namesMapper = {
    Countries: $localize`Country`,
    Cities: $localize`City`,
    Banks: $localize`Bank`,
    BankBranches: $localize`Bank branch`,
    Warehouses: $localize`Warehouse`,
    SupplyCategories: $localize`Supply category`,
    CompanyPositions: $localize`Company position`,
    ContractTypes: $localize`Contract type`,
    ProductionLines: $localize`Production line`,
    CashewStandards: $localize`Cashew standard`,
    ShippingPorts: $localize`Shipping port`,
    Cbulk: $localize`Cashew bulk item (material)`,
    Cpacked: $localize`Cashew packed item`,
    Gbulk: $localize`General bulk item (material)`,
    Gpacked: $localize`General packed item`,
    waste: $localize`Waste item`,
    User: $localize`User`,
    UserPerson: $localize`User for person`
  };
@Pipe({
    name: 'namingPipe'
})
export class NamingPipe implements PipeTransform {

    transform(element: string, type: string) {
        if(type === 'edit') {
            return $localize`Edit ` + namesMapper[element];
        } else if(type === 'add') {
            return $localize`Add ` + namesMapper[element];
        } else {
            return namesMapper[element];
        }
    }
}