package library.service;

public interface ReCaptchaService {
    boolean verifyToken(String token);
}
