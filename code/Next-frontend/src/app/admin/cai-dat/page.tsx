import { UI_TEXT } from "@/constants/ui-text";

export default function CaiDatPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-ink-950">{UI_TEXT.ADMIN_PAGES.SETTINGS.TITLE}</h1>
      <p className="mt-4 text-ink-950/70">
        {UI_TEXT.ADMIN_PAGES.SETTINGS.DESC}
      </p>
    </div>
  );
}
