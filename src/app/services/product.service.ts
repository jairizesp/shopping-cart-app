import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interface/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = 'http://localhost:5000/products';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  setItemQuantity(products: Product[], id: number, action: 'add' | 'subtract') {
    const item = products.find((item) => item.id == id);
    if (item) {
      if (item.quantity === undefined || item.quantity === null) {
        item.quantity = 1;
      }

      switch (action) {
        case 'add':
          item.quantity++;
          break;
        case 'subtract':
          if (item.quantity > 1) {
            item.quantity--;
          }
          break;
      }
    }
  }
}
