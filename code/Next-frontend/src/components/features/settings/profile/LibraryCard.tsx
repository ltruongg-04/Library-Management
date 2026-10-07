"use client";
import { QRCodeSVG } from "qrcode.react";
import { BaseButton } from "@/components/base/base-button";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useAuth } from "@/providers/auth";

export default function LibraryCard() {
    const { user } = useAuth();
    if (!user) return null;

    // Simulate a library card number based on user ID or email
    const cardNumber = `LIB-${new Date().getFullYear()}-${user.id ? user.id.toString().padStart(5, "0") : "00000"}`;

    const handleDownload = () => {
        const svg = document.getElementById("library-card-qr");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `LibraryCard_${cardNumber}.png`;
                    downloadLink.href = `${pngFile}`;
                    downloadLink.click();
                }
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }
    };

    return (
        <div className="mt-8 rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-primary dark:text-white">
                <MaterialIcon name="badge" className="text-secondary dark:text-white" />
                {UI_TEXT.RECENT.TEXT_180}
            </h2>
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <p className="text-body-md text-on-surface-variant dark:text-slate-400">{UI_TEXT.RECENT.TEXT_179}</p>
                    <div className="space-y-1">
                        <p className="font-mono text-sm uppercase tracking-wider text-outline dark:text-slate-500">{UI_TEXT.RECENT.TEXT_178}</p>
                        <p className="text-xl font-bold text-on-surface dark:text-white">{cardNumber}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-mono text-sm uppercase tracking-wider text-outline dark:text-slate-500">{UI_TEXT.RECENT.TEXT_177}</p>
                        <p className="text-lg font-medium text-on-surface dark:text-white">{user.fullName}</p>
                    </div>
                    <div className="pt-4">
                        <BaseButton onClick={handleDownload} variant="outline" className="w-full dark:border-slate-700 dark:text-white md:w-auto">
                            <MaterialIcon name="download" className="mr-2 text-sm" />
                            {UI_TEXT.RECENT.TEXT_176}
                        </BaseButton>
                    </div>
                </div>
                <div className="flex flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <QRCodeSVG id="library-card-qr" value={cardNumber} size={160} bgColor={"#ffffff"} fgColor={"#0f172a"} level={"H"} includeMargin={false} />
                    <p className="mt-3 text-xs text-gray-500">Lumina Library</p>
                </div>
            </div>
        </div>
    );
}
