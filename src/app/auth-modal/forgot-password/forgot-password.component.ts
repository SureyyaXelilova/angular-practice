import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'src/app/shared/helpers/custom_validators';
import { forgotPass } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  oobCode: string 
  showOOBCodeContainer: boolean = true
  formOOBCode: FormGroup
  formPassword: FormGroup
  submitted: boolean = false
  message: string
  oobSub: Subscription
  pSub: Subscription

  constructor(
    public auth: AuthService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formOOBCode = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
    })

    this.formPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required]),
    }, {validator: CustomValidators.confirmPassword('password', 'confirmPassword')})

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['oobCode']){
        this.showOOBCodeContainer = false
        this.oobCode = params['oobCode']
      }else{
        this.showOOBCodeContainer = true
      }
    })
  }


  sendOOBCode(){
    if(this.formOOBCode.invalid){
      return
    }
    this.submitted = true
    this.oobSub = this.auth.sendOOBCode(this.formOOBCode.value.email).subscribe(
      () => {
        this.formOOBCode.reset()
        this.message = 'Check Email Address For OOB Code'
        this.showOOBCodeContainer = false 
        this.submitted = false
      }, 
      error => {
        this.submitted = false
      }
    )
  }

  sendPassword(){
    if(this.formPassword.invalid && this.oobCode){
      return
    }
    this.submitted = true
    const forgotPassRequest: forgotPass = {
      oobCode: this.oobCode,
      newPassword: this.formPassword.value.password
    }
    console.log("forgotPassRequest", forgotPassRequest)
    this.pSub = this.auth.forgotPassword(forgotPassRequest).subscribe(
      () => {
        this.formPassword.reset()
        this.message = 'Password is change with successfully'
        this.submitted = false
      }, 
      error => {
        this.formPassword.reset()
        this.submitted = false
      }
    )
  }

  ngOnDestroy(){
    if(this.oobSub){
      this.oobSub.unsubscribe();
    }
    if(this.pSub){
      this.pSub.unsubscribe();
    }
  }
}
