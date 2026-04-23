import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

interface SkillGroup {
  label: string;
  items: string[];
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
  protected readonly role = 'Front-end Developer · Graphic Designer';
  protected readonly tagline = 'Measure craft. Compose interfaces.';
  protected readonly description =
    'Final-year Multimedia & Creative Technologies student at Erasmus University Brussels. I build responsive web and mobile apps with React & TypeScript, and design brand identities and interfaces with a careful, typographic eye.';

  protected readonly skillGroups: SkillGroup[] = [
    {
      label: 'Technical toolkit',
      items: [
        'React',
        'TypeScript',
        'React Native',
        'JavaScript',
        'HTML & CSS',
        'WebRTC',
        'MongoDB',
        'Git',
        'Vite',
        'Figma',
      ],
    },
    {
      label: 'Design toolkit',
      items: [
        'Logo Design',
        'Brand Identity',
        'Web Design',
        'App Design',
        'Poster & Flyer',
        'Social Media',
        'Adobe Illustrator',
        'Adobe Premiere',
        'Style Guides',
        'Typography',
      ],
    },
  ];

  @ViewChild('titleRef', { static: true }) private titleRef?: ElementRef<HTMLElement>;
  @ViewChild('roleRef', { static: true }) private roleRef?: ElementRef<HTMLElement>;
  @ViewChild('descRef', { static: true }) private descRef?: ElementRef<HTMLElement>;
  @ViewChild('badgesRef', { static: true }) private badgesRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.runIntroAnimation();
  }

  protected formatIndex(index: number): string {
    return (index + 1).toString().padStart(2, '0');
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
      const badges = this.badgesRef.nativeElement.querySelectorAll('.stack-item');
      if (badges.length) {
        timeline.from(badges, { opacity: 0, y: 10, stagger: 0.04, duration: 0.5 }, '-=0.2');
      }
    }
  }
}
