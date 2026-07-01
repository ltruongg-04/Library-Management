import { UI_TEXT } from "@/constants/ui-text";

interface CreateRoleButtonProps {
    onClick?: () => void;
}

export default function CreateRoleButton({ onClick }: CreateRoleButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[14px] font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container hover:shadow-lg active:scale-95"
        >
            <span className="material-symbols-outlined">{UI_TEXT.ROLES.ICON.ADD}</span>

            {UI_TEXT.ROLES.CREATE_ROLE}
        </button>
    );
}
