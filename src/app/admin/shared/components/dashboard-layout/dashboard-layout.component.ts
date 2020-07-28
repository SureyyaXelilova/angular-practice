import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardLayoutComponent implements OnInit {
  toggle: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

}
