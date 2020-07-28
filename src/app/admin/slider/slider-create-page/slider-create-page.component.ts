import { SliderService } from './../slider.service';
import { LoadingService } from './../../shared/services/loading.service';
import { ImageService } from './../../shared/services/image.service';
import { Slider } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slider-create-page',
  templateUrl: './slider-create-page.component.html',
  styleUrls: ['./slider-create-page.component.css']
})
export class SliderCreatePageComponent implements OnInit , OnDestroy {

  form: FormGroup 
  selectedFile: File = null
  imgSrc: any = this.imageService.previewUrl
  submitted: boolean = false
  cSub: Subscription
  fSub: Subscription
  uSub: Subscription

  constructor(
    private imageService: ImageService, 
    private sliderService: SliderService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
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
    let slider: Slider = {
      imageUrl:'',
      date: new Date()
    }

    this.fSub = this.imageService.imageAddToFirebase('slider', this.selectedFile).subscribe(
      null,
      () => this.submitResult(false),
      () => this.uSub = this.imageService.getDownloadURL().subscribe(
        imageUrl => {
          slider.imageUrl = imageUrl 
          this.cSub = this.sliderService.create(slider).subscribe(
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
    result === true ? this.alert.success('Slider image is created') : this.alert.danger('Slider image is not created')
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
