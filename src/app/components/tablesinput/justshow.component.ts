import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'just-show',
  template: `
  <fieldset [ngStyle]="{'width':'90%'}">
  <legend *ngIf="mainLabel"><h1>{{mainLabel}}</h1></legend>
  <ng-container *ngFor="let column of oneColumns">
    
      <ng-container *ngIf="dataSource[column.name]">
          <ng-container [ngSwitch]="column.type">
              <ng-container *ngSwitchCase="'normal'">
                <mat-form-field appearance="none" provideReadonly>
                    <mat-label>{{column.label}}</mat-label>
                    <input readonly matInput [value]="dataSource[column.name]" >
                </mat-form-field>
              </ng-container>
              <ng-container *ngSwitchCase="'nameId'">
                <div style="display: inline" *ngIf="isArray(dataSource[column.name]); else elseBlock">
                  <mat-form-field *ngIf="dataSource[column.name].length" appearance="none" provideReadonly>
                      <mat-label>{{column.label}}</mat-label>
                      <mat-chip-list #chipList>
                          <mat-chip *ngFor="let symbol of dataSource[column.name];">{{symbol.value}} </mat-chip>
                          <input readonly matInput [matChipInputFor]="chipList">
                      </mat-chip-list>
                  </mat-form-field>
                </div>
                <ng-template  #elseBlock>
                    <mat-form-field appearance="none" provideReadonly>
                      <mat-label>{{column.label}}</mat-label>
                      <input readonly matInput [value]="dataSource[column.name]['value']" >
                    </mat-form-field>
                </ng-template >
              </ng-container>
              <ng-container *ngSwitchCase="'dateTime'">
                <mat-form-field appearance="none" provideReadonly>
                  <mat-label>{{column.label}}</mat-label>
                  <input readonly matInput [ngxMatDatetimePicker]="picker" [value]="dataSource[column.name]" >
                  <ngx-mat-datetime-picker  #picker></ngx-mat-datetime-picker>
                </mat-form-field>
              </ng-container>
              <ng-container *ngSwitchCase="'name2'">
                <mat-form-field appearance="none" provideReadonly>
                    <mat-label>{{column.label}}</mat-label>
                    <input readonly matInput [value]="dataSource[column.name]['value']">
                </mat-form-field>
                <mat-form-field appearance="none" provideReadonly>
                    <mat-label>{{column.collections}}</mat-label>
                    <input readonly matInput [value]="dataSource[column.name][column.collections]">
                </mat-form-field>
              </ng-container>
              <ng-container *ngSwitchCase="'object'">
                <ng-container *ngIf="dataSource[column.name]['id']">
                  <h4>{{column.label}}</h4>
                  <just-show [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" (submit)="onSubmit($event)">
                  </just-show>
                </ng-container>
              </ng-container>
              <ng-container *ngSwitchCase="'parent'">
                <ng-container *ngIf="dataSource[column.name]['id']">
                  <just-show [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" (submit)="onSubmit($event)">
                  </just-show>
                </ng-container>
              </ng-container>
              <ng-container *ngSwitchCase="'parentArray'">
                <ng-container *ngIf="dataSource[column.name].length">
                  <just-show [oneColumns]="column.collections" [dataSource]="dataSource[column.name][0]" (submit)="onSubmit($event)">
                  </just-show>
                </ng-container>
              </ng-container>
              <ng-container *ngSwitchCase="'array'">
                <table-info *ngIf="dataSource[column.name].length" [oneColumns]="column.collections" [dataSource]="dataSource[column.name]" [titel]="column.label" (submit)="onSubmit($event)">
                </table-info>
              </ng-container>
              <ng-container *ngSwitchCase="'arrayGroup'">
                <table-info-group *ngIf="dataSource[column.name].length" [mainDetailsSource]="[dataSource[column.name], column.collections]" [titel]="column.label" (submit)="onSubmit($event)">
                </table-info-group>
              </ng-container>
              
          </ng-container>
      </ng-container>
    </ng-container>
    
</fieldset>
    
  `,
  styleUrls: ['tablesinfo.css'],
})
export class JustShowComponent implements OnInit {
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();
    
  @Input() mainLabel: string = null;
  dataTable;
  @Input() set dataSource(value) {
      this.dataTable = value;
  }
  get dataSource() { return this.dataTable; }

  regShow;
  @Input() set oneColumns(value) {
    if(value){
      this.regShow = value;
    }
  }
  get oneColumns() { return this.regShow; }


  ngOnInit() {
  }

  isArray(obj : any ) {
   return Array.isArray(obj)
  }

    onSubmit(event: Event) {
          this.submit.emit(event);
      }
}