import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  public workflowGenerated: boolean;
  public newModuleAdded: boolean;

  constructor(private http: HttpClient) { }

  getDefaultBuild() {
    return this.http.get('modules/download/default-build', { responseType: 'arraybuffer' });
  }

  getBuildWithWorkflow() {
    return this.http.get('modules/download/user-build', { responseType: 'arraybuffer' });
  }
}
