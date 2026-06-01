import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosHero } from './servicios-hero';

describe('ServiciosHero', () => {
  let component: ServiciosHero;
  let fixture: ComponentFixture<ServiciosHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosHero],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
