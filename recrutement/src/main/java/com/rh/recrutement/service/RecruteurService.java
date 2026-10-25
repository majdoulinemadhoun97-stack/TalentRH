package com.rh.recrutement.service;

import com.rh.recrutement.entity.Recruteur;
import com.rh.recrutement.repository.RecruteurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecruteurService {

    private final RecruteurRepository recruteurRepository;

    public RecruteurService(RecruteurRepository recruteurRepository) {
        this.recruteurRepository = recruteurRepository;
    }

    public Recruteur ajouterRecruteur(Recruteur recruteur) {
        return recruteurRepository.save(recruteur);
    }

    public List<Recruteur> afficherRecruteurs() {
        return recruteurRepository.findAll();
    }

    public Optional<Recruteur> trouverParId(Long id) {
        return recruteurRepository.findById(id);
    }

    public Recruteur modifierRecruteur(Recruteur recruteur) {
        return recruteurRepository.save(recruteur);
    }

    public void supprimerRecruteur(Long id) {
        recruteurRepository.deleteById(id);
    }
}