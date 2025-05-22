export interface Task {
  id: number;
  title: string;
  info?: string;
  color?: string;
  type: "task" | "app"; // "app" -> Appointment
  fromDate?: Date;
  toDate?: Date;
}
