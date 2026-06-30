import { UI_TEXT } from "@/constants/ui-text";

export default function SecurityPolicy() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
                <span className="material-symbols-outlined rounded-lg bg-blue-100 p-2 text-blue-600">
                    {UI_TEXT.ROLES.ICON.POLICY}
                </span>

                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {UI_TEXT.ROLES.SECURITY_POLICY_TITLE}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {UI_TEXT.ROLES.SECURITY_POLICY_DESCRIPTION}
                    </p>
                </div>
            </div>
        </div>
    );
}