import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosBanner } from './recursos-banner';

describe('RecursosBanner', () => {
  let component: RecursosBanner;
  let fixture: ComponentFixture<RecursosBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursosBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
