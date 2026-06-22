import { SVGProps } from "react";

export function ErrorIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            {...props}
        >
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    );
}
