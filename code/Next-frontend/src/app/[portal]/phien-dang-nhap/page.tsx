import { Metadata } from "next";
import SessionManagement from "@/components/features/admin/session/SessionManagement";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.RECENT.TEXT_9,
    description: UI_TEXT.RECENT.TEXT_8,
};

export default function SessionPage() {
    return <SessionManagement />;
}
