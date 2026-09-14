package com.alp.module.user.config;

import com.alp.common.config.AlpProperties;
import com.alp.common.validation.PasswordPolicy;
import com.alp.module.user.entity.Role;
import com.alp.module.user.entity.RoleName;
import com.alp.module.user.entity.User;
import com.alp.module.user.repository.RoleRepository;
import com.alp.module.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeedRunner.class);

    private final AlpProperties properties;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeedRunner(
            AlpProperties properties,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.properties = properties;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        AlpProperties.Seed seed = properties.seed();
        if (seed == null || isBlank(seed.adminEmail()) || isBlank(seed.adminPassword())) {
            return;
        }

        String email = User.normalizeEmail(seed.adminEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            log.info("Admin seed skipped; user already exists for {}", email);
            return;
        }

        PasswordPolicy.validate(seed.adminPassword());
        String username = isBlank(seed.adminUsername()) ? "admin" : seed.adminUsername().trim();
        if (userRepository.existsByUsername(username)) {
            log.warn("Admin seed skipped; username {} already exists", username);
            return;
        }

        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseThrow(() -> new IllegalStateException("ADMIN role is not seeded"));
        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new IllegalStateException("USER role is not seeded"));

        User admin = new User(username, email, passwordEncoder.encode(seed.adminPassword()), username);
        admin.addRole(userRole);
        admin.addRole(adminRole);
        userRepository.save(admin);
        log.info("Seeded admin user {}", email);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
