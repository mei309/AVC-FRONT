import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'cells-processes',
    template: `
    <div class="table-look">
        <div class="col">
            <div class="cell"><h1>{{process}}</h1></div>
        </div>
        <div class="col" *ngIf="dataSource['processes']">
            <div class="cell title"><h3 i18n>Date-Status-Approvals</h3></div>
            <div class="cell">
                <span style="white-space: pre-wrap;">
                <ng-container *ngFor="let ele of dataSource['processes']">
                    {{ele.date | date}}-{{ele.status}}-{{ele.approvals}}
                    <br/>
                </ng-container>
                </span>
            </div>
        </div>
        <ng-container *ngFor="let el of regShow">
            <div class="col" *ngIf="dataSource[el.name]">
                <div class="cell title"><h3>{{el.label}}</h3></div>
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                    <ng-container *ngFor="let itemElem of dataSource[el.name]">
                        <b>{{itemElem.item.value}}: </b>
                        <ng-container *ngFor="let amountElem of itemElem['amountList']; let amou = index">
                        <span style="white-space: nowrap;" *ngIf="!amou; else notFirst">{{amountElem | tableCellPipe: 'weight' : null}}</span>
                        <ng-template #notFirst><span style="white-space: nowrap;">({{amountElem | tableCellPipe: 'weight' : null}})</span></ng-template>
                        </ng-container>
                        <br/>
                    </ng-container>
                    </span>
                </div>
                <div class="cell" *ngIf="dataSource[el.name].length > 1">
                    <b>Total:</b> {{dataSource[el.foot] | tableCellPipe: 'weight' : null}}
                </div>
            </div>
        </ng-container>
        <div class="col" *ngIf="dataSource['difference']">
            <div class="cell title"><h3 i18n>Difference</h3></div>
            <div class="cell">
                <h2>{{dataSource['difference'] | tableCellPipe: 'weight' : null}} ({{dataSource['percentageLoss']}}%)</h2>
            </div>
        </div>
    </div>
      `,
      styleUrls: ['./final-report-tables.css']
  })
  export class CellsProcesses {

    @Input() process;
    @Input() dataSource;

    @Input() set oneColumns(value) {
        if(value){
            this.regShow = value;
        }
    }
    get oneColumns() { return this.regShow; }

    regShow = [
        {
            type: 'itemWeight',
            name: 'productIn',
            label: $localize`Product in`,
            foot: 'totalProductIn',
        },
        {
            type: 'itemWeight',
            name: 'ingredients',
            label: $localize`Ingredients`,
            foot: 'totalIngredients',
        },
        {
            type: 'itemWeight',
            name: 'received',
            label: $localize`Received`,
            foot: 'totalReceived',
        },
        {
            type: 'itemWeight',
            name: 'productOut',
            label: $localize`Product out`,
            foot: 'totalProductOut',
        },
        {
            type: 'itemWeight',
            name: 'waste',
            label: $localize`Waste`,
            foot: 'totalWaste',
        },
        {
            type: 'itemWeight',
            name: 'productCount',
            label: $localize`Product count`,
            foot: 'totalProductCount',
        },
    ];
  }