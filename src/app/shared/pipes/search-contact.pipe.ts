import { Contact } from 'src/app/shared/interfaces';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchContact'
})
export class SearchContact implements PipeTransform {
  transform(contacts: Contact[], search = ''): Contact[] {
    if(!search.trim()){
      return contacts
    }
    return contacts.filter(post => {
      return post.name.toLowerCase().includes(search.toLowerCase())
    })
  }
}
