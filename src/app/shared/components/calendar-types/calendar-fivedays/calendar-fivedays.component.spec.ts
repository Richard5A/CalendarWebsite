import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFivedaysComponent } from './calendar-fivedays.component';

describe('CalendarFivedaysComponent', () => {
  let component: CalendarFivedaysComponent;
  let fixture: ComponentFixture<CalendarFivedaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarFivedaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarFivedaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
