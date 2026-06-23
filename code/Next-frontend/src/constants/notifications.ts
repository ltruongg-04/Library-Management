import { Notification } from "@/types/notification";

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Overdue Notice",
    message:
      'The Structure of Scientific Revolutions was due yesterday. Please return or renew it.',
    date: "2 hours ago",
    unread: true,
    type: "urgent",
    badge: "Urgent",
  },
  {
    id: "2",
    title: "New Reading Suggestion",
    message:
      'AI recommends "Thinking, Fast and Slow" based on your reading history.',
    date: "Yesterday",
    unread: true,
    type: "recommendation",
    badge: "AI Curated",
  },
  {
    id: "3",
    title: "Hold Available",
    message:
      'Your hold for "Dune" is ready for pickup.',
    date: "Jul 24",
    unread: false,
    type: "normal",
  },
  {
    id: "4",
    title: "System Maintenance",
    message:
      "The online catalog will undergo maintenance this Sunday.",
    date: "Jul 20",
    unread: false,
    type: "normal",
  },
];