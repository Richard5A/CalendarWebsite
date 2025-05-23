import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarSwitchSubject = new Subject<string>();
  public calendarSwitchAction$ = this.calendarSwitchSubject.asObservable();

  private timeRangeSubject = new Subject<string>();
  public timeRangeAction$ = this.timeRangeSubject.asObservable();

  triggerCalendarSwitchAction(action: string): void {
    this.calendarSwitchSubject.next(action);
  }

  triggerTimeRangeAction(action: string): void {
    this.timeRangeSubject.next(action);
  }
}
