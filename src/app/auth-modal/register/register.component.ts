import { Subscription } from 'rxjs';
import { userDetails } from './../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/shared/interfaces';
import { CustomValidators } from 'src/app/shared/helpers/custom_validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup
  submitted: boolean = false
  message: string
  rSub: Subscription
  pSub: Subscription
  dSub: Subscription
  constructor(public auth: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl(null, [Validators.required]),
    }, {validator: CustomValidators.confirmPassword('password', 'confirmPassword')})
  }

  submit(){
    if(this.form.invalid){
      return 
    }
    this.submitted = true
    let userDetails: userDetails = {
      userName : this.form.value.name,
    }
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.rSub = this.auth.register(user).subscribe(
      (res) => {
        userDetails.localId = res.localId
        this.pSub = this.auth.postUserDetails(userDetails).subscribe(
          res => {
            this.dSub = this.auth.getUserById(res.name).subscribe()
          }
        )
        this.form.reset()
        this.message = 'Yor are registered in with successfully'
        this.submitted = false
      }, 
      error => {
        this.submitted = false
      }
    )
  }

  ngOnDestroy(){
    if(this.rSub){
      this.rSub.unsubscribe();
    }
    if(this.pSub){
      this.rSub.unsubscribe();
    }
    if(this.dSub){
      this.rSub.unsubscribe();
    }
  }
}
