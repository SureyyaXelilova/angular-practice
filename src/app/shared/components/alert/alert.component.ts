import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AlertService } from '../../services/alert.service';
// import { clearTimeout } from 'timers';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5000
  public text: string
  public type = 'success'
  aSub: Subscription

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.aSub = this.alertService.alert$.subscribe( alert => {
      console.log("why not work");
      this.text = alert.text
      this.type = alert.type
      console.log("text", this.text)
      console.log("type", this.type)
      const timeout = setTimeout( () => {
        clearTimeout(timeout)
        this.text = ''
      }, this.delay)
    })
  }

  ngOnDestroy(): void{
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
}
