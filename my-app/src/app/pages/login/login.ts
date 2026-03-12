import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  role = 'customer';
  currentUser: any = null;
  loginError = '';

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogin() {
    this.authService.login(this.email, this.password, this.role).subscribe({
      next: () => {
        this.loginError = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        this.loginError = 'Invalid credentials. Please try again.';
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
