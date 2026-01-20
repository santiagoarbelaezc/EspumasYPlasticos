import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridProductosInteres } from './grid-productos-interes';

describe('GridProductosInteres', () => {
  let component: GridProductosInteres;
  let fixture: ComponentFixture<GridProductosInteres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridProductosInteres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridProductosInteres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
