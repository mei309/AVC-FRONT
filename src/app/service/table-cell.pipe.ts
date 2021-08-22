import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { uniq } from 'lodash-es';
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
                    var str = '';
                    element.forEach(elem => {
                        if(str) {
                            str += ', ';// '\n';
                        }
                        str += elem.value;
                    });
                    return str;
                    // return element.map(va => va.value);
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
                return new CurrencyPipe(this.locale).transform(element['amount'], element['currency'], 'symbol', '1.0-3');
            case 'weight':
            case 'weight2': 
                if(element) {
                    if (Array.isArray(element)) {
                        var str = '';
                        // if(element[0]['amount']) {dose problem when 0
                            str = new DecimalPipe(this.locale).transform(element[0]['amount'])+' '+element[0]['measureUnit'];
                        // }
                        for (let ind = 1; ind < element.length; ind++) {
                            // if(element[ind]['amount']) {
                                str += ' (' + new DecimalPipe(this.locale).transform(element[ind]['amount'])+' '+element[ind]['measureUnit'] + ')';
                            // }
                        }
                        return str;
                    } else {
                        return new DecimalPipe(this.locale).transform(element['amount'])+' '+element['measureUnit'];
                    }
                } else {
                    return '';
                }
            case 'check':
                if(element === second){
                    return '\u2713';
                } else {
                    return ;
                }
            case 'checkBool':
                // if(element === second){
                    return '\u2713';
                // } else {
                //     return ;
                // }
            case 'percent':
                return new PercentPipe(this.locale).transform(element/100, '1.0-3');
            case 'percentNormal':
                return new PercentPipe(this.locale).transform(element, '1.0-3');
            case 'percentCollections':
                return new PercentPipe(this.locale).transform(element/second, '1.0-3');
            case 'difference':
                return element['amount'] - second['amount'];
            case 'arrayVal':
                return element.join(', ');
            case 'array':
                return uniq(element.split(',')).toString();
            case 'itemWeight':
                var str = '';
                element.forEach(elem => {
                    if(str) {
                        str += '\n';
                    }
                    str += elem.item.value +': '+ new DecimalPipe(this.locale).transform(elem['amountList'][0]['amount'])+' '+elem['amountList'][0]['measureUnit'];
                    for (let ind = 1; ind < elem['amountList'].length; ind++) {
                        str += ' (' + new DecimalPipe(this.locale).transform(elem['amountList'][ind]['amount'])+' '+elem['amountList'][ind]['measureUnit'] + ')';
                    }
                    str += [elem.warehouses];
                });
                return str;
            case 'listDates':
                var str = '';
                element.forEach(elem => {
                    if(str) {
                        str += '\n';
                    }
                    str += new DatePipe(this.locale).transform(elem);
                });
                return str;
            case 'decimalNumber':
                return new DecimalPipe(this.locale).transform(element);
            case 'dates':
                return new DatePipe(this.locale).transform(element.begin)+' - '+new DatePipe(this.locale).transform(element.end);
            default:
                return element;
        }
    }
  
}