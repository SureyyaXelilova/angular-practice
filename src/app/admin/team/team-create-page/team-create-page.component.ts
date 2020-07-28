import { Team } from './../../../shared/interfaces';
import { LoadingService } from './../../shared/services/loading.service';
import { ImageService } from './../../shared/services/image.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-create-page',
  templateUrl: './team-create-page.component.html',
  styleUrls: ['./team-create-page.component.css']
})
export class TeamCreatePageComponent implements OnInit, OnDestroy {

  form: FormGroup 
  selectedFile: File = null
  imgSrc: any = this.imageService.previewUrl
  submitted: boolean = false
  cSub: Subscription
  fSub: Subscription
  uSub: Subscription

  constructor(
    private imageService: ImageService, 
    private teamService: TeamService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      fullName_az: new FormControl(null, [Validators.required]),
      text_az: new FormControl(null, [Validators.required]),
      fullName_ru: new FormControl(null, [Validators.required]),
      text_ru: new FormControl(null, [Validators.required]),
      fullName_en: new FormControl(null, [Validators.required]),
      text_en: new FormControl(null, [Validators.required]),
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
    let team: Team = {
      fullName: {
        az: this.form.value.fullName_az,
        ru: this.form.value.fullName_ru,
        en: this.form.value.fullName_en
      },
      text: {
        az: this.form.value.text_az,
        ru: this.form.value.text_ru,
        en: this.form.value.text_en
      },
      imageUrl:'',
      date: new Date()
    }

    this.fSub = this.imageService.imageAddToFirebase('team', this.selectedFile).subscribe(
      null,
      () => this.submitResult(false),
      () => this.uSub = this.imageService.getDownloadURL().subscribe(
        imageUrl => {
          team.imageUrl = imageUrl 
          this.cSub = this.teamService.create(team).subscribe(
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
    result === true ? this.alert.success('Our Team is created') : this.alert.danger('Our Team is not created')
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
