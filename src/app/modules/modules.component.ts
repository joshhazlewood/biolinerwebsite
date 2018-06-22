import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {

  public activeTab: string = null;

  constructor() { }

  ngOnInit() {
    this.activeTab = 'modules';
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }

}
