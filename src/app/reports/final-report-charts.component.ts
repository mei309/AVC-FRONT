import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'final-report-charts',
  template:` 
<div class="grid-container">
  <mat-grid-list cols="3" rowHeight="400px">
    <mat-grid-tile *ngFor="let card of cards | async" [colspan]="card.cols" [rowspan]="card.rows">
      <mat-card class="dashboard-card" *ngIf="card.result.length">
        <mat-card-header>
          <mat-card-title>
            {{card.title}}
            <!-- <button mat-icon-button class="more-button" [matMenuTriggerFor]="menu" aria-label="Toggle menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu" xPosition="before">
              <button mat-menu-item>Expand</button>
              <button mat-menu-item>Remove</button>
            </mat-menu> -->
          </mat-card-title>
        </mat-card-header>
        <mat-card-content class="dashboard-card-content">
          <div [ngSwitch]="card.type" style="height: 300px;">
            <ngx-charts-bar-vertical-2d *ngSwitchCase="'vertical-2d'" [results]="card.result" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel" legendTitle="'Loss type'"
                yScaleMax="4" yScaleMin="-4" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical-2d>
            <ngx-charts-bar-vertical *ngSwitchCase="'vertical'" [results]="card.result" xAxis="true" yAxis="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="4" yScaleMin="-4" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-grid-tile>
  </mat-grid-list>
</div>
  ` ,
  styleUrls: ['./final-report-tables.css']
})
export class FinalReportChartsComponent {
    xAxisLabel = 'Process';
    yAxisLabel = 'Difference';
    totalLoss = [];
    productLoss = [];
    // bothLoss = [];
    receiptOrder = [];
    receiptReal = [];

    LossDataLabel;

    @Input() finalReport;

    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({ matches }) => {
          if (matches) {
            return [
              // { title: 'Total + Product Loss Per Process', cols: 1, rows: 1, type: 'vertical-2d', result: 'bothLoss' },
              { title: $localize`Unaccounted Difference`, cols: 1, rows: 1, type: 'vertical', result: this.totalLoss },
              { title: $localize`Product Difference`, cols: 1, rows: 1, type: 'vertical', result: this.productLoss },
              // { title: 'Aggregate Difference from Receipt (Order, Real)', cols: 1, rows: 1, type: 'vertical-2d', result: this.orderLoss },
              { title: $localize`Aggregate Difference from Receipt (Order)`, cols: 1, rows: 1, type: 'vertical', result: this.receiptOrder },
              { title: $localize`Aggregate Difference from Receipt (Real)`, cols: 1, rows: 1, type: 'vertical', result: this.receiptReal },
            ];
          }
    
          return [
            // { title: 'Total + Product Loss Per Process', cols: 2, rows: 1, type: 'vertical-2d', result: 'bothLoss' },
            { title: $localize`Unaccounted Difference`, cols: 1, rows: 1, type: 'vertical', result: this.totalLoss },
            { title: $localize`Product Difference`, cols: 1, rows: 1, type: 'vertical', result: this.productLoss },
            // { title: 'Aggregate Difference from Receipt (Order, Real)', cols: 2, rows: 1, type: 'vertical-2d', result: this.orderLoss },
            { title: $localize`Aggregate Difference from Receipt (Order)`, cols: 1, rows: 1, type: 'vertical', result: this.receiptOrder },
            { title: $localize`Aggregate Difference from Receipt (Real)`, cols: 1, rows: 1, type: 'vertical', result: this.receiptReal },
          ];
        })
      );

    constructor(private breakpointObserver: BreakpointObserver) {}
    
    ngOnInit() {
        this.LossDataLabel = this.formatLoss.bind(this);
        
        ['cleaning', 'roasting', 'toffee', 'packing'].forEach(v => {
            var val1 = this.finalReport[v];
            if(val1 && val1['difference']) {
                // this.bothLoss.push({
                //     name: v,
                //     series: [
                //         {
                //             name: "Total",
                //             value: val1['percentageLoss'],
                //             extra :  {
                //                 In: val1['totalProductIn'],
                //                 Out: val1['totalProductOut'],
                //                 Difference: val1['difference'],
                //                 Waste: val1['totalWaste'],
                //             }
                //         },
                //         {
                //             name: "Product",
                //             value: val1['productPercentageLoss'],
                //             extra :  {
                //                 In: val1['totalProductIn'],
                //                 Out: val1['totalProductOut'],
                //             }
                //         }
                //     ]
                // });
                this.totalLoss.push({
                    name: v,
                    value: val1['percentageLoss'],
                    extra :  {
                        In: val1['totalProductIn'],
                        Out: val1['totalProductOut'],
                        Difference: val1['difference'],
                        Waste: val1['totalWaste'],
                    }
                });
                this.productLoss.push({
                    name: v,
                    value: val1['productPercentageLoss'],
                    extra :  {
                        In: val1['totalProductIn'],
                        Out: val1['totalProductOut'],
                    }
                });
            }
        });

        this.finalReport['productPercentageLoss']?.forEach(el => {
                // this.orderLoss.push({
                //     name: el['process'],
                //     series: [
                //         {
                //             name: "Order",
                //             value: el['receivedOrderUnitsLoss']? el['receivedOrderUnitsLoss'] : 0,
                //         }, 
                //         {
                //             name: "Received(real)",
                //             value: el['receivedCountLoss']? el['receivedCountLoss'] : 0,
                //         }
                //     ]
                // });
                if(el['receivedOrderUnitsLoss']) {
                  this.receiptOrder.push({
                    name: el['process'],
                    value: el['receivedOrderUnitsLoss'],
                  });
                }
                if(el['receivedCountLoss']) {
                  this.receiptReal.push({
                    name: el['process'],
                    value: el['receivedCountLoss'],
                  });
                }
        });
    }

    formatLoss(value) {
        return value+'%';
    };
}


// <div style="height: 400px">
//             <h2>Total + Product Loss Per Process</h2>
//             <ngx-charts-bar-vertical-2d [view]="view" [results]="bothLoss" xAxis="true" yAxis="true" legend="true"
//                 showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
//                 yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
//                 <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
//             </ngx-charts-bar-vertical-2d>
//         </div>
//         <div style="height: 400px">
//             <h2>Total Loss Per Process</h2>
//             <ngx-charts-bar-vertical [results]="totalLoss" xAxis="true" yAxis="true" legend="true"
//                 showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
//                 yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
//                 <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
//             </ngx-charts-bar-vertical>
//         </div>
//         <div style="height: 400px">
//             <h2>Product Loss Per Process</h2>
//             <ngx-charts-bar-vertical [results]="productLoss" xAxis="true" yAxis="true" legend="true"
//                 showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
//                 yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
//                 <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
//             </ngx-charts-bar-vertical>
//         </div>

//         <div style="height: 400px">
//             <h2>Loss Per Process From Order + From Received(real)</h2>
//             <ngx-charts-bar-vertical-2d [results]="orderLoss" xAxis="true" yAxis="true" legend="true"
//                 showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
//                 yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
//                 <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
//             </ngx-charts-bar-vertical-2d>
//         </div>