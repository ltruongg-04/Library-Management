import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { INITIAL_VISIT_FORM_STATE } from "@/constants/book-visit";
import { submitBookVisit } from "@/services/bookVisit";
import type { SubmitStatus, VisitFormState } from "@/types/book-visit";

type UseBookVisitFormParams = {
    bookId: number;
    selectedBookTitle: string;
};

export function useBookVisitForm({ bookId, selectedBookTitle }: UseBookVisitFormParams) {
    const [formState, setFormState] = useState<VisitFormState>(INITIAL_VISIT_FORM_STATE);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const isSubmitted = submitStatus === "success" || submitStatus === "warning";

    const updateField = (field: keyof VisitFormState, value: string) => {
        setSubmitStatus("idle");
        setFormState((current) => ({ ...current, [field]: value }));
    };

    const closeToast = () => setSubmitStatus("idle");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitStatus("sending");

        const nextStatus = await submitBookVisit({
            ...formState,
            bookTitle: selectedBookTitle,
            bookId,
        });

        setSubmitStatus(nextStatus);
    };

    return {
        formState,
        submitStatus,
        today,
        isSubmitted,
        updateField,
        closeToast,
        handleSubmit,
    };
}
