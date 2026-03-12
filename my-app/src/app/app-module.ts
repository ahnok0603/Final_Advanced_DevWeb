import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentInfo } from './layout/student-info/student-info';
import { Menu } from './layout/menu/menu';
import { Products } from './pages/products/products';
import { Revenue } from './pages/revenue/revenue';
import { Login } from './pages/login/login';
import { CurrentOrder } from './pages/current-order/current-order';

@NgModule({
  declarations: [
    App,
    StudentInfo,
    Menu,
    Products,
    Revenue,
    Login,
    CurrentOrder
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
