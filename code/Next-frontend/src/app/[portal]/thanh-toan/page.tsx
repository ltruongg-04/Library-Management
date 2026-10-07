import { Metadata } from "next";
import PaymentManagement from "@/components/features/admin/payment/PaymentManagement";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.RECENT.TEXT_11,
    description: UI_TEXT.RECENT.TEXT_10,
};

export default function PaymentPage() {
    return <PaymentManagement />;
}
