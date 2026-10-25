package com.rh.recrutement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Candidat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCandidat;

    private String profilProfessionnel;

    private String cheminCv;

    @OneToOne
    @JoinColumn(name = "id_utilisateur", unique = true, nullable = false)
    private Utilisateur utilisateur;
}