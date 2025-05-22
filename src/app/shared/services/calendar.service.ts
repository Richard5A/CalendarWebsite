import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private actionSubject = new Subject<string>();
  public action$ = this.actionSubject.asObservable();

  triggerAction(action: string): void {
    this.actionSubject.next(action);
  }
}
