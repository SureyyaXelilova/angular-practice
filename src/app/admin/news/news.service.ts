import { News } from './../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class NewsService{
    constructor(private http: HttpClient){}

    create(news: News): Observable<News>{
        return this.http.post(`${environment.firebaseConfig.databaseURL}/news.json`, news)
        .pipe(
            map((resp: FbCreateResponse) => {
                return {
                    ...news,
                    id: resp.name,
                    date: new Date(news.date)
                }
            })
        )
    }
    
    getById(id:string): Observable<News>{
        return this.http.get<News>(`${environment.firebaseConfig.databaseURL}/news/${id}.json`)
        .pipe(map((news: News)=>{
            return {
                ...news,
                id,
                date: new Date(news.date)
            }
        }))
    }
    
    update(news: News){
        return this.http.patch(`${environment.firebaseConfig.databaseURL}/news/${news.id}.json`, news)
    }

    remove(id: string): Observable<void>{
        return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/news/${id}.json`)
    }
}