import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { CurrentOrder } from './pages/current-order/current-order';
import { Revenue } from './pages/revenue/revenue';

const routes: Routes = [
  { path:"products", component:Products},
  { path:"current-order", component:CurrentOrder},
  { path:"revenue", component:Revenue },
  { path:"", redirectTo:"products", pathMatch:"full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
