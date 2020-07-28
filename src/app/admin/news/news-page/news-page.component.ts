import { NewsService } from './../news.service';
import { News } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css']
})
export class NewsPageComponent implements  OnInit, OnDestroy {
  news: News[] = []
  gSub: Subscription
  dSub: Subscription
  searchStr = ''
  
  constructor(
    private commonData: CommonDataService, 
    private newsService: NewsService, private alert: AlertService
  ) {}

  ngOnInit() {
    this.gSub = this.commonData.getNews().subscribe( news => {
      this.news = news
    })
  }

  remove(id: string){
    this.dSub = this.newsService.remove(id).subscribe(() =>{
      this.news = this.news.filter(sNews => sNews.id !== id)
      this.alert.success("News post is removed")
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