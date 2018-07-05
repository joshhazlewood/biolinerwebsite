import { DownloadService } from './../download.service';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  public modulesAdded: boolean;
  public workflowGenerated: boolean;
  constructor(private downloadService: DownloadService) { }

  ngOnInit() {
    this.modulesAdded = this.downloadService.newModuleAdded;
    this.workflowGenerated = this.downloadService.workflowGenerated;
  }

  saveFile() {
    // const FileSave = new FileSaver();
    this.downloadService.getDefaultBuild().subscribe(response => {
      this.saveToFileSystem(response);
    });
  }

  saveFileWithWorkflow() {
    this.downloadService.getBuildWithWorkflow().subscribe(response => {
      this.saveToFileSystem(response);
    });
  }

  saveFileWithModules() {
    this.downloadService.getBuildWithWorkflow().subscribe(response => {
      this.saveToFileSystem(response);
    });
  }

  saveToFileSystem(response: any) {
    const blob = new Blob([response], {type: 'application/zip'});
    saveAs(blob, 'bioliner.zip');
  }

}
