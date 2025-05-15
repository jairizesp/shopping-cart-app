import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let cartService: CartService;
  let productService: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService,
        CartService,
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
