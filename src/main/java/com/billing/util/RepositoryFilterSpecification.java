package com.billing.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.billing.entity.BaseModel;
import com.billing.entity.Company;
import com.billing.entity.Organization;

import jakarta.persistence.criteria.Predicate;

public class RepositoryFilterSpecification {

    /**
     * Builds a Specification that filters by organization and company from ThreadLocal contexts
     * Only applies filters if the entity has organization/company fields
     */
    public static <T extends BaseModel> Specification<T> withOrganizationAndCompany() {
        return (root, query, cb) -> {
            Organization org = OrganizationContext.getOrganization();
            Company company = CompanyContext.getCompany();
            
            List<Predicate> predicates = new ArrayList<>();
            
            // Check if entity has organization field
            if (org != null && hasField(root.getJavaType(), "organization")) {
                predicates.add(cb.equal(root.get("organization"), org));
            }
            
            // Check if entity has company field
            if (company != null && hasField(root.getJavaType(), "company")) {
                predicates.add(cb.equal(root.get("company"), company));
            }
            
            if (predicates.isEmpty()) {
                return cb.conjunction(); // Return true predicate if no filters
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Builds a Specification that filters by organization only
     */
    public static <T extends BaseModel> Specification<T> withOrganization() {
        return (root, query, cb) -> {
            Organization org = OrganizationContext.getOrganization();
            
            if (org != null && hasField(root.getJavaType(), "organization")) {
                return cb.equal(root.get("organization"), org);
            }
            
            return cb.conjunction();
        };
    }

    /**
     * Builds a Specification that filters by company only
     */
    public static <T extends BaseModel> Specification<T> withCompany() {
        return (root, query, cb) -> {
            Company company = CompanyContext.getCompany();
            
            if (company != null && hasField(root.getJavaType(), "company")) {
                return cb.equal(root.get("company"), company);
            }
            
            return cb.conjunction();
        };
    }

    /**
     * Checks if a class has a field with the given name
     */
    private static boolean hasField(Class<?> clazz, String fieldName) {
        try {
            // Check for getter method
            String getterName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
            for (Method method : clazz.getMethods()) {
                if (method.getName().equals(getterName) && method.getParameterCount() == 0) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
