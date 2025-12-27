package com.billing.util;

import com.billing.entity.Company;

public class CompanyContext {

    private static final ThreadLocal<Company> companyThreadLocal = new ThreadLocal<>();

    public static void setCompany(Company company) {
    	companyThreadLocal.set(company);
    }

    public static Company getCompany() {
        return companyThreadLocal.get();
    }

    public static void clear() {
    	companyThreadLocal.remove();
    }
}
