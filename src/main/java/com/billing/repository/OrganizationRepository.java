package com.billing.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.billing.entity.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Organization save(Organization organization);

	List<Organization> findAllByCreatedAtBetween(Date startOfWeek, Date endOfWeek);
}
