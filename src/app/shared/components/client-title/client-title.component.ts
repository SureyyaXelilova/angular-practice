import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounceInLeft, slideInDown } from 'ng-animate';

@Component({
  selector: 'app-client-title',
  templateUrl: './client-title.component.html',
  styleUrls: ['./client-title.component.css'],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(slideInDown))])
  ],
})
export class ClientTitleComponent implements OnInit {
  @Input() title: string
  @Input() description: string
  bounce: any
  constructor() { }

  ngOnInit(): void {
  }

}
