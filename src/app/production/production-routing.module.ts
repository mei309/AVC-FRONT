import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionCleaningComponent } from './production-cleaning.component';
import { ProductionPackingComponent } from './production-packing.component';
import { ProductionRoastingComponent } from './production-roasting.component';
import { ProductionToffyComponent } from './production-toffy.component';
import { ProductionsComponent } from './productions.component';

const routes: Routes = [
  { path: 'Cleaning', component: ProductionCleaningComponent },
  { path: 'Roasting', component: ProductionRoastingComponent },
  { path: 'Packing', component:  ProductionPackingComponent},
  { path: 'Toffy', component:  ProductionToffyComponent},
  { path: 'Productions', component:  ProductionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
