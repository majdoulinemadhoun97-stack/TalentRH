package com.rh.recrutement.controller;

import com.rh.recrutement.entity.Candidat;
import com.rh.recrutement.service.CandidatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidats")
public class CandidatController {

    private final CandidatService candidatService;

    public CandidatController(CandidatService candidatService) {
        this.candidatService = candidatService;
    }

    // Ajouter un candidat
    @PostMapping
    public Candidat ajouterCandidat(@RequestBody Candidat candidat) {
        return candidatService.ajouterCandidat(candidat);
    }

    // Afficher tous les candidats
    @GetMapping
    public List<Candidat> afficherCandidats() {
        return candidatService.afficherCandidats();
    }

    // Chercher un candidat par ID
    @GetMapping("/{id}")
    public Optional<Candidat> trouverParId(@PathVariable Long id) {
        return candidatService.trouverParId(id);
    }

    // Modifier un candidat
    @PutMapping("/{id}")
    public Candidat modifierCandidat(
            @PathVariable Long id,
            @RequestBody Candidat candidat) {

        candidat.setIdCandidat(id);
        return candidatService.modifierCandidat(candidat);
    }

    // Supprimer un candidat
    @DeleteMapping("/{id}")
    public void supprimerCandidat(@PathVariable Long id) {
        candidatService.supprimerCandidat(id);
    }

    // Déposer ou remplacer le CV d'un candidat
    @PostMapping("/{id}/cv")
    public ResponseEntity<?> deposerCv(
            @PathVariable Long id,
            @RequestParam("cv") MultipartFile cv) {

        try {
            // Vérifier que le candidat existe
            Optional<Candidat> candidatOptional =
                    candidatService.trouverParId(id);

            if (candidatOptional.isEmpty()) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            // Vérifier que le fichier n'est pas vide
            if (cv.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Le fichier est vide");
            }

            // Vérifier que le fichier est un PDF
            if (!"application/pdf".equals(cv.getContentType())) {
                return ResponseEntity
                        .badRequest()
                        .body("Le CV doit être au format PDF");
            }

            // Créer le dossier s'il n'existe pas
            Path dossierCv = Paths.get("uploads", "cv");
            Files.createDirectories(dossierCv);

            // Créer un nom unique pour éviter d'écraser un autre CV
            String nomFichier =
                    UUID.randomUUID() + "_" + cv.getOriginalFilename();

            Path cheminFichier = dossierCv.resolve(nomFichier);

            // Enregistrer physiquement le PDF
            Files.copy(
                    cv.getInputStream(),
                    cheminFichier,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // Enregistrer le chemin du CV dans le candidat
            Candidat candidat = candidatOptional.get();

            candidat.setCheminCv(
                    cheminFichier.toString()
            );

            Candidat candidatModifie =
                    candidatService.modifierCandidat(candidat);

            return ResponseEntity.ok(candidatModifie);

        } catch (IOException e) {
            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Erreur lors de l'enregistrement du CV");
        }
    }
}