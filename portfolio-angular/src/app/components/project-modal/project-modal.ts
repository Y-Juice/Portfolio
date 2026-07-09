import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

import { Project } from '../../services/project';

@Component({
  selector: 'app-project-modal',
  imports: [CommonModule],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectModal implements OnChanges, AfterViewInit, OnDestroy {
  @Input({ required: true }) project: Project | null = null;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('overlay') private overlay?: ElementRef<HTMLDivElement>;
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    if (this.project) {
      this.lockScroll();
      this.animateOpen();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']?.currentValue) {
      this.lockScroll();
      if (this.dialog) {
        queueMicrotask(() => this.animateOpen());
      }
    }
  }

  ngOnDestroy() {
    this.unlockScroll();
  }

  protected close() {
    this.unlockScroll();
    this.closed.emit();
  }

  protected onOverlayClick(event: MouseEvent) {
    if (event.target === this.overlay?.nativeElement) {
      this.close();
    }
  }

  private lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  private unlockScroll() {
    document.body.style.overflow = '';
  }

  private animateOpen() {
    if (!this.overlay?.nativeElement || !this.dialog?.nativeElement) {
      return;
    }

    gsap.fromTo(
      this.overlay.nativeElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power1.out' }
    );

    gsap.fromTo(
      this.dialog.nativeElement,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
    );
  }
}
