import { Injectable, signal } from '@angular/core';

export type PortfolioMode = 'developer' | 'designer';

@Injectable({
  providedIn: 'root',
})
export class ModeService {
  private readonly modeSignal = signal<PortfolioMode>('developer');

  readonly mode = this.modeSignal.asReadonly();

  set(next: PortfolioMode) {
    this.modeSignal.set(next);
  }

  toggle() {
    this.modeSignal.update((current) => (current === 'developer' ? 'designer' : 'developer'));
  }
}
