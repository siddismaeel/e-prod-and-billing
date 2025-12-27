package com.billing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.billing.entity.RoleRight;

@Repository
public interface RoleRightMappingRepository extends JpaRepository<RoleRight, Long> {
	
	public List<RoleRight> findByRoleId(Long roleId);

}
