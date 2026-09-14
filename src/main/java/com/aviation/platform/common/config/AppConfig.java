package com.aviation.platform.common.config;

import com.aviation.platform.common.config.AviationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
@EnableConfigurationProperties(AviationProperties.class)
public class AppConfig {

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
