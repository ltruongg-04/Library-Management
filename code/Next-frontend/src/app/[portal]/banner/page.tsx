import { Metadata } from "next";
import BannerManagement from "@/components/features/admin/banner/BannerManagement";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.RECENT.TEXT_3,
    description: UI_TEXT.RECENT.TEXT_2,
};

export default function BannerPage() {
    return <BannerManagement />;
}
