import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';

import { Hero } from './components/hero/hero';
import { Portfolio } from './components/portfolio/portfolio';
import { ProjectModal } from './components/project-modal/project-modal';
import { ThemeToggle } from './components/theme-toggle/theme-toggle';
import { Contact } from './services/contact';
import { Project } from './services/project';

@Component({
  selector: 'app-root',
  imports: [Hero, NgIf, Portfolio, ProjectModal, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly contact = inject(Contact);
  protected selectedProject = signal<Project | null>(null);

  protected handleProjectSelect(project: Project) {
    this.selectedProject.set(project);
  }

  protected handleModalClose() {
    this.selectedProject.set(null);
  }

  protected openContactPopup() {
    this.contact.open();
  }

  protected closeContactPopup() {
    this.contact.close();
  }
}
