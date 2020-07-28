import { Order, Status } from './../../shared/interfaces';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy, OnChanges {
  orders: Order[] = []
  status = Status
  gSub: Subscription
  cSub: Subscription
  constructor(
    private authService: AuthService,
    public ordersService: OrdersService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.gSub = this.ordersService.getOrders().subscribe(orders => {
      this.orders = orders
      console.log(this.orders)
    })
  }
  ngOnChanges(){
    console.log('changes detected');
  }

  changeOrderStatus(id, status) {
    let changedStatus
    if(status === this.status.Waiting){
      changedStatus = this.status.Accepted
    }else if(status === this.status.Accepted){
      changedStatus = this.status.OnTheWay
    }else if(status === this.status.OnTheWay){
      changedStatus = this.status.Delivered
    }else if(status === this.status.CancelledByAdmin){
      changedStatus = status
    }
    console.log("status changed", id, status);
    this.cSub = this.ordersService.changeOrderStatus(id, changedStatus).subscribe(
      () => {
        this.ordersService.changeStatusInArray(this.orders, id, changedStatus)
        this.alertService.success("Order status is updated")
      },
      () => this.alertService.danger("Order status is not updated")
    )
  }

  getOrderActionNameInEng(status: number){
    let statusName 
    if(status === 1) {
      statusName = "Accept"
    }else if(status === 2) {
      statusName = "On The Way"
    }else if(status === 3) {
      statusName = "Delivered"
    }
    return statusName
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
