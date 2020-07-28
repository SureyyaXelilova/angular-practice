import { Subscription } from 'rxjs';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {
  lSub: Subscription
  public loading: boolean
  
  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.lSub = this.loadingService.loading$.subscribe(loading => this.loading = loading)
  }

  ngOnDestroy(): void{
    if(this.lSub){
      this.lSub.unsubscribe()
    }
  }
}
