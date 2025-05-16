import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../interface/product.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CheckoutComponent } from '../../components/checkout/checkout.component';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-cart',
  imports: [NgFor, CommonModule, CheckoutComponent, ToastComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemSubscription!: Subscription;
  @ViewChild('toastRef') toastRef!: ToastComponent;

  items!: Product[];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItemSubscription = this.cartService.items.subscribe(
      (item) => (this.items = item)
    );
  }

  ngOnDestroy(): void {
    this.cartItemSubscription?.unsubscribe();
  }

  removeFromCart(id: number) {
    this.cartService.removeItem(id);
    this.showNotification('Item removed from cart.');
  }

  showNotification(message: string) {
    this.toastRef.showToast(message, 'success');
  }

  setItemQuantity(item: Product, action: 'add' | 'subtract') {
    return this.cartService.addItem(item, action, 'cart');
  }
}
