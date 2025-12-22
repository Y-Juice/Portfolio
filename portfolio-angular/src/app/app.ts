import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';

import { AnimatedBackground } from './components/animated-background/animated-background';
import { Hero } from './components/hero/hero';
import { Portfolio } from './components/portfolio/portfolio';
import { ProjectModal } from './components/project-modal/project-modal';
import { Project } from './services/project';

@Component({
  selector: 'app-root',
  imports: [AnimatedBackground, Hero, NgIf, Portfolio, ProjectModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected selectedProject = signal<Project | null>(null);

  protected handleProjectSelect(project: Project) {
    this.selectedProject.set(project);
  }

  protected handleModalClose() {
    this.selectedProject.set(null);
  }
}
