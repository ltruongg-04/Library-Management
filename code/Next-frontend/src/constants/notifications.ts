import { Notification } from "@/types/notification";

export const notifications: Notification[] =
  [
    {
      id: 1,
      title: "Overdue Notice",
      message:
        'The book "Clean Code" is overdue.',
      type: "OVERDUE",
      isRead: false,
      time: "2 hours ago",
    },

    {
      id: 2,
      title: "AI Recommendation",
      message:
        'We recommend "Thinking Fast and Slow".',
      type: "AI_INSIGHT",
      isRead: false,
      time: "Yesterday",
    },

    {
      id: 3,
      title: "Hold Available",
      message:
        'Your reserved book "Dune" is ready.',
      type: "BORROW",
      isRead: true,
      time: "Jul 24",
    },
  ];