import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../interface/product.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  imports: [NgFor, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemSubscription!: Subscription;

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
  }

  setItemQuantity(item: Product, action: 'add' | 'subtract') {
    return this.cartService.addItem(item, action, 'cart');
  }
}
