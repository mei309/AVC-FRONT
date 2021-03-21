import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { SuppliersService } from '../suppliers/suppliers.service';
import { Genral } from './../genral.service';
import { includesArray, includesValdaite } from './compareService.interface';
import { diff } from '../libraries/diffArrayObjects.interface';
// import diff_arrays_of_objects from 'diff-arrays-of-objects';
@Component({
  selector: 'app-suppliers-test',
  template: `
  <div style="white-space: pre-wrap;">{{massage}}</div>
    ` ,
})
export class SuppliersTestComponent implements OnInit {
  massage = '';
  randomNum;

  constructor(private LocalService: SuppliersService, private genral: Genral) { }
  
  ngOnInit(): void {
    this.randomNum = new Date().getMilliseconds();
    this.LocalService.getSupplyType().pipe(take(1)).subscribe(value1 => {
      this.LocalService.getBranches().pipe(take(1)).subscribe(value2 => {
        this.LocalService.getCities().pipe(take(1)).subscribe(value3 => {
          this.LocalService.getCompanyPosition().pipe(take(1)).subscribe(value4 => {
            this.LocalService.getCountries().pipe(take(1)).subscribe(value5 => {
              const mainSupplier = { "name": "supplier test"+this.randomNum,
                "supplyCategories": [ value1[0], value1[1] ],
                "englishName": "supplier", "localName": "supplier", "license": "123456", "taxCode": "234567", "registrationLocation": "tan an",
                "contactDetails": { "addresses": { "streetAddress": "hozar hgfomin", "city": value3[0] }, "phones": [ { "value": "123456789" }, { "value": "456789098765" } ], "emails": [ { "value": "isra@dfghgf.vb" } ], "faxes": [ { "value": "12345678" } ],
                "paymentAccounts": [ { "bankAccount": { "ownerName": "supp", "accountNo": "12345", "branch": value2[0] } }, { "bankAccount": { "ownerName": "eferert", "accountNo": "12345654", "branch": value2[1] } } ] },
                "companyContacts": [ { "person": { "name": "supp1", "contactDetails": { "addresses": { "streetAddress": "sdfghrvc", "city": value3[1] }, "phones": [ { "value": "1234567" } ], "emails": [ ], "faxes": [ { "value": "234567" }, { "value": "3456543" } ] }, "idCard": { "idNumber": "1234567", "dateOfIssue": "2020-05-10", "placeOfIssue": "tan an", "nationality": value5[0], "dob": "1996-01-09" } }, "position": value4[1] },
                  { "person": { "name": "supp2", "contactDetails": { "addresses": { "streetAddress": "dfghgjhk", "city": value3[0] }, "phones": [  ], "emails": [ ], "faxes": [ ] }, "idCard": null }, "position": value4[0] } ] } ;
              this.LocalService.addSupplier(mainSupplier).pipe(take(1)).subscribe(value6 => {

                if(includesValdaite(Object.assign({}, value6), Object.assign({}, mainSupplier))) {
                  this.massage += 'adding supplier SUCSSESFUL\n';
                } else {
                  console.log(Object.assign({}, value6['companyContacts']));
                          console.log(Object.assign({}, mainSupplier['companyContacts']));
                  this.massage += 'adding supplier not including something\n';
                }

                const mainEdit = { "id": value6['id'], "version": value6['version'], "name": "supplier test"+this.randomNum, "supplyCategories": [ value1[2], value1[1], value1[0] ],
                "englishName": "supplier1", "localName": "supplier1", "license": "1234561", "taxCode": "2345671", "registrationLocation": "tan an" };
                
                this.LocalService.editMainSupplier(mainEdit).pipe(take(1)).subscribe(value7 => {

                  if(includesValdaite(Object.assign({}, value7), Object.assign({}, mainEdit))) {
                    this.massage += 'edit main supplier SUCSSESFUL\n';
                  } else {
                    this.massage += 'edit main supplier not including something\n';
                  }

                  const contact = value7['contactDetails'];
                  const address = contact['addresses'];
                  const phones = contact['phones'];
                  const emails = contact['emails'];
                  const contactEdit = { "id": contact['id'], "addresses": { "id": address['id'], "version": address['version'], "streetAddress": "hozar hgfomin", "city": value3[1] }, "phones": [ { "id": phones[0]['id'], "version": phones[0]['version'], "value": "12345" }, { "id": phones[1]['id'], "version": phones[1]['version'], "value": "456789098765" }, { "value": "12345678" } ], "emails": [ { "id": emails[0]['id'], "version": emails[0]['version'], "value": "isra@dfghgf.vb" } ], "faxes": [ ] };

                  this.LocalService.editContactInfo(contactEdit, value7['id']).pipe(take(1)).subscribe(value8 => {
                    
                    if(includesValdaite(Object.assign({}, value8['contactDetails']), Object.assign({}, contactEdit))) {
                      this.massage += 'edit Contact supplier SUCSSESFUL\n';
                    } else {
                      this.massage += 'edit Contact supplier not including something\n';
                    }

                    
                    const payments = value8['contactDetails']['paymentAccounts'];
                    
                    
                    const bankone = payments[0]['bankAccount'];
                    const paymentEdit = [ { "id": payments[0]['id'], "version": payments[0]['version'], "bankAccount": { "id": bankone['id'], "version": bankone['version'], "ownerName": "suppjj", "accountNo": "1234577", "branch": value2[2] } },
                      { "bankAccount": { "ownerName": "efererthh", "accountNo": "1234568854", "branch": value2[2] } } ] ;
                      console.log(payments);
                      console.log(paymentEdit);
                      
                      
                      var resultNew = diff(payments, paymentEdit, 'id');
                      
                    // var result = diff_arrays_of_objects(payments, paymentEdit, 'id');
                    this.LocalService.editPaymentAccounts(resultNew, contact['id'], value8['id']).pipe(take(1)).subscribe(value9 => {
                      
                      if(includesArray(Object.assign({}, value9['contactDetails']['paymentAccounts']), Object.assign({}, paymentEdit))) {
                        this.massage += 'edit payment supplier SUCSSESFUL\n';
                      } else {
                        this.massage += 'edit payment supplier not including something\n';
                      }

                      const persons = value9['companyContacts'];
                      const firstContact = persons[0]['name'] === 'supp1'? persons[0]: persons[1];
                      const firstPerson = firstContact['person'];
                      const secondContact = persons[1]['name'] === 'supp2'? persons[1]: persons[0];
                      const secondPerson = secondContact['person'];
                      
                      var personsEdit = [ { "id": firstContact['id'], "version": firstContact['version'], "person": { "id": firstPerson['id'], "version": firstPerson['version'], "name": "supp2", "contactDetails": { "id": firstPerson.contactDetails['id'], "addresses": { "id": firstPerson.contactDetails.addresses['id'], "version": firstPerson.contactDetails.addresses['version'], "streetAddress": "dfghgjgghk", "city": firstPerson.contactDetails.addresses['city'] }, "phones": [ { "value": 687654 } ], "emails": [ ], "faxes": [ { "value": 123456 }, { "value": 12345655 } ] }, "idCard": { "idNumber": "1234567", "dateOfIssue": "2020-05-10", "placeOfIssue": "tan aan", "nationality": value5[0], "dob": "1996-01-29" } }, "position": value4[2] },
                        { "id": secondContact['id'], "version": secondContact['version'], "person": { "id": secondPerson['id'], "version": secondPerson['version'], "name": "supp1",
                        "contactDetails": { "id": secondPerson.contactDetails['id'], 
                        "addresses": { "id": secondPerson.contactDetails.addresses['id'], "version": secondPerson.contactDetails.addresses['version'], "streetAddress": "sdfghrvc", "city": value3[0] }, "phones": [ { "id": secondPerson.contactDetails.phones[0]['id'], "version": secondPerson.contactDetails.phones[0]['version'], "value": "1234567500" } ], "emails": [ { "value": "israf@ghjk.cvbaa" } ],
                        "faxes": [ { "id": secondPerson.contactDetails.faxes[0]['id'], "version": secondPerson.contactDetails.faxes[0]['version'], "value": "23456700" }, { "id": secondPerson.contactDetails.faxes[1]['id'], "version": secondPerson.contactDetails.faxes[1]['version'], "value": "345654300" } ]},
                        "idCard": { "id": secondPerson.idCard['id'], "version": secondPerson.idCard['version'], "idNumber": "1234567", "dob": "1996-01-19", "dateOfIssue": "2020-05-19", "placeOfIssue": "tan an", "nationality": value5[1] } }, "position": value4[2] } ];

                      var result1 = diff(persons, personsEdit, 'id');
                      this.LocalService.editContactPersons(result1, value9['id']).pipe(take(1)).subscribe(value10 => {
                        
                        if(includesArray(value10['companyContacts'], personsEdit)) {
                          this.massage += 'edit persons supplier SUCSSESFUL\n';
                        } else {
                          console.log(value10['companyContacts']);
                          console.log(personsEdit);
                          this.massage += 'edit persons supplier not including something\n';
                        }
                        this.massage += 'suuucsssesss';
                      });
                    });
                  });
                });
              });
              const secondSupplier = { "name": "supplier test"+this.randomNum+1,
              "supplyCategories": [ value1[0], value1[1] ]};
              this.LocalService.addSupplier(secondSupplier).pipe(take(1)).subscribe(value20 => {
                if(includesValdaite(Object.assign({}, value20), Object.assign({}, secondSupplier))) {
                  this.massage += 'adding 2 supplier SUCSSESFUL\n';
                } else {
                  this.massage += 'adding 2 supplier not including something\n';
                }
              });
            });
          });
        });
      });
    });
    
      

    

  }
}