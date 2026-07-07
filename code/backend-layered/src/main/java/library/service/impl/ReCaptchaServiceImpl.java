package library.service.impl;

import library.dto.request.ReCaptchaResponseDto;
import library.service.ReCaptchaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class ReCaptchaServiceImpl implements ReCaptchaService {

    @Value("${recaptcha.secret-key:YOUR_SECRET_KEY}")
    private String secretKey;

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private final RestTemplate restTemplate;

    public ReCaptchaServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public boolean verifyToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        try {
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("secret", secretKey);
            body.add("response", token);

            ReCaptchaResponseDto response = restTemplate.postForObject(RECAPTCHA_VERIFY_URL, body, ReCaptchaResponseDto.class);

            if (response != null && response.isSuccess()) {
                return true;
            } else {
                log.warn("ReCAPTCHA verification failed: {}", response);
                return false;
            }
        } catch (Exception e) {
            log.error("Error calling ReCAPTCHA API", e);
            return false;
        }
    }
}
