import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../classes/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private api = "http://localhost:3000/orders";
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(product: Product, quantity: number) {
    const existing = this.cartItems.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    this.cartSubject.next(this.cartItems);
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems.find(i => i.product._id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next(this.cartItems);
    }
  }

  removeItem(productId: string) {
    this.cartItems = this.cartItems.filter(i => i.product._id !== productId);
    this.cartSubject.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
  }

  checkout(customerId: string): Observable<any> {
    const total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const details = this.cartItems.map(item => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderPayload = { customerId, details, total };
    return this.http.post(this.api, orderPayload);
  }

  getRevenue(): Observable<any> {
    return this.http.get('http://localhost:3000/revenue');
  }
}
