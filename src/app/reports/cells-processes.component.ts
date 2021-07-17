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
            <ng-container *ngIf="doseHaveFooter">
                <span class="empty-footer"></span>
            </ng-container>
        </div>
        <ng-container *ngFor="let el of oneColumns">
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
                <ng-container *ngIf="doseHaveFooter">
                    <div class="cell footer" *ngIf="dataSource[el.name].length > 1; else noContent">
                        <b>Total:</b> {{dataSource[el.foot] | tableCellPipe: 'weight' : null}}
                    </div>
                    <ng-template #noContent>
                        <span class="empty-footer"></span>
                    </ng-template>
                </ng-container>
            </div>
        </ng-container>
        <div class="col" *ngIf="dataSource['difference']">
            <div class="cell title"><h3 i18n>Difference</h3></div>
            <div class="cell">
                <h2>{{dataSource['difference'] | tableCellPipe: 'weight' : null}} ({{dataSource['percentageLoss']}}%)</h2>
            </div>
            <ng-container *ngIf="doseHaveFooter">
                <span class="empty-footer"></span>
            </ng-container>
        </div>
    </div>
      `,
      styleUrls: ['./final-report-tables.css']
  })
  export class CellsProcesses {

    @Input() process;
    @Input() dataSource;

    @Input() oneColumns;

    doseHaveFooter: boolean = false;
    

    ngOnInit() {
        if(!this.oneColumns) {
            this.oneColumns = [
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
        this.doseHaveFooter = this.oneColumns.some(el => this.dataSource[el.name] && this.dataSource[el.name].length > 1); 
    }

  }