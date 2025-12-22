import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

type TechIcon = 'react' | 'html' | 'css' | 'js' | 'three' | 'vite' | 'vue';

interface Tech {
  label: string;
  icon: TechIcon;
}

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements AfterViewInit {
  protected readonly profileImage = 'assets/testImg.jpeg';
  protected readonly name = 'Yassine Tazi';
  protected readonly role = 'Front-end Developer & React Lover';
  protected readonly description =
    'Front-end developer who brings designs to life with clean animations and engaging interactions. I love creating sleek, user-friendly, and fun interfaces that stand out.';

  protected readonly techStack: Tech[] = [
    { label: 'React', icon: 'react' },
    { label: 'HTML', icon: 'html' },
    { label: 'CSS', icon: 'css' },
    { label: 'JavaScript', icon: 'js' },
    { label: 'Three.js', icon: 'three' },
    { label: 'Vite', icon: 'vite' },
    { label: 'Vue', icon: 'vue' },
  ];

  @ViewChild('titleRef', { static: true }) private titleRef?: ElementRef<HTMLElement>;
  @ViewChild('roleRef', { static: true }) private roleRef?: ElementRef<HTMLElement>;
  @ViewChild('descRef', { static: true }) private descRef?: ElementRef<HTMLElement>;
  @ViewChild('badgesRef', { static: true }) private badgesRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.runIntroAnimation();
  }

  private runIntroAnimation() {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (this.titleRef?.nativeElement) {
      timeline.from(this.titleRef.nativeElement, { y: 30, opacity: 0, duration: 0.8 });
    }

    if (this.roleRef?.nativeElement) {
      timeline.from(this.roleRef.nativeElement, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');
    }

    if (this.descRef?.nativeElement) {
      timeline.from(this.descRef.nativeElement, { y: 15, opacity: 0, duration: 0.6 }, '-=0.4');
    }

    if (this.badgesRef?.nativeElement) {
      const badges = this.badgesRef.nativeElement.querySelectorAll('.tech-badge');
      if (badges.length) {
        timeline.from(badges, { opacity: 0, y: 10, stagger: 0.08, duration: 0.5 }, '-=0.2');
      }
    }
  }
}
