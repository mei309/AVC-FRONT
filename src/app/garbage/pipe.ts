
// import { Pipe, PipeTransform } from '@angular/core';
// @Pipe({
//   name: 'objectValues'
// })
// export class ObjectValuesPipe implements PipeTransform {
 
//   transform(object: any) {
//     let result = '';
//     if(isFish(object)) {
//       if(Object.keys(object).length === 2) {
//         return object.value+'\t';
//       } else if(Object.keys(object).length === 3) {
//         var temp = '';
//         for (var property in object) {
//           if (typeof object[property] == "object"){
//             temp = object[property].value;
//           }
//         }
//         return object.value+'\t'+temp;
//       }
//     }
//     for (var property in object) {
//         if (property !== 'id') {
//           if (object[property] == null){
//           } else if (object[property] instanceof Array){
//             result = result + '\n' + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformArray(object[property]);
//           }else if (typeof object[property] == "object"){
//               result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformObject(object[property]);
//           }else{
//             result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() + ': ' + object[property] + ' ';
//           }
//         }
//     }
//     return result.fontsize(4);
//   }

//   transformArray(object: any) {
//     let result = '';
//     for (var property in object) {
//         if (object[property] === null || property === 'id'){
//         }else if (object[property] instanceof Array){
//             result = result + '\n' + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformArray(object[property]);
//         }else if (typeof object[property] == "object"){
//           if(isFish(object[property]) && Object.keys(object[property]).length === 2) {
//             result = result + object[property].value+'\t';
//           } else {
//             result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformObject(object[property]);
//           }
//         } else{
//           result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() + ': ' + object[property] + ' ';
//         }
//     }
//     return result;
//   }

//   transformObject(object: any) {
//     let result = '';
//     if(isFish(object)) {
//       if(Object.keys(object).length === 2) {
//         return object.value+'\t';
//       } else if(Object.keys(object).length === 3) {
//         var temp = '';
//         for (var property in object) {
//           if (typeof object[property] == "object"){
//             temp = object[property].value;
//           }
//         }
//         return object.value+'\t'+temp;
//       }
//     }
//     for (var property in object) {
//         if (property !== 'id') {
//           if (object[property] == null){
//           } else if (object[property] instanceof Array){
//             result = result + '\n' + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformArray(object[property]);
//           }else if (typeof object[property] == "object"){
//               result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() +': ' +this.transformObject(object[property]);
//           }else{
//             result = result + (property.split(/(?=[A-Z])/).join(" ")).toUpperCase().bold() + ': ' + object[property] + ' ';
//           }
//         }
//     }
//     return result;
//   }


// }


// interface DropNormal {
//   value: string;
//   id: number;
// }
// function isFish(pet: DropNormal | object): pet is DropNormal {
//     return (pet as DropNormal).value !== undefined && (pet as DropNormal).id !== undefined;
// }