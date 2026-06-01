import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosHero } from './recursos-hero';

describe('RecursosHero', () => {
  let component: RecursosHero;
  let fixture: ComponentFixture<RecursosHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosHero],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursosHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
