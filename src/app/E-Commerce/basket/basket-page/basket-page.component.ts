import { AuthService } from 'src/app/shared/services/auth.service';
import { BasketService } from './../basket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-basket-page',
  templateUrl: './basket-page.component.html',
})
export class BasketPageComponent implements OnInit, OnDestroy {
  iSub: Subscription
  dSub: Subscription
  rSub: Subscription

  constructor(
    public basketService: BasketService,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  increaseItemInBasket(productId){
    this.iSub = this.basketService.increaseItemInBasket(productId, this.authService.currentUser.basket).subscribe(
      () => this.alertService.success("Shopping card is updated"),
      () => this.alertService.danger("Shopping card is not updated")
    )
  }

  decreaseItemInBasket(productId, productQuantity){
    console.log("productId, productQuantity", productId, productQuantity)
    if(productQuantity === 1){
      return 
    }
    this.dSub = this.basketService.decreaseItemInBasket(productId, this.authService.currentUser.basket).subscribe(
      () => this.alertService.success("Shopping card is updated"),
      () => this.alertService.danger("Shopping card is not updated")
    )
  }

  removeItemFromBasket(productId){
    this.rSub = this.basketService.removeItemFromBasket(productId, this.authService.currentUser.basket).subscribe(
      () => this.alertService.success("Product is removed from shopping card"),
      () => this.alertService.danger("Product is not removed from shopping card")
    )
  }

  ngOnDestroy():void {
    if(this.iSub){
      this.iSub.unsubscribe()
    }
    if(this.dSub){
      this.dSub.unsubscribe()
    }
    if(this.rSub){
      this.rSub.unsubscribe()
    }
  }
}
