import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCoach } from './life-coach';

describe('LifeCoach', () => {
  let component: LifeCoach;
  let fixture: ComponentFixture<LifeCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeCoach],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeCoach);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
