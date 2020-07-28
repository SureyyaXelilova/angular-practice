import { Slider } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { AlertService } from '../../../shared/services/alert.service';
import { SliderService } from '../slider.service';

@Component({
  selector: 'app-slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.css']
})
export class SliderPageComponent implements OnInit, OnDestroy  {

  slider: Slider[] = []
  gSub: Subscription
  dSub: Subscription

  constructor(private commonData: CommonDataService, private slidersService: SliderService, private alert: AlertService) { }

  ngOnInit() {
    this.gSub = this.commonData.getSlider().subscribe( slider => {
      this.slider = slider
    })
  }

  remove(id: string){
    this.dSub = this.slidersService.remove(id).subscribe(() =>{
      this.slider = this.slider.filter(slide => slide.id !== id)
      this.alert.success("Slide image is removed")
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
