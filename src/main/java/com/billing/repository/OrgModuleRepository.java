package com.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.billing.entity.ModuleOrganization;

@Repository
public interface OrgModuleRepository extends JpaRepository<ModuleOrganization, Long> {

	@Query("SELECT m FROM ModuleOrganization m WHERE m.organization.id = :orgId AND m.moduleId = :moduleId")
	public List<ModuleOrganization> findByOrganizationIdAndModuleId(@Param("orgId")Long orgId, @Param("moduleId")Long moduleId);
}
