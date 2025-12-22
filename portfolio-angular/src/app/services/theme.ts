import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly theme = signal<'light'>('light');

  get current() {
    return this.theme();
  }

  toggle() {
    // dark mode removed; keep light
    this.theme.set('light');
  }
}
