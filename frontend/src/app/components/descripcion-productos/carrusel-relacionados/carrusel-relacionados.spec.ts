import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselRelacionados } from './carrusel-relacionados';

describe('CarruselRelacionados', () => {
  let component: CarruselRelacionados;
  let fixture: ComponentFixture<CarruselRelacionados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselRelacionados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselRelacionados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
