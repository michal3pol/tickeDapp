import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReselledTicketComponent } from './reselled-ticket.component';

describe('ReselledTicketComponent', () => {
  let component: ReselledTicketComponent;
  let fixture: ComponentFixture<ReselledTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReselledTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReselledTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
