import type { Review } from "./ReviewCard";

export const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        userId: 9991,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sách rất hay, nội dung sâu sắc và dễ hiểu. Đề xuất cho những ai mới tìm hiểu về chủ đề này.",
        createdAt: "2024-03-15T08:00:00Z",
    },
    {
        id: 2,
        userId: 9992,
        userName: "Trần Thị B",
        rating: 4,
        comment: "Bản dịch tốt, tuy nhiên một số thuật ngữ chuyên ngành có thể giải thích rõ hơn ở phần chú thích.",
        createdAt: "2024-03-14T10:30:00Z",
    },
];
