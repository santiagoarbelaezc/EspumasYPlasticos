import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilGridProductsOther } from './util-grid-products-other';

describe('UtilGridProductsOther', () => {
  let component: UtilGridProductsOther;
  let fixture: ComponentFixture<UtilGridProductsOther>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilGridProductsOther]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilGridProductsOther);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
