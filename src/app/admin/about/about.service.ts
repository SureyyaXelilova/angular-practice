import { About } from './../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient){}

  create(about: About): Observable<About>{
      return this.http.post(`${environment.firebaseConfig.databaseURL}/about.json`, about)
      .pipe(
          map((resp: FbCreateResponse) => {
              return {
                  ...about,
                  id: resp.name,
                  date: new Date(about.date)
              }
          })
      )
  }
  
  getById(id:string): Observable<About>{
      return this.http.get<About>(`${environment.firebaseConfig.databaseURL}/about/${id}.json`)
      .pipe(map((about: About)=>{
          return {
              ...about,
              id,
              date: new Date(about.date)
          }
      }))
  }
  
  update(about: About){
      return this.http.patch(`${environment.firebaseConfig.databaseURL}/about/${about.id}.json`, about)
  }

  remove(id: string): Observable<void>{
      return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/about/${id}.json`)
  }
}
