import { Product } from './../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class ProductService {
    constructor(private http: HttpClient){}

    getProducts(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/products.json`)
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

    create(product: Product): Observable<Product>{
        return this.http.post(`${environment.firebaseConfig.databaseURL}/products.json`, product)
        .pipe(
            map((resp: FbCreateResponse) => {
                return {
                    ...product,
                    id: resp.name,
                    date: new Date(product.date)
                }
            })
        )
    }
    
    getById(id:string): Observable<Product>{
        return this.http.get<Product>(`${environment.firebaseConfig.databaseURL}/products/${id}.json`)
        .pipe(map((product: Product)=>{
            return {
                ...product,
                id,
                date: new Date(product.date)
            }
        }))
    }
    
    update(product: Product){
        return this.http.patch(`${environment.firebaseConfig.databaseURL}/products/${product.id}.json`, product)
    }

    remove(id: string): Observable<void>{
        return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/products/${id}.json`)
    }
}