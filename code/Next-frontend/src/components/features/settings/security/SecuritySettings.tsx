"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { KeyRound, Laptop, Monitor, Smartphone } from "lucide-react";
import { SuccessModal } from "@/components/base/success-modal";
import { UI_TEXT } from "@/constants/ui-text";

const securityText = UI_TEXT.SETTINGS_SECURITY.PAGE;
const TWO_FACTOR_STORAGE_KEY = "lumina_security_two_factor_enabled";
const MIN_PASSWORD_LENGTH = 8;

const passwordInputClass =
  "h-12 w-full rounded-lg border border-outline-variant/50 bg-surface px-md text-sm text-on-surface outline-none transition placeholder:text-outline focus:border-primary-700 focus:ring-1 focus:ring-primary-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-secondary-300 dark:focus:ring-secondary-300";
const passwordLabelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant dark:text-white";
const passwordHintClass = "mt-2 text-xs font-medium";

const initialSessions = [
  {
    id: 1,
    title: securityText.SESSIONS.MACBOOK_TITLE,
    subtitle: securityText.SESSIONS.MACBOOK_SUBTITLE,
    state: securityText.ACTIVE_NOW,
    icon: Laptop,
    active: true,
  },
  {
    id: 2,
    title: securityText.SESSIONS.IPHONE_TITLE,
    subtitle: securityText.SESSIONS.IPHONE_SUBTITLE,
    icon: Smartphone,
    active: false,
  },
  {
    id: 3,
    title: securityText.SESSIONS.WINDOWS_TITLE,
    subtitle: securityText.SESSIONS.WINDOWS_SUBTITLE,
    icon: Monitor,
    active: false,
  },
];

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [sessions, setSessions] = useState(initialSessions);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const hasCurrentPassword = passwordForm.currentPassword.trim().length > 0;
  const hasNewPassword = passwordForm.newPassword.length > 0;
  const hasConfirmPassword = passwordForm.confirmPassword.length > 0;
  const isNewPasswordEligible =
    passwordForm.newPassword.trim().length >= MIN_PASSWORD_LENGTH;
  const isConfirmPasswordMatched =
    hasConfirmPassword && passwordForm.confirmPassword === passwordForm.newPassword;
  const isPasswordFormValid =
    hasCurrentPassword && isNewPasswordEligible && isConfirmPasswordMatched;
  const hasSessions = sessions.length > 0;

  useEffect(() => {
    setTwoFactorEnabled(localStorage.getItem(TWO_FACTOR_STORAGE_KEY) === "true");
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleTwoFactorChange = () => {
    const nextValue = !twoFactorEnabled;
    setTwoFactorEnabled(nextValue);
    localStorage.setItem(TWO_FACTOR_STORAGE_KEY, String(nextValue));
    showSuccess(
      nextValue
        ? securityText.SUCCESS_MESSAGES.TWO_FACTOR_ENABLED
        : securityText.SUCCESS_MESSAGES.TWO_FACTOR_DISABLED,
    );
  };

  const handlePasswordChange =
    (field: keyof typeof passwordForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
  };

  const handleUpdatePassword = () => {
    if (!isPasswordFormValid) return;

    showSuccess(securityText.SUCCESS_MESSAGES.PASSWORD_UPDATED);
  };

  const handleLogoutAll = () => {
    if (!hasSessions) return;

    setSessions([]);
    showSuccess(securityText.SUCCESS_MESSAGES.LOGGED_OUT_ALL);
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-ink-200 bg-white p-xl shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-xl border-b border-ink-200 pb-xl dark:border-slate-800">
        <div className="max-w-[760px]">
          <h1 className="mb-2 text-3xl font-bold text-ink-950 dark:text-white">
            {securityText.HEADING}
          </h1>
          <p className="max-w-2xl font-body-md text-body-md text-ink-600 dark:text-slate-400">
            {securityText.SUBHEADING}
          </p>
        </div>
      </header>

      <div className="space-y-xl">
        <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
          <div className="flex items-center gap-md">
            <KeyRound
              size={22}
              strokeWidth={2}
              className="text-ink-950 dark:text-white"
            />
            <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">
              {securityText.CHANGE_PASSWORD}
            </h2>
          </div>

          <form className="mt-7 max-w-[760px] space-y-6">
            <div>
              <label className={passwordLabelClass}>
                {securityText.CURRENT_PASSWORD_LABEL}
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange("currentPassword")}
                placeholder={securityText.CURRENT_PASSWORD_PLACEHOLDER}
                className={passwordInputClass}
              />
            </div>

            <div className="grid gap-md md:grid-cols-2">
              <div>
                <label className={passwordLabelClass}>
                  {securityText.NEW_PASSWORD_LABEL}
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange("newPassword")}
                  placeholder={securityText.NEW_PASSWORD_PLACEHOLDER}
                  className={passwordInputClass}
                />
                {hasNewPassword && (
                  <p
                    className={`${passwordHintClass} ${
                      isNewPasswordEligible
                        ? "text-moss-700 dark:text-moss-300"
                        : "text-error-500 dark:text-error-300"
                    }`}
                  >
                    *{" "}
                    {isNewPasswordEligible
                      ? securityText.PASSWORD_ELIGIBLE
                      : securityText.PASSWORD_INELIGIBLE}
                  </p>
                )}
              </div>
              <div>
                <label className={passwordLabelClass}>
                  {securityText.CONFIRM_NEW_LABEL}
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange("confirmPassword")}
                  placeholder={securityText.CONFIRM_NEW_PLACEHOLDER}
                  className={passwordInputClass}
                />
                {hasConfirmPassword && (
                  <p
                    className={`${passwordHintClass} ${
                      isConfirmPasswordMatched
                        ? "text-moss-700 dark:text-moss-300"
                        : "text-error-500 dark:text-error-300"
                    }`}
                  >
                    *{" "}
                    {isConfirmPasswordMatched
                      ? securityText.PASSWORD_MATCH
                      : securityText.PASSWORD_MISMATCH}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!isPasswordFormValid}
                onClick={handleUpdatePassword}
                className="h-12 w-full rounded-lg bg-primary-700 px-6 text-body-md font-semibold text-on-primary shadow-sm transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-outline disabled:shadow-none disabled:hover:bg-surface-container-high dark:bg-primary-500 dark:hover:bg-primary-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 dark:focus-visible:ring-secondary-300 dark:focus-visible:ring-offset-slate-900 sm:w-[220px]"
              >
                {securityText.UPDATE_PASSWORD_BTN}
              </button>
            </div>
          </form>
        </section>

        <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
          <div className="flex items-start justify-between gap-lg">
            <div className="flex max-w-[720px] gap-md">
              <Smartphone
              size={22}
              strokeWidth={2}
                className="mt-1 shrink-0 text-ink-950 dark:text-white"
              />
              <div>
                <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">
                  {securityText.TWO_FACTOR_TITLE}
                </h2>
                <p className="mt-1 font-body-md text-body-md text-ink-600 dark:text-slate-400">
                  {securityText.TWO_FACTOR_DESC}
                </p>
                <div className="mt-4 inline-flex items-center gap-sm rounded-full bg-surface-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant dark:bg-slate-800 dark:text-slate-300">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      twoFactorEnabled
                        ? "bg-primary dark:bg-primary-500"
                      : "bg-outline dark:bg-slate-500"
                    }`}
                  />
                  {twoFactorEnabled
                    ? securityText.TWO_FACTOR_ENABLED
                    : securityText.TWO_FACTOR_DISABLED}
                </div>
              </div>
            </div>

            <label className="relative mt-2 inline-flex shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleTwoFactorChange}
                className="peer sr-only"
              />
              <span className="h-6 w-11 rounded-full bg-surface-variant transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:bg-slate-700 dark:peer-checked:bg-primary-500 dark:peer-focus-visible:ring-offset-slate-900" />
              <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full border border-outline-variant bg-white transition peer-checked:translate-x-full dark:border-slate-500" />
            </label>
          </div>
        </section>

        <section>
          <div className="mb-7 flex items-center justify-between gap-3">
            <div className="flex items-center gap-md">
              <Monitor
                size={22}
                strokeWidth={2}
                className="text-ink-950 dark:text-white"
              />
              <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">
                {securityText.LOGIN_ACTIVITY}
              </h2>
            </div>
            <button
              type="button"
              disabled={!hasSessions}
              onClick={handleLogoutAll}
              className="font-label-caps text-label-caps font-semibold uppercase text-primary transition hover:text-primary-500 disabled:cursor-not-allowed disabled:text-outline dark:text-primary-300 dark:hover:text-primary-100 dark:disabled:text-slate-500"
            >
              {securityText.LOG_OUT_ALL_BTN}
            </button>
          </div>

          {hasSessions ? (
            <div className="grid gap-md md:grid-cols-2">
              {sessions.map((session) => {
                const DeviceIcon = session.icon;

                return (
                  <div
                    key={session.id}
                    className="flex min-h-[92px] items-start gap-md rounded-xl border border-outline-variant/30 bg-surface p-md transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <DeviceIcon
                      size={22}
                      strokeWidth={2}
                      className={`mt-1 shrink-0 ${
                        session.active
                          ? "text-primary dark:text-primary-300"
                          : "text-outline dark:text-slate-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <h3 className="text-body-md font-semibold text-on-surface dark:text-white">
                          {session.title}
                        </h3>
                        {session.active && (
                          <span className="font-label-caps text-label-caps font-semibold text-primary dark:text-primary-300">
                            {session.state}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-body-sm text-on-surface-variant dark:text-slate-300">
                        {session.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ink-200 bg-surface p-md text-body-sm text-ink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {securityText.EMPTY_SESSIONS}
            </div>
          )}
        </section>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
}
