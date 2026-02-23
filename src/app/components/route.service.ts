import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private activeRoute = new BehaviorSubject<string>(''); // ou une structure plus riche
  activeRoute$ = this.activeRoute.asObservable();

  setActiveRoute(route: string) {
    this.activeRoute.next(route);
  }
}
