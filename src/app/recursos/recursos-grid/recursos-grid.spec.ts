import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosGrid } from './recursos-grid';

describe('RecursosGrid', () => {
  let component: RecursosGrid;
  let fixture: ComponentFixture<RecursosGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursosGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
