package com.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import com.billing.entity.BaseModel;

/**
 * Base repository interface that extends JpaRepository and JpaSpecificationExecutor
 * Provides automatic filtering by organization and company
 */
@NoRepositoryBean
public interface BaseRepository<T extends BaseModel, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
}
