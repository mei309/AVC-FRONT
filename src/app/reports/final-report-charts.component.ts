import { Component, Input } from '@angular/core';

@Component({
  selector: 'final-report-charts',
  template:`
        <div style="height: 400px">
            <h2>Total + Product Loss Per Process</h2>
            <ngx-charts-bar-vertical-2d [results]="bothLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical-2d>
        </div>
        <div style="height: 400px">
            <h2>Total Loss Per Process</h2>
            <ngx-charts-bar-vertical [results]="totalLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical>
        </div>
        <div style="height: 400px">
            <h2>Product Loss Per Process</h2>
            <ngx-charts-bar-vertical [results]="productLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical>
        </div>

        <div style="height: 400px">
            <h2>Loss Per Process From Order + From Received(real)</h2>
            <ngx-charts-bar-vertical-2d [results]="orderLoss" xAxis="true" yAxis="true" legend="true"
                showXAxisLabel="true" showYAxisLabel="true" [xAxisLabel]="xAxisLabel" [yAxisLabel]="yAxisLabel"
                yScaleMax="5" yScaleMin="-5" showDataLabel="true" [dataLabelFormatting]="LossDataLabel" [yAxisTickFormatting]="LossDataLabel">
                <ng-template #tooltipTemplate let-model="model">{{ model.name }}<pre>Difference in percent: {{ model.value }}%<br/><span *ngIf="model.extra"><span *ngFor="let line of model.extra | keyvalue">{{line.key}}: {{ line.value | tableCellPipe: 'weight' : null}}<br/></span></span></pre></ng-template>
            </ngx-charts-bar-vertical-2d>
        </div>
  ` ,
})
export class FinalReportChartsComponent {
    xAxisLabel = 'Process';
    yAxisLabel = 'Difference';
    view: any[] = [700, 400];//[view]="view"
    totalLoss = [];
    productLoss = [];
    bothLoss = [];
    orderLoss = [];

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
                            value: val1['percentageLoss'],
                            extra :  {
                                In: val1['totalProductIn'],
                                Out: val1['totalProductOut'],
                                Difference: val1['difference'],
                                Waste: val1['totalWaste'],
                            }
                        },
                        {
                            name: "Product",
                            value: val1['productPercentageLoss'],
                            extra :  {
                                In: val1['totalProductIn'],
                                Out: val1['totalProductOut'],
                            }
                        }
                    ]
                });
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

        this.finalReport['productPercentageLoss'].forEach(el => {
                this.orderLoss.push({
                    name: el['process'],
                    series: [
                        {
                            name: "Order",
                            value: el['receivedOrderUnitsLoss']? el['receivedOrderUnitsLoss'] : 0,
                        }, 
                        {
                            name: "Received(real)",
                            value: el['receivedCountLoss']? el['receivedCountLoss'] : 0,
                        }
                    ]
                });
        });
    }

    formatLoss(value) {
        return value+'%';
    };
}