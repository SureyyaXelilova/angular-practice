import { Product } from './../interfaces';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'searchProducts'
})
export class SearchProductsPipe implements PipeTransform {
  transform(products: Product[], search = ''): Product[] {
    if(!search.trim()){
      return products
    }
    return products.filter(product => {
      return product.name.toLowerCase().includes(search.toLowerCase())
    })
  }
}
