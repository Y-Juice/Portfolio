import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';

import { Project, ProjectService } from '../../services/project';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portfolio implements OnInit, AfterViewInit {
  private readonly allProjects = signal<Project[]>([]);
  protected readonly error = signal<string | null>(null);

  protected readonly developerProjects = computed(() =>
    this.allProjects().filter((project) => project.type === 'developer')
  );

  protected readonly designerProjects = computed(() =>
    this.allProjects().filter((project) => project.type === 'designer')
  );

  @Output() projectSelected = new EventEmitter<Project>();
  @ViewChildren('projectCard') private projectCards?: QueryList<ElementRef<HTMLElement>>;

  constructor(private projectService: ProjectService, private destroyRef: DestroyRef) {}

  ngOnInit() {
    this.projectService
      .getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.allProjects.set(projects);
          queueMicrotask(() => this.animateCards());
        },
        error: () => this.error.set('Unable to load projects right now.'),
      });
  }

  ngAfterViewInit() {
    this.animateCards();
  }

  protected openProject(project: Project) {
    this.projectSelected.emit(project);
  }

  private animateCards() {
    const cards = this.projectCards?.toArray().map((ref) => ref.nativeElement) ?? [];

    if (!cards.length) {
      return;
    }

    gsap.from(cards, {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.06,
      ease: 'power2.out',
    });
  }
}
