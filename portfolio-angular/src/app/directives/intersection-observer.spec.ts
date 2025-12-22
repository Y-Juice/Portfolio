import { IntersectionObserverDirective } from './intersection-observer';

describe('IntersectionObserverDirective', () => {
  it('should create an instance', () => {
    const mockEl = { nativeElement: document.createElement('div') } as any;
    const mockRenderer = { addClass: () => {} } as any;
    const directive = new IntersectionObserverDirective(mockEl, mockRenderer);
    expect(directive).toBeTruthy();
  });
});
