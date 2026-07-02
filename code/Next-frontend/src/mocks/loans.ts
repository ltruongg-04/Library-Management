export type LoanStatus = "pending" | "borrowing" | "overdue" | "returned" | "cancelled";

export type Loan = {
    id: string;
    title: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    actualReturnDate: string | null;
    deposit: string;
    status: LoanStatus;
    imgSrc: string;
    lateFee?: string;
    depositReturn?: string;
};

export const MOCK_LOANS: Loan[] = [
    {
        id: "RES-9045",
        title: "Sapiens: Lược sử loài người",
        author: "Yuval Noah Harari",
        borrowDate: "02/07/2026",
        dueDate: "09/07/2026",
        actualReturnDate: null as string | null,
        deposit: "200.000đ",
        status: "pending" as const,
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsfOcBpJJgQyJoSUCYejX7lohGTGUFjq7ZkL_tD7HdiMvYPfWkgXqdTHAvBuX0mKVSIASXedLUTe9Lz7wQ5omHp3_pRpFb6l-y-9FaV6Nz029PFWA7DMbdPKE2rMkn1jXs4gSZt6qUyIYI8Ct9JMzha-tzBvHJfODPtWxWPBLsAkQsJhGB6qRRHbbOi4CIfsEZHY3DBRvlmIdtICflVqffE44Fg4H79A5iO4m6OQ9hxKIp7litWF3Rpbwqz55cVhAfCn6U2aTfOH4S",
    },
    {
        id: "BRW-9042",
        title: "AI & Tương lai nhân loại",
        author: "Dr. Nguyễn Văn A",
        borrowDate: "12/05/2024",
        dueDate: "26/05/2024",
        actualReturnDate: null as string | null,
        deposit: "250.000đ",
        status: "borrowing" as const,
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsfOcBpJJgQyJoSUCYejX7lohGTGUFjq7ZkL_tD7HdiMvYPfWkgXqdTHAvBuX0mKVSIASXedLUTe9Lz7wQ5omHp3_pRpFb6l-y-9FaV6Nz029PFWA7DMbdPKE2rMkn1jXs4gSZt6qUyIYI8Ct9JMzha-tzBvHJfODPtWxWPBLsAkQsJhGB6qRRHbbOi4CIfsEZHY3DBRvlmIdtICflVqffE44Fg4H79A5iO4m6OQ9hxKIp7litWF3Rpbwqz55cVhAfCn6U2aTfOH4S",
    },
    {
        id: "BRW-9043",
        title: "Kỹ thuật Phân tích Dữ liệu",
        author: "Prof. Elena Smith",
        borrowDate: "01/05/2024",
        dueDate: "15/05/2024",
        actualReturnDate: null as string | null,
        deposit: "180.000đ",
        lateFee: "45.000đ",
        status: "overdue" as const,
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGwJPhPhWyh7tY-XMu0j8JBcP_19pPjVxWfDmaiE_eVafrSvKIX1xgGlg_qO_HMyIAggdr4WVxRsKy0HHMpJ7HAIydRHpnUtUiWbvvz8iSCdxaqmDUGZdQ1bMki9GXbLHgfzKoumR8sd552JpANAMD0hq40eTbEayNk3jSUFtodQxoU97fXMX5gu-XxQwsuGNmcx31cOiopHerjM5yOVr2MiZIOMHIcQflyzJ72zgl6we1EmSlBJUA3LRtPx39U-6Ki4OC6mi2_gug",
    },
    {
        id: "BRW-9044",
        title: "Lịch sử Văn minh Thế giới",
        author: "Trần Minh Tâm",
        borrowDate: "10/04/2024",
        dueDate: "24/04/2024",
        actualReturnDate: "22/04/2024",
        deposit: "200.000đ",
        depositReturn: "Đã hoàn (200.000đ)",
        status: "returned" as const,
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIJL9XO_994a2i10hkM-rzi-XNmAEJDwzK9Itt8Bb9u_NXic5gMtHVrUGHvsnJ8qhtvsgS-ckV5bo_xrY3y1tQXRo0zoRhOxYiAqAKFy1BkUVKCTwC1nyeVMwMHoBhzf1726LJemSi2YoUiDlP6RdWoOnTGoVycfG-xqTAnzrzvBMXVGPe5LfiXQDvdO8b1xW4KMVlXhMMe_Fn2NXRt9LDsYJw6AJl7-h0jUWIAeCAzI3XQ6mre-U8hhDnd7uaSr8-xAKi42Ud534M",
    },
];

export const MOCK_LOAN_DETAIL = {
    borrowDate: "10 Tháng 10, 2024",
    dueDate: "24 Tháng 10, 2024",
    deadlineDate: "24 Tháng 10, 2024",
    reminderDate: "23 Tháng 10, 2024",
    borrowSuccessDate: "10 Tháng 10, 2024",
    deposit: "500,000 đ",
    lateFee: "+50,000 đ",
    total: "50,000 đ",
    books: [
        {
            title: "The Design of Everyday Things",
            author: "Don Norman",
            status: "inUse" as const,
            imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ34UtDP4BZ4LFlmUEK6QqMCVoT97NCngWj_Ey944CvsOtRQp_Y6j01z69HKjw9Dsx5Ieyr3W9OFCxm53Cz7HacNb9yEFD6x0QvJWvaL4JiDKOknm0Hj51gCZ_KrhFBuN1lLIGUT_L_eUeOR8CMPSnC2uUvLgcq7-m07mXXhXWpOcc2qgWbznnU5NO2XpgCNw0xQOx9qskprOlw0OIr0uilJu9KwzAtnYOXvDk9a_hyqKpG7BJF7NNFXIR6X51ea1jCdKN4Omh0lxg",
        },
        {
            title: "Refactoring UI",
            author: "Adam Wathan & Steve Schoger",
            status: "returned" as const,
            imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPtZA1FZieeLT3BHKTaIAUREOada93EhqHzjoNeBZaq4rEjgFVvkjpxWZJCfYx9CA3-pELxTKGWh9SRUrPFWDYsN9HKxiP58bSmXyBNc9BQR7A7DzWIwEd0gArKrtqW7FajIywJHvavHBNPwjOOqzEIM8wJGeH-xuSsOM7BDBMvuZLgy9AkHHs5p5LowdmRXAw_t6qL_uZxSRIc8Splgw4NZv9_KtXH6LxDxUlLs-qqE5jmm3X4sTH-wISJn7yPRwFRLzHuMIsTcPj",
        },
    ],
};

export const MOCK_RENEW_DATA = {
    book: {
        title: "Kỹ thuật Phân tích Dữ liệu",
        author: "Prof. Elena Smith",
        borrowDate: "01/05/2024",
        dueDate: "15/05/2024",
        actualReturnDate: null as string | null,
        overdueDays: 3,
        imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGwJPhPhWyh7tY-XMu0j8JBcP_19pPjVxWfDmaiE_eVafrSvKIX1xgGlg_qO_HMyIAggdr4WVxRsKy0HHMpJ7HAIydRHpnUtUiWbvvz8iSCdxaqmDUGZdQ1bMki9GXbLHgfzKoumR8sd552JpANAMD0hq40eTbEayNk3jSUFtodQxoU97fXMX5gu-XxQwsuGNmcx31cOiopHerjM5yOVr2MiZIOMHIcQflyzJ72zgl6we1EmSlBJUA3LRtPx39U-6Ki4OC6mi2_gug",
    },
    currentLateFee: 45000,
    initialDeposit: 100000,
    renewalOptions: [
        { days: 7, fee: 10000 },
        { days: 14, fee: 20000 },
    ],
};
