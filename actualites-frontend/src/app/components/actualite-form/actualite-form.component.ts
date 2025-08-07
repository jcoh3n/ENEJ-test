import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ActualiteService } from '../../services/actualite.service';
import { AuthService } from '../../services/auth.service';
import { Actualite, CreateActualiteRequest, UpdateActualiteRequest } from '../../models/actualite';
import { User } from '../../models/user';

@Component({
  selector: 'app-actualite-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './actualite-form.component.html',
  styleUrl: './actualite-form.component.scss'
})
export class ActualiteFormComponent implements OnInit {
  actualiteForm: FormGroup;
  currentUser: User | null = null;
  isEditMode = false;
  actualiteId: string | null = null;
  loading = false;
  saving = false;

  profilsOptions = [
    { value: 'eleve', label: 'Élèves', icon: 'school' },
    { value: 'professeur', label: 'Professeurs', icon: 'person' },
    { value: 'direction', label: 'Direction', icon: 'admin_panel_settings' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actualiteService: ActualiteService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.actualiteForm = this.createForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    // Vérifier les autorisations
    if (!this.currentUser || this.currentUser.profil !== 'direction') {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Déterminer le mode (création ou édition)
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.actualiteId = id;
      this.loadActualite(id);
    } else {
      this.setDefaultDates();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      profilsDiffusion: [[], Validators.required],
      datePublication: [null, Validators.required],
      dateExpiration: [null, Validators.required],
      image: ['']
    }, { validators: this.dateValidator });
  }

  dateValidator(form: FormGroup) {
    const datePublication = form.get('datePublication')?.value;
    const dateExpiration = form.get('dateExpiration')?.value;
    
    if (datePublication && dateExpiration) {
      if (new Date(dateExpiration) <= new Date(datePublication)) {
        return { dateError: true };
      }
    }
    return null;
  }

  setDefaultDates(): void {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    this.actualiteForm.patchValue({
      datePublication: today,
      dateExpiration: nextMonth
    });
  }

  loadActualite(id: string): void {
    this.loading = true;
    this.actualiteService.getActualite(id).subscribe({
      next: (actualite) => {
        this.actualiteForm.patchValue({
          titre: actualite.titre,
          description: actualite.description,
          profilsDiffusion: actualite.profilsDiffusion,
          datePublication: new Date(actualite.datePublication),
          dateExpiration: new Date(actualite.dateExpiration),
          image: actualite.image || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.snackBar.open('Erreur lors du chargement de l\'actualité', 'Fermer', { duration: 3000 });
        this.router.navigate(['/actualites']);
      }
    });
  }

  onSubmit(): void {
    if (this.actualiteForm.valid && this.currentUser) {
      this.saving = true;
      
      const formValue = this.actualiteForm.value;
      const request = {
        titre: formValue.titre,
        description: formValue.description,
        profilsDiffusion: formValue.profilsDiffusion,
        datePublication: formValue.datePublication,
        dateExpiration: formValue.dateExpiration,
        image: formValue.image || undefined
      };

      const operation = this.isEditMode && this.actualiteId
        ? this.actualiteService.updateActualite(this.actualiteId, request as UpdateActualiteRequest, this.currentUser.id)
        : this.actualiteService.createActualite(request as CreateActualiteRequest, this.currentUser.id);

      operation.subscribe({
        next: (actualite) => {
          this.saving = false;
          const message = this.isEditMode ? 'Actualité modifiée avec succès' : 'Actualité créée avec succès';
          this.snackBar.open(message, 'Fermer', { duration: 3000 });
          this.router.navigate(['/actualites', actualite.id]);
        },
        error: (error) => {
          this.saving = false;
          console.error('Erreur lors de la sauvegarde:', error);
          const message = this.isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la création';
          this.snackBar.open(message, 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.actualiteForm.controls).forEach(key => {
      this.actualiteForm.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    if (this.isEditMode && this.actualiteId) {
      this.router.navigate(['/actualites', this.actualiteId]);
    } else {
      this.router.navigate(['/actualites']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.actualiteForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Ce champ est obligatoire';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    }
    return '';
  }

  hasDateError(): boolean {
    return this.actualiteForm.hasError('dateError') && 
           (this.actualiteForm.get('datePublication')?.touched || false) && 
           (this.actualiteForm.get('dateExpiration')?.touched || false);
  }

  getTitle(): string {
    return this.isEditMode ? 'Modifier l\'actualité' : 'Nouvelle actualité';
  }

  getSubmitButtonText(): string {
    if (this.saving) {
      return this.isEditMode ? 'Modification...' : 'Création...';
    }
    return this.isEditMode ? 'Modifier' : 'Créer';
  }
}
