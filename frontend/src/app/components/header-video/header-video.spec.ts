import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderVideo } from './header-video';

describe('HeaderVideo', () => {
  let component: HeaderVideo;
  let fixture: ComponentFixture<HeaderVideo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderVideo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderVideo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
