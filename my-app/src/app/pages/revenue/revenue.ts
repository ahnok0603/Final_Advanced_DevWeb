import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-revenue',
  standalone: false,
  templateUrl: './revenue.html',
  styleUrls: ['./revenue.css']
})
export class Revenue implements OnInit {
  currentUser: any = null;
  revenueData: any[] = [];
  overallTotal: number = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.isEmployee) {
        this.loadRevenue();
      }
    });
  }

  get isEmployee() {
    return this.currentUser && this.currentUser.role === 'employee';
  }

  loadRevenue() {
    this.orderService.getRevenue().subscribe(data => {
      this.revenueData = data.revenueStats;
      this.overallTotal = data.total;
    });
  }
}
