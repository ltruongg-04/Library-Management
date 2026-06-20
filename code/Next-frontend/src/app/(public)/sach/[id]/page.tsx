import Breadcrumb from "@/components/features/book-detail/Breadcrumb";
import BookCover from "@/components/features/book-detail/BookCover";
import BookInfo from "@/components/features/book-detail/BookInfo";
import AIChatbot from "@/components/features/book-detail/AIChatbot";
import RelatedBooks from "@/components/features/book-detail/RelatedBooks";
import type { Book, RelatedBook } from "@/types/book";

// Mock data — sẽ thay thế bằng API call khi backend sẵn sàng
const MOCK_BOOK: Book = {
  id: 1,
  title: "The Algorithmic Mind",
  author: "Dr. Elena Rostova",
  publisher: "Nexus Press",
  publishedDate: "Oct 2023",
  pages: 342,
  isbn: "978-1-234-5678",
  description:
    "An illuminating journey into the intersection of human cognition and artificial intelligence. Dr. Rostova deconstructs complex machine learning models to reveal how they parallel, and diverge from, the neurological pathways of the human brain. Essential reading for understanding the future of cognitive technology.",
  coverImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMQZBwRZKLiwS6s_Ghy2_0232U4u8yrVt0UoLSfqDN1CsrwPHmS4Kd3UrRaqEu5cFueLAfwFeL3RtxDYO7mBdlOrBmIzg1LAifXS5Ke852HdIZXRvjSe4ILboN6D9bnTPk2oVp8CcdJHT_g9gFy4fKK7fq14vo4smnYqVAjuCZEztGQohjl9HlXhovVOfuT65lwKU7ToahWuCAmutimIZCyfsJRzk_ai_vPVd5iaGoXpNl0KfkXbDYOMAEMBlDryuGgvAuZWKCZdpM",
  rating: 4.9,
  reviewCount: 128,
  availableCount: 3,
  totalCount: 5,
  shelfLocation: "A3-12",
  categories: [
    "Artificial Intelligence",
    "Cognitive Science",
    "Technology",
    "Machine Learning",
  ],
  aiMatchScore: 98,
};

const MOCK_RELATED_BOOKS: RelatedBook[] = [
  {
    id: 2,
    title: "Sentient Systems",
    author: "Marcus Vance",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMmCiisoJSpv4dvhtaCdcoE1uS_CBtUC8kwsFUNxhgnupzh2gwqkc6Y61JxPoMMe0t1hLC4S9Fc8AOG56NdzVsft_J2ipvPnX6C33CeHDKy52GPyZqEVLz6lu_dZsDLLY2itV8C5MLT15dj45eRZ0J81iwUfWxdKAeiCE-xUwDW8rGHqtvIb08Zg-4B-e_bPNOvXGM_HPoopmXuUMpyNxcCk6oPfjU30Z2uZXIL8IiztciFMYH8PPFcNUkuJG83f6ivzfK5E-N2qRn",
  },
  {
    id: 3,
    title: "Code & Cognition",
    author: "Dr. Sarah Jenkins",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBehlRBluY2H86XNuf3iXURag8OtXWdzR6luPuT4-Rz95fi7OdFVShqx6GzXoQL_1TxeQ1eJgUhzMsiMr0qvszKS-w-TRgLwxnEx1m_QW7uo0-Tsc3nx4LKefihl3fK67GYd90rW2TPNHUbOQ76xNdBMxgtPYfYkH37Kh32ujcSJHGthQAh_Yg4MmvfBOaxWRWETJHWKRqOT1CZ8ngmnJSn3tkL5ctkWxrvLIjrphtCon2lbuI_CZrArUWwhI64ltwT-_Z5rq-J0R2x",
  },
  {
    id: 4,
    title: "The Silicon Soul",
    author: "A.J. Thorne",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7DbciVnkrS3xPbNq6UHVgda6vZZl5njAKfTRjjTA4_tVAYoxD5hVSN6qghwyj6UDqfkCAbldQhcpQQUfTvt0Kj-yXaFnuzdsuRDAymk9draKu64TLo4MUOQDKNr6WAm7dT-cfnzXfsjcHbVLssYz2g8EDY-3rqN3O3vkf8zzSSvcBir9sb4oWihUCvGb8JHIdDJQoBdNN-RVoGOxkeI6_JmWdPugeZD2ahUxc54v9h9weUoW31mHaqCB2O6Vs6OB7PDckAR1aL23",
  },
  {
    id: 5,
    title: "Conversational AI",
    author: "L. Chen",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCw80Sw2BU5XvcHA7V09zy6UirEiamVjKAyEZ8laM82itQA-nmvRR5bVmwqL_RncEl3k9MnuPi8hQM1nhdxPaSe8HcpVT50_mAlPN5VIA6iuBd1Fd_wd8pZgE_jTxDq7QZzb4wp-wMQ-swOURcipKmxWZ5CS4ZrMpl2NSgVaxEjJOLq0omNKzLmHZbjjRFGDdZkRe9bZrqfLpnK1Ff3pT2yidmLlg8iK8x4FfTaUtz6x1PQ47VnvDky9wFccasiJAm8rPWq8b_s8Oth",
  },
  {
    id: 6,
    title: "Hardware Deep Dive",
    author: "T. R. Gable",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0mQ_hKe7HgA6DuFUeKSc5FwhnUnb_Lj2tn4J0fS-alLeC6U0VBshQ9_WjDjmS4HZzeTkhNbWoOYfnD603hc2gTmAMcXOIF-06YF69D-gi56--JWqYA42lnvnvXmPefVyhF_8k0LwhB_5qAVuIQwwLZttvh4S8CKBxEzDjm46Y6r8z0TYl_XPjmXFS_xI2E7NiTIU0GshppAXbtC5f4Ep75lilbj8Oiykjq_gKWh4Wqgrv_oi3ZUg6qgVJzRizMewoa_-YUNkXRHES",
  },
];

export default function BookDetailPage() {
  const book = MOCK_BOOK;
  const relatedBooks = MOCK_RELATED_BOOKS;

  const breadcrumbItems = [
    { label: "Catalog", href: "/" },
    { label: "Computer Science", href: "/" },
    { label: book.title },
  ];

  return (
    <div className="pb-12 px-4 md:px-6 max-w-[1440px] mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12">
        {/* Left Column: Book Cover & Actions */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <BookCover book={book} />
        </div>

        {/* Middle Column: Metadata & Details */}
        <div className="col-span-1 md:col-span-8 lg:col-span-6">
          <BookInfo book={book} />
        </div>

        {/* Right Column: AI Chatbot */}
        <div className="col-span-1 md:col-span-12 lg:col-span-3">
          <AIChatbot bookTitle={book.title} />
        </div>
      </div>

      {/* Related Books Section */}
      <RelatedBooks books={relatedBooks} />
    </div>
  );
}
