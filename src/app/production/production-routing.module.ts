import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewProductionPackingComponent } from './new-production-packing.component';
import { ProductionCleaningComponent } from './production-cleaning.component';
import { ProductionPackingComponent } from './production-packing.component';
import { ProductionRoastingComponent } from './production-roasting.component';
import { ProductionToffyComponent } from './production-toffy.component';
import { ProductionsComponent } from './productions.component';

const routes: Routes = [
  { path: 'Cleaning', component: ProductionCleaningComponent, runGuardsAndResolvers: 'always'},
  { path: 'Roasting', component: ProductionRoastingComponent, runGuardsAndResolvers: 'always'},
  // { path: 'Packing', component:  ProductionPackingComponent, runGuardsAndResolvers: 'always'},
  { path: 'Packing', component:  NewProductionPackingComponent, runGuardsAndResolvers: 'always'},
  { path: 'Toffy', component:  ProductionToffyComponent, runGuardsAndResolvers: 'always'},
  { path: 'Productions', component:  ProductionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
