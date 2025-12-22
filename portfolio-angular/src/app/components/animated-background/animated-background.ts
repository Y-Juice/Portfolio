import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-animated-background',
  imports: [CommonModule],
  templateUrl: './animated-background.html',
  styleUrl: './animated-background.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedBackground implements AfterViewInit, OnDestroy {
  @ViewChild('grid', { static: true }) private grid?: ElementRef<HTMLDivElement>;

  private gridAnimation?: gsap.core.Tween;
  private resizeTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit() {
    this.buildGrid();
    this.animateGrid();
  }

  ngOnDestroy() {
    this.gridAnimation?.kill();
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
  }

  @HostListener('window:resize')
  protected handleResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.buildGrid();
      this.animateGrid();
    }, 180);
  }

  private buildGrid() {
    if (!this.grid?.nativeElement) {
      return;
    }

    const container = this.grid.nativeElement;
    container.innerHTML = '';

    const columns = Math.ceil(window.innerWidth / 60);
    const rows = Math.ceil(window.innerHeight / 60);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < rows * columns; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      fragment.appendChild(cell);
    }

    container.style.setProperty('--grid-columns', columns.toString());
    container.style.setProperty('--grid-rows', rows.toString());
    container.appendChild(fragment);
  }

  private animateGrid() {
    this.gridAnimation?.kill();
    const cells = this.grid?.nativeElement.querySelectorAll('.grid-cell');

    if (!cells?.length) {
      return;
    }

    this.gridAnimation = gsap.to(cells, {
      opacity: 0.65,
      scale: 1.08,
      backgroundColor: 'var(--grid-highlight)',
      ease: 'sine.inOut',
      duration: 1.6,
      stagger: {
        amount: 6,
        from: 'random',
        repeat: -1,
        yoyo: true,
      },
    });
  }
}
