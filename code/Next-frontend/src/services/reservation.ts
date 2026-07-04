import axiosInstance from "@/lib/axios";

export interface ReservationResponse {
    id: number;
    bookId: number;
    bookTitle: string;
    coverImage: string;
    reservationDate: string;
    status: string;
    queuePosition: number;
}

export const reservationService = {
    createReservation: async (bookId: number): Promise<ReservationResponse> => {
        const response = await axiosInstance.post(`/api/reservations`, { bookId });
        return response.data;
    },

    getMyReservations: async (page: number = 0, size: number = 10): Promise<{ content: ReservationResponse[]; totalPages: number; totalElements: number }> => {
        const response = await axiosInstance.get(`/api/reservations/me`, { params: { page, size } });
        return response.data;
    },

    cancelReservation: async (reservationId: number): Promise<void> => {
        await axiosInstance.delete(`/api/reservations/${reservationId}`);
    },
};
