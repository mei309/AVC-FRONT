import { Component, Input } from '@angular/core';

@Component({
  selector: 'final-report-charts',
  template:`
        <div style="height: 400px">
            <h2>Total + Product Loss Per Process</h2>
            <ngx-charts-bar-vertical-2d [results]="bothLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">
                        <div class="tt" *ngIf="model.extra">
                            Amount: {{ model.extra | tableCellPipe: 'weight' : null}}
                        </div>
                    </ng-template>
            </ngx-charts-bar-vertical-2d>
        </div>
        <div style="height: 400px">
            <h2>Total Loss Per Process</h2>
            <ngx-charts-bar-vertical [results]="totalLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">
                        <div class="tt">
                            Amount: {{ model.extra | tableCellPipe: 'weight' : null}}
                        </div>
                    </ng-template>
            </ngx-charts-bar-vertical>
        </div>
        <div style="height: 400px">
            <h2>Product Loss Per Process</h2>
            <ngx-charts-bar-vertical [results]="productLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="10" yScaleMin="-10" showDataLabel="true" [dataLabelFormatting]="LossDataLabel">
            </ngx-charts-bar-vertical>
        </div>
  ` ,
})
export class FinalReportChartsComponent {
    xAxisLabel = 'Process';
    yAxisLabel = 'Lose';
    view: any[] = [700, 400];//[view]="view"
    totalLoss = [];
    productLoss = [];
    bothLoss = [];
    LossDataLabel;

    @Input() finalReport;

    constructor() {}
    
    ngOnInit() {
        this.LossDataLabel = this.formatLoss.bind(this);
        
        ['cleaning', 'roasting', 'packing'].forEach(v => {
            var val1 = this.finalReport[v];
            if(val1 && val1['difference']) {
                this.bothLoss.push({
                    name: v,
                    series: [
                        {
                            name: "Total",
                            value: val1['ratioLoss'],
                            extra :  val1['difference'],
                        },
                        {
                            "name": "Product",
                            value: val1['productRatioLoss'],
                        }
                        ]
                });
                this.totalLoss.push({
                    name: v,
                    value: val1['ratioLoss'],
                    extra :  val1['difference'],
                });
                this.productLoss.push({
                    name: v,
                    value: val1['productRatioLoss'],
                });
            }
        });
    }

    public formatLoss(value) {
        return value+'%';
    };
}