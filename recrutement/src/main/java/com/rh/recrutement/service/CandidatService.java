package com.rh.recrutement.service;

import com.rh.recrutement.entity.Candidat;
import com.rh.recrutement.repository.CandidatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidatService {

    private final CandidatRepository candidatRepository;

    public CandidatService(CandidatRepository candidatRepository) {
        this.candidatRepository = candidatRepository;
    }

    public Candidat ajouterCandidat(Candidat candidat) {
        return candidatRepository.save(candidat);
    }

    public List<Candidat> afficherCandidats() {
        return candidatRepository.findAll();
    }

    public Optional<Candidat> trouverParId(Long id) {
        return candidatRepository.findById(id);
    }

    public Candidat modifierCandidat(Candidat candidat) {
        return candidatRepository.save(candidat);
    }

    public void supprimerCandidat(Long id) {
        candidatRepository.deleteById(id);
    }
}