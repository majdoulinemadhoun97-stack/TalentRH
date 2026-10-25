package com.rh.recrutement.service;

import com.rh.recrutement.entity.OffreEmploi;
import com.rh.recrutement.repository.OffreEmploiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OffreEmploiService {

    private final OffreEmploiRepository offreEmploiRepository;

    public OffreEmploiService(OffreEmploiRepository offreEmploiRepository) {
        this.offreEmploiRepository = offreEmploiRepository;
    }

    public OffreEmploi ajouterOffre(OffreEmploi offre) {
        return offreEmploiRepository.save(offre);
    }

    public List<OffreEmploi> afficherOffres() {
        return offreEmploiRepository.findAll();
    }

    public Optional<OffreEmploi> trouverParId(Long id) {
        return offreEmploiRepository.findById(id);
    }

    public OffreEmploi modifierOffre(OffreEmploi offre) {
        return offreEmploiRepository.save(offre);
    }

    public void supprimerOffre(Long id) {
        offreEmploiRepository.deleteById(id);
    }
}