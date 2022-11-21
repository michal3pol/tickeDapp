import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcertSectorsComponent } from './concert-sectors.component';

describe('ConcertSectorsComponent', () => {
  let component: ConcertSectorsComponent;
  let fixture: ComponentFixture<ConcertSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcertSectorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcertSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
