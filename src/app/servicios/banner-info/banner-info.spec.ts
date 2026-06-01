import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerInfo } from './banner-info';

describe('BannerInfo', () => {
  let component: BannerInfo;
  let fixture: ComponentFixture<BannerInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
