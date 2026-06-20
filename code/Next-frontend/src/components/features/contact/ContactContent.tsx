"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "faq-ai-search",
    question: "Làm thế nào để mượn sách từ thư viện?",
    answer:
      "Bạn chỉ cần vào danh mục, tìm kiếm sách, chọn sách muốn mượn và chờ nhân viên thư viện xử lý. Nếu bạn mượn trực tuyến, bạn có thể nhận sách tại quầy hoặc yêu cầu giao sách đến tận nơi.",
  },
  {
    id: "faq-api-access",
    question: "Tôi có thể mượn sách dễ dàng không?",
    answer:
      "Có, Lumina Library cho phép mượn sách dễ dàng thông qua website hoặc mượn trực tiếp từ thư viện",
  },
  {
    id: "faq-library-hours",
    question: "Giờ hoạt động của thư viện là bao nhiêu?",
    answer:
      "Các phòng đọc tại thư viện mở cửa từ Thứ Hai đến Thứ Sáu, 8:00 sáng đến 9:00 tối. Truy cập cuối tuần được giới hạn cho các nghiên cứu sinh cao cấp theo lịch hẹn. Danh mục kỹ thuật số hoạt động 24/7.",
  },
];

export default function ContactContent() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-grow space-y-12 px-4 py-12 md:px-6">
      {/* Header Section */}
      <header className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
        <h1 className="text-5xl font-bold leading-[56px] tracking-[-0.02em] text-primary">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-base leading-6 text-on-surface-variant">
          Bạn có câu hỏi về bộ sưu tập, khả năng tìm kiếm AI, hoặc truy cập tổ
          chức? Đội ngũ tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>
      </header>

      {/* Bento Grid Layout for Contact & Details */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Contact Form Area (Main Focus) */}
        <section className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:p-12 lg:col-span-7 xl:col-span-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold leading-7 text-primary">
            <span className="material-symbols-outlined text-secondary">
              mail
            </span>
            Gửi tin nhắn
          </h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label
                  className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant"
                  htmlFor="contact-name"
                >
                  Họ và tên
                </label>
                <input
                  className="w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                  id="contact-name"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  type="text"
                />
              </div>
              <div className="space-y-1">
                <label
                  className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant"
                  htmlFor="contact-email"
                >
                  Địa chỉ Email
                </label>
                <input
                  className="w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                  id="contact-email"
                  name="email"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label
                className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant"
                htmlFor="contact-subject"
              >
                Chủ đề
              </label>
              <select
                className="w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                id="contact-subject"
                name="subject"
              >
                <option value="">Chọn loại yêu cầu...</option>
                <option value="access">Truy cập Tổ chức</option>
                <option value="support">
                  Hỗ trợ Kỹ thuật (Tìm kiếm AI)
                </option>
                <option value="collection">Đề xuất Bộ sưu tập</option>
                <option value="other">Yêu cầu khác</option>
              </select>
            </div>
            <div className="space-y-1">
              <label
                className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant"
                htmlFor="contact-message"
              >
                Nội dung
              </label>
              <textarea
                className="w-full resize-none rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary"
                id="contact-message"
                name="message"
                placeholder="Chúng tôi có thể hỗ trợ bạn điều gì?"
                rows={5}
              />
            </div>
            <div className="pt-2">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-12 py-4 text-xl font-semibold leading-7 text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-container hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] md:w-auto"
                type="submit"
              >
                Gửi yêu cầu
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </form>
        </section>

        {/* Sidebar: Details & Map */}
        <aside className="flex h-full flex-col space-y-6 lg:col-span-5 xl:col-span-4">
          {/* Contact Information Card */}
          <div className="flex-grow rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 space-y-4">
            <h3 className="border-b border-outline-variant/30 pb-2 text-xl font-semibold leading-7 text-primary">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-4 pt-2">
              <li className="group flex items-start gap-4">
                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container">
                  <span className="material-symbols-outlined">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant">
                    Địa chỉ
                  </p>
                  <p className="text-base font-medium leading-6 text-on-surface">
                    Lumina Campus
                    <br />
                    404 Knowledge Parkway
                    <br />
                    Innovation District, CA 90210
                  </p>
                </div>
              </li>
              <li className="group flex items-start gap-4">
                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant">
                    Hỗ trợ chung
                  </p>
                  <p className="text-base font-medium leading-6 text-on-surface">
                    +1 (800) 555-0199
                  </p>
                </div>
              </li>
              <li className="group flex items-start gap-4">
                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container">
                  <span className="material-symbols-outlined">
                    alternate_email
                  </span>
                </div>
                <div>
                  <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant">
                    Email
                  </p>
                  <p className="text-base font-medium leading-6 text-on-surface">
                    research@luminalibrary.edu
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Component (Visual anchor) */}
          <div className="map-container relative h-64 w-full overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-variant">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYrrGABKWhsjlUQauZaA0B8xhhhlC-of7fsx3WYu8Qwpd6TCoS4Mp5bTfyGg96hI4woPHNS6KFIUC9Uiz7tSapcmFiuiydfU2Ytv2-L8vpshtr9sII7xxlGIQmFnsajRRfe6Om53yyXzgdKb2ofWqUIwhrmjbbrmVe8jzRo8SDX73ZkrTqLrrDF2JxINNA3qATvpnyPYE_Jq76Ywo0Wub_e8dXXti2Mp6ZEXv4AK01jU5quZmX3DS55IL9AzVxlfRBrfEIx4wMTN7L"
              alt="Bản đồ vị trí Lumina Campus"
            />
            <div className="map-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
            <div className="absolute bottom-4 left-4 right-4">
              <button
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-2 text-xl font-semibold leading-7 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">
                  directions
                </span>
                Chỉ đường
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl pt-12">
        <div className="mb-6 text-center">
          <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-2 text-base leading-6 text-on-surface-variant">
            Giải đáp nhanh các thắc mắc phổ biến.
          </p>
        </div>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-surface-variant bg-surface-container-lowest"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-surface-container-low"
                onClick={() => toggleAccordion(item.id)}
                type="button"
                aria-expanded={activeAccordion === item.id}
                aria-controls={`${item.id}-content`}
              >
                <span className="text-xl font-semibold leading-7 text-on-surface">
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined text-secondary transition-transform duration-300 ${
                    activeAccordion === item.id ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              <div
                id={`${item.id}-content`}
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  activeAccordion === item.id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                role="region"
                aria-labelledby={item.id}
              >
                <div className="border-t border-surface-variant bg-background px-6 pb-4 pt-2 text-base leading-6 text-on-surface-variant">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
