import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'cells-final-report',
    template: `
    <div fxLayout="row" fxLayoutAlign="start center" >
      <div  *ngFor="let subject of regShow" fxFlex>
        <div fxLayout="column" fxLayoutAlign="start start" >
            {{subject | json}}
        </div>
        <div fxFlex class="sec1" fxFlex.xs="55">
              first-section
          </div>
          <div fxFlex class="sec2" >
              second-section
          </div>
          <div fxFlex>
              third-section
          </div>
      </div>
    </div>
    <div fxLayout="row" fxLayoutGap="10px" class="container">
    <div style="width: 50px;" fxLayoutAlign="center center">1</div>
    <div style="width: 50px;" fxLayoutAlign="center center">2</div>
    <div style="width: 50px;" fxLayoutAlign="center center">3</div>
    <div style="width: 50px;" fxLayoutAlign="center center">4</div>
  </div>
      `,
  })
  export class CellsFinalReport {

    @Input() dataSource;
    regShow = [
        // {
        //     name: 'processes',
        //     label: $localize`Processes`,
        // },
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
        // {
        //     name: 'difference',
        // },
    ];
  }