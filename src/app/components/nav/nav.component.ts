import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  cartItemsSubscription!: Subscription;
  count = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartService.items.subscribe(
      (items) => (this.count = items.length)
    );
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription?.unsubscribe();
  }
}
