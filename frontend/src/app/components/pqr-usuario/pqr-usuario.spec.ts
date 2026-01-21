import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqrUsuario } from './pqr-usuario';

describe('PqrUsuario', () => {
  let component: PqrUsuario;
  let fixture: ComponentFixture<PqrUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PqrUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PqrUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
