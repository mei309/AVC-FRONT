import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashewBagsComponent } from './cashew-bags.component';
import { MaterialsComponent } from './materials.component';


const routes: Routes = [
      { path: 'CashewBags', component: CashewBagsComponent },
      { path: 'Materials', component: MaterialsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
