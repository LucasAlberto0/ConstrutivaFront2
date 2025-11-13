import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto } from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'jwt_token';
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/Auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this._isAuthenticated.next(true);
      })
    );
  }

  register(userData: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Auth/register`, userData);
  }

  logout(): void {
    this.removeToken();
    this._isAuthenticated.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}