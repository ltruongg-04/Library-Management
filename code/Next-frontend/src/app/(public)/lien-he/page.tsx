import type { Metadata } from "next";
import ContactContent from "@/components/features/contact/ContactContent";

import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
  title: UI_TEXT.CONTACT.PAGE_TITLE,
  description: UI_TEXT.CONTACT.PAGE_DESC,
};

export default function ContactPage() {
  return <ContactContent />;
}
