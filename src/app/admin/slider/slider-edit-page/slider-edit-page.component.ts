import { SliderService } from './../slider.service';
import { Slider } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { LoadingService } from '../../shared/services/loading.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-slider-edit-page',
  templateUrl: './slider-edit-page.component.html',
  styleUrls: ['./slider-edit-page.component.css']
})
export class SliderEditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  slider: Slider
  submitted: boolean = false
  uSub: Subscription
  fSub: Subscription 
  urlSub: Subscription
  selectedFile: File | null = null
  imgSrc: any = this.imageService.previewUrl

  constructor(
    private route: ActivatedRoute, 
    private sliderService: SliderService,  
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
        return this.sliderService.getById(params['id'])
      })
    ).subscribe((slider: Slider) => {
      this.slider = slider
      this.valueFormGroup(slider)
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
    this.fSub = this.imageService.imageAddToFirebase('slider', this.selectedFile).subscribe(
      null,
      () => this.submitResult(false),
      () => this.urlSub = this.imageService.getDownloadURL().subscribe(
        imageUrl => {
          this.slider.imageUrl = imageUrl 
          this.uSub = this.sliderService.update(this.slider).subscribe(
            () => this.submitResult(true),
            () => this.submitResult(false)
          )
        } 
      )
    )
  }

  valueFormGroup(slider: Slider | null){
    this.imgSrc = slider == null ? this.imageService.previewUrl : slider.imageUrl
    this.form = new FormGroup({
      imageUrl: new FormControl('', [Validators.required])
    })
  }

  submitResult(result){
    result === true ? this.alert.success('Slider image is updated') : this.alert.danger('Slider image is not updated')
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