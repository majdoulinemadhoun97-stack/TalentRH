package com.rh.recrutement.controller;

import com.rh.recrutement.entity.Candidature;
import com.rh.recrutement.entity.StatutCandidature;
import com.rh.recrutement.service.CandidatureService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    private final CandidatureService candidatureService;

    public CandidatureController(CandidatureService candidatureService) {
        this.candidatureService = candidatureService;
    }

    // Déposer une candidature
    @PostMapping
    public Candidature ajouterCandidature(
            @RequestBody Candidature candidature) {

        return candidatureService.ajouterCandidature(candidature);
    }

    // Afficher toutes les candidatures
    @GetMapping
    public List<Candidature> afficherCandidatures() {
        return candidatureService.afficherCandidatures();
    }

    // Chercher une candidature par ID
    @GetMapping("/{id}")
    public Optional<Candidature> trouverParId(@PathVariable Long id) {
        return candidatureService.trouverParId(id);
    }

    // Modifier le statut
    @PutMapping("/{id}/statut")
    public Candidature modifierStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature statut) {

        return candidatureService.modifierStatut(id, statut);
    }

    // Classer les candidatures d'une offre par score
    @GetMapping("/offre/{idOffre}/classement")
    public List<Candidature> classerParScore(
            @PathVariable Long idOffre) {

        return candidatureService.classerParScore(idOffre);
    }
}