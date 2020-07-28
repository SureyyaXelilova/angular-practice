import { AuthService } from '../../shared/services/auth.service';
import { ProductService } from '../../shared/services/product.service';
import { Product, LUser, Basket } from '../../shared/interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
basket: Basket | null = this.authService.isAuthenticated() ? this.authService.currentUser.basket : null

  constructor(
    private productService: ProductService,
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  addToBasket(product: Product, basket): Observable<any> {
    if(!basket.products){
      basket.products = []
    }
    if(basket.products.filter(item => item.id == product.id).length === 0){
      product.quantity = 1
      product.oneItemPrice = product.price
      basket.products.push(product)
    }else{
      basket.products.filter((item, index) => {
        if(item.id === product.id) {
          basket.products[index].quantity++;
          basket.products[index].price = product.oneItemPrice *  basket.products[index].quantity
          return
        }
      })
    }
    return this.updateBasket(basket);
  }
  
  increaseItemInBasket(productId, basket): Observable<any> {
    basket.products.filter((item, index) => {
      if(item.id === productId) {
        basket.products[index].quantity++;
        basket.products[index].price =  basket.products[index].oneItemPrice *  basket.products[index].quantity
        return
      }
    })
    return this.updateBasket(basket);
  }

  decreaseItemInBasket(productId, basket): Observable<any> | null{
    basket.products.filter((item, index) => {
      if(item.id === productId) {
        basket.products[index].quantity--;
        basket.products[index].price =  basket.products[index].oneItemPrice *  basket.products[index].quantity
        return 
      }
    })
    return this.updateBasket(basket);
  }

  removeItemFromBasket(productId, basket): Observable<any> {
    basket.products.filter((item, index) => {
      if(item.id === productId) {
        basket.products.splice(index, 1);
        return
      }
    })
    return this.updateBasket(basket);
  }

  updateBasket(basket): Observable<any> {
    let updatedBasket = this.calcBasketPriceAndItemCount(basket)
    updatedBasket.cardInfo.refreshTime = new Date()
    let user: LUser = JSON.parse(localStorage.getItem('fb-user'))
    user.basket = updatedBasket
    localStorage.setItem('fb-user', JSON.stringify(user))
    console.log("this user which update basket", this.authService.currentUser)
    return this.http.patch(`${environment.firebaseConfig.databaseURL}/userDetails/${this.authService.currentUser.userDetailsId}.json`, {basket: updatedBasket})
  }

  calcBasketPriceAndItemCount(basket) {
    let commonPrice = 0,
        itemCount = 0
    basket.products.forEach(item => {
      commonPrice = commonPrice + +item.price
      itemCount = itemCount + item.quantity
    })
    basket.cardInfo.commonPrice = commonPrice
    basket.cardInfo.itemCount = itemCount
    return basket
  }

  getBasket() {
    if(!this.authService.currentUser){
      return []
    }
    return this.authService.currentUser.basket.products ? this.authService.currentUser.basket.products : []
  }

  get basketCommonPrice() {
    if(!this.authService.currentUser){
      return 0
    }
    return this.authService.currentUser.basket.cardInfo.commonPrice
  }

  get basketItemCount() {
    if(!this.authService.currentUser){
      return 0
    }
    return this.authService.currentUser.basket.cardInfo.itemCount
  }


}
