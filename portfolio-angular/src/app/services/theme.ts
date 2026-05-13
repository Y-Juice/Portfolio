import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly theme = signal<ThemeMode>(this.getInitialTheme());
  readonly current = this.theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.document.documentElement.style.colorScheme = theme;
      this.document.defaultView?.localStorage.setItem('portfolio-theme', theme);
    });
  }

  toggle() {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): ThemeMode {
    const storedTheme = this.document.defaultView?.localStorage.getItem('portfolio-theme');

    return storedTheme === 'dark' ? 'dark' : 'light';
  }
}
