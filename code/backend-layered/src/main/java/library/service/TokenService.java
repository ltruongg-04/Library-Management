package library.service;

import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;

public interface TokenService {
    
    /**
     * Creates a new pair of Access Token and Refresh Token for a user.
     */
    TokenRefreshResponse generateTokenPair(UserEntity user);

    /**
     * Refreshes the Access Token using a valid Refresh Token.
     */
    TokenRefreshResponse refreshToken(String refreshToken);

    /**
     * Revokes a Refresh Token (used during logout).
     * Returns the user associated with the token if it was valid.
     */
    java.util.Optional<UserEntity> revokeToken(String refreshToken);
}
