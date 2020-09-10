import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { AddProductDialogComponent } from './add-one.component';
import { CashewBagsComponent } from './cashew-bags.component';
import { MaterialsComponent } from './materials.component';
import { ProductsRoutingModule } from './products-routing.module';




@NgModule({
  declarations: [CashewBagsComponent, MaterialsComponent ,AddProductDialogComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SheardModule,
  ],
  entryComponents: [AddProductDialogComponent]
})
export class ProductsModule { }
