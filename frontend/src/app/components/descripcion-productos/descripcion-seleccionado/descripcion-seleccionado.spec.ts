import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionSeleccionado } from './descripcion-seleccionado';

describe('DescripcionSeleccionado', () => {
  let component: DescripcionSeleccionado;
  let fixture: ComponentFixture<DescripcionSeleccionado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescripcionSeleccionado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescripcionSeleccionado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
