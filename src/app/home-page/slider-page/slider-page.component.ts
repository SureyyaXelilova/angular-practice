import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInDown } from 'ng-animate';

@Component({
  selector: 'app-slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.css'],
  animations: [
    trigger('slideInDown', [transition('* => *', useAnimation(slideInDown))])
  ],
})
export class SliderPageComponent implements OnInit {
  slideInDown: any
  constructor() { }

  ngOnInit(): void {
  }

}
