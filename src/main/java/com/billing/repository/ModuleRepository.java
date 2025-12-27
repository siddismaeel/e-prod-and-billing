package com.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.billing.entity.Modules;


@Repository
public interface ModuleRepository extends JpaRepository<Modules, Long> {

}
