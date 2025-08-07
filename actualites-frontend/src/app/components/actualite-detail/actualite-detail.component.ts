import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { ActualiteService } from '../../services/actualite.service';
import { AuthService } from '../../services/auth.service';
import { Actualite } from '../../models/actualite';
import { User } from '../../models/user';

@Component({
  selector: 'app-actualite-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './actualite-detail.component.html',
  styleUrl: './actualite-detail.component.scss'
})
export class ActualiteDetailComponent implements OnInit {
  actualite: Actualite | null = null;
  currentUser: User | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actualiteService: ActualiteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActualite(id);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadActualite(id: string): void {
    this.loading = true;
    this.actualiteService.getActualite(id).subscribe({
      next: (actualite) => {
        this.actualite = actualite;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'actualité:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/actualites']);
  }

  editActualite(): void {
    if (this.actualite) {
      this.router.navigate(['/actualites', this.actualite.id, 'edit']);
    }
  }

  deleteActualite(): void {
    if (!this.actualite || !this.currentUser) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'actualité "${this.actualite.titre}" ?`)) {
      this.actualiteService.deleteActualite(this.actualite.id, this.currentUser.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/actualites']);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de l\'actualité');
          }
        });
    }
  }

  canEditActualite(): boolean {
    if (!this.actualite || !this.currentUser) return false;
    return this.currentUser.profil === 'direction' || 
           this.currentUser.id === this.actualite.createurId;
  }

  getProfilColor(profil: string): string {
    switch (profil) {
      case 'eleve': return 'primary';
      case 'professeur': return 'accent';
      case 'direction': return 'warn';
      default: return 'primary';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date | string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  isExpired(): boolean {
    if (!this.actualite) return false;
    return new Date(this.actualite.dateExpiration) < new Date();
  }

  getDaysUntilExpiration(): number {
    if (!this.actualite) return 0;
    const today = new Date();
    const expiration = new Date(this.actualite.dateExpiration);
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
