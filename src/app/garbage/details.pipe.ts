// import { formatDate } from '@angular/common';
// import { Pipe, PipeTransform } from '@angular/core';
// @Pipe({
//   name: 'detailsPipe'
// })
// export class DetailsPipe implements PipeTransform {

//     transform(putData, fields) {
//         let result = '';
//         if(!putData) {
//           return 'data loading';
//         }
//         fields.forEach(field => {
//             if(putData.hasOwnProperty(field.name) && putData[field.name]) {
//                 switch (field.type) {
//                     case 'normal': {
//                         result = result + field.label.toUpperCase().bold() + ': ' + putData[field.name] + ' ';
//                         break;
//                     }
//                     case 'nameId': {
//                         var temp = this.putNameId(putData[field.name]);
//                         if(temp !== '') {
//                             result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                         }
//                         break;
//                     }
//                     case 'dateTime': {
//                         result = result + field.label.toUpperCase().bold() + ': ' + formatDate(<Date>putData, 'medium', 'en-US');
//                         break;
//                     }
//                     case 'name2': {
//                         var temp = this.putName2(putData[field.name], field.collections);
//                         if(temp !== '') {
//                             result = result + field.label.toUpperCase().bold() + ': ' + temp;
//                         }
//                         break;
//                     }
//                     case 'array': {
//                         var temp = this.putArray(putData[field.name], field.collections);
//                         if(temp !== '') {
//                             result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp;
//                         }
//                         break;
//                     }
//                     case 'object': {
//                         var temp = this.transform(putData[field.name], field.collections);
//                         if(temp !== '') {
//                             result = result + '\n' + field.label.toUpperCase().bold() + '\n' + temp + '\n';
//                         }
//                         break;
//                     }
//                     case 'parent': {
//                         result = result + this.transform(putData[field.name], field.collections);
//                         break;
//                     }
//                 }
//             }
//         });
//         return result.fontsize(4);
//     }

//   putNameId(val): string {
//     let result = '';
//     if(val instanceof Array) {
//       val.forEach(element => {
//         result = result + element.value+'\t';
//       });
//     } else {
//       result = result + val.value +'\t';
//     }
//     return result;
//   }

//   putName2(val, place): string {
//     let result = '';
//     // if(val instanceof Array) {
//     //   val.forEach(element => {
//     //     result = result + element.value+'\t';
//     //   });
//     // } else {
//       return val.value +'\t'+val[place];
//     // }
//     // return result;
//   }

//   putArray(putData: any, fields): string {
//     let result = '';
//     if(putData.length == 0) {
//       return result;
//     }
//     putData.forEach(line => {
//         result = result + this.transform(line, fields)+'\n';
//     });
//     return result;
//   }

// }




