import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellComponent } from './resell.component';

describe('ResellComponent', () => {
  let component: ResellComponent;
  let fixture: ComponentFixture<ResellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
