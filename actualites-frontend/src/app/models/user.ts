export interface User {
  id: string;
  nom: string;
  prenom: string;
  profil: 'eleve' | 'professeur' | 'direction';
  login: string;
  dateCreation: Date;
  derniereConnexion?: Date;
}

export interface LoginRequest {
  login: string;
  motDePasse: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  profil: 'eleve' | 'professeur' | 'direction';
  login: string;
  motDePasse: string;
}