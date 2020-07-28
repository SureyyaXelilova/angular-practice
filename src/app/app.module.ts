import { AuthInterceptor } from './shared/services/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { SliderPageComponent } from './home-page/slider-page/slider-page.component';
import { AboutUsPageComponent } from './home-page/about-us-page/about-us-page.component';
import { OurTeamPageComponent } from './home-page/our-team-page/our-team-page.component';
import { OurServicesPageComponent } from './our-services-page/our-services-page.component';
import { HomeBlogPageComponent } from './home-page/home-blog-page/home-blog-page.component';
import { ContactPageComponent } from './home-page/contact-page/contact-page.component';
import { FooterPageComponent } from './shared/components/footer-page/footer-page.component';
import { SharedModule } from './shared/shared.modules';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthClientGuard } from './shared/services/auth-client.guard';
import { AuthModalComponent } from './auth-modal/auth-modal/auth-modal.component';
import { RegisterComponent } from './auth-modal/register/register.component';
import { LoginComponent } from './auth-modal/login/login.component';
import { ForgotPasswordComponent } from './auth-modal/forgot-password/forgot-password.component';
import { ClientTitleComponent } from './shared/components/client-title/client-title.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageService } from './shared/services/language.service';
import { EscapeHtmlPipe } from './shared/pipes/html-content.pipe';
import { ProductsPageComponent } from './products/products-page/products-page.component';
import { ProductsDetailsComponent } from './products/products-details/products-details.component';
import { FavoritesPageComponent } from './E-Commerce/favorites-page/favorites-page.component';
// import { AlertComponent } from './shared/components/alert/alert.component';
import { BasketPageComponent } from './E-Commerce/basket/basket-page/basket-page.component';
import { BasketInfoComponent } from './E-Commerce/basket/basket-info/basket-info.component';
import { PaymentPageComponent } from './E-Commerce/payment-page/payment-page.component';
import { OrdersPageComponent } from './E-Commerce/orders-page/orders-page.component';
import { BlogPageComponent } from './blog/blog-page/blog-page.component';
import { BlogDetailsPageComponent } from './blog/blog-details-page/blog-details-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,  
  multi: true,
  useClass: AuthInterceptor  
}

 
@NgModule({
  declarations: [
    // AlertComponent,
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    SliderPageComponent,
    AboutUsPageComponent,
    OurTeamPageComponent,
    OurServicesPageComponent,
    HomeBlogPageComponent,
    ContactPageComponent,
    FooterPageComponent,
    BlogPageComponent,
    BlogDetailsPageComponent,
    LoginComponent,
    RegisterComponent,
    AuthModalComponent,
    ForgotPasswordComponent,
    ClientTitleComponent,
    EscapeHtmlPipe,
    ProductsPageComponent,
    ProductsDetailsComponent,
    FavoritesPageComponent,
    BasketPageComponent,
    BasketInfoComponent,
    PaymentPageComponent,
    OrdersPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [INTERCEPTOR_PROVIDER, AuthClientGuard, LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
