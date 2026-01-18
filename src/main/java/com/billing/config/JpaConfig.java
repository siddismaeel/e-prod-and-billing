package com.billing.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.billing.repository.BaseRepositoryImpl;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.billing.repository",
    repositoryBaseClass = BaseRepositoryImpl.class
)
public class JpaConfig {
    // Configuration handled by @EnableJpaRepositories annotation
}
