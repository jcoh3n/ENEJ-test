import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActualitesListComponent } from './components/actualites-list/actualites-list.component';
import { ActualiteDetailComponent } from './components/actualite-detail/actualite-detail.component';
import { ActualiteFormComponent } from './components/actualite-form/actualite-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'actualites', component: ActualitesListComponent, canActivate: [authGuard] },
  { path: 'actualites/:id', component: ActualiteDetailComponent, canActivate: [authGuard] },
  { path: 'actualites/new', component: ActualiteFormComponent, canActivate: [authGuard] },
  { path: 'actualites/:id/edit', component: ActualiteFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
