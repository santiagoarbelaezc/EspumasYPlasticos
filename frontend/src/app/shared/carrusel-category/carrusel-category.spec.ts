import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselCategory } from './carrusel-category';

describe('CarruselCategory', () => {
  let component: CarruselCategory;
  let fixture: ComponentFixture<CarruselCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
