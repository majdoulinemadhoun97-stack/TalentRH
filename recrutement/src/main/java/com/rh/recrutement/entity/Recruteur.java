package com.rh.recrutement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruteurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recruteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRecruteur;

    private String nomEntreprise;
    private String posteOccupe;

    @OneToOne
    @JoinColumn(name = "id_utilisateur", unique = true, nullable = false)
    private Utilisateur utilisateur;
}