package com.rh.recrutement.controller;

import com.rh.recrutement.entity.Recruteur;
import com.rh.recrutement.service.RecruteurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recruteurs")
public class RecruteurController {

    private final RecruteurService recruteurService;

    public RecruteurController(RecruteurService recruteurService) {
        this.recruteurService = recruteurService;
    }

    // Ajouter un recruteur
    @PostMapping
    public Recruteur ajouterRecruteur(@RequestBody Recruteur recruteur) {
        return recruteurService.ajouterRecruteur(recruteur);
    }

    // Afficher tous les recruteurs
    @GetMapping
    public List<Recruteur> afficherRecruteurs() {
        return recruteurService.afficherRecruteurs();
    }

    // Chercher un recruteur par ID
    @GetMapping("/{id}")
    public Optional<Recruteur> trouverParId(@PathVariable Long id) {
        return recruteurService.trouverParId(id);
    }

    // Modifier un recruteur
    @PutMapping("/{id}")
    public Recruteur modifierRecruteur(
            @PathVariable Long id,
            @RequestBody Recruteur recruteur) {

        recruteur.setIdRecruteur(id);
        return recruteurService.modifierRecruteur(recruteur);
    }

    // Supprimer un recruteur
    @DeleteMapping("/{id}")
    public void supprimerRecruteur(@PathVariable Long id) {
        recruteurService.supprimerRecruteur(id);
    }
}
