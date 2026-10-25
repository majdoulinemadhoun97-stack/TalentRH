package com.rh.recrutement.controller;

import com.rh.recrutement.entity.OffreEmploi;
import com.rh.recrutement.service.OffreEmploiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/offres")
public class OffreEmploiController {

    private final OffreEmploiService offreEmploiService;

    public OffreEmploiController(OffreEmploiService offreEmploiService) {
        this.offreEmploiService = offreEmploiService;
    }

    // Ajouter une offre
    @PostMapping
    public OffreEmploi ajouterOffre(@RequestBody OffreEmploi offre) {
        return offreEmploiService.ajouterOffre(offre);
    }

    // Afficher toutes les offres
    @GetMapping
    public List<OffreEmploi> afficherOffres() {
        return offreEmploiService.afficherOffres();
    }

    // Chercher une offre par son ID
    @GetMapping("/{id}")
    public Optional<OffreEmploi> trouverParId(@PathVariable Long id) {
        return offreEmploiService.trouverParId(id);
    }

    // Modifier une offre
    @PutMapping("/{id}")
    public OffreEmploi modifierOffre(
            @PathVariable Long id,
            @RequestBody OffreEmploi offre) {

        offre.setIdOffre(id);
        return offreEmploiService.modifierOffre(offre);
    }

    // Supprimer une offre
    @DeleteMapping("/{id}")
    public void supprimerOffre(@PathVariable Long id) {
        offreEmploiService.supprimerOffre(id);
    }
}