'use client';

import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id?: string;
}

export function Toggle({ checked, onChange, id }: ToggleProps) {
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer" onClick={(e) => {
            // Prevent event bubbling issues
            e.stopPropagation();
        }}>
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div
                    className={`block w-10 h-6 rounded-full transition-colors duration-300 ${
                        checked ? 'bg-primary' : 'bg-surface-variant'
                    }`}
                ></div>
                <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                        checked ? 'translate-x-full' : ''
                    }`}
                ></div>
            </div>
        </label>
    );
}
