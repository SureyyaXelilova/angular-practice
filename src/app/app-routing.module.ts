import { OrdersPageComponent } from './E-Commerce/orders-page/orders-page.component';
import { PaymentPageComponent } from './E-Commerce/payment-page/payment-page.component';
import { BasketPageComponent } from './E-Commerce/basket/basket-page/basket-page.component';
import { ForgotPasswordComponent } from './auth-modal/forgot-password/forgot-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AuthClientGuard } from './shared/services/auth-client.guard';
import { ProductsDetailsComponent } from './products/products-details/products-details.component';
import { FavoritesPageComponent } from './E-Commerce/favorites-page/favorites-page.component';
import { ProductsPageComponent } from './products/products-page/products-page.component';
import { BlogPageComponent } from './blog/blog-page/blog-page.component';
import { BlogDetailsPageComponent } from './blog/blog-details-page/blog-details-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
    {
        path:'', component: MainLayoutComponent, children: [
            {path: '', component: HomePageComponent},
            {path: 'blog', component: BlogPageComponent},
            {path: 'blog/:id', component: BlogDetailsPageComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'products', component: ProductsPageComponent},
            {path: 'product/:id', component: ProductsDetailsComponent},
            {path: 'favorites', component: FavoritesPageComponent, canActivate: [AuthClientGuard]},
            {path: 'orders', component: OrdersPageComponent, canActivate: [AuthClientGuard]},
            {path: 'basket', component: BasketPageComponent, canActivate: [AuthClientGuard]},
            {path: 'payment', component: PaymentPageComponent, canActivate: [AuthClientGuard]},
            {path: '404', component: NotFoundPageComponent},
            
        ]
    },
    {
        path:'admin', loadChildren: () => import('./admin/admin.module').then( m => m.AdminModule)
    },
    {path: '**', redirectTo: '/404'}
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule{}