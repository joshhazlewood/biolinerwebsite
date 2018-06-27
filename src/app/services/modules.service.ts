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

  postNewModule(data: Module) {
    const moduleData = new FormData();
    const file: File = data['file'];

    moduleData.append('name', data['name']);
    moduleData.append('category', data['category']);
    moduleData.append('description', data['description']);
    moduleData.append('inputFile', data['inputFile']);
    moduleData.append('outputFile_required', data['outputFile_required'].toString());

    if (data.outputFile_required) {
      moduleData.append('outputFile', data['outputFile']);
    }

    moduleData.append('command', data['command']);
    moduleData.append('params', data['params']);
    moduleData.append('file', file);

    return this.http.post('/modules/user-module', moduleData ).subscribe(
      responseData => {
        console.log(responseData);
      }
    );
  }

  addNewUserModule(userModule: Module) {
    this.userModules.push(userModule);
    console.log(this.userModules);
  }

}
