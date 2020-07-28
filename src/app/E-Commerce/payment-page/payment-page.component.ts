import { BasketService } from './../basket/basket.service';
import { AuthService } from './../../shared/services/auth.service';
import { Order, Status, Payment, LUser } from './../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  user: LUser | null = this.authService.currentUser
  form: FormGroup 
  submitted: boolean = false
  cSub: Subscription
  uSub: Subscription
  rSub: Subscription
  constructor(
    private router: Router,
    private alertService: AlertService,
    private basketservice: BasketService,
    private ordersService: OrdersService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      phone: new FormControl(null, [Validators.required]),
      addressDetails: new FormControl(null, [Validators.required]),
    })
  }
  
  submit(){
    if(this.form.invalid){
      return
    }
    this.submitted = true
    let order = {
      userInfo: {
        name: this.authService.currentUser.name,
        email: this.authService.currentUser.email
      },
      phone: this.form.value.phone,
      addressDetails: this.form.value.addressDetails,
      products: this.basketservice.getBasket(),
      price: this.basketservice.basketCommonPrice,
      payment: Payment.Cash,
      status: Status.Waiting,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.cSub = this.ordersService.createOrder(order).subscribe(
      (res) => {
        this.form.reset()
        let ordersIdArray = this.user.orders
        ordersIdArray.push(res.id)
        this.uSub = this.ordersService.updateUserDetails(ordersIdArray).subscribe(
          ()=> {
            this.updateUserDetails(ordersIdArray)
            this.alertService.success("Order is created")
            this.router.navigate(['/orders'])
          },
          ()=> {
            this.rSub = this.ordersService.removeOrder(res.id).subscribe()
          }
        )
      },
      () => this.alertService.success("Order is not created, please try again")
    )
  }

  updateUserDetails(ordersIdArray) {
    if(!ordersIdArray){
      return
    }
    this.user.orders = ordersIdArray
    this.user.basket = {
      products: [],
      cardInfo:{
          commonPrice: 0,
          itemCount: 0,
          refreshTime: new Date()
      }
    }
    localStorage.setItem('fb-user', JSON.stringify(this.user))
  }

  ngOnDestroy() {
    if(this.cSub){
      this.cSub.unsubscribe()
    }
    if(this.uSub){
      this.uSub.unsubscribe()
    }
    if(this.rSub){
      this.rSub.unsubscribe()
    }
  }
}
