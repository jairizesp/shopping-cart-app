import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interface/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'cart-items';
  private items$ = new BehaviorSubject<Product[]>(this.loadFromLocalStorage());

  readonly items = this.items$.asObservable();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        this.items$.next(this.loadFromLocalStorage());
      }
    });
  }

  loadFromLocalStorage(): Product[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(items: Product[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  setItems(newItems: Product[]) {
    this.items$.next(newItems);
    this.saveToLocalStorage(newItems);
  }

  addItem(
    item: Product,
    action: 'add' | 'subtract' = 'add',
    page = 'product-list'
  ) {
    const currentItems = this.items$.value;
    const isItemExists = currentItems.some(
      (currentItem) => currentItem.id === item.id
    );

    let updatedItems: Product[] = [];

    if (isItemExists) {
      updatedItems = currentItems.map((updatedItem) => {
        if (updatedItem.id === item.id) {
          return {
            ...updatedItem,

            quantity: this.calculateQuantity(
              updatedItem.quantity ?? 0,
              item.quantity ?? 0,
              action,
              page
            ),
            // action === 'add'
            //   ? // @ts-ignore
            //     updatedItem.quantity + item.quantity
            //   : // @ts-ignore
            //     updatedItem.quantity--,
          };
        }
        return updatedItem;
      });

      console.log(updatedItems);
    } else {
      updatedItems = [...currentItems, item];
    }
    this.setItems(updatedItems);
  }

  calculateQuantity(
    quantity1: number,
    quantity2: number,
    action: 'add' | 'subtract',
    page: string
  ) {
    if (action === 'add' && page === 'product-list') {
      console.log('2');
      return quantity1 + quantity2;
    }

    if (action === 'add' && page === 'cart') {
      console.log('3');
      return ++quantity1;
    }

    console.log('1');
    return --quantity1;
  }

  updateItem(updatedItem: Product) {
    const currentItems = this.items$.value;
    const updatedItems = currentItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.setItems(updatedItems);
  }

  removeItem(id: number) {
    const currentItems = this.items$.value;
    const updatedItems = currentItems.filter((item) => item.id !== id);
    this.setItems(updatedItems);
  }

  // Get current value snapshot
  get currentItems() {
    return this.items$.value;
  }
}
