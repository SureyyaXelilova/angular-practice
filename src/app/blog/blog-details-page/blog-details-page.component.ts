import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { News } from 'src/app/shared/interfaces';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-blog-details-page',
  templateUrl: './blog-details-page.component.html',
})
export class BlogDetailsPageComponent implements OnInit {
  news: News
  constructor(
    private commonDataService: CommonDataService,
    private route: ActivatedRoute,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getById()
  }
  
  getById(){
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.commonDataService.getNewsById(params['id'])
      })
    ).subscribe((news: News) => {
      this.news = news
      console.log("this.newsById", this.news)
    })
  }

}
