import type { Metadata } from "next";
import ContactContent from "@/components/features/contact/ContactContent";

export const metadata: Metadata = {
  title: "Liên hệ | Lumina Library",
  description:
    "Liên hệ với đội ngũ Lumina Library — giải đáp thắc mắc về bộ sưu tập, tìm kiếm AI, hoặc truy cập tổ chức.",
};

export default function ContactPage() {
  return <ContactContent />;
}
