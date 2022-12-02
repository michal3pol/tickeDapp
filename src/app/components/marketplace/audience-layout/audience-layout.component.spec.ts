import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceLayoutComponent } from './audience-layout.component';

describe('AudienceLayoutComponent', () => {
  let component: AudienceLayoutComponent;
  let fixture: ComponentFixture<AudienceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudienceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
