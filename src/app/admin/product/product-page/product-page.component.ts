import { ProductService } from './../../../shared/services/product.service';
import { Product } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements  OnInit, OnDestroy {
  products: Product[] = []
  gSub: Subscription
  dSub: Subscription
  searchStr = ''
  
  constructor(
    private productService: ProductService, 
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.gSub = this.productService.getProducts().subscribe( products => {
      this.products = products
    })
  }

  remove(id: string){
    this.dSub = this.productService.remove(id).subscribe(() =>{
      this.products = this.products.filter(product => product.id !== id)
      this.alert.success("Product is removed")
    })
  }

  ngOnDestroy(){
    if(this.gSub){
      this.gSub.unsubscribe()
    }
    if(this.dSub){
      this.dSub.unsubscribe()
    }
  }
}