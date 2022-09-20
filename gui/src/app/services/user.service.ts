import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = `${environment.backendUrl}` + '/users';

  constructor(private readonly http: HttpClient) {}

  uploadCsv(file) {
    const url = `${this.baseUrl}/upload`;
    return this.http.post<any>(url, file).pipe(catchError(this.handleError));
  }

  getInitialUsers() {
    const queryParams = `?minSalary=${0}&maxSalary=${Number.MAX_SAFE_INTEGER}&offset=${0}&limit=${
      Number.MAX_SAFE_INTEGER
    }&sort=${'+id'}`;
    const url = this.baseUrl + queryParams;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getUser(id: string): Observable<UserModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  updateUser(id: string, payload): Observable<UserModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.patch<any>(url, payload).pipe(catchError(this.handleError));
  }

  deleteUser(id: string) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url).pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getAllUsersWithQuery(minSalary, maxSalary, offset, limit = 30, sort) {
    const queryParams = `?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sort}`;
    const url = this.baseUrl + queryParams;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error;
    } else {
      errorMessage = 'A HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
