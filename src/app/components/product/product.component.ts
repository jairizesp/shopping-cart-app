import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../interface/product.interface';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  imports: [NgFor],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() products!: Product[];
  cartItemSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  items!: Product[];

  ngOnInit(): void {
    this.cartItemSubscription = this.cartService.items.subscribe(
      (cartItems) => (this.items = cartItems)
    );
  }

  ngOnDestroy(): void {
    this.cartItemSubscription.unsubscribe();
  }

  addToCart(item: Product, quantity: number | undefined) {
    item.quantity = quantity ? quantity : 1;
    this.cartService.addItem(item);
  }

  isAlreadyAdded(id: number) {
    if (this.items.length) {
      return this.items.some((item) => item.id == id);
    }

    return false;
  }

  setItemQuantity(id: number, action: 'add' | 'subtract') {
    return this.productService.setItemQuantity(this.products, id, action);
  }
}
