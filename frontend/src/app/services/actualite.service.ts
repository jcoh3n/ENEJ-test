import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actualite, CreateActualiteRequest, UpdateActualiteRequest } from '../models/actualite';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
  private readonly API_URL = 'http://localhost:5000/api/actualites';

  constructor(private http: HttpClient) { }

  getDashboardActualites(userId: string): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${this.API_URL}/dashboard/${userId}`);
  }

  getActualitesForUser(userId: string, page: number = 0, size: number = 5): Observable<Actualite[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Actualite[]>(`${this.API_URL}/user/${userId}`, { params });
  }

  getActualite(id: string): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.API_URL}/${id}`);
  }

  createActualite(request: CreateActualiteRequest, userId: string): Observable<Actualite> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<Actualite>(this.API_URL, request, { params });
  }

  updateActualite(id: string, request: UpdateActualiteRequest, userId: string): Observable<Actualite> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<Actualite>(`${this.API_URL}/${id}`, request, { params });
  }

  deleteActualite(id: string, userId: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.API_URL}/${id}`, { params });
  }
}