import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {
  sLogin: boolean = true
  sRegister: boolean = false
  // sChangePass: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  // changeSChangePass(sChangePass: boolean){
  //   this.sChangePass = sChangePass
  //   this.sLogin = !sChangePass
  // }

  changeSRegister(sRegister: boolean){
    this.sRegister = sRegister
    this.sLogin = !sRegister
  }
}
