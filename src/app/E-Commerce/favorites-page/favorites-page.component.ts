import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { AuthService } from '../../shared/services/auth.service';
import { AlertService } from '../../shared/services/alert.service';
import { Product } from '../../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent implements OnInit, OnDestroy {
  cSub: Subscription
  constructor( 
    public favoritesService : FavoritesService, 
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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

  ngOnDestroy() {
    if(this.cSub){
      this.cSub.unsubscribe()
    }
  }
}
