import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveClass } from './paint/save-class.module';


@Injectable({
  providedIn: 'root'
})
export class PaintService {
  private baseURL: string = "http://localhost:8090/";

  constructor(private http: HttpClient) { }

  public clear(): Observable<SaveClass[]> {
    return this.http.get<SaveClass[]>(this.baseURL + 'clear');
  }

  public undo(): Observable<SaveClass[]> {
    return this.http.get<SaveClass[]>(this.baseURL + 'undo');
  }
  public redo(): Observable<SaveClass[]> {
    return this.http.get<SaveClass[]>(this.baseURL + 'redo');
  }
  public addSave(saveClass: SaveClass[]): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(saveClass);
    console.log(body);
    return this.http.post(this.baseURL + 'new', body, { 'headers': headers });
  }
  public save(): Observable<SaveClass[]> {
    return this.http.get<SaveClass[]>(this.baseURL + 'save');
  }
  public load(): Observable<SaveClass[]> {
    return this.http.get<SaveClass[]>(this.baseURL + 'load');
  }

}
