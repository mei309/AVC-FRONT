import {
    Directive,
    ElementRef,
    HostListener,
    Input
} from '@angular/core';

@Directive({
    selector: '[DurationPicker]'
})
export class MyDurationPickerDirective {
    private navigationKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ':'];
    @Input()
    picker: HTMLInputElement;

    constructor(public el: ElementRef) {

        this.picker = el.nativeElement;
        this.picker.value = '00:00';
        this.picker.style.textAlign = 'right';
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (this.navigationKeys.indexOf(e.key) > -1) {
            // let it happen, don't do anything
            return;
        }
        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }

    @HostListener('change', ['$event']) ngOnChanges(e) {
        this.validateInput(e);
    }

    @HostListener('click', ['$event']) ngOnClick(e) {
        this.selectFocus(e);
    }

    validateInput(event) {
        const sectioned = event.target.value.split(':');
        if (sectioned.length !== 2) {
            event.target.value = '00:00'; // fallback to default
            return;
        }
        if (sectioned.length === 2 && sectioned[1].length === 0) {
            event.target.value = '00:00'; // fallback to default
            return;
        }
        if (sectioned.length === 2 && sectioned[0].length === 0) {
            event.target.value = '00:00'; // fallback to default
            return;
        }
        if (isNaN(sectioned[0])) {
            sectioned[0] = '00';
        }
        if (isNaN(sectioned[1]) || sectioned[1] < 0) {
            sectioned[1] = '00';
        }
        if (sectioned[1] > 59 || sectioned[1].length > 2) {
            sectioned[1] = '59';
        }
        event.target.value = sectioned.join(':');
    }

    selectFocus = event => {
        // get cursor position and select nearest block;
        const cursorPosition = event.target.selectionStart;
        // '00:00' this is the format used to determine cursor location
        const hourMarker = event.target.value.indexOf(':');
        if (hourMarker < 0) {
            // something wrong with the format. just return;
            return;
        }
        if (cursorPosition < hourMarker) {
            event.target.selectionStart = 0; // hours mode
            event.target.selectionEnd = hourMarker;
        }
    };
}
