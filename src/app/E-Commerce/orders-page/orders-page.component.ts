import { Order, LUser, Status } from './../../shared/interfaces';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, OnDestroy {
  user: LUser | null = this.authService.currentUser
  userOrders: Order[] = []
  status = Status
  gSub: Subscription
  cSub: Subscription
  constructor(
    private authService: AuthService,
    public ordersService: OrdersService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.getUserOrders()
  }

  getUserOrders() {
    this.gSub = this.ordersService.getOrders().subscribe(orders => {
      orders.forEach(item => {
        if(this.user.orders.includes(item.id)){
          this.userOrders.push(item)
        }
      })
    })
  }

  changeOrderStatus(id, status) {
    this.cSub = this.ordersService.changeOrderStatus(id, status).subscribe(
      () => {
        this.ordersService.changeStatusInArray(this.userOrders, id, status)
        this.alertService.success("Order is cancelled")
      },
      () => this.alertService.danger("Order is not cancelled")
    )
  }

  ngOnDestroy() {
    if(this.gSub){
      this.gSub.unsubscribe()
    }
    if(this.cSub){
      this.cSub.unsubscribe()
    }
  }
}
