import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutPageComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkouts',
    component: CheckoutPageComponent,
  },
];
