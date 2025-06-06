export enum CalendarDisplayView {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    AGENDA = "agenda",
    YEAR = "year",
    FIVE_DAYS = "5days",
}

export const CalendarDisplayViewList = [
   {name: "Tag", id: CalendarDisplayView.DAY},
   {name: "Woche", id: CalendarDisplayView.WEEK},
   {name: "Monat", id: CalendarDisplayView.MONTH},
   {name: "Agenda", id: CalendarDisplayView.AGENDA},
   {name: "Jahr", id: CalendarDisplayView.YEAR},
   {name: "5 Tage", id: CalendarDisplayView.FIVE_DAYS},
];
