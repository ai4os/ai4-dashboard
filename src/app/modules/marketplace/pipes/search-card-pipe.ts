import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  public transform(value: any, searchValue: string) {
    if (!searchValue) return value;
    
    return value.filter((v:any) => 
    v.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 || 
    v.summary.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)

  }

}

