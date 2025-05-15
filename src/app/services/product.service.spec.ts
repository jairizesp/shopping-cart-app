import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '../interface/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product',
      quantity: 1,
      price: 9.99,
      description: 'Mock description',
      image: 'random string',
    },
    {
      id: 2,
      name: 'Another Product',
      quantity: 2,
      price: 23.99,
      description: 'Another mock description',
      image: 'random string',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from API', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:5000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  describe('setItemQuantity()', () => {
    it('should increase quantity by 1 when action is "add"', () => {
      const products = [...mockProducts];
      service.setItemQuantity(products, 1, 'add');
      expect(products[0].quantity).toBe(2);
    });

    it('should decrease quantity by 1 when action is "subtract" and quantity > 1', () => {
      const products = [...mockProducts];
      service.setItemQuantity(products, 2, 'subtract');
      expect(products[1].quantity).toBe(1);
    });

    it('should not decrease quantity below 1', () => {
      const products = [
        {
          id: 1,
          name: 'Test Product',
          quantity: 1,
          price: 9.99,
          description: 'Mock description',
          image: 'random string',
        },
      ];
      service.setItemQuantity(products, 3, 'subtract');
      expect(products[0].quantity).toBe(1);
    });

    it('should do nothing if product is not found', () => {
      const products = [...mockProducts];
      service.setItemQuantity(products, 999, 'add');
      expect(products).toEqual(mockProducts);
    });
  });
});
