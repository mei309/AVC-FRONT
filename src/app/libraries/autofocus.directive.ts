import { AfterContentInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FormDirective implements AfterContentInit{
  focusables = ['input', 'select', 'textarea']
  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    const input = this.el.nativeElement.querySelector(
      this.focusables.join(','),
    )
    if (input) {
      setTimeout(() => {
        input.focus();
      }, 2)
      
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