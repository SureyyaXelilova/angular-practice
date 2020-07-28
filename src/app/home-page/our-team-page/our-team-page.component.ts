import { Team } from 'src/app/shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-our-team-page',
  templateUrl: './our-team-page.component.html',
  styleUrls: ['./our-team-page.component.css']
})
export class OurTeamPageComponent implements OnInit {

  team: Team[] = []

  constructor(
    private commonDataService: CommonDataService, 
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.commonDataService.getTeam().subscribe(team => this.team = team)
  }

}
