import { LoadingService } from './../../shared/services/loading.service';
import { ImageService } from './../../shared/services/image.service';
import { News } from './../../../shared/interfaces';
import { NewsService } from './../news.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-create-page',
  templateUrl: './news-create-page.component.html',
  styleUrls: ['./news-create-page.component.css']
})
export class NewsCreatePageComponent implements OnInit, OnDestroy {

  form: FormGroup 
  selectedFile: File = null
  imgSrc: any = this.imageService.previewUrl
  submitted: boolean = false
  cSub: Subscription
  fSub: Subscription
  uSub: Subscription

  constructor(
    private imageService: ImageService, 
    private newsService: NewsService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title_az: new FormControl(null, [Validators.required]),
      text_az: new FormControl(null, [Validators.required]),
      author_az: new FormControl(null, [Validators.required]),
      title_ru: new FormControl(null, [Validators.required]),
      text_ru: new FormControl(null, [Validators.required]),
      author_ru: new FormControl(null, [Validators.required]),
      title_en: new FormControl(null, [Validators.required]),
      text_en: new FormControl(null, [Validators.required]),
      author_en: new FormControl(null, [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
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
    let news: News = {
      title: {
        az: this.form.value.title_az,
        ru: this.form.value.title_ru,
        en: this.form.value.title_en
      },
      text: {
        az: this.form.value.text_az,
        ru: this.form.value.text_ru,
        en: this.form.value.text_en
      },
      author: {
        az: this.form.value.author_az,
        ru: this.form.value.author_ru,
        en: this.form.value.author_en
      },
      imageUrl:'',
      date: new Date()
    }

    this.fSub = this.imageService.imageAddToFirebase('news', this.selectedFile).subscribe(
      null,
      () => this.submitResult(false),
      () => this.uSub = this.imageService.getDownloadURL().subscribe(
        imageUrl => {
          news.imageUrl = imageUrl 
          this.cSub = this.newsService.create(news).subscribe(
            () => {
              this.form.reset()
              this.imgSrc = this.imageService.previewUrl
              this.submitResult(true)
            }, 
            () => this.submitResult(false)
          )
        } 
      )
    )
  }

  submitResult(result){
    result === true ? this.alert.success('News is created') : this.alert.danger('News is not created')
    this.submitted = false
    this.loadingService.unvisible()
  }

  ngOnDestroy():void {
    if(this.cSub){
      this.cSub.unsubscribe()
    }
    if(this.fSub){
      this.fSub.unsubscribe()
    }
    if(this.uSub){
      this.uSub.unsubscribe()
    }
  }
}
