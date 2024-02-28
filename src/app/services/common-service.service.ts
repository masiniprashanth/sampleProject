import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient) { }

  getUserDetails(getSearchValue:string){
    return this.http.get(`https://api.github.com/search/users?q=${getSearchValue}`);
  }
}
