import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Theme } from '../../services/theme';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  constructor(private theme: Theme) {}

  protected toggle() {
    this.theme.toggle();
  }

  protected get isDark() {
    return this.theme.current === 'dark';
  }
}
