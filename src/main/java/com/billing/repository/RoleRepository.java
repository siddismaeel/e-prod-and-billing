package com.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.billing.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role save(Role role);

    @Query("SELECT DISTINCT r FROM Role r WHERE r.name = :roleName")
	Role findByRoleName(@Param("roleName") String roleName);
    
//    @Modifying
//    @Query("UPDATE Role r SET r.organization = NULL WHERE r.organization.id = :organizationId")
//    void nullifyOrganizationId(@Param("organizationId") Long organizationId);

}
