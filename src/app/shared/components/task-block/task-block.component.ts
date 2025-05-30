import {Component, Input, OnInit} from '@angular/core';

import {Task} from '../../types/task-types';

@Component({
  selector: 'app-task-block',
  imports: [],
  templateUrl: './task-block.component.html',
  styleUrl: './task-block.component.less'
})
export class TaskBlockComponent implements OnInit {
  @Input() task!: Task;

  // For displaying on the UI
  timeStart: string | undefined;
  timeEnd: string | undefined;

  blockTop: string = "0";
  blockHeight: string = "100%";

  ngOnInit() {
    if (this.task.fromDate && this.task.toDate) {
      this.timeStart = this.task.fromDate.toLocaleTimeString().slice(0, 5);
      this.timeEnd = this.task.toDate.toLocaleTimeString().slice(0, 5);

      this.blockTop = this.task.fromDate.getMinutes() / 60.0 * 100.0 + "%";

      // Berechnung der Anzahl der "Überzüge"
      let ueberzuege = 0;
      const fromDate = this.task.fromDate;
      const toDate = this.task.toDate;

      // Startprüfpunkt ist die nächste volle Stunde nach der Startzeit.
      // Beispiel: Wenn Start 12:00 ist, ist der erste mögliche Überzugspunkt 13:00.
      // Wenn Start 12:30 ist, ist der erste mögliche Überzugspunkt 13:00.
      const pruefpunkt = new Date(fromDate.getTime());
      pruefpunkt.setMinutes(0, 0, 0); // Auf die volle Stunde des Starts setzen/abrunden
      pruefpunkt.setHours(pruefpunkt.getHours() + 1); // Zum nächsten vollen Stundenkandidaten gehen

      // Zählen, wie viele volle Stundenmarkierungen überschritten werden, bevor die Aufgabe endet.
      while (pruefpunkt.getTime() < toDate.getTime()) {
        ueberzuege++;
        pruefpunkt.setHours(pruefpunkt.getHours() + 1);
      }
      // Wenn die Aufgabe z.B. von 12:00 bis 13:00 geht, ist pruefpunkt.getTime() (13:00) nicht kleiner als toDate.getTime() (13:00),
      // also gibt es 0 Überzüge, was korrekt ist.
      // Wenn die Aufgabe z.B. von 12:00 bis 13:30 geht, wird 13:00 als Überzug gezählt.

      const additionalPixels = ueberzuege * 2;

      // Korrekte Berechnung der Gesamtdauer der Aufgabe in Minuten
      const durationMs = toDate.getTime() - fromDate.getTime();
      const durationMinutes = Math.max(0, durationMs / (1000 * 60)); // Sicherstellen, dass die Dauer nicht negativ ist

      // Die ursprüngliche Zeile für blockHeight war:
      // this.blockHeight = (timeEnd - timeStart) / 60.0 * 100.0 + "%";
      // Wir ersetzen (timeEnd - timeStart) durch die robustere durationMinutes
      // und fügen additionalPixels mit calc() hinzu.

      const percentageHeight = (durationMinutes / 60.0) * 100.0;

      if (additionalPixels > 0) {
        this.blockHeight = `calc(${percentageHeight}% + ${additionalPixels}px)`;
      } else {
        this.blockHeight = `${percentageHeight}%`;
      }
    }
  }
}
