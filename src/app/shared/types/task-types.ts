export interface Task {
  id: number;
  title: string;
  info?: string;
  type: "task" | "app"; // "app" -> Appointment
  fromDate?: Date;
  toDate?: Date;
}
