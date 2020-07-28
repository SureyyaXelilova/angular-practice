
import { LoadingService } from './shared/services/loading.service';
import { ImageService } from './shared/services/image.service';
import { environment } from './../../environments/environment';
import { SharedModule } from './../shared/shared.modules';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardLayoutComponent } from './shared/components/dashboard-layout/dashboard-layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthAdminGuard } from './shared/services/auth-admin.guard';
import { AngularFireModule } from '@angular/fire'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage'
import { NewsPageComponent } from './news/news-page/news-page.component';
import { NewsCreatePageComponent } from './news/news-create-page/news-create-page.component';
import { NewsEditPageComponent } from './news/news-edit-page/news-edit-page.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { SliderPageComponent } from './slider/slider-page/slider-page.component';
import { SliderCreatePageComponent } from './slider/slider-create-page/slider-create-page.component';
import { SliderEditPageComponent } from './slider/slider-edit-page/slider-edit-page.component';
import { AboutPageComponent } from './about/about-page/about-page.component';
import { AboutCreatePageComponent } from './about/about-create-page/about-create-page.component';
import { AboutEditPageComponent } from './about/about-edit-page/about-edit-page.component';
import { TeamEditPageComponent } from './team/team-edit-page/team-edit-page.component';
import { TeamCreatePageComponent } from './team/team-create-page/team-create-page.component';
import { TeamPageComponent } from './team/team-page/team-page.component';
import { ContactComponent } from './contact/contact.component';
import { ProductPageComponent } from './product/product-page/product-page.component';
import { ProductCreateComponent } from './product/product-create/product-create.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';


@NgModule({
    declarations: [
        AdminLayoutComponent, 
        LoginPageComponent, 
        DashboardLayoutComponent, 
        HeaderComponent, 
        NewsPageComponent, 
        NewsCreatePageComponent, 
        NewsEditPageComponent, 
        LoadingComponent, 
        SliderPageComponent, 
        SliderCreatePageComponent, 
        SliderEditPageComponent, 
        AboutPageComponent, 
        AboutCreatePageComponent, 
        AboutEditPageComponent, 
        TeamEditPageComponent, 
        TeamCreatePageComponent, 
        TeamPageComponent, 
        ContactComponent, 
        ProductPageComponent, 
        ProductCreateComponent, 
        ProductEditComponent, 
        OrdersComponent, 
        UsersComponent
    ],
    imports:[
        CommonModule,
        SharedModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        RouterModule.forChild([
            {
                path:'', component: AdminLayoutComponent, children: [
                    {path:'', redirectTo: '/admin/login', pathMatch:'full'},
                    {
                        path:'', component: DashboardLayoutComponent, children: [
                            // {path:'', redirectTo: '/admin/login', pathMatch:'full'},
                            
                            {path:'news', component: NewsPageComponent, canActivate: [AuthAdminGuard]},
                            {path:'news-create', component: NewsCreatePageComponent, canActivate: [AuthAdminGuard]},
                            {path:'news-edit/:id', component: NewsEditPageComponent, canActivate: [AuthAdminGuard]},

                            {path:'slider', component: SliderPageComponent, canActivate: [AuthAdminGuard]},
                            {path:'slider-create', component: SliderCreatePageComponent, canActivate: [AuthAdminGuard]},
                            {path:'slider-edit/:id', component: SliderEditPageComponent, canActivate: [AuthAdminGuard]},

                            {path:'about', component: AboutPageComponent, canActivate: [AuthAdminGuard]},
                            {path:'about-create', component: AboutCreatePageComponent, canActivate: [AuthAdminGuard]},
                            {path:'about-edit/:id', component: AboutEditPageComponent, canActivate: [AuthAdminGuard]},

                            {path:'team', component: TeamPageComponent, canActivate: [AuthAdminGuard]},
                            {path:'team-create', component: TeamCreatePageComponent, canActivate: [AuthAdminGuard]},
                            {path:'team-edit/:id', component: TeamEditPageComponent, canActivate: [AuthAdminGuard]},

                            {path:'contacts', component: ContactComponent, canActivate: [AuthAdminGuard]},

                            {path:'products', component: ProductPageComponent, canActivate: [AuthAdminGuard]},
                            {path:'product-create', component: ProductCreateComponent, canActivate: [AuthAdminGuard]},
                            {path:'product-edit/:id', component: ProductEditComponent, canActivate: [AuthAdminGuard]},

                            {path:'orders', component: OrdersComponent, canActivate: [AuthAdminGuard]},
                            {path:'users', component: UsersComponent, canActivate: [AuthAdminGuard]},
                        
                        ]
                    },
                    {path:'login', component: LoginPageComponent}
                ]
                
            },
        ])
    ],
    exports:[
        RouterModule
    ],
    providers:[
        AuthAdminGuard, 
        ImageService,
        LoadingService
    ]
})
export class AdminModule {}