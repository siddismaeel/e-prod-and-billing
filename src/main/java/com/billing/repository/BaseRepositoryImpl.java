package com.billing.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.lang.NonNull;

import com.billing.entity.BaseModel;
import com.billing.util.RepositoryFilterSpecification;

import jakarta.persistence.EntityManager;

/**
 * Custom repository implementation that automatically applies organization/company filters
 * to all queries for entities that have these fields
 */
public class BaseRepositoryImpl<T extends BaseModel, ID> extends SimpleJpaRepository<T, ID> implements BaseRepository<T, ID> {

    public BaseRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
    }

    @Override
    @NonNull
    public List<T> findAll() {
        Specification<T> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        return findAll(filterSpec);
    }

    @Override
    @NonNull
    public List<T> findAll(@NonNull Sort sort) {
        Specification<T> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        return findAll(filterSpec, sort);
    }

    @Override
    @NonNull
    public Page<T> findAll(@NonNull Pageable pageable) {
        Specification<T> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        return findAll(filterSpec, pageable);
    }

    @Override
    @NonNull
    public <S extends T> List<S> findAll(@NonNull Example<S> example) {
        // For Example queries, we need to filter results after fetching
        // This is a limitation - Example and Specification don't combine well
        List<S> results = super.findAll(example);
        return filterByContext(results);
    }

    @Override
    @NonNull
    public <S extends T> List<S> findAll(@NonNull Example<S> example, @NonNull Sort sort) {
        List<S> results = super.findAll(example, sort);
        return filterByContext(results);
    }

    @Override
    @NonNull
    public <S extends T> Page<S> findAll(@NonNull Example<S> example, @NonNull Pageable pageable) {
        // For paged Example queries, we filter results after fetching
        // Note: This may affect pagination accuracy if filtering removes items
        Page<S> results = super.findAll(example, pageable);
        List<S> filtered = filterByContext(results.getContent());
        // Return new Page with filtered content
        // Note: Total count may not be accurate after filtering
        return new PageImpl<>(filtered, pageable, filtered.size());
    }

    @Override
    @NonNull
    public Optional<T> findById(@NonNull ID id) {
        Specification<T> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        Specification<T> idSpec = (root, query, cb) -> cb.equal(root.get("id"), id);
        return findOne(Specification.where(filterSpec).and(idSpec));
    }

    @Override
    public long count() {
        Specification<T> filterSpec = RepositoryFilterSpecification.withOrganizationAndCompany();
        return count(filterSpec);
    }

    @Override
    public <S extends T> long count(@NonNull Example<S> example) {
        // Count with Example - filter results first
        List<S> results = super.findAll(example);
        return filterByContext(results).size();
    }

    @Override
    public boolean existsById(@NonNull ID id) {
        return findById(id).isPresent();
    }

    /**
     * Filters a list of entities by organization and company from context
     */
    private <S extends T> List<S> filterByContext(List<S> entities) {
        if (entities.isEmpty()) {
            return entities;
        }
        
        // Check if first entity has organization/company fields
        T first = entities.get(0);
        if (!hasOrganizationOrCompanyField(first)) {
            return entities; // No filtering needed
        }
        
        com.billing.entity.Organization org = com.billing.util.OrganizationContext.getOrganization();
        com.billing.entity.Company company = com.billing.util.CompanyContext.getCompany();
        
        return entities.stream()
            .filter(entity -> {
                try {
                    if (org != null) {
                        java.lang.reflect.Method getOrg = entity.getClass().getMethod("getOrganization");
                        com.billing.entity.Organization entityOrg = (com.billing.entity.Organization) getOrg.invoke(entity);
                        if (entityOrg == null || !entityOrg.getId().equals(org.getId())) {
                            return false;
                        }
                    }
                    if (company != null) {
                        java.lang.reflect.Method getCompany = entity.getClass().getMethod("getCompany");
                        com.billing.entity.Company entityCompany = (com.billing.entity.Company) getCompany.invoke(entity);
                        if (entityCompany == null || !entityCompany.getId().equals(company.getId())) {
                            return false;
                        }
                    }
                    return true;
                } catch (Exception e) {
                    return true; // If reflection fails, include the entity
                }
            })
            .toList();
    }

    private boolean hasOrganizationOrCompanyField(T entity) {
        try {
            entity.getClass().getMethod("getOrganization");
            return true;
        } catch (NoSuchMethodException e) {
            return false;
        }
    }
}
