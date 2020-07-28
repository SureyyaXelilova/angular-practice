import { Contact } from './../../shared/interfaces';
import { ContactService } from '../../shared/services/contact.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  contacts: Contact[] = []
  searchStr = ''
  cSub: Subscription
  dSub: Subscription

  constructor(private contactService: ContactService, private alert: AlertService) { }

  ngOnInit(): void {
    this.cSub = this.contactService.getContact().subscribe( contacts => {
      console.log("contact", contacts)
      this.contacts = contacts
    })
  }

  remove(id: string){
    this.dSub = this.contactService.remove(id).subscribe(() =>{
      this.contacts = this.contacts.filter(contact => contact.id !== id)
      this.alert.success("News post is removed")
    })
  }

  ngOnDestroy(){
    if(this.cSub){
      this.cSub.unsubscribe()
    }
  }

}
