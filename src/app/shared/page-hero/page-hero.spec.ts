import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHero } from './page-hero';

describe('PageHero', () => {
  let component: PageHero;
  let fixture: ComponentFixture<PageHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHero],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
