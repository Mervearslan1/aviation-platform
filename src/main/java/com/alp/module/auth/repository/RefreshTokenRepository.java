package com.alp.module.auth.repository;

import com.alp.module.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query("SELECT t FROM RefreshToken t JOIN FETCH t.user u LEFT JOIN FETCH u.roles WHERE t.tokenHash = :tokenHash")
    Optional<RefreshToken> findByTokenHashWithUser(@Param("tokenHash") String tokenHash);
}
