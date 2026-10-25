package com.rh.recrutement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "offres_emploi")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OffreEmploi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOffre;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String competencesRequises;

    private String typeContrat;
    private String localisation;
    private Double salaire;
    private LocalDate datePublication;
    private String statut;

    @ManyToOne
    @JoinColumn(name = "id_recruteur", nullable = false)
    private Recruteur recruteur;
}
