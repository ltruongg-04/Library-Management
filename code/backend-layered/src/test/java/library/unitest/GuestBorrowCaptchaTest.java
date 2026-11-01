package library.unitest;

import library.common.exception.CustomBusinessException;
import library.controller.PublicBorrowController;
import library.dto.borrow.GuestBorrowRequestDto;
import library.service.BorrowOrderService;
import library.service.OtpService;
import library.service.ReCaptchaService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GuestBorrowCaptchaTest {

    private static final String TOKEN = "captcha-token";

    private final BorrowOrderService borrowOrderService = mock(BorrowOrderService.class);
    private final ReCaptchaService reCaptchaService = mock(ReCaptchaService.class);
    private final PublicBorrowController controller =
            new PublicBorrowController(borrowOrderService, mock(OtpService.class), reCaptchaService);

    @Test
    void orderIsNotCreatedWhenCaptchaFails() {
        when(reCaptchaService.verifyToken(TOKEN)).thenReturn(false);

        assertThatThrownBy(() -> controller.createGuestBorrowOrder(request(), null))
                .isInstanceOf(CustomBusinessException.class);

        verify(borrowOrderService, never()).createGuestBorrowOrder(any(), any());
    }

    @Test
    void orderIsCreatedWhenCaptchaPasses() {
        when(reCaptchaService.verifyToken(TOKEN)).thenReturn(true);

        controller.createGuestBorrowOrder(request(), null);

        verify(borrowOrderService).createGuestBorrowOrder(any(), any());
    }

    private GuestBorrowRequestDto request() {
        return GuestBorrowRequestDto.builder().recaptchaToken(TOKEN).build();
    }
}
