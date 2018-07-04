import { DownloadService } from './../download.service';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  constructor(private downloadService: DownloadService) { }

  ngOnInit() {
  }

  saveFile() {
    // const FileSave = new FileSaver();
    this.downloadService.getDefaultBuild().subscribe(response => {
      this.saveToFileSystem(response);
    });
  }

  saveToFileSystem(response: any) {
    const blob = new Blob([response], {type: 'application/zip'});
    saveAs(blob, 'bioliner.zip');
  }

}
