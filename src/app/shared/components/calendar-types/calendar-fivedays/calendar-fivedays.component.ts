import {Component, Input, OnInit, OnDestroy, model, effect} from '@angular/core';
import {Subscription} from 'rxjs';

import {TaskBlockComponent} from '../../task-block/task-block.component';
import {Task} from '../../../types/task-types';
import {CalendarService} from '../../../services/calendar.service';

@Component({
  selector: 'app-calendar-fivedays',
  imports: [TaskBlockComponent],
  templateUrl: './calendar-fivedays.component.html',
  styleUrl: './calendar-fivedays.component.less'
})
export class CalendarFivedaysComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  private DAYS_SHOWN = 5;
  private hours_in_milli = 60 * 60 * 1000;

  @Input() tasks: Task[] = [];
  calendarDate = model<Date>(); // Für Two-Way Binding

  // calendarStart wird in ngOnInit basierend auf dem Input von calendarDate initialisiert.
  // Als Fallback dient das heutige Datum.
  private calendarStart: Date = this.getToday();

  days: string[] = this.getWeekdays();
  offsets: number[] = Array.from(this.days, (_, i) => i);
  hours: number[] = Array.from({length: 24}, (_, i) => i);

  constructor(private calendarService: CalendarService) {
    // 'effect' reagiert auf spätere Änderungen von calendarDate durch die Elternkomponente
    effect(() => {
      const dateFromParent = this.calendarDate();
      if (dateFromParent) {
        // Nur aktualisieren, wenn sich das Datum vom Parent tatsächlich von unserem internen calendarStart unterscheidet, um Endlosschleifen zu vermeiden.
        if (!this.calendarStart || this.calendarStart.getTime() !== dateFromParent.getTime()) {
          this.calendarStart = new Date(dateFromParent.getTime());
          this.updateViewAndNotifyParent(); // Ansicht und abhängigen Zustand aktualisieren
        }
      }
    });
  }

  ngOnInit(): void {
    // Hier ist der initiale Wert von [(calendarDate)]="focusDay" verfügbar.
    const initialDateFromParent = this.calendarDate();

    if (initialDateFromParent) {
      // Wenn die Elternkomponente ein Datum bereitstellt, verwenden wir dieses.
      this.calendarStart = new Date(initialDateFromParent.getTime());
      console.log('ngOnInit: Initiales calendarDate vom Parent wird verwendet:', this.calendarStart);
    } else {
      // Fallback: Wenn kein initiales Datum vom Parent kommt.
      // calendarStart hat bereits den Wert von getToday() durch seine Deklaration.
      // Wir sollten diesen Standardwert an den Parent zurückmelden.
      console.log('ngOnInit: Kein initiales calendarDate vom Parent. Aktuelles calendarStart (Standard ist heute):', this.calendarStart);
      this.calendarDate.set(new Date(this.calendarStart.getTime()));
    }

    this.sub = this.calendarService.calendarSwitchAction$.subscribe(action => {
      switch (action) {
        case "next":
          this.goRelative(1);
          break;
        case "previous":
          this.goRelative(-1);
          break;
        case "today":
          this.gotoToday();
          break;
      }
    });

    // Initiale Einrichtung der Ansicht basierend auf dem ermittelten calendarStart
    this.updateViewAndNotifyParent();
  }

  ngOnDestroy(): void {
    if (this.sub) { // Sicherstellen, dass sub existiert, bevor unsubscribe aufgerufen wird
        this.sub.unsubscribe();
    }
  }

  getTasksFor(day_offset: number, hour: number, debug = false): Task[] {
    const timeStart: Date = new Date(this.calendarStart.getTime() + (day_offset * 24 + hour) * this.hours_in_milli);
    const timeEnd: Date = new Date(timeStart.getTime() + this.hours_in_milli);

    if (debug) {
      console.log(timeStart);
      console.log(timeEnd);
      console.log(this.tasks.filter(v => {
        return (v.fromDate && v.toDate) && (v.fromDate >= timeStart && v.fromDate < timeEnd);
      }));
    }

    return this.tasks.filter(v => {
      return (v.fromDate && v.toDate) && (v.fromDate >= timeStart && v.fromDate < timeEnd);
    });
  }

  // Diese Methode aktualisiert den internen Zustand (wie 'days') und gibt den 'calendarStart'-Wert über das 'calendarDate'-Model an den Parent zurück.
  private updateViewAndNotifyParent(): void {
    // Das Model-Output (calendarDate) aktualisieren, wenn sich das interne calendarStart geändert hat.
    // Stellt sicher, dass Two-Way Binding funktioniert, wenn calendarStart intern modifiziert wird.
    if (this.calendarStart) { // Sicherstellen, dass calendarStart initialisiert ist
      const currentDateModel = this.calendarDate();
      if (!currentDateModel || currentDateModel.getTime() !== this.calendarStart.getTime()) {
        this.calendarDate.set(new Date(this.calendarStart.getTime()));
      }
    }

    this.days = this.getWeekdays(); // Abhängig von calendarStart
    this.triggerTimeRangeUpdateAction(); // Abhängig von calendarStart
  }

  private goRelative(amount: number): void {
    const deltaDays: number = this.DAYS_SHOWN * amount;

    const newDate = new Date(this.calendarStart.getTime());
    newDate.setDate(newDate.getDate() + deltaDays);
    this.calendarStart = newDate;
    this.updateViewAndNotifyParent();
  }

  private gotoToday(): void {
    this.calendarStart = this.getToday();
    this.updateViewAndNotifyParent();
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private getWeekdays(): string[] {
    const weekdays: string[] = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const result: string[] = [];

    const date = new Date(this.calendarStart.getTime());

    for (let i = 0; i < this.DAYS_SHOWN; i++) {
      result.push(weekdays[date.getDay()]);
      date.setDate(date.getDate() + 1);
    }
    return result;
  }

  private triggerTimeRangeUpdateAction(): void {
    // Sicherstellen, dass calendarStart initialisiert ist
    if (!this.calendarStart) return;

    const start = this.calendarStart.toLocaleDateString();
    const end = new Date(this.calendarStart.getTime() + (this.DAYS_SHOWN - 1) * 24 * this.hours_in_milli).toLocaleDateString();
    this.calendarService.triggerTimeRangeAction(start + " - " + end);
  }
}
