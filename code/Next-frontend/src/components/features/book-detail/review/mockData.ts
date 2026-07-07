import type { Review } from "./ReviewCard";

export const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sách rất hay.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        userName: "You",
        rating: 4,
        comment: "Đánh giá của mình.",
        createdAt: new Date().toISOString(),
    },
];
