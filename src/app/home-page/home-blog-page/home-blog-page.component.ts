import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { News } from 'src/app/shared/interfaces';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-home-blog-page',
  templateUrl: './home-blog-page.component.html',
})
export class HomeBlogPageComponent implements OnInit, OnDestroy {
  news: News[] = []
  gSub: Subscription
  constructor( 
    private commonDataService: CommonDataService, 
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getNews()
  }

  getNews(){
    this.gSub = this.commonDataService.getNews().subscribe(news => {
      news.forEach((item, index) => {
        if(index < 3){
          this.news.push(item)
        }
      })
    })
  }
  
  ngOnDestroy(){
    if(this.gSub){
      this.gSub.unsubscribe()
    }
  }
}
