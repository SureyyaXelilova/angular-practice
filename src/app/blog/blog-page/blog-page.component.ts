import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { News } from 'src/app/shared/interfaces';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { LanguageService } from 'src/app/shared/services/language.service';
@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
})
export class BlogPageComponent implements OnInit, OnDestroy {
  news: News[] = []
  gSub: Subscription
  searchStr = ''
  constructor( 
    private commonDataService: CommonDataService, 
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getNews()
  }

  getNews(){
    this.gSub = this.commonDataService.getNews().subscribe(news => this.news = news)
  }
  
  ngOnDestroy(){
    if(this.gSub){
      this.gSub.unsubscribe()
    }
  }
}