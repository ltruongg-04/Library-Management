import type { Metadata } from "next";
import ContactContent from "@/components/features/contact/ContactContent";

export const metadata: Metadata = {
  title: "Liên hệ | Lumina Library",
  description:
    "Liên hệ với đội ngũ Lumina Library — giải đáp thắc mắc về thư viện, sách và các thông tin khác",
};

export default function ContactPage() {
  return <ContactContent />;
}
