import { Component, OnInit } from '@angular/core';
import { OrderService, CartItem } from '../../services/order';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-order',
  standalone: false,
  templateUrl: './current-order.html',
  styleUrls: ['./current-order.css']
})
export class CurrentOrder implements OnInit {
  cartItems: CartItem[] = [];
  currentUser: any = null;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.orderService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get total() {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  updateQuantity(productId: string | undefined, qtyStr: string) {
    if(!productId) return;
    const qty = parseInt(qtyStr, 10);
    if (qty > 0) {
      this.orderService.updateQuantity(productId, qty);
    }
  }

  removeItem(productId: string | undefined) {
    if(productId) {
      this.orderService.removeItem(productId);
    }
  }

  checkout() {
    if (!this.currentUser) {
      alert("Please login as a Customer to complete payment.");
      return;
    }
    if (this.cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    this.orderService.checkout(this.currentUser._id).subscribe({
      next: () => {
        alert("Payment successful! Order completed.");
        this.orderService.clearCart();
        this.router.navigate(['/products']);
      },
      error: (err) => {
        alert("Checkout failed: " + err.message);
      }
    });
  }
}
