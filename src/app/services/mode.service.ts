import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private modeSubject = new BehaviorSubject<string>(localStorage.getItem('selectedMode') || 'legacy');
  mode$ = this.modeSubject.asObservable();

  setMode(mode: string) {
    this.modeSubject.next(mode);
    localStorage.setItem('selectedMode', mode);
  }

  getMode(): string {
    return this.modeSubject.value;
  }
} 