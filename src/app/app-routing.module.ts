import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login.component';
import { MainComponent } from './main.component';
import { AuthGaurdService } from './service/auth-gaurd.service';

const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'Main', component: MainComponent,
      children: [
          { path: 'supready', loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule)},
          { path: 'ordready', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)},
          { path: 'receiptready', loadChildren: () => import('./receipt/receipt.module').then(m => m.ReceiptModule)},
          { path: 'specialordready', loadChildren: () => import('./special-orders/special-orders.module').then(m => m.SpecialOrdersModule)},
          { path: 'qcready', loadChildren: () => import('./qc/qc.module').then(m => m.QcModule) },
          { path: 'invready', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)},
          { path: 'production', loadChildren: () => import('./production/production.module').then(m => m.ProductionModule)},
          { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
          { path: 'schedules', loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule) },
          { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
          { path: 'countiners', loadChildren: () => import('./countiners/countiners.module').then(m => m.CountinersModule)},
          { path: 'manager', loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule), canLoad:[AuthGaurdService]},
          { path: 'useraccount', loadChildren: () => import('./user-account/user-account.module').then(m => m.UserAccountModule)},
          { path: 'test', loadChildren: () => import('./my-tests/my-tests.module').then(m => m.MyTestsModule), canLoad:[AuthGaurdService]},
      ]
    },
    { path: '**', redirectTo: '' }
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
