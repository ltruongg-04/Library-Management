export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  unread: boolean;
  type: "urgent" | "recommendation" | "normal";
  badge?: string;
}