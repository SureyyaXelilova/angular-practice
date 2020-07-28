import { Team } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { LoadingService } from '../../shared/services/loading.service';
import { AlertService } from '../../../shared/services/alert.service';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-edit-page',
  templateUrl: './team-edit-page.component.html',
  styleUrls: ['./team-edit-page.component.css']
})
export class TeamEditPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  team: Team
  submitted: boolean = false
  uSub: Subscription
  fSub: Subscription 
  urlSub: Subscription
  selectedFile: File | null = null
  imgSrc: any = this.imageService.previewUrl

  constructor(
    private route: ActivatedRoute, 
    private teamService: TeamService,  
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
        return this.teamService.getById(params['id'])
      })
    ).subscribe((team: Team) => {
      this.team = team
      this.valueFormGroup(team)
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
    this.team.fullName = {
      az: this.form.value.fullName_az,
      ru: this.form.value.fullName_ru,
      en: this.form.value.fullName_en
    }
    this.team.text = {
      az: this.form.value.text_az,
      ru: this.form.value.text_ru,
      en: this.form.value.text_en
    }
   
    if(this.selectedFile == null){
      this.uSub = this.teamService.update(this.team).subscribe(
        () => this.submitResult(true),
        () => this.submitResult(false),
      )
    }else{
      this.fSub = this.imageService.imageAddToFirebase('team', this.selectedFile).subscribe(
        null,
        () => this.submitResult(false),
        () => this.urlSub = this.imageService.getDownloadURL().subscribe(
          imageUrl => {
            this.team.imageUrl = imageUrl 
            this.uSub = this.teamService.update(this.team).subscribe(
              () => this.submitResult(true),
              () => this.submitResult(false)
            )
          } 
        )
      )
    }
  }

  valueFormGroup(team: Team | null) {
    this.imgSrc = team == null ? this.imageService.previewUrl : team.imageUrl
    this.form = new FormGroup({
      fullName_az: new FormControl(team == null ? null : team.fullName.az, Validators.required),
      text_az: new FormControl(team == null ? null : team.text.az, Validators.required),
      fullName_ru: new FormControl(team == null ? null : team.fullName.ru, Validators.required),
      text_ru: new FormControl(team == null ? null : team.text.ru, Validators.required),
      fullName_en: new FormControl(team == null ? null : team.fullName.en, Validators.required),
      text_en: new FormControl(team == null ? null : team.text.en, Validators.required),
      imageUrl: new FormControl('')
    })
  }

  submitResult(result){
    result === true ? this.alert.success('Our Team is updated') : this.alert.danger('Our Team is not updated')
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
