import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PassageEvent {
  type: any;
  data: any;
}

@Injectable({
  providedIn: 'root'
})



export class PassageService {

  // Créer un sujet pour notifier l'ouverture du modal
  //private passageSubject = new BehaviorSubject<PassageEvent>({ type: '', data: null });  
  private passageSubject = new BehaviorSubject<any>({ type: 'url', data: null, endpoint:'' });
  constructor() { }

  // Méthode pour ouvrir le modal avec des données spécifiques
  openModal(data: any) {
    this.passageSubject.next({ type: 'modal', data });
    
  }

  appelURL(data: any, endpoint = ''){
    console.log("appelURL dans le service passage avec endpoint : ", endpoint);
    this.passageSubject.next({ type: 'url', data, endpoint : endpoint });
  }

  // Méthode pour récupérer l'observable qui sera écouté dans l'autre composant
  getObservable() {
    return this.passageSubject.asObservable();
  }

  clear(): void {
    this.passageSubject.next({ type: 'clear', data: null });
  }
}
