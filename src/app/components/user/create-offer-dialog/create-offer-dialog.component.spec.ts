import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferDialogComponent } from './create-offer-dialog.component';

describe('CreateOfferDialogComponent', () => {
  let component: CreateOfferDialogComponent;
  let fixture: ComponentFixture<CreateOfferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOfferDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOfferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
