import { Metadata } from "next";
import InventoryManagement from "@/components/features/admin/inventory/InventoryManagement";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.RECENT.TEXT_7,
    description: UI_TEXT.RECENT.TEXT_6,
};

export default function InventoryPage() {
    return <InventoryManagement />;
}
