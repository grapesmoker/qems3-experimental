import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BASE_URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class GenericRestClientService<T> {

  constructor(protected httpClient: HttpClient, private _apiUrl: string) { }

  convertUrlParams(urlParams: { [key: string]: string | number }): string {
    let actualUrl = this._apiUrl

    if (urlParams) {
      for (const [key, value] of Object.entries(urlParams)) {
        actualUrl = actualUrl.replace(`:${key}`, `${value}`);
      }
    }
    return BASE_URL + actualUrl.replace(/:[^\/]*\/?/g, '');
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(url: string) {
    this._apiUrl = url;
  }

  getItem(
    urlParams: { [key: string]: string | number } = {},
    httpOptions?: { [key: string]: any }
    ): Observable<T> {
      console.log(this.convertUrlParams(urlParams));
      return this.httpClient.get<T>(this.convertUrlParams(urlParams), httpOptions)
  }

  getItems(
    urlParams: { [key: string]: string | number } = {},
    httpOptions?: { [key: string]: any }
  ): Observable<T[]> {
    return this.httpClient.get<T[]>(
      this.convertUrlParams(urlParams),
      httpOptions
    );
  }

  postItem(
    postData: any,
    urlParams: { [key: string]: string | number } = {},
    httpOptions?: { [key: string]: any }
  ): Observable<T> {
    return this.httpClient.post<T>(
      this.convertUrlParams(urlParams),
      postData,
      httpOptions
    );
  }

  putItem(
    putData,
    urlParams: { [key: string]: string | number } = {},
    httpOptions?: { [key: string]: any }
  ): Observable<T> {
    console.log(this.convertUrlParams(urlParams));
    return this.httpClient.put<T>(
      this.convertUrlParams(urlParams),
      putData,
      httpOptions
    );
  }

  deleteItem(
    urlParams: { [key: string]: string | number } = {},
    httpOptions?: { [key: string]: any }
  ): Observable<T> {
    return this.httpClient.delete<T>(
      this.convertUrlParams(urlParams),
      httpOptions
    );
  }
}
