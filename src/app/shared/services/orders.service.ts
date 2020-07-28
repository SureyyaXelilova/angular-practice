import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FbCreateResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrders(){
    return this.http.get(`${environment.firebaseConfig.databaseURL}/orders.json`)
    .pipe(
        map((response: {[key: string]: any}) => {
            if(response == null){
                return []
            }
            return Object.keys(response).map( key => ({
                ...response[key],
                id: key,
                date: new Date(response[key].date)
            }))
        })
    )
  }

  createOrder(order): Observable<any> {
    return this.http.post(`${environment.firebaseConfig.databaseURL}/orders.json`, order)
    .pipe(
      map((resp: FbCreateResponse) => {
          return {
              ...order,
              id: resp.name,
              date: new Date(order.date)
          }
      })
    )
  }

  updateUserDetails(ordersIdArray){
    return this.http.patch(`${environment.firebaseConfig.databaseURL}/userDetails/${this.authService.currentUser.userDetailsId}.json`, 
    {
      orders: ordersIdArray,
      basket: {
        products: [],
        cardInfo:{
            commonPrice: 0,
            itemCount: 0,
            refreshTime: new Date()
        }
      }
    })
  }

  removeOrder(id: string): Observable<void>{
    return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/orders/${id}.json`)
  }

  changeOrderStatus(id: string, status: number) {
    return this.http.patch(`${environment.firebaseConfig.databaseURL}/orders/${id}.json`, {status: status})
  }

  getOrderStatus(status: number){
    let statusName 
    if(status === 1) {
      statusName = "Gözləmədə"
    }else if(status === 2) {
      statusName = "Qəbul edildi"
    }else if(status === 3) {
      statusName = "Karqoya verildi"
    }else if(status === 4) {
      statusName = "Təslim edildi"
    }else if(status === 5) {
      statusName = "Admin tərəfindən ləğv edildi"
    }else if(status === 6) {
      statusName = "Müştəri tərəfindən ləğv edildi"
    }
    return statusName
  }

  changeStatusInArray(orders, id, status){
    orders.filter(item => {
      if(item.id === id){
        item.status = status
      }
    })
  }
}
