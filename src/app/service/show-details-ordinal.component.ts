import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'show-details-ordinal',
  template: `
  <div class="array-field-grid">
    <div *ngFor="let item of dataSource" class="one-cell-table">
      <span>&nbsp; {{item.ordinal}} &nbsp;</span>
      <mat-form-field style="width: 100px" appearance="none" provideReadonly>
        <input matInput style="text-align: center" readonly [value]="item.amount">
      </mat-form-field>
    </div>
  </div>
`,
})
export class ShowOrdinalComponent implements OnInit {
  
    @Input() dataSource;

    @Input() secondSource;
  
    noChanges: boolean = true;
  
    constructor() {}
    ngOnInit() {
    }
}
