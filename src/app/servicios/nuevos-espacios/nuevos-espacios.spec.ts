import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevosEspacios } from './nuevos-espacios';

describe('NuevosEspacios', () => {
  let component: NuevosEspacios;
  let fixture: ComponentFixture<NuevosEspacios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevosEspacios],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevosEspacios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
