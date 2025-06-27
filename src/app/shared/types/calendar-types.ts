export enum CalendarDisplayType {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    AGENDA = "agenda",
    YEAR = "year",
    FIVE_DAYS = "5days",
}

export enum ViewType {
  CALENDAR = "calendar",
  TASKS = "tasks",
  CONTACTS = "contacts"
}

export const CalendarDisplayViewList = [
   {name: "Tag", id: CalendarDisplayType.DAY},
   {name: "Woche", id: CalendarDisplayType.WEEK},
   {name: "Monat", id: CalendarDisplayType.MONTH},
   {name: "Agenda", id: CalendarDisplayType.AGENDA},
   {name: "Jahr", id: CalendarDisplayType.YEAR},
   {name: "5 Tage", id: CalendarDisplayType.FIVE_DAYS},
];
