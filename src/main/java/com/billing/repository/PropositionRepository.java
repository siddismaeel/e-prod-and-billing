package com.billing.repository;

import com.billing.entity.Proposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropositionRepository extends JpaRepository<Proposition, Long> {
    List<Proposition> findByReadyItemId(Long readyItemId);
    Optional<Proposition> findByReadyItemIdAndRawMaterialId(Long readyItemId, Long rawMaterialId);
    void deleteByReadyItemId(Long readyItemId);
}

