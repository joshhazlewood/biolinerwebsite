import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private http: HttpClient) { }

  getAllModules() {
    return this.http.get('/modules/all-modules');
  }

  postNewModule(data) {
    return this.http.post('/modules/user-module', data);
  }
}
