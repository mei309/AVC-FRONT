import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { ProductionCleaningComponent } from './production-cleaning.component';
import { ProductionDetailsDialogComponent } from './production-detailes-dialog.component';
import { ProductionPackingComponent } from './production-packing.component';
import { ProductionRoastingComponent } from './production-roasting.component';
import { ProductionRoutingModule } from './production-routing.module';
import { ProductionToffyComponent } from './production-toffy.component';
import { ProductionsComponent } from './productions.component';
import { ExportImportComponent } from './export-import.component';
@NgModule({
  declarations: [ProductionCleaningComponent, ProductionPackingComponent, ProductionRoastingComponent, ProductionDetailsDialogComponent,
  ProductionToffyComponent, ProductionsComponent, ExportImportComponent],
  imports: [
    SheardModule,
    ProductionRoutingModule
  ],
  entryComponents: [ProductionDetailsDialogComponent, ExportImportComponent]
})
export class ProductionModule { }
