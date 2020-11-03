import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Server } from './server';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
configUrl = 'http://localhost:4454/';
constructor(private http: HttpClient) { }

  getServerList() {
    const url = this.configUrl + 'servers';
    return this.http.get(url);
 }

 turnOnServer(id: number) {
  const url = this.configUrl + 'servers/' + id + '/on';
  return this.http.put<Server>(url, id);
 }

 turnOffServer(id: number) {
  const url = this.configUrl + 'servers/' + id + '/off';
  return this.http.put<Server>(url, id);
  }

  rebootServer(id: number) {
    const url = this.configUrl + 'servers/' + id + '/reboot';
    return this.http.put<Server>(url, id);
  }

  getServer(id: number) {
    const url = this.configUrl + 'servers/' + id;
    return this.http.put<Server>(url, id);
  }
}
