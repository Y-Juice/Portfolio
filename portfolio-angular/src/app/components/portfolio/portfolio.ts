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
  protected readonly thumbnailColors = signal<Record<string, string>>({});

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

  protected isExternalThumbnail(url: string) {
    return /^https?:\/\//i.test(url);
  }

  protected onThumbnailLoad(project: Project, event: Event) {
    if (project.thumbnailBackground) {
      this.thumbnailColors.update((colors) => ({
        ...colors,
        [project.id]: project.thumbnailBackground as string,
      }));
      return;
    }

    const img = event.target as HTMLImageElement;
    const color = this.sampleImageBackgroundColor(img);

    this.thumbnailColors.update((colors) => ({
      ...colors,
      [project.id]: color,
    }));
  }

  private sampleImageBackgroundColor(img: HTMLImageElement): string {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (!width || !height) {
      return '#e8e8e8';
    }

    const maxSide = 120;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const sampleWidth = Math.max(1, Math.round(width * scale));
    const sampleHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return '#e8e8e8';
    }

    try {
      ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

      const counts = new Map<string, { r: number; g: number; b: number; n: number }>();

      const addSample = (x: number, y: number) => {
        const data = ctx.getImageData(x, y, 1, 1).data;
        if (data[3] < 200) {
          return;
        }

        const key = `${data[0] >> 4},${data[1] >> 4},${data[2] >> 4}`;
        const existing = counts.get(key);

        if (existing) {
          existing.r += data[0];
          existing.g += data[1];
          existing.b += data[2];
          existing.n += 1;
          return;
        }

        counts.set(key, { r: data[0], g: data[1], b: data[2], n: 1 });
      };

      for (let x = 0; x < sampleWidth; x++) {
        addSample(x, 0);
        addSample(x, sampleHeight - 1);
      }

      for (let y = 0; y < sampleHeight; y++) {
        addSample(0, y);
        addSample(sampleWidth - 1, y);
      }

      let best: { r: number; g: number; b: number; n: number } | null = null;
      for (const entry of counts.values()) {
        if (!best || entry.n > best.n) {
          best = entry;
        }
      }

      if (!best) {
        return '#e8e8e8';
      }

      return `rgb(${Math.round(best.r / best.n)}, ${Math.round(best.g / best.n)}, ${Math.round(
        best.b / best.n
      )})`;
    } catch {
      return '#e8e8e8';
    }
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
