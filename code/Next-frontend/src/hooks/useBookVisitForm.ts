import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_VISIT_FORM_STATE } from "@/constants/book-visit";
import { submitBookVisit } from "@/services/bookVisit";
import type { SubmitStatus, VisitFormState } from "@/types/book-visit";
import { buildBookVisitSuccessUrl, createVisitReferenceCode } from "@/utils/book-visit";

type UseBookVisitFormParams = {
    bookId: number;
    selectedBookTitle: string;
};

export function useBookVisitForm({ bookId, selectedBookTitle }: UseBookVisitFormParams) {
    const router = useRouter();
    const [formState, setFormState] = useState<VisitFormState>(INITIAL_VISIT_FORM_STATE);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const updateField = (field: keyof VisitFormState, value: string) => {
        setSubmitStatus("idle");
        setFormState((current) => {
            if (field === "visitDate") {
                return { ...current, visitDate: value, visitHour: "", visitMinute: "", visitPeriod: "" };
            }

            return { ...current, [field]: value };
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitStatus("sending");
        const confirmationCode = createVisitReferenceCode();

        const nextStatus = await submitBookVisit({
            ...formState,
            bookTitle: selectedBookTitle,
            bookId,
            confirmationCode,
        });

        setSubmitStatus(nextStatus);

        if (nextStatus === "success" || nextStatus === "warning") {
            router.push(buildBookVisitSuccessUrl({ bookId, formState, confirmationCode }));
        }
    };

    return {
        formState,
        submitStatus,
        today,
        updateField,
        handleSubmit,
    };
}
