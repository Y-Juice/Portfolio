import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly theme = signal<'dark'>('dark');
  readonly current = this.theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.document.documentElement.style.colorScheme = theme;
    });
  }
}
