import { AlertService } from './../../shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ContactService } from '../../shared/services/contact.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Contact } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  form: FormGroup 
  submitted: boolean = false
  cSub: Subscription
  success: string
  error: string
  constructor(
    private contactService: ContactService, 
    public authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    })
  }
  
  submit(){
    if(this.form.invalid){
      return
    }
    this.submitted = true
    
    let contact: Contact = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      message: this.form.value.message,
      date: new Date()
    }
    this.cSub = this.contactService.create(contact).subscribe(
      () => {
        this.submitted = false
        this.form.reset()
        this.alertService.success('Contact info submitted successfully')
      },
      () => {
        this.submitted = false
        this.alertService.danger('Contact info not submitted')
      }
    )
  }
}
