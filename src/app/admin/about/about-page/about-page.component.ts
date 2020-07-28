import { AboutService } from './../about.service';
import { About } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonDataService } from 'src/app/shared/services/commonData.service';
import { AlertService } from '../../../shared/services/alert.service';


@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit, OnDestroy {
  about: About[] = []
  gSub: Subscription
  dSub: Subscription
  searchStr = ''
  
  constructor(private commonData: CommonDataService, private aboutService: AboutService, private alert: AlertService) { }

  ngOnInit() {
    this.gSub = this.commonData.getAbout().subscribe( about => {
      this.about = about
    })
  }

  remove(id: string){
    this.dSub = this.aboutService.remove(id).subscribe(() =>{
      this.about = this.about.filter(sAbout => sAbout.id !== id)
      this.alert.success("About post is removed")
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