import { NewsService } from './../news.service';
import { News } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { LoadingService } from '../../shared/services/loading.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-news-edit-page',
  templateUrl: './news-edit-page.component.html',
  styleUrls: ['./news-edit-page.component.css']
})
export class NewsEditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  news: News
  submitted: boolean = false
  uSub: Subscription
  fSub: Subscription 
  urlSub: Subscription
  selectedFile: File | null = null
  imgSrc: any = this.imageService.previewUrl

  constructor(
    private route: ActivatedRoute, 
    private newsService: NewsService,  
    private imageService: ImageService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getById()
    this.valueFormGroup(null)
  }
  
  getById(){
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.newsService.getById(params['id'])
      })
    ).subscribe((news: News) => {
      this.news = news
      this.valueFormGroup(news)
    })
  }

  onFileSelect(event){
    this.selectedFile = event.target.files[0]
    this.imageService.showPreview(event).then(imgSrc => this.imgSrc = imgSrc)
  }

  submit(){
    if(this.form.invalid){
      return 
    }
    this.submitted = true
    this.loadingService.visible()
    this.news.title = {
      az: this.form.value.title_az,
      ru: this.form.value.title_ru,
      en: this.form.value.title_en
    }
    this.news.text = {
      az: this.form.value.text_az,
      ru: this.form.value.text_ru,
      en: this.form.value.text_en
    }
    this.news.author = {
      az: this.form.value.author_az,
      ru: this.form.value.author_ru,
      en: this.form.value.author_en
    }

    if(this.selectedFile == null){
      this.uSub = this.newsService.update(this.news).subscribe(
        () => this.submitResult(true),
        () => this.submitResult(false),
      )
    }else{
      this.fSub = this.imageService.imageAddToFirebase('news', this.selectedFile).subscribe(
        null,
        () => this.submitResult(false),
        () => this.urlSub = this.imageService.getDownloadURL().subscribe(
          imageUrl => {
            this.news.imageUrl = imageUrl 
            this.uSub = this.newsService.update(this.news).subscribe(
              () => this.submitResult(true),
              () => this.submitResult(false)
            )
          } 
        )
      )
    }
  }

  valueFormGroup(news: News | null){
    this.imgSrc = news == null ? this.imageService.previewUrl : news.imageUrl
    this.form = new FormGroup({
      author_az: new FormControl(news == null ? null : news.author.az, Validators.required),
      title_az: new FormControl(news == null ? null : news.title.az, Validators.required),
      text_az: new FormControl(news == null ? null : news.text.az, Validators.required),
      author_ru: new FormControl(news == null ? null : news.author.ru, Validators.required),
      title_ru: new FormControl(news == null ? null : news.title.ru, Validators.required),
      text_ru: new FormControl(news == null ? null : news.text.ru, Validators.required),
      author_en: new FormControl(news == null ? null : news.author.en, Validators.required),
      title_en: new FormControl(news == null ? null : news.title.en, Validators.required),
      text_en: new FormControl(news == null ? null : news.text.en, Validators.required),
      imageUrl: new FormControl('')
    })
  }

  submitResult(result){
    result === true ? this.alert.success('News is updated') : this.alert.danger('News is not updated')
    this.submitted = false
    this.loadingService.unvisible()
  }

  ngOnDestroy(): void{
    if(this.uSub){
      this.uSub.unsubscribe()
    }
    if(this.fSub){
      this.fSub.unsubscribe()
    }
    if(this.urlSub){
      this.urlSub.unsubscribe()
    }
  }
}
