import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaCitas } from './politica-citas';

describe('PoliticaCitas', () => {
  let component: PoliticaCitas;
  let fixture: ComponentFixture<PoliticaCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaCitas],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaCitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
