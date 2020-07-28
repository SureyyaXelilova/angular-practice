import { News } from '../interfaces';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'searchNewsPosts'
})
export class SearchNewsPostsPipe implements PipeTransform {
  transform(posts: News[], search = ''): News[] {
    if(!search.trim()){
      return posts
    }
    return posts.filter(post => {
      return post.title.az.toLowerCase().includes(search.toLowerCase())
    })
  }
}
