import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportarService {
  private readonly api = '/api/importar';

  constructor(private http: HttpClient) {}

  ejecutarImportacion(): Observable<any> {
    return this.http.post<any>(`${this.api}/ejecutar`, {});
  }
}
