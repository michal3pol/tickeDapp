import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertSellComponent } from './concert-sell.component';

describe('SellComponent', () => {
  let component: ConcertSellComponent;
  let fixture: ComponentFixture<ConcertSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcertSellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
