import {Directive, ElementRef, HostListener, Input } from "@angular/core";
import { NgControl } from '@angular/forms';
  @Directive({
    selector: "[numeric]"
  })
  export class NumericDirective {
    @Input("decimals") decimals: number = 0;
    @Input("minus") minus: boolean = false;
  
    private check(value: string) {
        if (this.decimals <= 0) {
            return String(value).match(new RegExp(/^\d+$/));
        } else if (this.minus) {
            var regExpString =
                "^\\s*((\\-?\\.?)|(\\-?\\d+(\\.\\d{0," +
                this.decimals +
                "})?)|((\\-?\\d*(\\.\\d{1," +
                this.decimals +
                "}))))\\s*$";
            return String(value).match(new RegExp(regExpString));
        } else {
            var regExpString =
                "^\\s*((\\.)|(\\d+(\\.\\d{0," +
                this.decimals +
                "})?)|((\\d*(\\.\\d{1," +
                this.decimals +
                "}))))\\s*$";
            return String(value).match(new RegExp(regExpString));
        }
    }
  
    private run(oldValue) {
        setTimeout(() => {
            let currentValue: string = this.el.nativeElement.value;
            if (currentValue !== '' && !this.check(currentValue)) {
                this.el.nativeElement.value = oldValue;
                this.control.control.setValue(oldValue);
            }
        });
    }
  
    constructor(private el: ElementRef, private control : NgControl) {}
  
    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        this.run(this.el.nativeElement.value);
    }
  
    @HostListener("paste", ["$event"])
    onPaste(event: ClipboardEvent) {
        this.run(this.el.nativeElement.value);
    }
  
  }