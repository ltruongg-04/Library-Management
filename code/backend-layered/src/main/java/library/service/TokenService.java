package library.service;

import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;

public interface TokenService {

    /**
     * Creates a new pair of Access Token and Refresh Token for a user.
     */
    TokenRefreshResponse generateTokenPair(UserEntity user);

    /**
     * Refreshes the Access Token using a valid Refresh Token and rotates the Refresh Token.
     */
    TokenRefreshResponse refreshToken(String refreshToken);

    /**
     * Revokes a Refresh Token and its session (used during logout).
     * Returns the user associated with the token if it was valid.
     */
    java.util.Optional<UserEntity> revokeToken(String refreshToken);

    /**
     * Revokes the session an Access Token belongs to (used during logout without a Refresh Token).
     * Returns the user associated with the session if the token was valid.
     */
    java.util.Optional<UserEntity> revokeSessionOfAccessToken(String accessToken);
}
