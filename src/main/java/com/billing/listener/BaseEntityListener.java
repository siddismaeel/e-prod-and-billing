package com.billing.listener;

import java.lang.reflect.Method;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.billing.entity.BaseModel;
import com.billing.entity.Company;
import com.billing.entity.Organization;
import com.billing.entity.User;
import com.billing.util.AuditorAwareImpl;
import com.billing.util.CompanyContext;
import com.billing.util.OrganizationContext;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Component
public class BaseEntityListener implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        BaseEntityListener.applicationContext = applicationContext;
    }

    @PrePersist
    public void prePersist(BaseModel entity) {
        Date now = new Date();
        
        // Set timestamps
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(now);
        }
        entity.setUpdatedAt(now);

        // Set createdBy and updatedBy from current user
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isPresent()) {
            User user = currentUser.get();
            if (entity.getCreatedBy() == null) {
                entity.setCreatedBy(user);
            }
            entity.setUpdatedBy(user);
        }

        // Set organization and company if entity has these fields
        setOrganizationAndCompany(entity);
    }

    @PreUpdate
    public void preUpdate(BaseModel entity) {
        Date now = new Date();
        entity.setUpdatedAt(now);

        // Set updatedBy from current user
        Optional<User> currentUser = getCurrentUser();
        if (currentUser.isPresent()) {
            entity.setUpdatedBy(currentUser.get());
        }

        // Update organization and company if not already set
        setOrganizationAndCompany(entity);
    }

    private Optional<User> getCurrentUser() {
        if (applicationContext == null) {
            return Optional.empty();
        }
        try {
            AuditorAwareImpl auditorAware = applicationContext.getBean(AuditorAwareImpl.class);
            return auditorAware.getCurrentAuditor();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private void setOrganizationAndCompany(BaseModel entity) {
        // Check if organization/company are already set
        Organization existingOrg = getFieldValue(entity, "organization", Organization.class);
        Company existingCompany = getFieldValue(entity, "company", Company.class);

        // Only set if not already set
        if (existingOrg == null) {
            // Try to get organization/company from current user first
            Optional<User> currentUser = getCurrentUser();
            Organization org = null;
            Company company = null;

            if (currentUser.isPresent()) {
                User user = currentUser.get();
                org = user.getOrganization();
                company = user.getCompany();
            }

            // Fallback to ThreadLocal contexts if not available from user
            if (org == null) {
                org = OrganizationContext.getOrganization();
            }
            if (company == null) {
                company = CompanyContext.getCompany();
            }

            // Set organization and company using reflection (since not all entities have these fields)
            if (org != null) {
                setFieldValue(entity, "organization", org);
            }
            if (company != null && existingCompany == null) {
                setFieldValue(entity, "company", company);
            }
        } else if (existingCompany == null) {
            // Organization is set but company is not
            Optional<User> currentUser = getCurrentUser();
            Company company = null;

            if (currentUser.isPresent()) {
                company = currentUser.get().getCompany();
            }

            if (company == null) {
                company = CompanyContext.getCompany();
            }

            if (company != null) {
                setFieldValue(entity, "company", company);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private <T> T getFieldValue(BaseModel entity, String fieldName, Class<T> fieldType) {
        try {
            String getterName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
            Method getter = findGetterMethod(entity.getClass(), getterName, fieldType);
            if (getter != null) {
                return (T) getter.invoke(entity);
            }
        } catch (Exception e) {
            // Field doesn't exist or can't be accessed - ignore
        }
        return null;
    }

    private Method findGetterMethod(Class<?> clazz, String methodName, Class<?> returnType) {
        for (Method method : clazz.getMethods()) {
            if (method.getName().equals(methodName) && 
                method.getParameterCount() == 0 && 
                returnType.isAssignableFrom(method.getReturnType())) {
                return method;
            }
        }
        return null;
    }

    private void setFieldValue(BaseModel entity, String fieldName, Object value) {
        try {
            Method setter = findSetterMethod(entity.getClass(), fieldName);
            if (setter != null) {
                setter.invoke(entity, value);
            }
        } catch (Exception e) {
            // Field doesn't exist or can't be set - ignore
        }
    }

    private Method findSetterMethod(Class<?> clazz, String fieldName) {
        String setterName = "set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
        for (Method method : clazz.getMethods()) {
            if (method.getName().equals(setterName) && method.getParameterCount() == 1) {
                return method;
            }
        }
        return null;
    }
}
