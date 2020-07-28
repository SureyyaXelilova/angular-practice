import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { News } from '../interfaces';

@Injectable({providedIn: 'root'})
export class CommonDataService{
    constructor(private http: HttpClient){}

    getBlogPosts(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/posts.json`)
        .pipe(
            map((response: {[key: string]: any}) => {
                return Object.keys(response).map( key => ({
                    ...response[key],
                    id: key,
                    date: new Date(response[key].date)
                }))
            })
        )
    }

    getNews(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/news.json`)
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

    getNewsById(id:string): Observable<News>{
        return this.http.get<News>(`${environment.firebaseConfig.databaseURL}/news/${id}.json`)
        .pipe(map((news: News)=>{
            return {
                ...news,
                id,
                date: new Date(news.date)
            }
        }))
    }
    
    getSlider(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/slider.json`)
        .pipe(
            map((response: {[key: string]: any} |  null) => {
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

    getAbout(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/about.json`)
        .pipe(
            map((response: {[key: string]: any} |  null) => {
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

    getTeam(){
        return this.http.get(`${environment.firebaseConfig.databaseURL}/team.json`)
        .pipe(
            map((response: {[key: string]: any} |  null) => {
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
}