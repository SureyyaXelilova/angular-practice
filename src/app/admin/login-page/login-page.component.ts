import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from 'src/app/shared/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup
  submitted = false
  message: string
  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if(params['loginAgain']){
        this.message = 'Please, login again'
      }else if(params['authFailed']){
        this.message = "Token is expired, login again, please"
      }
    })
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
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

    this.auth.login(user).subscribe(
      () => {
        this.form.reset()
        this.router.navigate(['/admin', 'news'])
        this.submitted = false
      }, 
      error => {
        this.submitted = false
      }
    )
  }
}
