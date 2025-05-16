import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-checkout-page',
  imports: [NgFor, CommonModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent {
  constructor(private storageService: StorageService) {}

  get checkedOutItems() {
    return this.storageService.getStorage('checkout_items');
  }
}
