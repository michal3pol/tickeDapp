import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNftComponent } from './my-nft.component';

describe('MyNftComponent', () => {
  let component: MyNftComponent;
  let fixture: ComponentFixture<MyNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
