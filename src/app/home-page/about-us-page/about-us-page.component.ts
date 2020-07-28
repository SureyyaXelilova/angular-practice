import { Subscription } from 'rxjs';
import { About } from './../../shared/interfaces';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css']
})
export class AboutUsPageComponent implements OnInit, OnDestroy {
  about: About[] = []
  gSub: Subscription

  constructor(
    private commonDataService: CommonDataService, 
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.gSub = this.commonDataService.getAbout().subscribe(about => this.about = about)
  }
  
  ngOnDestroy(){
    if(this.gSub){
      this.gSub.unsubscribe()
    }
  }
}
