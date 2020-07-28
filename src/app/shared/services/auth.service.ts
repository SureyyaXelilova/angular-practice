import { forgotPass, userDetails } from './../interfaces';
import { Role, LUser, FbCreateResponse } from '../interfaces';
import { environment } from '../../../environments/environment';
import { Observable, throwError, Subject } from 'rxjs';
import { User, FbAuthResponse } from 'src/app/shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class AuthService {
    user: User
    public error$: Subject<string> = new Subject<string>()
    constructor(private http: HttpClient, private router: Router){}

    get token(): string | null {
        let checkExp = this.checkExpDate()
        if(checkExp == null){
            return 
        }else if(!checkExp){
            this.logout()
            return null
        }
        return localStorage.getItem('fb-token')
    }

    get currentUser(): LUser | null {
        let checkExp = this.checkExpDate()
        if(checkExp == null){
            return 
        }else if(!checkExp){
            this.logout()
            return null
        }
        let user: LUser = JSON.parse(localStorage.getItem('fb-user'))
        return user ? user : null
    }

    checkExpDate(): boolean {
        if(localStorage.getItem('fb-token-exp') == null){
            return null
        }
        const expDate = new Date(localStorage.getItem('fb-token-exp'))
        if(new Date() > expDate) {
            return false
        }
        return true
    }
    
    login(user: User): Observable<any>{
        user.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
        .pipe(
            tap(this.setToken),
            catchError(this.handleError.bind(this))
        )
    }

    register(user: User): Observable<any> {
        user.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`, user)
        .pipe(
            tap(this.setToken),
            catchError(this.handleError.bind(this))
        )
    }

    postUserDetails(user: userDetails): Observable<any> {
        return this.http.post(`${environment.firebaseConfig.databaseURL}/userDetails.json`, user)
        .pipe(
            tap(res => this.updateLocalStorage(res, true)),
            catchError(this.handleError.bind(this))
        )
    }

    getUserById(id): Observable<any> {
        return this.http.get(`${environment.firebaseConfig.databaseURL}/userDetails/${id}.json`)
        .pipe(
            tap(this.updateLocalStorage),
            catchError(this.handleError.bind(this))
        )
    }

    getUserDetails(localId, allUsers = false): Observable<any> {
        return this.http.get(`${environment.firebaseConfig.databaseURL}/userDetails.json`)
        .pipe(
            map((response: {[key: string]: any}) => {
                return Object.keys(response).map( key => ({
                    ...response[key],
                    id: key,
                    userName: response[key].userName
                }))
            }),
            tap(response => {
                if(allUsers === false) {
                    response.forEach(item => {
                        if(item.localId === localId){
                            this.updateLocalStorage(item)
                        }
                    });
                }
            }),
            catchError(this.handleError.bind(this))
        )
    }

    sendOOBCode(email: string): Observable<any> {
        const requestOOBCode = {
            requestType: "PASSWORD_RESET",
            email: email,
        }
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${environment.apiKey}`, requestOOBCode)
        .pipe(
            catchError(this.handleError.bind(this))
        )
    }

    forgotPassword(forgotPassRequest: forgotPass): Observable<any> {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${environment.apiKey}`, forgotPassRequest)
        .pipe(
            catchError(this.handleError.bind(this))
        )
    }

    logout(message?){
        console.log('inside  logout')
        this.setToken(null)
        
        if(message === 'loginAgain'){
            this.router.navigate(['/admin', 'login'], {
                queryParams:{
                    loginAgain: true
                }
            })
        }else if(message === 'authFailed'){
            this.router.navigate(['/admin', 'login'], {
                queryParams:{
                    authFailed: true
                }
            })
        }else if(message === 'loginAgainClient'){
            this.router.navigate(['/login'], {
                queryParams:{
                    loginAgain: true
                }
            })
        }else if(message === 'logoutClient'){
            this.router.navigate(['/'])
        }else{
            this.isAdmin ? this.router.navigate(['/admin', 'login']) 
                         : this.router.navigate(['/'])
        }
    }

    isAuthenticated(): boolean {
        return !!this.token
    }

    isAdmin(): boolean {
        return this.currentUser && this.currentUser.role === Role.Admin
    }

    isClient(): boolean {
        return this.currentUser && this.currentUser.role === Role.Client
    }

    private handleError(error: HttpErrorResponse){
        const {message} = error.error.error
        console.log(message)
        switch(message){
            case "INVALID_EMAIL":
                this.error$.next('Incorrect email')
                break
            case "INVALID_PASSWORD":
                this.error$.next('Incorrect password')
                break
            case "EMAIL_NOT_FOUND":
                this.error$.next('Email not found')
                break
            case "EMAIL_EXISTS":
                this.error$.next('Email exsist')
                break
            case "INVALID_OOB_CODE":
                 this.error$.next('Invalid OOB Code')
                 break
        }
        return throwError(error)
    }

    private setToken(resp: FbAuthResponse | null) {
        if(!resp){
            localStorage.clear()
            return
        }
        const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000)
        let user: LUser = {
            localId: resp.localId,
            email: resp.email,
            role: resp.email === 's.x@gmail.com' ? 1 : 2,
            favorites: [],
            orders: [],
            basket: {
                products: [],
                cardInfo:{
                    commonPrice: 0,
                    itemCount: 0,
                    refreshTime: new Date()
                }
            }
        }
        localStorage.setItem('fb-user',JSON.stringify(user))
        localStorage.setItem('fb-token', resp.idToken)
        localStorage.setItem('fb-token-exp', expDate.toString())
       
    }

    private updateLocalStorage(res, userDetailsId = false){
        if(!res){
            return 
        }
        let user: LUser = JSON.parse(localStorage.getItem('fb-user'))
        if(userDetailsId === true){
            user.userDetailsId = res.name
            localStorage.setItem('fb-user', JSON.stringify(user)) 
            return 
        }
        if(res.id) {
            user.userDetailsId = res.id
        }
        user.name = res.userName
        user.phone = res.phone ? res.phone : null
        user.addressDetails = res.addressDetails ? res.addressDetails : []
        user.favorites = res.favorites ? res.favorites : []
        user.orders = res.orders ? res.orders : []
        user.basket = res.basket ? res.basket : {
            products: [],
            cardInfo:{
                commonPrice: 0,
                itemCount: 0,
                refreshTime: ''
            }
        }
        localStorage.setItem('fb-user', JSON.stringify(user)) 
    }
}