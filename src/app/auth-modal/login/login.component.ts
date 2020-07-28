import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup
  submitted: boolean = false
  message: string
  lSub: Subscription
  dSub: Subscription
  @Output() changeSChangePass: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() changeSRegister: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
       
    })
  }

  changePass(){
    this.changeSChangePass.emit(true)
  }

  register(){
    this.changeSRegister.emit(true)
  }

  submit(){
    if(this.form.invalid){
      return 
    }
    this.submitted = true
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.lSub = this.auth.login(user).subscribe(
      (res) => {
        this.form.reset()
        this.dSub = this.auth.getUserDetails(res.localId).subscribe()
        this.message = 'Yor are logged in with successfully'
        this.submitted = false
      }, 
      error => {
        this.submitted = false
      }
    )
  }

  ngOnDestroy(){
    if(this.lSub){
      this.lSub.unsubscribe()
    }
    if(this.dSub){
      this.lSub.unsubscribe()
    }
  }
}
