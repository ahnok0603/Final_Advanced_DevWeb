import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Productservice {
  private api = "http://localhost:3000";

  constructor(private http: HttpClient){}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/categories`);
  }

  searchByPrice(maxPrice: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products/price/${maxPrice}`);
  }

  searchByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products/category/${categoryId}`);
  }

  addProduct(p: Product){
    return this.http.post(`${this.api}/products`, p);
  }

  updateProduct(id: string, p: Product){
    return this.http.put(`${this.api}/products/${id}`, p);
  }

  deleteProduct(id: string){
    return this.http.delete(`${this.api}/products/${id}`);
  }
}
