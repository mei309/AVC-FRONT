import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, KeyValuePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import {uniq} from 'lodash-es';
@Pipe({
  name: 'tableCellPipe'
})
export class TableCellPipe implements PipeTransform {

    constructor(@Inject(LOCALE_ID) private locale: string) {
    }
    transform(element, type, second) {
        switch (type) {    
            case 'normal':
                return element;
            case 'nameId':
                if(Array.isArray(element)) {
                    return element.map(value => value.value);
                } else {
                    return element['value'];
                }
            case 'dateTime':
                return new DatePipe(this.locale).transform(element, 'medium');
            case 'date':
                return new DatePipe(this.locale).transform(element);
            case 'name2':
                return element['value'] +', '+ element[second];
            case 'currency':
                return new CurrencyPipe(this.locale).transform(element['amount'], element['currency']);
            case 'weight':
                if (Array.isArray(element)) {
                    return 'zvi why array';
                }
                return new DecimalPipe(this.locale).transform(element['amount'])+' '+element['measureUnit'];
            case 'weight2':
                if (!Array.isArray(element)) {
                    return 'zvi array';
                }
                return new DecimalPipe(this.locale).transform(element[0]['amount'])+' '+element[0]['measureUnit']
                + ' (' + new DecimalPipe(this.locale).transform(element[1]['amount'])+' '+element[1]['measureUnit'] + ')';
            case 'check':
                if(element === second){
                    const tempElement = document.createElement("div");
                    tempElement.innerHTML = '&#x2713';
                    return tempElement.innerText;
                } else {
                    return ;
                }
            case 'percent':
                return new PercentPipe(this.locale).transform(element/100, '1.0-3');
            case 'percentNormal':
                return new PercentPipe(this.locale).transform(element, '1.0-3');
            case 'percentCollections':
                return new PercentPipe(this.locale).transform(element/second, '1.0-3');
            case 'difference':
                return element['amount'] - second['amount'];
            case 'arrayVal':
                return element.toString();
            case 'array':
                return uniq(element.split(',')).toString();
            case 'amountWithUnit':
                var str = '';
                element.forEach(elem => {
                    if(str) {
                        str += '<br/>';
                    }
                    str += [elem.item.value] +':'+ elem.amountWithUnit[0]['value'] + ' (' + elem.amountWithUnit[1]['value'] + ') ' + [elem.warehouses];
                });
                return str;
            default:
                return element;
        }
    }
  
}