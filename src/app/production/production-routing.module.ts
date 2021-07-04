import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { NewProductionPackingComponent } from './new-production-packing.component';
import { ProductionCleaningComponent } from './production-cleaning.component';
import { ProductionPackingComponent } from './production-packing.component';
import { ProductionQcPackComponent } from './production-qc-pack.component';
import { ProductionRoastingComponent } from './production-roasting.component';
import { ProductionToffeeComponent } from './production-toffee.component';
import { ProductionsComponent } from './productions.component';

const routes: Routes = [
  { path: 'Cleaning', component: ProductionCleaningComponent, runGuardsAndResolvers: 'always'},
  { path: 'Roasting', component: ProductionRoastingComponent, runGuardsAndResolvers: 'always'},
  { path: 'Packing', component:  ProductionPackingComponent, runGuardsAndResolvers: 'always'},
  // { path: 'Packing', component:  NewProductionPackingComponent, runGuardsAndResolvers: 'always'},
  { path: 'Toffee', component:  ProductionToffeeComponent, runGuardsAndResolvers: 'always'},
  { path: 'QcPacking', component:  ProductionQcPackComponent, runGuardsAndResolvers: 'always'},
  { path: 'Productions', component:  ProductionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
