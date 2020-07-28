import { BasketService } from 'src/app/E-Commerce/basket/basket.service';
import { LanguageService } from './../../services/language.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit {
  toggle: boolean = false
  sLogin: boolean = true
  sRegister: boolean = false
  sChangePass: boolean = false
  constructor(
    public authService: AuthService, 
    public languageService: LanguageService,
    public basketService: BasketService
  ) {}
  
  ngOnInit(): void {}

  logout(){
    this.authService.logout("logoutClient")
  }
}
