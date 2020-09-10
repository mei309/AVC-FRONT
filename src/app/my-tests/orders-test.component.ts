import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { OrdersService } from '../orders/orders.service';
import { Genral } from './../genral.service';
import { includesValdaite } from './compareService.interface';
@Component({
  selector: 'app-orders-test',
  template: `
  <div style="white-space: pre-wrap;">{{massage}}</div>
    ` ,
})
export class OrdersTestComponent implements OnInit {
  massage = '';
  randomNum = 15868;

  constructor(private LocalService: OrdersService, private genral: Genral) { }
  
  ngOnInit(): void {
    this.LocalService.getSupplierCashew().pipe(take(1)).subscribe(value1 => {
      this.genral.getItemsRawCashew().pipe(take(1)).subscribe(value2 => {
        this.genral.getContractType().pipe(take(1)).subscribe(value3 => {
          this.genral.getStorage().pipe(take(1)).subscribe(value4 => {
              const mainOrder = { "poCode": { "supplier": value1[0], "contractType": value3[0], "code": null }, "recordedTime": "2020-05-05T13:12:29.855Z", "orderItems": [ 
                  { "item": value2[0], "numberUnits": {"amount": "232", "measureUnit": "KG"}, "unitPrice": {"amount": "343", "currency": "USD"}, "deliveryDate": "2020-05-05", "defects": "12%", "remarks": "ertyf cvbnjytr bvvghh" },
                    { "item": value2[0], "numberUnits": {"amount": "4444", "measureUnit": "KG"}, "unitPrice": {"amount": "44", "currency": "USD"}, "deliveryDate": "2020-05-05", "defects": "By standard", "remarks": null },
                    { "item": value2[1], "numberUnits": {"amount": "78", "measureUnit": "KG"}, "unitPrice": {"amount": "77", "currency": "USD"}, "deliveryDate": "2020-05-05", "defects": "By supplier sample", "remarks": null } ] }
              
                    console.log(mainOrder);
                    
                this.LocalService.addEditCashewOrder(mainOrder, true).pipe(take(1)).subscribe(value6 => {
                
                mainOrder['recordedTime'] = value6['recordedTime'];
                delete mainOrder['poCode']['supplier'];
                mainOrder['poCode']['contractTypeCode'] = mainOrder['poCode']['contractType']['value'];
                delete mainOrder['poCode']['contractType'];
                
                
                if(includesValdaite(Object.assign({}, value6), Object.assign({}, mainOrder))) {
                  this.massage += 'adding cashew order SUCSSESFUL\n';
                } else {
                  this.massage += 'adding cashew order not including something\n';
                }

                const items = value6['orderItems'];
                const mainEdit = { "id": value6['id'], "version": value6['version'], "createdDate": value6['createdDate'], "orderItems": [
                  { "id": items[0]['id'], "version": items[0]['version'], "item": value2[0], "numberUnits": {"amount": "2321", "measureUnit": "KG"}, "unitPrice": {"amount": "343", "currency": "USD"}, "deliveryDate": "2020-05-15", "defects": "12%", "remarks": "ertyf cvbnjytr bvvghh" },
                  { "id": items[1]['id'], "version": items[1]['version'], "item": value2[0], "numberUnits": {"amount": "4441", "measureUnit": "KG"}, "unitPrice": {"amount": "4412", "currency": "USD"}, "deliveryDate": "2020-05-15", "defects": "By standard", "remarks": null },
                  { "item": value2[2], "numberUnits": {"amount": "78", "measureUnit": "KG"}, "unitPrice": {"amount": "771", "currency": "USD"}, "deliveryDate": "2020-05-15", "defects": "By supplier sample", "remarks": "hhhhhhh" } ] }
            
                  console.log(mainEdit);
                this.LocalService.addEditCashewOrder(mainEdit, false).pipe(take(1)).subscribe(value7 => {
                  
                  if(includesValdaite(Object.assign({}, value7), Object.assign({}, mainEdit))) {
                    this.massage += 'edit main cashew order SUCSSESFUL\n';
                  } else {
                    this.massage += 'edit main cashew order not including something\n';
                  }

                  
                  
                  let stickData = {};
                  stickData['poCode'] = value7['poCode'];
                  var orderdItems = [];
                  value7['orderItems'].forEach(element => {
                          const nuuum = Math.floor(Math.random() * 4) + 1;
                          let newArray = [];
                          for(var i = 0; i<=nuuum; i++) {
                            newArray.push(
                                {
                                    unitAmount: {amount: (Math.random() * 10000).toFixed(2), measureUnit: 'KG'},
                                    numberUnits: (Math.random() * 10000).toFixed(2),
                                    warehouseLocation: value4[Math.floor(Math.random() * 3)],
                                }
                            );
                          }
                          orderdItems.push(
                              {
                                  orderItem: element,
                                  item: element['item'],
                                  storageForms: newArray
                              }
                          );
                  });
                  
                  stickData['receiptItems'] = orderdItems;
                  stickData['recordedTime'] = "2020-05-05T13:12:29.855Z";
                  console.log(stickData);
                  this.LocalService.addEditRecivingCashewOrder(stickData, true).pipe(take(1)).subscribe( value8 => {
                    
                    stickData['recordedTime'] = value8['recordedTime'];
                    stickData['receiptItems'].forEach(element => {
                          delete element['orderItem']
                    });
                    if(includesValdaite(Object.assign({}, value8), Object.assign({}, stickData))) {
                      
                      if(value8['receiptItems'].every(line => { if(line['orderItem']) return true; })) {
                        this.massage += 'receive cashew order SUCSSESFUL\n';
                      } else {
                        this.massage += 'receive cashew order dosent have an order\n';
                      }
                    } else {
                      this.massage += 'receive cashew order not including something\n';
                    }
                  });
                });
              });



              
              const itemRound = Math.floor(Math.random() * 4) + 1;

              let stickData1 = {};
              var orderdItems = [];
              stickData1['poCode'] = { "supplier": value1[1], "contractType": value3[1], "code": Math.floor(Math.random() * 4444444) + 1 };
              for(var j = 0; j<=itemRound; j++) {
                      const nuuum = Math.floor(Math.random() * 4) + 1;
                      let newArray = [];
                      for(var i = 0; i<=nuuum; i++) {
                        newArray.push(
                            {
                                unitAmount: {amount: (Math.random() * 10000).toFixed(2), measureUnit: 'KG'},
                                numberUnits: (Math.random() * 10000).toFixed(2),
                                warehouseLocation: value4[Math.floor(Math.random() * 3)],
                            }
                        );
                      }
                      orderdItems.push(
                          {
                              item: value2[Math.floor(Math.random() * 3)],
                              storageForms: newArray
                          }
                      );
              };
              
              stickData1['receiptItems'] = orderdItems;
              
              stickData1['recordedTime'] = "2020-05-05T13:12:29.855Z";

              // console.log(stickData1);
              console.log(stickData1);
              this.LocalService.addReceiveCashewNoOrder(stickData1).pipe(take(1)).subscribe( value9 => {
                    
                    stickData1['recordedTime'] = value9['recordedTime'];
                    delete stickData1['poCode']['supplier'];
                    stickData1['poCode']['contractTypeCode'] = stickData1['poCode']['contractType']['value'];
                    delete stickData1['poCode']['contractType'];
                    // stickData1['poCode']['id'] = stickData1['poCode']['code'];
                    // delete stickData1['poCode']['code'];
                    // console.log(value9);
                    // console.log(stickData1);
                    if(includesValdaite(Object.assign({}, value9), Object.assign({}, stickData1))) {
                      this.massage += 'receive cashew without a order SUCSSESFUL\n';
                    } else {
                      this.massage += 'receive cashew without a order not including something\n';
                    }


                    this.LocalService.getPoCashewCodesOpenPending().pipe(take(1)).subscribe(value20 => {

                      var mainSample = { "poCode": value20[0], "recordedTime": "2020-05-27T10:18:59.290Z", "sampleItems": [ 
                        { "item": value2[0], "emptyContainerWeight": "222", "measureUnit": "KG", "itemWeights": [ { "numberOfSamples": "2323", "avgTestedWeight": "2222", "unitAmount": "55.44" } ] },
                        { "item": value2[1], "emptyContainerWeight": "444", "measureUnit": "KG", "itemWeights": [ { "numberOfSamples": "33", "avgTestedWeight": "23.999", "unitAmount": "51.44" } ] } ] };
                        // console.log(mainSample);
                        
                      // this.LocalService.addEditReceiveSample(mainSample, true).pipe(take(1)).subscribe(value21 => {
          
                      //   mainSample['recordedTime'] = value21['recordedTime'];
                        
                      //   if(includesValdaite(Object.assign({}, value21), Object.assign({}, mainSample))) {
                      //     this.massage += 'receive sample SUCSSESFUL\n';
                      //   } else {
                      //     this.massage += 'receive sample not including something\n';
                      //   }
                        
                      // });
                    });



                    
              });
          });
        });
      

        
      
      
      });
    });




    // this.LocalService.getSupplierGeneral().pipe(take(1)).subscribe(value51 => {
    //   this.LocalService.getItemsGeneral().pipe(take(1)).subscribe(value52 => {
    //     this.genral.getContractType().pipe(take(1)).subscribe(value53 => {
    //       this.genral.getStorage().pipe(take(1)).subscribe(value54 => {
    //           const mainOrder1 = { "poCode": { "supplier": value51[0], "contractType": value53[0], "code": null }, "recordedTime": "2020-05-05T13:12:29.855Z", "orderItems": [ 
    //               { "item": value52[0], "numberUnits": {"amount": "232", "measureUnit": "KG"}, "unitPrice": {"amount": "343", "currency": "USD"}, "deliveryDate": "2020-05-05", "remarks": "ertyf cvbnjytr bvvghh" },
    //                 { "item": value52[0], "numberUnits": {"amount": "4444", "measureUnit": "KG"}, "unitPrice": {"amount": "44", "currency": "USD"}, "deliveryDate": "2020-05-05", "remarks": null },
    //                 { "item": value52[1], "numberUnits": {"amount": "78", "measureUnit": "KG"}, "unitPrice": {"amount": "77", "currency": "USD"}, "deliveryDate": "2020-05-05", "remarks": null } ] }
    //           this.LocalService.addEditGenralOrder(mainOrder1, true).pipe(take(1)).subscribe(value56 => {

    //             mainOrder1['recordedTime'] = value56['recordedTime'];
    //             delete mainOrder1['poCode']['supplier'];
    //             mainOrder1['poCode']['contractTypeCode'] = mainOrder1['poCode']['contractType']['value'];
    //             delete mainOrder1['poCode']['contractType'];
                
    //             if(includesValdaite(Object.assign({}, value56), Object.assign({}, mainOrder1))) {
    //               this.massage += 'adding general order SUCSSESFUL\n';
    //             } else {
    //               // console.log(value56);
    //               // console.log(mainOrder1);
    //               this.massage += 'adding general order not including something\n';
    //             }

    //             const items = value56['orderItems'];
    //             const mainEdit1 = { "id": value56['id'], "version": value56['version'], "createdDate": value56['createdDate'], "orderItems": [
    //               { "id": items[0]['id'], "version": items[0]['version'], "item": value52[0], "numberUnits": {"amount": 2321, "measureUnit": "KG"}, "unitPrice": {"amount": 343, "currency": "USD"}, "deliveryDate": "2020-05-15", "remarks": "ertyf cvbnjytr bvvghh" },
    //               { "id": items[1]['id'], "version": items[1]['version'], "item": value52[0], "numberUnits": {"amount": 44441, "measureUnit": "KG"}, "unitPrice": {"amount": 44, "currency": "USD"}, "deliveryDate": "2020-05-15", "remarks": null },
    //               { "item": value52[2], "numberUnits": {"amount": 78, "measureUnit": "KG"}, "unitPrice": {"amount": 771, "currency": "USD"}, "deliveryDate": "2020-05-15", "remarks": "hhhhhhh" } ] }
            
    //             this.LocalService.addEditGenralOrder(mainEdit1, false).pipe(take(1)).subscribe(value57 => {

    //               if(includesValdaite(Object.assign({}, value57), Object.assign({}, mainEdit1))) {
    //                 this.massage += 'edit main genral order SUCSSESFUL\n';
    //               } else {
    //                 console.log(value57);
    //                 console.log(mainEdit1);
    //                 this.massage += 'edit main general order not including something\n';
    //               }

            

                    
            
    //               let stickData5 = {};
    //               stickData5['poCode'] = value57['poCode'];
    //               var orderdItems = [];
    //               value57['orderItems'].forEach(element => {
    //                       const nuuum = Math.floor(Math.random() * 4) + 1;
    //                       let newArray = [];
    //                       for(var i = 0; i<=nuuum; i++) {
    //                         newArray.push(
    //                             {
    //                                 unitAmount: {amount: (Math.random() * 10000).toFixed(2), measureUnit: 'KG'},
    //                                 numberUnits: (Math.random() * 10000).toFixed(2),
    //                                 warehouseLocation: value54[Math.floor(Math.random() * 3)],
    //                             }
    //                         );
    //                       }
    //                       orderdItems.push(
    //                           {
    //                               orderItem: element,
    //                               item: element['item'],
    //                               storageForms: newArray
    //                           }
    //                       );
    //               });
                  
    //               stickData5['receiptItems'] = orderdItems;
    //               stickData5['recordedTime'] = "2020-05-05T13:12:29.855Z";
                  
    //               console.log(stickData5);
                  
    //               this.LocalService.addEditRecivingGenralOrder(stickData5, true).pipe(take(1)).subscribe( value58 => {
                    
    //                 stickData5['recordedTime'] = value58['recordedTime'];
    //                 stickData5['receiptItems'].forEach(element => {
    //                       delete element['orderItem']
    //                 });
    //                 if(includesValdaite(Object.assign({}, value58), Object.assign({}, stickData5))) {
                      
    //                   if(value58['receiptItems'].every(line => { if(line['orderItem']) return true; })) {
    //                     this.massage += 'receive general order SUCSSESFUL\n';
    //                   } else {
    //                     this.massage += 'receive general order dosent have an order\n';
    //                   }
    //                 } else {
    //                   this.massage += 'receive general order not including something\n';
    //                 }
    //               });
    //             });
   
      //         });
      //     });
      //   });
      // });
    // });
    
      
    

  }
}