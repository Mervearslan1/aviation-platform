package com.alp.module.user.repository;

import com.alp.module.user.entity.User;
import com.alp.module.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCaseWithRoles(@Param("email") String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);

    Page<User> findAllByStatus(UserStatus status, Pageable pageable);
}
