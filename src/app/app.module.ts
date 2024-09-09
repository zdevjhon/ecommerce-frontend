/*import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    UserRegisterComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Importa RouterModule

import { FormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Asegúrate de tener tus rutas aquí

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

import { LoginComponent } from './components/login/login.component'; // Importa el componente de login

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    UserRegisterComponent,
    CartComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes) // Importa el RouterModule y las rutas
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    // Otros proveedores
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
