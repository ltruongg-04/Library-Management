"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Image as ImageIcon, Loader2, RefreshCw, Upload, VideoOff, X } from "lucide-react";
import { ADMIN } from "@/constants/ui-text/admin";
import { extractIsbnFromScannedText } from "@/utils/barcode";

interface BookScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (isbn: string, rawText?: string) => void;
}

export default function BookScannerModal({ isOpen, onClose, onScanSuccess }: BookScannerModalProps) {
    const textUI = ADMIN.MODAL.SCAN_QR;
    const [activeTab, setActiveTab] = useState<"camera" | "file">("camera");
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>("");
    const [isStartingCamera, setIsStartingCamera] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null);

    const scannerRef = useRef<any>(null);
    const isScanningRef = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dừng scanner một cách an toàn
    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                if (isScanningRef.current) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Lỗi khi dừng scanner:", err);
            } finally {
                scannerRef.current = null;
                isScanningRef.current = false;
            }
        }
    };

    // Xử lý khi quét được mã thành công
    const handleSuccess = (rawDecodedText: string) => {
        if (successCode) return; // Tránh trigger nhiều lần liên tiếp
        const extracted = extractIsbnFromScannedText(rawDecodedText);
        setSuccessCode(extracted);

        // Hiệu ứng rung nhẹ trên điện thoại nếu được hỗ trợ
        if (typeof window !== "undefined" && "vibrate" in navigator) {
            try {
                navigator.vibrate(100);
            } catch {}
        }

        setTimeout(() => {
            stopScanner().then(() => {
                onScanSuccess(extracted, rawDecodedText);
            });
        }, 600);
    };

    const handleSuccessRef = useRef(handleSuccess);
    useEffect(() => {
        handleSuccessRef.current = handleSuccess;
    });

    const { CAMERA_NOT_FOUND, CAMERA_PERMISSION_DENIED } = textUI;

    // Khởi tạo camera khi mở modal và tab là 'camera'
    useEffect(() => {
        if (!isOpen || activeTab !== "camera") {
            stopScanner();
            return;
        }

        let isMounted = true;
        setIsStartingCamera(true);
        setCameraError(null);

        const initScanner = async () => {
            try {
                const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

                if (!isMounted) return;

                // Lấy danh sách camera
                const devices = await Html5Qrcode.getCameras();
                if (!devices || devices.length === 0) {
                    if (isMounted) {
                        setCameraError(CAMERA_NOT_FOUND);
                        setIsStartingCamera(false);
                    }
                    return;
                }

                if (isMounted) {
                    setCameras(devices);
                    if (!selectedCameraId) {
                        // Ưu tiên camera sau (back / environment)
                        const backCamera = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("sau"));
                        setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
                    }
                }

                // Dừng scanner cũ nếu có
                await stopScanner();
                if (!isMounted) return;

                const formatsToSupport = [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                ];

                const targetCameraId = selectedCameraId || (devices[devices.length - 1] ? devices[devices.length - 1].id : devices[0].id);
                const html5QrCode = new Html5Qrcode("book-qr-reader", {
                    formatsToSupport,
                    verbose: false,
                });
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    targetCameraId,
                    {
                        fps: 12,
                        qrbox: { width: 280, height: 180 },
                        aspectRatio: 1.333333,
                    },
                    (decodedText) => {
                        handleSuccessRef.current(decodedText);
                    },
                    () => {
                        // Bỏ qua lỗi từng frame nếu chưa nhận diện được
                    },
                );

                isScanningRef.current = true;
                if (isMounted) {
                    setIsStartingCamera(false);
                }
            } catch (err: any) {
                console.error("Camera scanner error:", err);
                if (isMounted) {
                    if (err?.name === "NotAllowedError" || String(err).includes("Permission denied")) {
                        setCameraError(CAMERA_PERMISSION_DENIED);
                    } else {
                        setCameraError(CAMERA_NOT_FOUND);
                    }
                    setIsStartingCamera(false);
                }
            }
        };

        initScanner();

        return () => {
            isMounted = false;
            stopScanner();
        };
    }, [isOpen, activeTab, selectedCameraId, CAMERA_NOT_FOUND, CAMERA_PERMISSION_DENIED]);

    // Xử lý đổi camera
    const handleSwitchCamera = () => {
        if (cameras.length <= 1) return;
        const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setSelectedCameraId(cameras[nextIndex].id);
    };

    // Xử lý quét qua file ảnh upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessingFile(true);
        setFileError(null);

        try {
            const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

            const formatsToSupport = [
                Html5QrcodeSupportedFormats.QR_CODE,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
            ];

            const html5QrCode = new Html5Qrcode("book-qr-file-processor", {
                formatsToSupport,
                verbose: false,
            });

            const result = await html5QrCode.scanFile(file, true);
            html5QrCode.clear();

            if (result) {
                handleSuccess(result);
            } else {
                setFileError(textUI.NO_CODE_FOUND);
            }
        } catch (err) {
            console.warn("Scan file error:", err);
            setFileError(textUI.NO_CODE_FOUND);
        } finally {
            setIsProcessingFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm duration-200">
            <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-surface-container-high px-5 py-3.5 dark:border-slate-800">
                    <div>
                        <h2 className="text-[17px] font-semibold text-ink-950 dark:text-white">{textUI.TITLE}</h2>
                        <p className="mt-0.5 text-[12.5px] text-on-surface-variant dark:text-slate-400">{textUI.SUBTITLE}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface hover:text-on-surface dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label={textUI.CLOSE}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-surface-container-high bg-surface px-5 pt-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("camera");
                            setSuccessCode(null);
                        }}
                        className={`flex items-center gap-2 border-b-2 px-4 pb-2.5 text-[13.5px] font-semibold transition-colors ${
                            activeTab === "camera"
                                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300"
                                : "border-transparent text-on-surface-variant hover:text-ink-950 dark:text-slate-400 dark:hover:text-white"
                        }`}
                    >
                        <Camera size={16} />
                        {textUI.CAMERA_TAB}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("file");
                            setSuccessCode(null);
                        }}
                        className={`flex items-center gap-2 border-b-2 px-4 pb-2.5 text-[13.5px] font-semibold transition-colors ${
                            activeTab === "file"
                                ? "border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300"
                                : "border-transparent text-on-surface-variant hover:text-ink-950 dark:text-slate-400 dark:hover:text-white"
                        }`}
                    >
                        <ImageIcon size={16} />
                        {textUI.FILE_TAB}
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5">
                    {/* Thành công */}
                    {successCode && (
                        <div className="dark:bg-success-950/30 mb-4 flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 p-3 text-success-800 dark:border-success-900/50 dark:text-success-300">
                            <CheckCircle2 size={20} className="shrink-0 text-success-600 dark:text-success-400" />
                            <div>
                                <p className="text-[13px] font-semibold">{textUI.SCAN_SUCCESS}</p>
                                <p className="font-mono text-[14px] font-bold tracking-wider">{successCode}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "camera" ? (
                        <div className="flex flex-col items-center">
                            {/* Khung Camera */}
                            <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border-2 border-slate-700 bg-black shadow-inner">
                                <div id="book-qr-reader" className="h-full w-full overflow-hidden [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />

                                {/* Lớp phủ Laser Animation khi đang quét */}
                                {!isStartingCamera && !cameraError && !successCode && (
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
                                        {/* Khung ngắm */}
                                        <div className="relative h-44 w-64 rounded-lg border-2 border-emerald-400/80 bg-emerald-500/5 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                            {/* 4 Góc định vị */}
                                            <div className="absolute -left-1 -top-1 h-4 w-4 border-l-4 border-t-4 border-emerald-400" />
                                            <div className="absolute -right-1 -top-1 h-4 w-4 border-r-4 border-t-4 border-emerald-400" />
                                            <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-emerald-400" />
                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-emerald-400" />

                                            {/* Tia quét Laser */}
                                            <div className="absolute inset-x-0 h-0.5 animate-bounce bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399]" />
                                        </div>
                                    </div>
                                )}

                                {/* Trạng thái đang khởi động */}
                                {isStartingCamera && !cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white">
                                        <Loader2 size={32} className="text-primary-400 animate-spin" />
                                        <p className="mt-3 text-[13px] text-slate-300">{textUI.CAMERA_STARTING}</p>
                                    </div>
                                )}

                                {/* Lỗi Camera */}
                                {cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-6 text-center text-white">
                                        <VideoOff size={36} className="text-rose-400" />
                                        <p className="mt-3 text-[13px] text-rose-200">{cameraError}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCameraError(null);
                                                setIsStartingCamera(true);
                                                setSelectedCameraId((prev) => prev);
                                            }}
                                            className="mt-4 flex items-center gap-1.5 rounded-lg bg-surface px-4 py-2 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-surface-container-high dark:bg-slate-800 dark:text-white"
                                        >
                                            <RefreshCw size={14} />
                                            {textUI.RETRY}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Hướng dẫn & Đổi Camera */}
                            <div className="mt-3 flex w-full items-center justify-between text-[12.5px] text-on-surface-variant dark:text-slate-400">
                                <span>{textUI.SCAN_HINT}</span>
                                {cameras.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleSwitchCamera}
                                        className="dark:text-primary-400 flex items-center gap-1 font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:hover:text-primary-300"
                                    >
                                        <RefreshCw size={13} />
                                        {textUI.CHANGE_CAMERA}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Tab Tải ảnh lên */
                        <div className="flex flex-col items-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            {/* Ẩn div hỗ trợ scanFile của Html5Qrcode */}
                            <div id="book-qr-file-processor" className="hidden" />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file && fileInputRef.current) {
                                        const dt = new DataTransfer();
                                        dt.items.add(file);
                                        fileInputRef.current.files = dt.files;
                                        handleFileUpload({ target: fileInputRef.current } as any);
                                    }
                                }}
                                className="dark:hover:border-primary-400 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-container-high bg-surface/50 p-8 text-center transition-colors hover:border-primary-500 hover:bg-primary-50/20 dark:border-slate-800 dark:bg-slate-800/30"
                            >
                                <div className="text-primary-600 dark:text-primary-400 mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                                    {isProcessingFile ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                </div>
                                <h3 className="text-[15px] font-semibold text-ink-950 dark:text-white">
                                    {isProcessingFile ? textUI.PROCESSING_IMAGE : textUI.FILE_UPLOAD_TITLE}
                                </h3>
                                <p className="mt-1 text-[13px] text-on-surface-variant dark:text-slate-400">{textUI.FILE_UPLOAD_DESC}</p>
                                <button
                                    type="button"
                                    disabled={isProcessingFile}
                                    className="mt-4 rounded-lg border border-surface-container-high bg-white px-4 py-2 text-[13px] font-semibold text-ink-950 shadow-sm transition-colors hover:bg-surface-container-lowest dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                                >
                                    {textUI.FILE_SELECT_BTN}
                                </button>
                            </div>

                            {fileError && <div className="mt-3 text-center text-[13px] font-medium text-error">{fileError}</div>}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-end border-t border-surface-container-high bg-surface px-5 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-surface-container-high bg-white px-4 py-2 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-surface-container-lowest dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                    >
                        {textUI.CLOSE}
                    </button>
                </div>
            </div>
        </div>
    );
}
