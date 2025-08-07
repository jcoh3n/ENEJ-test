import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let storedUser = null;
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      storedUser = stored ? JSON.parse(stored) : null;
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(map(response => {
        if (response.success && response.user) {
          // Stocker l'utilisateur dans le localStorage et mettre à jour le subject
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        }
        return response;
      }));
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/register`, request);
  }

  logout(): void {
    // Supprimer l'utilisateur du localStorage et mettre à jour le subject
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isDirection(): boolean {
    return this.currentUserValue?.profil === 'direction';
  }
}