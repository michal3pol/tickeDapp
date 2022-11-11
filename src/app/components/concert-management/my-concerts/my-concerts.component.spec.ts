import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConcertsComponent } from './my-concerts.component';

describe('MyConcertsComponent', () => {
  let component: MyConcertsComponent;
  let fixture: ComponentFixture<MyConcertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyConcertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyConcertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
