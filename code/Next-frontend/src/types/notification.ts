export interface Notification {
  id: number;

  title: string;

  message: string;

  type:
    | "SYSTEM"
    | "AI_INSIGHT"
    | "BORROW"
    | "RETURN"
    | "OVERDUE";

  isRead: boolean;

  time: string;
}