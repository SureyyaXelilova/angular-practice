import { AuthService } from '../../shared/services/auth.service';
import { ProductService } from '../../shared/services/product.service';
import { Product, LUser } from '../../shared/interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  user: LUser | null = this.authService.currentUser
  favorites: Product[] = this.authService.isAuthenticated() ? this.authService.currentUser.favorites : []

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}

  addToFavorites(product: Product, favorites): Observable<any> {
    if(favorites.filter(item => item.id == product.id).length === 0){
      favorites.push(product)
    }else{
      favorites.filter((item, index) => {
        if(item.id === product.id){
          favorites.splice(index, 1);
          return
        }
      })
    }
    let user: LUser = JSON.parse(localStorage.getItem('fb-user'))
    user.favorites = favorites
    localStorage.setItem('fb-user', JSON.stringify(user))
    return this.http.patch(`${environment.firebaseConfig.databaseURL}/userDetails/${user.userDetailsId}.json`, {favorites: favorites})
  }

  checkFavoritedProduct(productId) {
    if(!this.authService.isAuthenticated() || this.authService.currentUser.favorites.length === 0){
      return false
    }
    return this.authService.currentUser.favorites.filter(item => item.id === productId).length !== 0 ? true : false
  }

  getFavorites() {
    if(!this.authService.currentUser) {
      return []
    }
    return this.authService.currentUser.favorites
  }
}
