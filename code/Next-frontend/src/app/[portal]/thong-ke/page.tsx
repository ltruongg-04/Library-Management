import { redirect } from "next/navigation";

export default function ThongKePage({ params }: { params: { portal: string } }) {
    redirect(`/${params.portal}`);
}
