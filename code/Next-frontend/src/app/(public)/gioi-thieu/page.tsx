import type { Metadata } from "next";
import { MaterialIcon } from "@/components/base/material-icon";

import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
  title: UI_TEXT.ABOUT.PAGE_TITLE,
  description: UI_TEXT.ABOUT.PAGE_DESC,
};

export default function AboutPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative min-h-[614px] flex items-center justify-center overflow-hidden py-12">
        {/* Background Image with AI motif */}
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNP4hklh_rinbMp9WL8REWQKC92gV0-GlVBx0BMJAL6MayCEsxzl1mO-pq5-nyqR4GjHDJlpSViYN3WcASlc_UwPrUMM6OAa1ohUvrM_Br5epGq8dwY8wF_yd9ZvCu6-Z5nLfDyN1yecj7VEOvfaYkqF-2w-BiBWgJcflSPA2C9FSzRVNfiLrZ4wJySkrNjoNZSeHMmX_8LNiyWQ-HP_3_kEQ8AnlCGdWzIZOsDESp_YB_SEUujo2G_tJzLPArVZA0AOWbCUZGJFbf')",
            }}
            role="img"
            aria-label={UI_TEXT.ABOUT.ARIA_HERO}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background dark:from-slate-950/80 dark:via-slate-950/60 dark:to-slate-950 transition-colors duration-200" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center">
          <h1 className="mb-4 text-5xl font-bold leading-[56px] tracking-[-0.02em] text-primary dark:text-white transition-colors duration-200">
            {UI_TEXT.ABOUT.HERO_HEADING}
          </h1>
          <p className="mx-auto mb-6 max-w-3xl text-xl font-semibold leading-7 text-on-surface-variant dark:text-white transition-colors duration-200">
            {UI_TEXT.ABOUT.HERO_DESC_1}
          </p>
          <button
            className="ai-glow mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-700 to-secondary-300 px-12 py-4 text-xl font-semibold leading-7 text-on-primary shadow-lg transition-opacity hover:opacity-90 active:scale-95"
            type="button"
          >
            <span>{UI_TEXT.ABOUT.EXPLORE_VISION}</span>
            <MaterialIcon name="arrow_forward" className="text-sm" />
          </button>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-surface-container-low dark:bg-slate-900 py-12 transition-colors duration-200">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-6 md:flex-row">
          <div className="order-2 flex-1 md:order-1">
            <div
              className="aspect-video w-full rounded-lg bg-cover bg-center shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:opacity-80 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYfB9DiX-0NNMfrZ7SBvnOXX6ZAOwZXraYCf_EEW-jFgHo-_bVwnqK080G8g6XEvJ8Ytrq5u2DU5lErTTQilc-x2bMrYj65zQqNTPYh1Dta2stVIZNlODWAhvsfewlJtf1HftRExfq9-tnFXukW-6EX7EldmVUbis89SI-UeoPMnDSFbcjf8lVnI50ub7E3vXykNHkdD9BvF1WvCkT6KxibfMDmbggdbnVH9Yj_jBR7rWkfocHO2LEreJx0K5r_QimIsm7ObIEJCfq')",
              }}
              role="img"
              aria-label={UI_TEXT.ABOUT.ARIA_STORY}
            />
          </div>
          <div className="order-1 flex-1 md:order-2">
            <h2 className="mb-4 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary dark:text-white transition-colors duration-200">
              {UI_TEXT.ABOUT.STORY_HEADING}
            </h2>
            <p className="mb-4 text-base leading-6 text-on-surface-variant dark:text-white transition-colors duration-200">
              {UI_TEXT.ABOUT.STORY_DESC_1}
            </p>
            <p className="text-base leading-6 text-on-surface-variant dark:text-white transition-colors duration-200">
              {UI_TEXT.ABOUT.STORY_DESC_2}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary dark:text-white transition-colors duration-200">
              {UI_TEXT.ABOUT.CORE_VALUES.HEADING}
            </h2>
            <p className="text-base leading-6 text-on-surface-variant dark:text-white transition-colors duration-200">
              {UI_TEXT.ABOUT.CORE_VALUES.SUBHEADING}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Value 1 - Innovation */}
            <div className="flex flex-col items-start rounded-lg border border-outline-variant/20 dark:border-slate-800 bg-surface dark:bg-slate-900 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] md:translate-y-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-primary-container text-on-primary-container dark:bg-primary-900/50 dark:text-primary-100">
                <MaterialIcon
                  name="lightbulb"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold leading-7 text-on-surface dark:text-white transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V1_TITLE}
              </h3>
              <p className="text-sm leading-5 text-on-surface-variant dark:text-white/80 transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V1_DESC}
              </p>
            </div>

            {/* Value 2 - Accessibility */}
            <div className="flex flex-col items-start rounded-lg border border-outline-variant/20 dark:border-slate-800 bg-surface dark:bg-slate-900 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] md:translate-y-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-secondary-container text-on-secondary-container dark:bg-secondary-500/20 dark:text-secondary-100">
                <MaterialIcon
                  name="public"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold leading-7 text-on-surface dark:text-white transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V2_TITLE}
              </h3>
              <p className="text-sm leading-5 text-on-surface-variant dark:text-white/80 transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V2_DESC}
              </p>
            </div>

            {/* Value 3 - Integrity */}
            <div className="flex flex-col items-start rounded-lg border border-outline-variant/20 dark:border-slate-800 bg-surface dark:bg-slate-900 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] md:translate-y-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-tertiary-container text-on-tertiary-container dark:bg-tertiary-500/20 dark:text-tertiary-100">
                <MaterialIcon
                  name="verified_user"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                />
              </div>
              <h3 className="mb-1 text-xl font-semibold leading-7 text-on-surface dark:text-white transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V3_TITLE}
              </h3>
              <p className="text-sm leading-5 text-on-surface-variant dark:text-white/80 transition-colors duration-200">
                {UI_TEXT.ABOUT.CORE_VALUES.V3_DESC}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
