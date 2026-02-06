import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrioCard } from './trio-card';

describe('TrioCard', () => {
  let component: TrioCard;
  let fixture: ComponentFixture<TrioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrioCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrioCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
