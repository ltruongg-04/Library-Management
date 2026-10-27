import { Metadata } from "next";
import EbookReader from "@/components/features/ebook/EbookReader";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: UI_TEXT.EBOOK_READER.PAGE_METADATA.TITLE,
    description: UI_TEXT.EBOOK_READER.PAGE_METADATA.DESCRIPTION,
};

export default function BookReaderPage({ params }: { params: { id: string } }) {
    const bookId = parseInt(params.id, 10);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <EbookReader bookId={bookId} />
        </div>
    );
}
