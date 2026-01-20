import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Descripcion } from './descripcion';

describe('Descripcion', () => {
  let component: Descripcion;
  let fixture: ComponentFixture<Descripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Descripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Descripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
