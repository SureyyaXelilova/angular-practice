import { Team } from './../../shared/interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FbCreateResponse } from 'src/app/shared/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient){}

  create(team: Team): Observable<Team>{
      return this.http.post(`${environment.firebaseConfig.databaseURL}/team.json`, team)
      .pipe(
          map((resp: FbCreateResponse) => {
              return {
                  ...team,
                  id: resp.name,
                  date: new Date(team.date)
              }
          })
      )
  }
  
  getById(id:string): Observable<Team>{
      return this.http.get<Team>(`${environment.firebaseConfig.databaseURL}/team/${id}.json`)
      .pipe(map((team: Team)=>{
          return {
              ...team,
              id,
              date: new Date(team.date)
          }
      }))
  }
  
  update(team: Team){
      return this.http.patch(`${environment.firebaseConfig.databaseURL}/team/${team.id}.json`, team)
  }

  remove(id: string): Observable<void>{
      return this.http.delete<void>(`${environment.firebaseConfig.databaseURL}/team/${id}.json`)
  }
}
