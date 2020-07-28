import { AuthService } from '../../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable()
export class AuthAdminGuard implements CanActivate{
    constructor(private auth: AuthService){}
    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if(this.auth.isAuthenticated() && this.auth.isAdmin()){
            return true
        }else{
            this.auth.logout('loginAgain')
        }
    }
}