import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuard } from './guards/auth.guard'; // Importa el guard
import { LoginComponent } from './components/login/login.component'; // Importa el componente de login

/*export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'cart', component: CartComponent }
];*/

/*const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'register', component: UserRegisterComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'login', component: UserRegisterComponent } // Asegúrate de tener una ruta para el login
];*/

//{ path: 'cart', component: CartComponent, canActivate: [AuthGuard] },

export const routes: Routes = [
  //{ path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent},
  { path: 'register', component: UserRegisterComponent },
  { path: 'cart', component: CartComponent,},
  { path: 'login', component: LoginComponent }  
];

