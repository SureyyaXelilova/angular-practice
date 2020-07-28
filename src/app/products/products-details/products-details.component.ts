import { BasketService } from 'src/app/E-Commerce/basket/basket.service';
import { FavoritesService } from '../../E-Commerce/favorites-page/favorites.service';
import { Product } from './../../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductService } from 'src/app/shared/services/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css']
})
export class ProductsDetailsComponent implements OnInit {
  product: Product
  cSub: Subscription
  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,
    public favoritesService: FavoritesService,
    public authService: AuthService,
    private alertService: AlertService,
    private basketService: BasketService
  ) {}

  ngOnInit() {
    this.getById()
  }
  
  getById(){
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.productService.getById(params['id'])
      })
    ).subscribe((product: Product) => {
      this.product = product
      console.log("this.product", this.product)
    })
  }

  addToFavorites(product: Product) {
    if(!this.authService.isAuthenticated()) {
      return
    }
    this.cSub = this.favoritesService.addToFavorites(product, this.authService.currentUser.favorites).subscribe(
      () => this.alertService.success("Favorites list updated"),
      () => this.alertService.danger("Favorites list not updated")
    )
  }

  addToCard(product: Product){
    if(!this.authService.isAuthenticated()) {
      return
    }
    this.cSub = this.basketService.addToBasket(product, this.authService.currentUser.basket).subscribe(
      () => this.alertService.success("Product is added to shopping card"),
      () => this.alertService.danger("Product is not added to shopping card")
    )
  }

  ngOnDestroy():void {
    if(this.cSub){
      this.cSub.unsubscribe()
    }
  }
}
