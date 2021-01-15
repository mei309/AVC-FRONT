import { AfterContentInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FormDirective implements AfterContentInit{
  @Input("popup") popup: boolean = false;
  focusables = ['input', 'select', 'textarea']
  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    if(!this.popup) {
      const input = this.el.nativeElement.querySelector(
        this.focusables.join(','),
      )
      if (input) {
        setTimeout(() => {
          input.focus();
        }, 2) 
      }
    }
  }
  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector(
      this.focusables.map((x) => `${x}.ng-invalid`).join(','),
    )
    
    if (invalidControl) {
      invalidControl.focus();
    }
  }
}