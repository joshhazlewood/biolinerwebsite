import { Component, OnInit } from '@angular/core';
import { Module } from '../interfaces/module';
import { ModulesService } from '../services/modules.service';

@Component({
  selector: 'app-list-modules',
  templateUrl: './list-modules.component.html',
  styleUrls: ['./list-modules.component.css']
})
export class ListModulesComponent implements OnInit {

  public isLoading: boolean;
  public modules: Module[] = [];

  constructor(public modulesService: ModulesService) { }

  ngOnInit() {
    this.isLoading = true;
    this.modulesService.getAllModules().subscribe(
      (data: any) => {
        console.log(data);
        const rawModules: any[] = data.modules.module;
        rawModules.map(element => {
          const module: Module = {
            name: element['name'],
            description: element['description'],
            inputFile: element['inputFile'],
            outputFile_req: element['outputFile_required'],
            outputFile: element['outputFile'],
            params: element['params'],
            command: element['command'],
          };
          console.log(rawModules);
          console.log(typeof module.outputFile_req);
          this.modules.push(module);
        });
        console.log(this.modules);
        this.isLoading = false;
      }
    );
  }

}
