"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock3, CreditCard, Globe2, Landmark, Save, Settings, ToggleRight, WalletCards } from "lucide-react";
import { SuccessModal } from "@/components/base/success-modal";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { ConfirmDiscardModal, FeatureToggle, GatewayRow, PolicyField, SectionCard, SelectField } from "@/components/features/admin/settings/SettingsControls";
import {
    type AdminSettingsState,
    DEFAULT_SETTINGS,
    SETTINGS,
    STORAGE_KEY,
    borrowingFields,
    featureItems,
    languageOptions,
    readSavedSettings,
    timezoneOptions,
} from "@/constants/admin/settings";
import { UI_TEXT } from "@/constants/ui-text";

export default function CaiDatPage() {
    const [adminSettings, setAdminSettings] = useState(DEFAULT_SETTINGS);
    const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    useEffect(() => {
        const loaded = readSavedSettings();
        setAdminSettings(loaded);
        setSavedSettings(loaded);
    }, []);

    const hasChanges = JSON.stringify(adminSettings) !== JSON.stringify(savedSettings);

    const updateBorrowing = (key: keyof AdminSettingsState["borrowing"], value: string) => {
        setAdminSettings((current) => ({
            ...current,
            borrowing: {
                ...current.borrowing,
                [key]: value,
            },
        }));
    };

    const updateFeature = (key: keyof AdminSettingsState["features"], value: boolean) => {
        setAdminSettings((current) => ({
            ...current,
            features: {
                ...current.features,
                [key]: value,
            },
        }));
    };

    const updateLocalization = (key: keyof AdminSettingsState["localization"], value: string) => {
        setAdminSettings((current) => ({
            ...current,
            localization: {
                ...current.localization,
                [key]: value,
            },
        }));
    };

    const handleSave = () => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(adminSettings));
        setSavedSettings(adminSettings);
        setShowSuccessModal(true);
        window.setTimeout(() => setShowSuccessModal(false), 3000);
    };

    const confirmDiscard = () => {
        setAdminSettings(savedSettings);
        setShowDiscardModal(false);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface pb-28 text-on-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_SETTINGS} />
            </div>

            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <Settings size={24} className="text-primary-600" />
                        {SETTINGS.PAGE_TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{SETTINGS.PAGE_DESCRIPTION}</p>
                </div>
            </div>

            <main className="flex-1 overflow-auto p-8">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-lg xl:grid-cols-12 xl:gap-xl">
                    <div className="xl:col-span-7">
                        <SectionCard icon={BookOpen} title={SETTINGS.BORROWING.TITLE}>
                            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                                {borrowingFields.map((field) => (
                                    <PolicyField
                                        key={field.key}
                                        label={field.label}
                                        value={adminSettings.borrowing[field.key]}
                                        suffix={field.suffix}
                                        onChange={(value) => updateBorrowing(field.key, value)}
                                    />
                                ))}
                                <div className="md:col-span-2">
                                    <div className="max-w-sm">
                                        <PolicyField
                                            label={SETTINGS.BORROWING.MAX_RENEWALS}
                                            value={adminSettings.borrowing.maxRenewals}
                                            onChange={(value) => updateBorrowing("maxRenewals", value)}
                                        />
                                    </div>
                                    <p className="mt-xs text-[13px] leading-5 text-on-surface-variant">* {SETTINGS.BORROWING.RENEWALS_HELP}</p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    <div className="xl:col-span-5">
                        <SectionCard icon={ToggleRight} title={SETTINGS.FEATURES.TITLE}>
                            <div className="flex flex-col gap-lg">
                                {featureItems.map((item, index) => (
                                    <FeatureToggle
                                        key={item.title}
                                        id={`feature-toggle-${index}`}
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        checked={adminSettings.features[item.key]}
                                        onChange={(checked) => updateFeature(item.key, checked)}
                                    />
                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    <div className="xl:col-span-7">
                        <SectionCard icon={WalletCards} title={SETTINGS.PAYMENTS.TITLE}>
                            <div className="flex flex-col gap-md">
                                <GatewayRow
                                    icon={Landmark}
                                    name={SETTINGS.PAYMENTS.MOMO_NAME}
                                    description={SETTINGS.PAYMENTS.MOMO_DESC}
                                    note={SETTINGS.PAYMENTS.MOMO_NOTE}
                                    token={SETTINGS.PAYMENTS.MOMO_TOKEN}
                                    active
                                />
                                <GatewayRow
                                    icon={CreditCard}
                                    name={SETTINGS.PAYMENTS.VNPAY_NAME}
                                    description={SETTINGS.PAYMENTS.VNPAY_DESC}
                                    note={SETTINGS.PAYMENTS.VNPAY_NOTE}
                                    token={SETTINGS.PAYMENTS.VNPAY_TOKEN}
                                    active={false}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
                        <SectionCard icon={Globe2} title={SETTINGS.LOCALIZATION.LANGUAGE}>
                            <SelectField
                                label=""
                                value={adminSettings.localization.language}
                                onChange={(value) => updateLocalization("language", value)}
                                options={languageOptions}
                            />
                        </SectionCard>

                        <SectionCard icon={Clock3} title={SETTINGS.LOCALIZATION.WORLD_CLOCK}>
                            <SelectField
                                label=""
                                value={adminSettings.localization.timezone}
                                onChange={(value) => updateLocalization("timezone", value)}
                                options={timezoneOptions}
                            />
                        </SectionCard>
                    </div>
                </div>
            </main>

            {hasChanges && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-container-high bg-white px-8 py-4 shadow-lg">
                    <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-md">
                        <p className="text-body-sm text-on-surface-variant">{SETTINGS.ACTION_BAR.WARNING}</p>
                        <div className="flex gap-sm">
                            <button
                                type="button"
                                onClick={() => setShowDiscardModal(true)}
                                className="focus-ring h-10 rounded-lg border border-outline px-md text-body-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                            >
                                {SETTINGS.ACTION_BAR.DISCARD}
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="focus-ring flex h-10 items-center gap-sm rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
                            >
                                <Save size={16} />
                                {SETTINGS.ACTION_BAR.SAVE}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal isOpen={showSuccessModal} message={SETTINGS.ACTION_BAR.SUCCESS} onClose={() => setShowSuccessModal(false)} />

            <ConfirmDiscardModal isOpen={showDiscardModal} onClose={() => setShowDiscardModal(false)} onConfirm={confirmDiscard} />
        </div>
    );
}
