import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../interface/product.interface';
import { CommonModule, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [NgClass, CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  @Input() items!: Product[];
  @ViewChild('toastRef') toastRef!: ToastComponent;
  form!: FormGroup;
  has_discount = false;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private cartService: CartService
  ) {
    this.form = this.fb.group({
      promoCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get hasDiscount() {
    return this.storageService.getStorage('has_used_promo_code');
  }

  get totalCheckoutPrice() {
    const itemsPrice = this.items.map((item) =>
      item.quantity ? item.price * item.quantity : item.price
    );

    const has_discount = this.storageService.getStorage('has_used_promo_code');

    const total = itemsPrice.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    return has_discount == 'true' ? total - total * 0.1 : total;
  }

  get originalPrice() {
    const itemsPrice = this.items.map((item) =>
      item.quantity ? item.price * item.quantity : item.price
    );

    const total = itemsPrice.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    return total;
  }

  checkout() {
    const checkoutItems = this.storageService.getStorage('checkout_items');

    if (!checkoutItems) {
      this.storageService.setStorage('checkout_items', this.items);
    } else {
      this.storageService.setStorage('checkout_items', [
        ...checkoutItems,
        ...this.items,
      ]);
    }

    this.storageService.setStorage('has_used_promo_code', 'false');
    this.storageService.removeItemStorage('cart-items');
    this.cartService.setItems([]);
  }

  showNotification(message: string) {
    this.toastRef.showToast(message, 'success');
  }

  onSubmit() {
    const promoCode = this.storageService.getStorage('promo_code');

    if (this.form.valid) {
      if (
        this.form.value['promoCode'] === promoCode &&
        this.hasDiscount == 'true'
      ) {
        this.showNotification('Promo code already used.');
        return;
      }

      if (this.form.value['promoCode'] !== promoCode) {
        this.showNotification('Invalid Promo Code');
        return;
      }

      this.showNotification('Promo code successfully used.');
      this.showNotification('Enjoy your 10% discount!');

      this.storageService.setStorage('has_used_promo_code', 'true');

      return;
    }
  }
}
