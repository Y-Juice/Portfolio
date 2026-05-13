import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

import { Contact } from '../../services/contact';
import { ModeService, PortfolioMode } from '../../services/mode';

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
  private readonly contact = inject(Contact);
  private readonly modeService = inject(ModeService);

  protected readonly profileImage = 'assets/testImg.jpeg';
  protected readonly name = 'Yassine Tazi';
  protected readonly description =
    'Final-year Multimedia & Creative Technologies student at Erasmus University Brussels. I create responsive sites, mobile apps, and visual identities with a focus on clear structure, bold typography, and smooth user journeys.';
  protected readonly servicePillars = [
    'Web design',
    'Front-end development',
    'Mobile apps',
    'Brand identity',
    'UI systems',
    'Motion details',
  ];
  protected readonly proofPoints = [
    { value: '10+', label: 'Projects shipped' },
    { value: '2', label: 'Creative modes' },
    { value: 'BE', label: 'Based in Vilvoorde' },
  ];

  protected readonly mode = this.modeService.mode;

  protected readonly role = computed<string>(() =>
    this.mode() === 'developer' ? 'Front-end Developer' : 'Graphic Designer'
  );

  protected readonly tagline = computed<string>(() =>
    this.mode() === 'developer'
      ? 'Built for clean digital launches.'
      : 'Visual systems for brands with momentum.'
  );

  protected readonly focus = computed<string>(() =>
    this.mode() === 'developer' ? 'React & TS' : 'Brand & UI'
  );

  private readonly developerSkills: SkillGroup = {
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
  };

  private readonly designerSkills: SkillGroup = {
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
  };

  protected readonly skillGroup = computed<SkillGroup>(() =>
    this.mode() === 'developer' ? this.developerSkills : this.designerSkills
  );
  protected readonly skillGroups = [this.developerSkills, this.designerSkills];

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

  protected setMode(next: PortfolioMode) {
    if (this.mode() === next) {
      return;
    }

    this.modeService.set(next);
  }

  protected openContactPopup() {
    this.contact.open();
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
