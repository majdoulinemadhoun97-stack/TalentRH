package com.rh.recrutement.controller;

import com.rh.recrutement.entity.Utilisateur;
import com.rh.recrutement.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // Ajouter un utilisateur
    @PostMapping
    public Utilisateur ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.ajouterUtilisateur(utilisateur);
    }

    // Afficher tous les utilisateurs
    @GetMapping
    public List<Utilisateur> afficherUtilisateurs() {
        return utilisateurService.afficherUtilisateurs();
    }

    // Connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {

        String email = loginData.get("email");
        String motDePasse = loginData.get("motDePasse");

        Optional<Utilisateur> utilisateurOptional =
                utilisateurService.trouverParEmail(email);

        if (utilisateurOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Email incorrect");
        }

        Utilisateur utilisateur = utilisateurOptional.get();

        boolean motDePasseCorrect =
                utilisateurService.verifierMotDePasse(
                        motDePasse,
                        utilisateur.getMotDePasse()
                );

        if (!motDePasseCorrect) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }

        return ResponseEntity.ok(utilisateur);
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public void supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
    }
}