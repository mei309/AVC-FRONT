import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../field.interface';
import { Genral } from '../genral.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'final-report-table',
  template:`
    <ng-container *ngFor="let process of processess">
        <fieldset *ngIf="dataSource[process.name]">
            <legend><h1>{{process.label}}</h1></legend>
            <ng-container *ngIf="process.tableView; else fullDetailes">
                <normal-details [dataSource]="dataSource[process.name]" [oneColumns]="columnsQc">
                </normal-details>
            </ng-container>
            <ng-template #fullDetailes>
                <ng-container *ngFor="let column of oneColumns">
                    <ng-container *ngIf="dataSource[process.name][column.name]">
                        <ng-container [ngSwitch]="column.name">
                            <table style="display: inline-block" mat-table *ngSwitchCase="'dates'" [dataSource]="dataSource[process.name][column.name]" class="mat-elevation-z2">
                                <ng-container matColumnDef="dates">
                                    <th mat-header-cell *matHeaderCellDef><h3>Dates</h3></th>
                                    <td mat-cell *matCellDef="let element"> {{element | date}} </td>
                                </ng-container>
                                <tr mat-header-row *matHeaderRowDef="['dates']"></tr>
                                <tr mat-row *matRowDef="let row; columns: ['dates']"></tr>
                            </table>
                            <mat-form-field appearance="none" *ngSwitchCase="'difference'" provideReadonly>
                                <mat-label>Difference</mat-label>
                                <input style="white-space: pre-wrap;" readonly matInput [value]="dataSource[process.name][column.name] | tableCellPipe: 'weight' : null">
                            </mat-form-field>
                            <table style="display: inline-block" mat-table *ngSwitchDefault [dataSource]="dataSource[process.name][column.name]" class="mat-elevation-z2">
                                <ng-container matColumnDef="titel">
                                    <th mat-header-cell *matHeaderCellDef colspan="3"><h3>{{column.label}}</h3></th>
                                </ng-container>
                                <ng-container matColumnDef="item">
                                    <th mat-header-cell *matHeaderCellDef><h4>Item</h4></th>
                                    <td mat-cell *matCellDef="let element"> {{element.item.value}} </td>
                                </ng-container>
                                <ng-container matColumnDef="amount">
                                    <th mat-header-cell *matHeaderCellDef><h4>Amount</h4></th>
                                    <td mat-cell *matCellDef="let element"> 
                                        {{element.amount | tableCellPipe: 'weight' : null}}
                                    </td>
                                </ng-container>
                                <ng-container matColumnDef="weight">
                                    <th mat-header-cell *matHeaderCellDef><h4>Weight</h4></th>
                                    <td mat-cell *matCellDef="let element">
                                        {{element.weight | tableCellPipe: 'weight2' : null}} 
                                    </td>
                                </ng-container>
                                <ng-container matColumnDef="footer">
                                    <th mat-footer-cell *matFooterCellDef colspan="3">
                                        Total: {{dataSource[process.name][column.foot] | tableCellPipe: 'weight' : null}}
                                    </th>
                                </ng-container>
                                <tr mat-header-row *matHeaderRowDef="['titel']"></tr>
                                <tr mat-header-row *matHeaderRowDef="getDisplayedColumns(dataSource[process.name][column.name])"></tr>
                                <tr mat-row *matRowDef="let row; columns: getDisplayedColumns(dataSource[process.name][column.name])"></tr>
                                <tr mat-footer-row *matFooterRowDef="['footer']"></tr>
                            </table>
                        </ng-container>
                    </ng-container>
                </ng-container>
            </ng-template>
        </fieldset>
    </ng-container>
    ` ,
    styleUrls: ['./final-report-tables.css']
})
export class FinalReportTablesComponent {
    
    
    
    @Input() dataSource;
    processess = [
        // {
        //     name: 'relocation',
        //     label: 'Relocation',
        // },
        {
            name: 'receipt',
            label: 'Receiving',
        },
        {
            name: 'receiptQC',
            label: 'Receiving QC',
            tableView: true,
        },
        {
            name: 'cleaning',
            label: 'Cleaning',
        },
        {
            name: 'roasting',
            label: 'Roasting',
        },
        {
            name: 'packing',
            label: 'Packing',
        },
        {
            name: 'loadings',
            label: 'Loadings',
        },
    ];

    oneColumns = [
        {
            name: 'dates',
        },
        {
            name: 'productIn',
            label: 'Product in',
            foot: 'totalProductIn',
        },
        {
            name: 'productOut',
            label: 'Product out',
            foot: 'totalProductOut',
        },
        {
            name: 'waste',
            label: 'Waste',
            foot: 'totalWaste',
        },
        {
            name: 'productCount',
            label: 'Product count',
            foot: 'totalProductCount',
        },
        {
            name: 'difference',
        },
    ];
    columnsQc = [
        {
          type: 'nameId',
          name: 'item',
          label: 'Product descrption',
        },
        {
            type: 'percent',
            label: 'Humidity',
            name: 'humidity',
        },
        {
            type: 'percentNormal',
            label: 'Breakage',
            name: 'breakage',
        },
        {
          type: 'percentNormal',
          name: 'totalDamage',
          label: 'Total damage',
        },
        {
          type: 'percentNormal',
          name: 'totalDefects',
          label: 'Total defects',
        },
        {
          type: 'percentNormal',
          name: 'totalDefectsAndDamage',
          label: 'Total defects + damage',
        },
        {
          type: 'dateTime',
          name: 'checkDate',
          label: 'Check date',
        },
      ];

    getDisplayedColumns(myData): string[] {
        if(myData.some(a => a.amount)) {
            return ['item', 'amount', 'weight'];
        } else {
            return ['item', 'weight']
        }
    }
}