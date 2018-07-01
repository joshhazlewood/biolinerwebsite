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
  public userAddedModules: Module[] = [];

  constructor(public modulesService: ModulesService) { }

  ngOnInit() {
    this.isLoading = true;
    this.modulesService.getAllModules()
      .subscribe(
      (data: any) => {
        console.log(data);
        const rawModules: any[] = data.modules.module;
        rawModules.map(element => {
          let outputFileReqFlag;

          if (element['outputFile_required'] === 'true') {
            outputFileReqFlag = true;
          } else {
            outputFileReqFlag = false;
          }

          const module: Module = {
            name: element['name'],
            category: element['category'],
            description: element['description'],
            inputFile: element['inputFile'],
            outputFile_required: outputFileReqFlag,
            outputFile: element['outputFile'],
            command: element['command'],
            params: element['params'],
          };
          console.log(rawModules);
          console.log(typeof module.outputFile_required);
          this.modules.push(module);
        });
        console.log(this.modules);
        this.isLoading = false;
      }
    );

    this.userAddedModules = this.modulesService.userModules;
  }

}
