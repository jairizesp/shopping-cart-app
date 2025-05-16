import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interface/product.interface';
import { Subscription } from 'rxjs';
import { ProductComponent } from '../../components/product/product.component';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  productSubscription!: Subscription;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productSubscription = this.productService
      .getProducts()
      .subscribe((data) => {
        this.products = data;
        console.log(data);
      });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
