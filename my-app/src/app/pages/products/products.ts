import { Component } from '@angular/core';
import { Product } from '../../classes/product';
import { Productservice } from '../../services/productservice';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products:Product[]=[]

 constructor(private service:Productservice){}

 ngOnInit(){
  this.service.getProducts().subscribe(data=>{
   this.products=data
  })
 }
}
