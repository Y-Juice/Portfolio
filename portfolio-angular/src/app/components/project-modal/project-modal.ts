import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
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
export class ProjectModal implements OnChanges, AfterViewInit {
  @Input({ required: true }) project: Project | null = null;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('overlay') private overlay?: ElementRef<HTMLDivElement>;
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    if (this.project) {
      this.animateOpen();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']?.currentValue && this.dialog) {
      queueMicrotask(() => this.animateOpen());
    }
  }

  protected close() {
    this.closed.emit();
  }

  protected onOverlayClick(event: MouseEvent) {
    if (event.target === this.overlay?.nativeElement) {
      this.close();
    }
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
      { y: 30, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
  }
}
