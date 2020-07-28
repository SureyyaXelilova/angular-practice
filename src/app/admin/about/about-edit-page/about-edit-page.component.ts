import { About } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { LoadingService } from '../../shared/services/loading.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AboutService } from '../about.service';

@Component({
  selector: 'app-about-edit-page',
  templateUrl: './about-edit-page.component.html',
  styleUrls: ['./about-edit-page.component.css']
})
export class AboutEditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  about: About
  submitted: boolean = false
  uSub: Subscription
  fSub: Subscription 
  urlSub: Subscription
  selectedFile: File | null = null
  imgSrc: any = this.imageService.previewUrl

  constructor(
    private route: ActivatedRoute, 
    private abutService: AboutService,  
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
        return this.abutService.getById(params['id'])
      })
    ).subscribe((about: About) => {
      this.about = about
      this.valueFormGroup(about)
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
  
    this.about.text = {
      az: this.form.value.text_az,
      ru: this.form.value.text_ru,
      en: this.form.value.text_en
    }
    
    if(this.selectedFile == null){
      this.uSub = this.abutService.update(this.about).subscribe(
        () => this.submitResult(true),
        () => this.submitResult(false),
      )
    }else{
      this.fSub = this.imageService.imageAddToFirebase('about', this.selectedFile).subscribe(
        null,
        () => this.submitResult(false),
        () => this.urlSub = this.imageService.getDownloadURL().subscribe(
          imageUrl => {
            this.about.imageUrl = imageUrl 
            this.uSub = this.abutService.update(this.about).subscribe(
              () => this.submitResult(true),
              () => this.submitResult(false)
            )
          } 
        )
      )
    }
  }

  valueFormGroup(about: About | null){
    this.imgSrc = about == null ? this.imageService.previewUrl : about.imageUrl
    this.form = new FormGroup({
      text_az: new FormControl(about == null ? null : about.text.az, Validators.required),
      text_ru: new FormControl(about == null ? null : about.text.ru, Validators.required),
      text_en: new FormControl(about == null ? null : about.text.en, Validators.required),
      imageUrl: new FormControl('')
    })
  }

  submitResult(result){
    result === true ? this.alert.success('About us is updated') : this.alert.danger('About us not updated')
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
