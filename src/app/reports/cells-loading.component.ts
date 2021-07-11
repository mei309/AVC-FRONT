import { Component, Input } from "@angular/core";

@Component({
    selector: 'cells-loading',
    template: `
    <div class="table-look">
        <div class="col">
            <div class="cell"><h1 i18n>Loadings</h1></div>
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
        <div class="col">
            <div class="cell title"><h3 i18n>Shipment code</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele['shipmentCode'] | tableCellPipe: 'nameId' : null}}
                    </span>
                </div>
            </ng-container>
        </div>
        
        <div class="col">
            <div class="cell title"><h3 i18n>Container number</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele['containerDetails']['containerNumber'] | tableCellPipe: 'normal' : null}}
                    </span>
                </div>
            </ng-container>
        </div>
        <div class="col">
            <div class="cell title"><h3 i18n>Seal number</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele['containerDetails']['sealNumber'] | tableCellPipe: 'normal' : null}}
                    </span>
                </div>
            </ng-container>
        </div>
        <div class="col">
            <div class="cell title"><h3 i18n>Container type</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                        {{ele['containerDetails']['containerType'] | tableCellPipe: 'normal' : null}}
                    </span>
                </div>
            </ng-container>
        </div>

        <div class="col">
            <div class="cell title"><h3 i18n>Product in</h3></div>
            <ng-container *ngFor="let ele of dataSource">
                <div class="cell">
                    <span style="white-space: pre-wrap;">
                    <ng-container *ngFor="let itemElem of ele['productIn']">
                        <b>{{itemElem.item.value}}: </b>
                        <ng-container *ngFor="let amountElem of itemElem['amountList']; let amou = index">
                        <span style="white-space: nowrap;" *ngIf="!amou; else notFirst">{{amountElem | tableCellPipe: 'weight' : null}}</span>
                        <ng-template #notFirst><span style="white-space: nowrap;">({{amountElem | tableCellPipe: 'weight' : null}})</span></ng-template>
                        </ng-container>
                        <br/>
                    </ng-container>
                    </span>
                    <ng-container *ngIf="ele['productIn'].length > 1">
                        <b>Total:</b> {{ele['totalProductIn'] | tableCellPipe: 'weight' : null}}
                    </ng-container>
                </div>
            </ng-container>
        </div>
    </div>
      `,
      styleUrls: ['./final-report-tables.css']
  })
  export class CellsLoading {

    @Input() dataSource;

  }