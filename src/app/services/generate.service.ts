import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Diagram } from '../class/model/db/diagram/diagram';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {
  constructor(private _http: HttpClient) {}

  public doGenerate(diagram: Diagram): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this._http.post(`${API_URL}/generate/Oracle12c `, diagram, {
      headers
    });
  }
}
