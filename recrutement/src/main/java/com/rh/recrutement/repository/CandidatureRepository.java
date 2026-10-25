package com.rh.recrutement.repository;


import com.rh.recrutement.entity.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepository
        extends JpaRepository<Candidature, Long> {

    List<Candidature>
    findByOffreIdOffreOrderByScoreCompatibiliteDesc(Long idOffre);

    boolean existsByCandidatIdCandidatAndOffreIdOffre(
            Long idCandidat,
            Long idOffre
    );
}