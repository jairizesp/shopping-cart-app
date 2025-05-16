import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/cart.service';
import { ToastComponent } from '../toast/toast.component';
import { of } from 'rxjs';
import { Product } from '../../interface/product.interface';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockItems: Product[] = [
    {
      id: 1,
      name: 'Soi Tresse Menue Sling Bag Black',
      price: 100,
      description:
        'Say hello to our latest addition to the Soi collection- the Soi Tresse Menue sling bag. Sleek, chic, and always on fleek, this bag is a celebration of individuality and the finesse of craftsmanship.',
      image:
        'https://nestasia.in/cdn/shop/files/Slingbag_1_4c87306f-4575-46d4-8f84-48b1a028aca3.jpg?v=1736592212&width=600',
      quantity: 2,
    },
    {
      id: 2,
      name: 'Croco Black Sling Bag',
      price: 50,
      description:
        "This black handheld bag with a sling is a versatile accessory that effortlessly complements your style, making it a fashion essential for every woman. Whether you're running errands or heading out for a night out, it transitions smoothly from AM to PM.",
      image:
        'https://nestasia.in/cdn/shop/files/Croco-Black-Sling-Bag_1.jpg?v=1739795636&width=600',
      quantity: 1,
    },
  ];

  beforeEach(async () => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'getStorage',
      'setStorage',
      'removeItemStorage',
    ]);

    cartServiceSpy = jasmine.createSpyObj('CartService', ['setItems']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CheckoutComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    component.items = mockItems;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate original price correctly', () => {
    expect(component.originalPrice).toBe(250);
  });

  it('should calculate discounted price correctly if discount is used', () => {
    storageServiceSpy.getStorage
      .withArgs('has_used_promo_code')
      .and.returnValue('true');
    expect(component.totalCheckoutPrice).toBe(225); // 10% off of 250
  });

  it('should return full price if discount not used', () => {
    storageServiceSpy.getStorage
      .withArgs('has_used_promo_code')
      .and.returnValue('false');
    expect(component.totalCheckoutPrice).toBe(250);
  });

  it('should show "Promo code already used" message if used', () => {
    spyOn(component as any, 'showNotification');
    storageServiceSpy.getStorage
      .withArgs('promo_code')
      .and.returnValue('DISCOUNT10');
    storageServiceSpy.getStorage
      .withArgs('has_used_promo_code')
      .and.returnValue('true');

    component.form.setValue({ promoCode: 'DISCOUNT10' });
    component.onSubmit();

    expect((component as any).showNotification).toHaveBeenCalledWith(
      'Promo code already used.'
    );
  });

  it('should show "Invalid Promo Code" if code does not match', () => {
    spyOn(component as any, 'showNotification');
    storageServiceSpy.getStorage
      .withArgs('promo_code')
      .and.returnValue('DISCOUNT10');

    component.form.setValue({ promoCode: 'WRONGCODE' });
    component.onSubmit();

    expect((component as any).showNotification).toHaveBeenCalledWith(
      'Invalid Promo Code'
    );
  });

  it('should accept valid promo code and mark it as used', () => {
    spyOn(component as any, 'showNotification');
    storageServiceSpy.getStorage
      .withArgs('promo_code')
      .and.returnValue('DISCOUNT10');
    storageServiceSpy.getStorage
      .withArgs('has_used_promo_code')
      .and.returnValue('false');

    component.form.setValue({ promoCode: 'DISCOUNT10' });
    component.onSubmit();

    expect((component as any).showNotification).toHaveBeenCalledWith(
      'Promo code successfully used.'
    );
    expect(storageServiceSpy.setStorage).toHaveBeenCalledWith(
      'has_used_promo_code',
      'true'
    );
  });

  it('should store checkout items, clear cart and reset promo on checkout', () => {
    storageServiceSpy.getStorage
      .withArgs('checkout_items')
      .and.returnValue(null);

    component.checkout();

    expect(storageServiceSpy.setStorage).toHaveBeenCalledWith(
      'checkout_items',
      mockItems
    );
    expect(storageServiceSpy.setStorage).toHaveBeenCalledWith(
      'has_used_promo_code',
      'false'
    );
    expect(storageServiceSpy.removeItemStorage).toHaveBeenCalledWith(
      'cart-items'
    );
    expect(cartServiceSpy.setItems).toHaveBeenCalledWith([]);
  });
});
