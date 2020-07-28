import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket.service';

@Component({
  selector: 'app-basket-info',
  templateUrl: './basket-info.component.html',
  })
export class BasketInfoComponent implements OnInit {

  constructor(public basketService: BasketService) { }

  ngOnInit(): void {
  }

}
