export interface Actualite {
  id: string;
  titre: string;
  profilsDiffusion: string[];
  description: string;
  image?: string;
  datePublication: Date;
  dateExpiration: Date;
  createurId: string;
  createurInfo: CreateurInfo;
  dateCreation: Date;
  dateModification?: Date;
  actif: boolean;
}

export interface CreateurInfo {
  nom: string;
  prenom: string;
  profil: string;
}

export interface CreateActualiteRequest {
  titre: string;
  profilsDiffusion: string[];
  description: string;
  image?: string;
  datePublication: Date;
  dateExpiration: Date;
}

export interface UpdateActualiteRequest {
  titre: string;
  profilsDiffusion: string[];
  description: string;
  image?: string;
  datePublication: Date;
  dateExpiration: Date;
}