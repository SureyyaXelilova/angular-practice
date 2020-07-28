import { News, Slider } from './../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  constructor(private http: HttpClient){}

  create(slider: Slider): Observable<Slider>{
      return this.http.post(`${environment.firebaseConfig.databaseURL}/slider.json`, slider)
      .pipe(
          map((resp: FbCreateResponse) => {
              return {
                  ...slider,
                  id: resp.name,
                  date: new Date(slider.date)
              }
          })
      )
  }
  
  getById(id:string): Observable<Slider>{
      return this.http.get<Slider>(`${environment.firebaseConfig.databaseURL}/slider/${id}.json`)
      .pipe(map((slider: Slider)=>{
          return {
              ...slider,
              id,
              date: new Date(slider.date)
          }
      }))
  }
  
  update(slider: Slider){
      return this.http.patch(`${environment.firebaseConfig.databaseURL}/slider/${slider.id}.json`, slider)
  }

  remove(id: string): Observable<void>{
      return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/slider/${id}.json`)
  }
}
