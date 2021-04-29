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
    Cbulk: $localize`Cashew bulk item`,
    Cpacked: $localize`Cashew packed item`,
    Gbulk: $localize`General bulk item`,
    Gpacked: $localize`General packed item`,
    waste: $localize`Waste item`,
    User: $localize`User`,
    UserPerson: $localize`User for person`
  };
@Pipe({
    name: 'namingPipe'
})
export class NamingPipe implements PipeTransform {

    transform(element: string, isEdit: boolean) {
        if(isEdit) {
            return $localize`Edit ` + namesMapper[element];
        } else {
            return $localize`Add ` + namesMapper[element];
        }
    }
}