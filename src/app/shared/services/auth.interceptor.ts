import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private auth: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.auth.isAuthenticated()){
            console.log("inside setHeaders")
            req = req.clone({
                setParams:{
                    auth: this.auth.token
                }
            })
        }
        console.log("outside  setHeaders")
        return next.handle(req)
        .pipe(
            tap(() => {
                console.log('Interceptors')
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('Interceptor Error', error)
                if(error.status === 401){
                    this.auth.logout("authFailed")
                }
                return throwError(error)
            })
        )
    }
}