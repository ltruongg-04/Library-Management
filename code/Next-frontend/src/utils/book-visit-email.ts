type BuildBookVisitEmailHtmlParams = {
    fullName: string;
    bookTitle: string;
    visitDate: string;
    visitTime: string;
    phone?: string;
};

export function buildBookVisitEmailHtml({ fullName, bookTitle, visitDate, visitTime, phone }: BuildBookVisitEmailHtmlParams) {
    const safeFullName = escapeHtml(fullName);
    const safeBookTitle = escapeHtml(bookTitle);
    const safeVisitDate = escapeHtml(visitDate);
    const safeVisitTime = escapeHtml(visitTime);
    const safePhone = escapeHtml(phone || "");

    return `
        <div style="font-family: Inter, Arial, sans-serif; color: #191c1d; line-height: 1.6;">
            <h1 style="color: #15157d;">Lumina Library</h1>
            <p>Xin chào ${safeFullName},</p>
            <p>Lịch đọc sách tại thư viện của bạn đã được ghi nhận.</p>
            <table style="border-collapse: collapse; margin-top: 16px;">
                <tr><td style="padding: 6px 12px; font-weight: 600;">Sách</td><td style="padding: 6px 12px;">${safeBookTitle}</td></tr>
                <tr><td style="padding: 6px 12px; font-weight: 600;">Ngày đến</td><td style="padding: 6px 12px;">${safeVisitDate}</td></tr>
                <tr><td style="padding: 6px 12px; font-weight: 600;">Giờ đến</td><td style="padding: 6px 12px;">${safeVisitTime}</td></tr>
                ${safePhone ? `<tr><td style="padding: 6px 12px; font-weight: 600;">Số điện thoại</td><td style="padding: 6px 12px;">${safePhone}</td></tr>` : ""}
            </table>
            <p style="margin-top: 20px;">Vui lòng mang theo email này khi đến quầy lễ tân.</p>
        </div>
    `;
}

function escapeHtml(value: string) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
