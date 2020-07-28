import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Team } from 'src/app/shared/interfaces';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css']
})
export class TeamPageComponent implements OnInit, OnDestroy {
  team: Team[] = []
  gSub: Subscription
  dSub: Subscription
  searchStr = ''
  
  constructor(private commonData: CommonDataService, private teamService: TeamService, private alert: AlertService) { }

  ngOnInit() {
    this.gSub = this.commonData.getTeam().subscribe( team => {
      this.team = team
    })
  }

  remove(id: string){
    this.dSub = this.teamService.remove(id).subscribe(() =>{
      this.team = this.team.filter(sTeam => sTeam.id !== id)
      this.alert.success("Our team post is removed")
    })
  }

  ngOnDestroy(){
    if(this.gSub){
      this.gSub.unsubscribe()
    }
    if(this.dSub){
      this.dSub.unsubscribe()
    }
  }
}