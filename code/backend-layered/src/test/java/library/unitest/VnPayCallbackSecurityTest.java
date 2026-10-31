package library.unitest;

import library.common.utils.VnPayUtil;
import library.config.VnPayConfig;
import library.controller.user.VnPayController;
import library.entity.PaymentType;
import library.service.VnPayCallbackService;
import library.service.VnPayService;
import library.service.impl.VnPayServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VnPayCallbackSecurityTest {

    private static final String ORDER_CODE = "BO-12345678";
    private static final String FRONTEND_URL = "https://library.test";
    private static final String HASH_SECRET = "test-secret";
    private static final Map<String, String> PAID_PARAMS = Map.of(
            "vnp_TxnRef", ORDER_CODE, "vnp_ResponseCode", "00", "vnp_TransactionStatus", "00", "vnp_Amount", "1000000");

    @Mock
    private VnPayService vnPayService;
    @Mock
    private VnPayCallbackService vnPayCallbackService;
    @Mock
    private VnPayConfig vnPayConfig;

    @InjectMocks
    private VnPayController controller;

    @BeforeEach
    void setUp() {
        lenient().when(vnPayConfig.getFrontendUrl()).thenReturn(FRONTEND_URL);
    }

    @Test
    void forgedReturnCallbackChangesNothing() {
        Map<String, String> forged = Map.of("vnp_TxnRef", ORDER_CODE, "vnp_ResponseCode", "24");
        when(vnPayService.validateCallback(forged)).thenReturn(false);
        lenient().when(vnPayConfig.isProcessOnReturn()).thenReturn(true);

        ResponseEntity<Void> response = controller.handleReturn(forged);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(location(response)).startsWith(FRONTEND_URL + "/thanh-toan/ket-qua?status=failed");
        verifyNoInteractions(vnPayCallbackService);
    }

    @Test
    void returnOnlyDisplaysResultByDefault() {
        when(vnPayService.validateCallback(PAID_PARAMS)).thenReturn(true);
        when(vnPayCallbackService.findPaymentSummary(ORDER_CODE))
                .thenReturn(Optional.of(new VnPayCallbackService.PaymentSummary(ORDER_CODE, PaymentType.DEPOSIT)));

        ResponseEntity<Void> response = controller.handleReturn(PAID_PARAMS);

        verify(vnPayCallbackService, never()).processCallback(any());
        assertThat(location(response)).contains("status=success", "orderCode=" + ORDER_CODE, "type=DEPOSIT", "amount=10000");
    }

    @Test
    void returnProcessesPaymentOnlyWhenFlagIsEnabled() {
        when(vnPayService.validateCallback(PAID_PARAMS)).thenReturn(true);
        when(vnPayConfig.isProcessOnReturn()).thenReturn(true);
        when(vnPayCallbackService.findPaymentSummary(ORDER_CODE)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = controller.handleReturn(PAID_PARAMS);

        verify(vnPayCallbackService).processCallback(PAID_PARAMS);
        assertThat(location(response)).contains("status=success", "orderCode=UNKNOWN");
    }

    @Test
    void ipnWithInvalidSignatureIsRejected() {
        when(vnPayService.validateCallback(PAID_PARAMS)).thenReturn(false);

        assertThat(controller.handleIpn(PAID_PARAMS).getBody()).containsEntry("RspCode", "97");
        verifyNoInteractions(vnPayCallbackService);
    }

    @Test
    void ipnMapsProcessingResultToVnPayResponseCode() {
        when(vnPayService.validateCallback(PAID_PARAMS)).thenReturn(true);
        Map<VnPayCallbackService.Result, String> expectedCodes = Map.of(
                VnPayCallbackService.Result.CONFIRMED, "00",
                VnPayCallbackService.Result.PAYMENT_NOT_FOUND, "01",
                VnPayCallbackService.Result.ALREADY_PROCESSED, "02",
                VnPayCallbackService.Result.AMOUNT_MISMATCH, "04");

        expectedCodes.forEach((result, code) -> {
            when(vnPayCallbackService.processCallback(PAID_PARAMS)).thenReturn(result);
            assertThat(controller.handleIpn(PAID_PARAMS).getBody()).containsEntry("RspCode", code);
        });
    }

    @Test
    void ipnAsksVnPayToRetryWhenProcessingFails() {
        when(vnPayService.validateCallback(PAID_PARAMS)).thenReturn(true);
        when(vnPayCallbackService.processCallback(PAID_PARAMS)).thenThrow(new IllegalStateException("db down"));

        assertThat(controller.handleIpn(PAID_PARAMS).getBody()).containsEntry("RspCode", "99");
    }

    @Test
    void signatureCheckAcceptsGenuineHashInAnyCaseAndRejectsTampering() {
        VnPayConfig config = mock(VnPayConfig.class);
        when(config.getHashSecret()).thenReturn(HASH_SECRET);
        VnPayServiceImpl service = new VnPayServiceImpl(config);

        Map<String, String> params = new HashMap<>(Map.of("vnp_Amount", "1000", "vnp_TxnRef", ORDER_CODE));
        String hash = VnPayUtil.hmacSHA512(HASH_SECRET, "vnp_Amount=1000&vnp_TxnRef=" + ORDER_CODE);

        params.put("vnp_SecureHash", hash.toUpperCase());
        assertThat(service.validateCallback(params)).isTrue();

        params.put("vnp_Amount", "1");
        assertThat(service.validateCallback(params)).isFalse();
    }

    private String location(ResponseEntity<Void> response) {
        return response.getHeaders().getLocation().toString();
    }
}
