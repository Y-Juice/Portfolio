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
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { gsap } from 'gsap';

import { Project, ProjectService } from '../../services/project';
import { ModeService, PortfolioMode } from '../../services/mode';

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

  private readonly modeService = inject(ModeService);
  protected readonly mode = this.modeService.mode;

  protected readonly projects = computed(() =>
    this.allProjects().filter((project) => project.type === this.mode())
  );

  protected readonly sectionMeta = computed(() =>
    this.mode() === 'developer'
      ? {
          eyebrow: 'Selected ecommerce-minded builds',
          subtitle:
            'Responsive web and app projects shaped like small launch systems: clear pages, sharp interfaces, and focused user flows.',
        }
      : {
          eyebrow: 'Brand and interface systems',
          subtitle:
            'Visual identities, editorial layouts, and digital design work built to feel direct, structured, and memorable.',
        }
  );

  @Output() projectSelected = new EventEmitter<Project>();
  @ViewChildren('projectCard') private projectCards?: QueryList<ElementRef<HTMLElement>>;

  constructor(private projectService: ProjectService, private destroyRef: DestroyRef) {
    effect(() => {
      this.mode();
      queueMicrotask(() => this.animateCards());
    });
  }

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

  protected setMode(next: PortfolioMode) {
    this.modeService.set(next);
  }

  protected formatIndex(index: number): string {
    return (index + 1).toString().padStart(2, '0');
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
