import { Metadata } from "next";
import MembershipTierManagement from "@/components/features/admin/membership/MembershipTierManagement";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.RECENT.TEXT_5,
    description: UI_TEXT.RECENT.TEXT_4,
};

export default function MembershipTierPage() {
    return <MembershipTierManagement />;
}
