import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { ActualiteService } from '../../services/actualite.service';
import { User } from '../../models/user';
import { Actualite } from '../../models/actualite';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  actualites: Actualite[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private actualiteService: ActualiteService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadDashboardActualites();
  }

  loadDashboardActualites(): void {
    if (this.currentUser) {
      this.loading = true;
      this.actualiteService.getDashboardActualites(this.currentUser.id).subscribe({
        next: (actualites) => {
          this.actualites = actualites;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des actualités:', error);
          this.loading = false;
        }
      });
    }
  }

  onActualiteClick(actualite: Actualite): void {
    this.router.navigate(['/actualites', actualite.id]);
  }

  onViewAllActualites(): void {
    this.router.navigate(['/actualites']);
  }

  onCreateActualite(): void {
    this.router.navigate(['/actualites/new']);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isDirection(): boolean {
    return this.authService.isDirection();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getProfilColor(profil: string): string {
    switch (profil) {
      case 'eleve': return 'primary';
      case 'professeur': return 'accent';
      case 'direction': return 'warn';
      default: return 'primary';
    }
  }
}