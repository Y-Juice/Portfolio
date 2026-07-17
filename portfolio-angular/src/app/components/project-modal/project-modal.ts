import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
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

  protected carouselIndexes: number[] = [];

  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    if (this.project) {
      this.lockScroll();
      this.animateOpen();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']?.currentValue) {
      this.resetCarousels();
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

  protected prevSlide(postIndex: number) {
    const post = this.project?.instagramPosts?.[postIndex];
    if (!post?.images.length) {
      return;
    }

    const current = this.carouselIndexes[postIndex] ?? 0;
    this.carouselIndexes[postIndex] =
      (current - 1 + post.images.length) % post.images.length;
    this.cdr.markForCheck();
  }

  protected nextSlide(postIndex: number) {
    const post = this.project?.instagramPosts?.[postIndex];
    if (!post?.images.length) {
      return;
    }

    const current = this.carouselIndexes[postIndex] ?? 0;
    this.carouselIndexes[postIndex] = (current + 1) % post.images.length;
    this.cdr.markForCheck();
  }

  protected goToSlide(postIndex: number, slideIndex: number) {
    this.carouselIndexes[postIndex] = slideIndex;
    this.cdr.markForCheck();
  }

  protected instagramHref(handle: string) {
    return `https://www.instagram.com/${handle}/`;
  }

  private resetCarousels() {
    const count = this.project?.instagramPosts?.length ?? 0;
    this.carouselIndexes = Array.from({ length: count }, () => 0);
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
