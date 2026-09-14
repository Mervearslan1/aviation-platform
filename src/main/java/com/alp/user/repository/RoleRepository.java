package com.alp.user.repository;

import com.alp.user.entity.Role;
import com.alp.user.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);

    Set<Role> findByNameIn(Collection<RoleName> names);
}
