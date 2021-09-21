import { Component, Input } from "@angular/core";

@Component({
    selector: 'cells-qcs',
    template: `
    <div class="table-look">
        <div class="col">
            <div class="cell"><h1>{{process}}</h1></div>
        </div>
        <div class="col">
            <div class="cell title"><h3 i18n>Checked by</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele.checkedBy}}
                        <br/>
                    </span>
                </div>
            </ng-container>
        </div>
        <div class="col">
            <div class="cell title"><h3 i18n>Date-Status-Approvals</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele.date | date}}-{{ele.status}}-{{ele.approvals}}
                        <br/>
                    </span>
                </div>
            </ng-container>
        </div>
        <ng-container *ngFor="let el of columnsQc">
            <div class="col">
                <div class="cell title"><h3>{{el.label}}</h3></div>
                <ng-container *ngFor="let ele of dataSource">
                    <ng-container *ngFor="let elem of ele['itemQcs']">
                        <div class="cell">
                            <span *ngIf="elem[el.name] != null" style="white-space: pre-wrap;">
                                {{elem[el.name] | tableCellPipe: el.type : null}}
                            </span>
                        </div>
                    </ng-container>
                </ng-container>
            </div>
        </ng-container>


    </div>
      `,
      styleUrls: ['./final-report-tables.css']
  })
  export class CellsQcs {

    @Input() dataSource;
    @Input() process;
    columnsQc = [
        // {
        //     type: 'normal',
        //     name: 'checkedBy',
        //     label: $localize`Checked by`,
        //     group: 'date'
        // },
        // {
        //     type: 'date',
        //     name: 'date',
        //     label: $localize`Check date`,
        //     group: 'date'
        // },
        // {
        //     type: 'normal',
        //     name: 'approvals',
        //     label: $localize`Approvals`,
        //     group: 'date'
        // },
        // {
        //     type: 'normal',
        //     name: 'status',
        //     label: $localize`Status`,
        //     group: 'date'
        // },
        {
            type: 'nameId',
            name: 'item',
            label: $localize`Product descrption`,
        },
        {
            type: 'percent',
            label: $localize`Humidity`,
            name: 'humidity',
        },
        {
            type: 'percentNormal',
            label: $localize`Breakage`,
            name: 'breakage',
        },
        {
          type: 'percentNormal',
          name: 'totalDamage',
          label: $localize`Total damage`,
        },
        {
          type: 'percentNormal',
          name: 'totalDefects',
          label: $localize`Total defects`,
        },
        {
          type: 'percentNormal',
          name: 'totalDefectsAndDamage',
          label: $localize`Total defects + damage`,
        },
        // {
        //     type: 'kidArray',
        //     name: 'itemQcs',
        // },
      ];
  }
