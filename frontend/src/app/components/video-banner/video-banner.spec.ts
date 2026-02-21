import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBanner } from './video-banner';

describe('VideoBanner', () => {
  let component: VideoBanner;
  let fixture: ComponentFixture<VideoBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
