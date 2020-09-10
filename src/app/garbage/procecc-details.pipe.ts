// import { formatDate } from '@angular/common';
// import { Pipe, PipeTransform } from '@angular/core';
// import {isEqual} from 'lodash-es';
// @Pipe({
//   name: 'proceccDetailsPipe'
// })
// export class ProceccDetailsPipe implements PipeTransform {

//     transform(putData, editData) {
//         if(editData) {
//             if(putData) {
//                 return (this.writeDataEdit(putData, editData, this.regConfig)).fontsize(4);
//             } else {
//                 return '<ins>'+this.writeData(editData, this.regConfig).fontsize(4)+'</ins>';
//             }
//         } else {
//             return (this.writeData(putData, this.regConfig)).fontsize(4);
//         }
//     }

//     writeData(putData, fields) {
//         let result = '';
//         if(!putData) {
//           return 'data loading';
//         }
//         fields.forEach(field => {
//             if(putData.hasOwnProperty(field.name) && putData[field.name]) {
//                 result = result + this.checkData(putData[field.name], field);
//             }
//         });
//         return result;
//     }

//     checkData(putData, field) {
//         let result = '';
//         switch (field.type) {
//             case 'normal': {
//                 result = result + field.label.toUpperCase().bold() + ': ' + putData + ' ';
//                 break;
//             }
//             case 'nameId': {
//                 var temp = this.putNameId(putData);
//                 if(temp !== '') {
//                     result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                 }
//                 break;
//             }
//             case 'dateTime': {
//                 result = result + field.label.toUpperCase().bold() + ': ' + formatDate(<Date>putData, 'medium', 'en-US');
//                 break;
//             }
//             case 'name2': {
//                 var temp = this.putName2(putData, field.collections);
//                 if(temp !== '') {
//                     result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                 }
//                 break;
//             }
//             case 'array': {
//                 var temp = this.putArray(putData, field.collections);
//                 if(temp !== '') {
//                     result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp;
//                 }
//                 break;
//             }
//             case 'object': {
//                 var temp = this.writeData(putData, field.collections);
//                 if(temp !== '') {
//                     result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp + '\n';
//                 }
//                 break;
//             }
//             case 'parent': {
//                 result = result + this.writeData(putData, field.collections);
//                 break;
//             }
//         }
//         return result;
//     }

//   putNameId(val): string {
//     let result = '';
//     if(val instanceof Array) {
//       val.forEach(element => {
//         result = result + element['value']+'\t';
//       });
//     } else {
//       result = result + val['value'] +'\t';
//     }
//     return result;
//   }

//   putName2(val, place): string {
//     let result = '';
//     return val['value'] +'\t'+val[place]+'\t';
//   }


//   putArray(putData: any, fields): string {
//     let result = '';
//     putData.forEach(line => {
//         result = result + this.writeData(line, fields)+'\n';
//     });
//     return result;
//   }


//     writeDataEdit(putData, editData, regConfig): string {
//         let result = '';
//         regConfig.forEach(field => {
//             if(putData.hasOwnProperty(field.name) && putData[field.name]) {
//                 if(editData.hasOwnProperty(field.name) && editData[field.name]) {
//                     if(isEqual(putData[field.name], editData[field.name])) {
//                         result = result + this.checkData(putData[field.name], field);
//                     } else {
//                         result = result + this.checkDataEdit(putData[field.name], editData[field.name], field);
//                     }
//                 } else {
//                     result = result +'<del>'+ this.checkData(putData[field.name], field)+'</del>';
//                 }
//             } else if(editData.hasOwnProperty(field.name) && editData[field.name]) {
//                 result = result +'<ins>'+ this.checkData(putData[field.name], field)+'</ins>';
//             }
//         });
//         return result;
//     }

//     checkDataEdit(putData, editData, field): string {
//         let result = '';
//         switch (field.type) {
//             case 'normal': {
//                 result = result + field.label.toUpperCase().bold() + ': ' + '<ins>'+editData+'</ins>' + ' <del>' + putData + '</del> ';
//                 break;
//             }
//             case 'nameId': {
//                 var temp = this.putNameIdEdit(putData, editData);
//                 if(temp !== '') {
//                     result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                 }
//                 break;
//             }
//             case 'dateTime': {
//                 result = result + field.label.toUpperCase().bold() + ': ' +'<ins>'+formatDate(<Date>editData, 'medium', 'en-US')+'</ins>' + ' <del>' + formatDate(<Date>putData, 'medium', 'en-US') + '</del> ';
//                 break;
//             }
//             case 'name2': {
//                 var temp = this.putName2Edit(putData, editData, field.collections);
//                 if(temp !== '') {
//                     result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                 }
//                 break;
//             }
//             case 'array': {
//                 var temp = this.putArrayEdit(putData, editData, field.collections);
//                 if(temp !== '') {
//                     result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp;
//                 }
//                 break;
//             }
//             case 'object': {
//                 var temp = this.writeDataEdit(putData, editData, field.collections);
//                 if(temp !== '') {
//                     result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp + '\n';
//                 }
//                 break;
//             }
//             case 'parent': {
//                 result = result + this.writeDataEdit(putData, editData, field.collections);
//                 break;
//             }
//         }
//         return result;
//     }

//     putNameIdEdit(putData, editValue): string {
//         let result = '';
//         if(putData instanceof Array) {
//             
//             var changes = diffArray(putData, editValue, 'id', { updatedValues: diffArray.updatedValues.both });
            
//             changes['same'].forEach(line => {
//                 result = result + line['value'] +'\t';
//             });
//             changes['updated'].forEach(line => {
//                 result = result +'<del>'+ putData['value']+'</del>' +'\t' +'<ins>'+ editValue['value']+'</ins>'+'\t';
//             });
//             changes['added'].forEach(line => {
//                 result = result +'<ins>'+ line['value']+'</ins>'+'\t';
//             });
//             changes['removed'].forEach(line => {
//                 result = result +'<del>'+ line['value']+'</del>' +'\t';
//             });
//         } else {
//             result = result +'<del>'+ putData['value']+'</del>' +'\t' +'<ins>'+ editValue['value']+'</ins>'+'\t';
//         }
//         return result;
//     }

//     putName2Edit(putData, editValue, place): string {
//         return '<del>'+(putData['value'] +'\t'+putData[place]+'\t')+'</del>' +'<ins>'+ (editValue['value'] +'\t'+editValue[place]+'\t')+'</ins>';
//     }

//     putArrayEdit(putData, editValue, fields): string {
//         let result = '';
//         
//         var changes = diffArray(putData, editValue, 'id', { updatedValues: diffArray.updatedValues.both });
//         changes['same'].forEach(line => {
//             result = result + this.writeData(line, fields)+'\n';
//         });
//         changes['updated'].forEach(line => {
//             console.log(line);
//             result = result + this.writeDataEdit(line[0], line[1], fields)+'\n';
//         });
//         changes['added'].forEach(line => {
//             result = result +'<ins>'+ this.writeData(line, fields)+'</ins>'+'\n';
//         });
//         changes['removed'].forEach(line => {
//             result = result +'<del>'+ this.writeData(line, fields)+'</del>'+'\n';
//         });
//         return result;
//     }

//         regConfig = [
//             {
//                 type: 'nameId',
//                 label: 'Supplier',
//                 name: 'supplier',
//             },
//             {
//                 type: 'nameId',
//                 label: '#PO',
//                 name: 'poCode',
//             },
//             {
//                 type: 'dateTime',
//                 label: 'Contract date',
//                 name: 'recordedTime',
//             },
//             {
//                 type: 'array',
//                 label: 'Orderd products',
//                 name: 'orderItems',
//                 collections: [
//                     {
//                         type: 'nameId',
//                         label: 'Item descrption',
//                         name: 'item',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Weight',
//                         name: 'numberUnits',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Weight unit',
//                         name: 'measureUnit',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Price per unit',
//                         name: 'unitPrice',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Currency',
//                         name: 'currency',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Delivery date',
//                         name: 'deliveryDate',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Defects',
//                         name: 'defects',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Remarks',
//                         name: 'remarks',
//                     },
//                 ]
//             },
//             {
//                 type: 'dateTime',
//                 label: 'Receive date',
//                 name: 'recordedTime',
//             },
//             {
//                 type: 'array',
//                 label: 'Received products',
//                 name: 'processItems',
//                 collections: [
//                     {
//                         type: 'nameId',
//                         label: 'Item descrption',
//                         name: 'item',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Weight',
//                         name: 'numberUnits',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Weight unit',
//                         name: 'measureUnit',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Unit amount',
//                         name: 'unitAmount',
//                     },
//                     {
//                         type: 'nameId',
//                         label: 'Storage locatio',
//                         name: 'storageLocation',
//                     },
//                     {
//                         type: 'normal',
//                         label: 'Remarks',
//                         name: 'remarks',
//                     },
//                 ]
//             },
//         ];
// }