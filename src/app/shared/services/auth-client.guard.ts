import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthClientGuard implements CanActivate{
    constructor(private auth: AuthService){}
    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if(this.auth.isAuthenticated() && this.auth.isClient()){
            return true
        }else{
            this.auth.logout('loginAgainClient')
        }
    }
}