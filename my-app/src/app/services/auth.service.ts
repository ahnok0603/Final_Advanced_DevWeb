import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://localhost:3000/login';
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, role: string) {
    return this.http.post<any>(this.api, { email, password, role })
      .pipe(tap(res => {
        if (res && res.success) {
          const userObj = { ...res.user, role: res.role };
          localStorage.setItem('currentUser', JSON.stringify(userObj));
          this.currentUserSubject.next(userObj);
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
