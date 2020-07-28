import { News, Contact } from '../interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ContactService{
    constructor(private http: HttpClient){}

    create(contact: Contact): Observable<Contact>{
        return this.http.post(`${environment.firebaseConfig.databaseURL}/contact.json`, contact)
        .pipe(
            map((resp: FbCreateResponse) => {
                return {
                    ...contact,
                    id: resp.name,
                    date: new Date(contact.date)
                }
            })
        )
    }

    getContact(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/contact.json`)
        .pipe(
            map((response: {[key: string]: any}) => {
                if(response == null){
                    return []
                }
                return Object.keys(response).map( key => ({
                    ...response[key],
                    id: key,
                    date: new Date(response[key].date)
                }))
            })
        )
    }

    remove(id: string): Observable<void>{
        return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/contact/${id}.json`)
    }
}