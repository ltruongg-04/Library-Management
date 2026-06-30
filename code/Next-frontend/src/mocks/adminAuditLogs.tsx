import { Bot, UserX } from "lucide-react";
import type { AuditLog, TimeRangeFilter } from "@/types/admin-audit-log";

export const CURRENT_TIME = new Date("2026-06-29T15:30:00+07:00");
export const timeRangeHours: Record<Exclude<TimeRangeFilter, "all">, number> = {
    "12h": 12,
    "1d": 24,
    "3d": 72,
    "7d": 168,
};
function createDate(hoursAgo: number) {
    return new Date(CURRENT_TIME.getTime() - hoursAgo * 60 * 60 * 1000);
}

function formatDateTime(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const auditLogs: AuditLog[] = [
    {
        id: "audit-001",
        occurredAt: createDate(2),
        timestamp: formatDateTime(createDate(2)),
        actor: "Nguyễn An (Quản trị viên)",
        actorFilter: "admin",
        initials: "NA",
        actorTone: "primary",
        action: "Cập nhật cấu hình",
        targetObject: "chinh_sach_gioi_han_tan_suat",
        ipAddress: "192.168.1.45",
        result: "success",
        description: "Quản trị viên cập nhật chính sách giới hạn tần suất truy cập API.",
    },
    {
        id: "audit-002",
        occurredAt: createDate(6),
        timestamp: formatDateTime(createDate(6)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Đồng bộ dữ liệu",
        targetObject: "csdl_danh_muc_02",
        ipAddress: "10.0.0.22 (Nội bộ)",
        result: "failed",
        description: "Tác vụ đồng bộ dữ liệu danh mục bên ngoài kết thúc với trạng thái thất bại.",
    },
    {
        id: "audit-003",
        occurredAt: createDate(11),
        timestamp: formatDateTime(createDate(11)),
        actor: "Trần Minh (Người dùng)",
        actorFilter: "user",
        initials: "TM",
        actorTone: "secondary",
        action: "Tạo bản ghi",
        targetObject: "ma_bien_muc: 88472A",
        ipAddress: "203.0.113.88",
        result: "success",
        description: "Người dùng tạo bản ghi biên mục mới trong kho dữ liệu.",
    },
    {
        id: "audit-004",
        occurredAt: createDate(20),
        timestamp: formatDateTime(createDate(20)),
        actor: "Nguồn không xác định",
        actorFilter: "unknown",
        actorTone: "muted",
        actorIcon: UserX,
        action: "Thử xác thực",
        targetObject: "diem_cuoi_quan_tri_/v1",
        ipAddress: "198.51.100.14",
        result: "blocked",
        description: "Hệ thống chặn yêu cầu xác thực bất thường vào điểm cuối quản trị.",
    },
    {
        id: "audit-005",
        occurredAt: createDate(30),
        timestamp: formatDateTime(createDate(30)),
        actor: "Nguyễn An (Quản trị viên)",
        actorFilter: "admin",
        initials: "NA",
        actorTone: "primary",
        action: "Đăng nhập",
        targetObject: "tao_phien_dang_nhap",
        ipAddress: "192.168.1.45",
        result: "success",
        description: "Quản trị viên đăng nhập và hệ thống tạo phiên làm việc mới.",
    },
    {
        id: "audit-006",
        occurredAt: createDate(48),
        timestamp: formatDateTime(createDate(48)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Tạo báo cáo",
        targetObject: "bao_cao_su_dung_tuan.pdf",
        ipAddress: "10.0.0.5 (Nội bộ)",
        result: "success",
        description: "Hệ thống tạo báo cáo thống kê sử dụng theo tuần.",
    },
    {
        id: "audit-007",
        occurredAt: createDate(70),
        timestamp: formatDateTime(createDate(70)),
        actor: "Lê Hương (Người dùng)",
        actorFilter: "user",
        initials: "LH",
        actorTone: "secondary",
        action: "Cập nhật hồ sơ",
        targetObject: "ho_so_doc_gia_10294",
        ipAddress: "203.0.113.41",
        result: "success",
        description: "Người dùng cập nhật thông tin hồ sơ độc giả.",
    },
    {
        id: "audit-008",
        occurredAt: createDate(96),
        timestamp: formatDateTime(createDate(96)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Sao lưu dữ liệu",
        targetObject: "snapshot_du_lieu_ngay_20231025",
        ipAddress: "10.0.0.8 (Nội bộ)",
        result: "success",
        description: "Hệ thống tạo snapshot sao lưu dữ liệu định kỳ.",
    },
    {
        id: "audit-009",
        occurredAt: createDate(132),
        timestamp: formatDateTime(createDate(132)),
        actor: "Phạm Khoa (Người dùng)",
        actorFilter: "user",
        initials: "PK",
        actorTone: "secondary",
        action: "Gia hạn lượt mượn",
        targetObject: "phieu_muon_20231025_7781",
        ipAddress: "198.51.100.21",
        result: "failed",
        description: "Người dùng gia hạn lượt mượn nhưng không đáp ứng điều kiện nghiệp vụ.",
    },
    {
        id: "audit-010",
        occurredAt: createDate(160),
        timestamp: formatDateTime(createDate(160)),
        actor: "Mai Linh (Người dùng)",
        actorFilter: "user",
        initials: "ML",
        actorTone: "secondary",
        action: "Đặt mượn sách",
        targetObject: "yeu_cau_dat_muon_sach_88472A_nguoi_dung_20941",
        ipAddress: "192.0.2.73",
        result: "success",
        description: "Người dùng tạo yêu cầu đặt mượn sách từ danh mục trực tuyến.",
    },
];
