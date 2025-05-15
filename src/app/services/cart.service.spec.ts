import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../interface/product.interface';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    quantity: 1,
    price: 9.99,
    description: 'Mock description',
    image: 'random string',
  };
  const anotherProduct: Product = {
    id: 2,
    name: 'Another Product',
    quantity: 2,
    price: 23.99,
    description: 'Another mock description',
    image: 'random string',
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load from empty localStorage', () => {
    expect(service.currentItems).toEqual([]);
  });

  it('should add a new item to the cart', () => {
    service.addItem(mockProduct);
    expect(service.currentItems.length).toBe(1);
    expect(service.currentItems[0]).toEqual(mockProduct);
  });

  it('should increase quantity if item exists (product-list page)', () => {
    service.addItem({ ...mockProduct, quantity: 1 }, 'add', 'product-list');
    service.addItem({ ...mockProduct, quantity: 2 }, 'add', 'product-list');
    expect(service.currentItems[0].quantity).toBe(3);
  });

  it('should increase quantity by 1 (cart page)', () => {
    service.addItem({ ...mockProduct, quantity: 1 }, 'add', 'cart');
    service.addItem({ ...mockProduct, quantity: 1 }, 'add', 'cart');
    expect(service.currentItems[0].quantity).toBe(2);
  });

  it('should decrease quantity by 1 (cart page)', () => {
    service.addItem({ ...mockProduct, quantity: 3 });
    service.addItem({ ...mockProduct, quantity: 1 }, 'subtract', 'cart');
    expect(service.currentItems[0].quantity).toBe(2);
  });

  it('should update item details', () => {
    service.addItem(mockProduct);
    const updated = { ...mockProduct, name: 'Updated', quantity: 5 };
    service.updateItem(updated);
    expect(service.currentItems[0]).toEqual(updated);
  });

  it('should remove item by ID', () => {
    service.addItem(mockProduct);
    service.addItem(anotherProduct);
    service.removeItem(mockProduct.id);
    expect(service.currentItems.length).toBe(1);
    expect(service.currentItems[0].id).toBe(anotherProduct.id);
  });

  it('should persist items in localStorage', () => {
    service.addItem(mockProduct);
    const stored = JSON.parse(localStorage.getItem('cart-items')!);
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(mockProduct.id);
  });

  it('should respond to storage events', () => {
    const spy = spyOn(service as any, 'loadFromLocalStorage').and.callThrough();
    const newData = JSON.stringify([anotherProduct]);
    localStorage.setItem('cart-items', newData);

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart-items',
        newValue: newData,
      })
    );

    expect(spy).toHaveBeenCalled();
    expect(service.currentItems[0].id).toBe(anotherProduct.id);
  });
});
