import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfoqueTerapeutico } from './enfoque-terapeutico';

describe('EnfoqueTerapeutico', () => {
  let component: EnfoqueTerapeutico;
  let fixture: ComponentFixture<EnfoqueTerapeutico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfoqueTerapeutico],
    }).compileComponents();

    fixture = TestBed.createComponent(EnfoqueTerapeutico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
