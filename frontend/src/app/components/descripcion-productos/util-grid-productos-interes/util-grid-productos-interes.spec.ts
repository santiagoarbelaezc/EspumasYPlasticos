import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilGridProductosInteres } from './util-grid-productos-interes';

describe('UtilGridProductosInteres', () => {
  let component: UtilGridProductosInteres;
  let fixture: ComponentFixture<UtilGridProductosInteres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilGridProductosInteres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilGridProductosInteres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
