import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

import { Contact } from '../../services/contact';

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

  protected readonly profileImage = 'assets/testImg.jpeg';
  protected readonly name = 'Yassine Tazi';
  protected readonly role = 'Developer & Designer';
  protected readonly description =
    'Websites, apps, and brand systems — clean structure, bold type, smooth UX.';
  protected readonly servicePillars = [
    'Web design',
    'Front-end',
    'Mobile apps',
    'Brand identity',
  ];

  protected readonly skillGroups: SkillGroup[] = [
    {
      label: 'Tech',
      items: ['React', 'TypeScript', 'React Native', 'JavaScript', 'HTML & CSS', 'MongoDB', 'Git', 'Figma'],
    },
    {
      label: 'Design',
      items: ['Brand identity', 'Web design', 'App design', 'Illustrator', 'Typography'],
    },
  ];

  @ViewChild('titleRef', { static: true }) private titleRef?: ElementRef<HTMLElement>;
  @ViewChild('roleRef', { static: true }) private roleRef?: ElementRef<HTMLElement>;
  @ViewChild('descRef', { static: true }) private descRef?: ElementRef<HTMLElement>;
  @ViewChild('badgesRef', { static: true }) private badgesRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.runIntroAnimation();
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
