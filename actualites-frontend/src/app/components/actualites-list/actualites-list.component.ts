import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ActualiteService } from '../../services/actualite.service';
import { AuthService } from '../../services/auth.service';
import { Actualite } from '../../models/actualite';
import { User } from '../../models/user';

@Component({
  selector: 'app-actualites-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './actualites-list.component.html',
  styleUrl: './actualites-list.component.scss'
})
export class ActualitesListComponent implements OnInit {
  actualites: Actualite[] = [];
  currentUser: User | null = null;
  loading = false;
  currentPage = 0;
  pageSize = 5;
  totalActualites = 0;

  constructor(
    private actualiteService: ActualiteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.loadActualites();
    }
  }

  loadActualites(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.actualiteService.getActualitesForUser(this.currentUser.id, this.currentPage, this.pageSize)
      .subscribe({
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadActualites();
  }

  viewActualite(id: string): void {
    this.router.navigate(['/actualites', id]);
  }

  editActualite(id: string): void {
    this.router.navigate(['/actualites', id, 'edit']);
  }

  createActualite(): void {
    this.router.navigate(['/actualites/new']);
  }

  canCreateActualite(): boolean {
    return this.currentUser?.profil === 'direction';
  }

  canEditActualite(actualite: Actualite): boolean {
    return this.currentUser?.profil === 'direction' || 
           this.currentUser?.id === actualite.createurId;
  }

  deleteActualite(actualite: Actualite): void {
    if (!this.currentUser) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'actualité "${actualite.titre}" ?`)) {
      this.actualiteService.deleteActualite(actualite.id, this.currentUser.id)
        .subscribe({
          next: () => {
            this.loadActualites(); // Recharger la liste
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de l\'actualité');
          }
        });
    }
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
    return new Date(date).toLocaleDateString('fr-FR');
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
