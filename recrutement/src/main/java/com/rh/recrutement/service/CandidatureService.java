package com.rh.recrutement.service;

import com.rh.recrutement.entity.Candidat;
import com.rh.recrutement.entity.Candidature;
import com.rh.recrutement.entity.OffreEmploi;
import com.rh.recrutement.entity.StatutCandidature;
import com.rh.recrutement.repository.CandidatRepository;
import com.rh.recrutement.repository.CandidatureRepository;
import com.rh.recrutement.repository.OffreEmploiRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final CandidatRepository candidatRepository;
    private final OffreEmploiRepository offreEmploiRepository;

    private final RestClient restClient;

    public CandidatureService(
            CandidatureRepository candidatureRepository,
            CandidatRepository candidatRepository,
            OffreEmploiRepository offreEmploiRepository) {

        this.candidatureRepository = candidatureRepository;
        this.candidatRepository = candidatRepository;
        this.offreEmploiRepository = offreEmploiRepository;

        this.restClient = RestClient.create();
    }

    public Candidature ajouterCandidature(Candidature candidature) {

        Long idCandidat = candidature
                .getCandidat()
                .getIdCandidat();

        Long idOffre = candidature
                .getOffre()
                .getIdOffre();

        // Vérifier si le candidat a déjà postulé
        boolean existe =
                candidatureRepository
                        .existsByCandidatIdCandidatAndOffreIdOffre(
                                idCandidat,
                                idOffre
                        );

        if (existe) {
            throw new RuntimeException(
                    "Vous avez déjà postulé à cette offre"
            );
        }

        // Récupérer le candidat complet depuis MySQL
        Candidat candidat = candidatRepository
                .findById(idCandidat)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Candidat introuvable"
                        )
                );

        // Récupérer l'offre complète depuis MySQL
        OffreEmploi offre = offreEmploiRepository
                .findById(idOffre)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Offre introuvable"
                        )
                );

        // Utiliser les vraies entités
        candidature.setCandidat(candidat);
        candidature.setOffre(offre);

        candidature.setDateCandidature(LocalDate.now());
        candidature.setStatut(StatutCandidature.EN_ANALYSE);

        // Analyse IA du CV
        Double score = analyserCv(candidat, offre);

        candidature.setScoreCompatibilite(score);

        // Enregistrer la candidature avec son score
        return candidatureRepository.save(candidature);
    }

    private Double analyserCv(
            Candidat candidat,
            OffreEmploi offre) {

        try {

            // Vérifier que le candidat possède un CV
            if (candidat.getCheminCv() == null ||
                    candidat.getCheminCv().isBlank()) {

                System.out.println(
                        "Aucun CV enregistré pour le candidat"
                );

                return null;
            }

            // Vérifier que l'offre possède des compétences
            if (offre.getCompetencesRequises() == null ||
                    offre.getCompetencesRequises().isBlank()) {

                System.out.println(
                        "Aucune compétence requise pour cette offre"
                );

                return null;
            }

            File fichierCv =
                    new File(candidat.getCheminCv());

            if (!fichierCv.exists()) {

                System.out.println(
                        "Fichier CV introuvable : "
                                + candidat.getCheminCv()
                );

                return null;
            }

            // Préparer les données multipart envoyées à Python
            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            body.add(
                    "cv",
                    new FileSystemResource(fichierCv)
            );

            body.add(
                    "competences_offre",
                    offre.getCompetencesRequises()
            );

            // Appeler FastAPI
            Map resultat = restClient
                    .post()
                    .uri(
                            "http://127.0.0.1:8000/analyser-cv"
                    )
                    .contentType(
                            MediaType.MULTIPART_FORM_DATA
                    )
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (resultat == null) {
                return null;
            }

            Object scoreObjet =
                    resultat.get(
                            "score_compatibilite"
                    );

            if (scoreObjet instanceof Number) {
                return ((Number) scoreObjet)
                        .doubleValue();
            }

            return null;

        } catch (Exception e) {

            System.out.println(
                    "Erreur lors de l'analyse IA : "
                            + e.getMessage()
            );

            return null;
        }
    }

    public List<Candidature> afficherCandidatures() {
        return candidatureRepository.findAll();
    }

    public Optional<Candidature> trouverParId(Long id) {
        return candidatureRepository.findById(id);
    }

    public List<Candidature> classerParScore(Long idOffre) {
        return candidatureRepository
                .findByOffreIdOffreOrderByScoreCompatibiliteDesc(
                        idOffre
                );
    }

    public Candidature modifierStatut(
            Long id,
            StatutCandidature nouveauStatut) {

        Candidature candidature =
                candidatureRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Candidature introuvable"
                                )
                        );

        candidature.setStatut(nouveauStatut);

        return candidatureRepository.save(
                candidature
        );
    }
}