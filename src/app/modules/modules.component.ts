import { Component, OnInit } from '@angular/core';
import { ModulesService } from './../services/modules.service';
import { Module } from '../interfaces/module';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {

  public activeTab: string = null;
  public isLoading: boolean;
  public modules: Module[] = [];

  constructor(public modulesService: ModulesService) { }

  ngOnInit() {
    this.activeTab = 'modules';
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

  showTab(tab: string) {
    this.activeTab = tab;
  }

}
