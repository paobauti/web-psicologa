import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opiniones } from './opiniones';

describe('Opiniones', () => {
  let component: Opiniones;
  let fixture: ComponentFixture<Opiniones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opiniones],
    }).compileComponents();

    fixture = TestBed.createComponent(Opiniones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
