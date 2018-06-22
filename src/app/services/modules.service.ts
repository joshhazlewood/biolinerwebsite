import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Module } from './../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  public userModules: Module[] = Array();

  constructor(private http: HttpClient) { }

  getAllModules() {
    return this.http.get('/modules/all-modules');
  }

  postNewModule(data) {
    return this.http.post('/modules/user-module', data);
  }

  addNewUserModule(userModule: Module) {
    this.userModules.push(userModule);
    console.log(this.userModules);
  }

}
