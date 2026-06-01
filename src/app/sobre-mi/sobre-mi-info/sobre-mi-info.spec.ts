import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreMiInfo } from './sobre-mi-info';

describe('SobreMiInfo', () => {
  let component: SobreMiInfo;
  let fixture: ComponentFixture<SobreMiInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreMiInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(SobreMiInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
