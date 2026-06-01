import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasCalendly } from './citas-calendly';

describe('CitasCalendly', () => {
  let component: CitasCalendly;
  let fixture: ComponentFixture<CitasCalendly>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasCalendly],
    }).compileComponents();

    fixture = TestBed.createComponent(CitasCalendly);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
