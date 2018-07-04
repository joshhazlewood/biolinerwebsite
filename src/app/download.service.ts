import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) { }

  getDefaultBuild() {
    return this.http.get('modules/download/default-build', { responseType: 'arraybuffer' });
  }
}
