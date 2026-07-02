import BookVisitPageContent from "@/components/features/book-visit/BookVisitPageContent";

export default function BookVisitPage({ params }: { params: { id: string } }) {
    const bookId = parseInt(params.id, 10);

    return <BookVisitPageContent bookId={bookId} />;
}
