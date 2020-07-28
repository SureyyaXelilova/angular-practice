import { Subscription } from 'rxjs';
import { AlertService } from './../../shared/services/alert.service';
import { Product } from './../../shared/interfaces';
import { ProductService } from './../../shared/services/product.service';
import { FavoritesService } from '../../E-Commerce/favorites-page/favorites.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BasketService } from 'src/app/E-Commerce/basket/basket.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  products: Product[] = []
  cSub: Subscription
  @Input() homePage: boolean = false
  constructor(
    private basketService: BasketService,
    public favoritesService : FavoritesService, 
    private productService: ProductService,
    private alertService: AlertService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      products.forEach((product, index) => {
        if(this.homePage && index > 2){
          return 
        }
        this.products.push(product)
      });
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
