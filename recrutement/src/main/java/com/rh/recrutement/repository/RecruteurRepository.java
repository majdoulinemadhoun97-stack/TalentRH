package com.rh.recrutement.repository;

import com.rh.recrutement.entity.Recruteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruteurRepository extends JpaRepository<Recruteur, Long> {
}