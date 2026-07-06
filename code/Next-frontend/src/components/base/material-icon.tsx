import { HTMLAttributes } from "react";

interface MaterialIconProps extends HTMLAttributes<HTMLSpanElement> {
    name: string;
    filled?: boolean;
}

export function MaterialIcon({ name, filled = false, className = "", style, ...props }: MaterialIconProps) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{
                fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                ...style,
            }}
            {...props}
        >
            {name}
        </span>
    );
}
