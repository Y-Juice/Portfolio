import { Injectable, signal } from '@angular/core';

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Contact {
  readonly isOpen = signal(false);
  readonly items: ContactItem[] = [
    {
      label: 'Email',
      value: 'yassinetazi238@gmail.com',
      href: 'mailto:yassinetazi238@gmail.com',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/yassine-tazi2004',
      href: 'https://www.linkedin.com/in/yassine-tazi2004',
    },
    {
      label: 'Freelance',
      value: 'wara.studio',
      href: 'https://www.wara.studio',
    },
  ];

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
