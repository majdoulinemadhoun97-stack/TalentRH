
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionRecruteur() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [posteOccupe, setPosteOccupe] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const [afficherMotDePasse, setAfficherMotDePasse] =
    useState(false);
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setChargement(true);
    setMessage("");
    setSucces(false);

    try {
      // 1. Création de l'utilisateur
      const utilisateur = {
        nom,
        prenom,
        email,
        motDePasse,
        telephone,
        role: "RECRUTEUR",
      };

      const response = await fetch(
        "http://localhost:8080/api/utilisateurs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(utilisateur),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de créer le compte. Vérifiez vos informations."
        );
      }

      const data = await response.json();

      if (!data.idUtilisateur) {
        throw new Error(
          "Le serveur n'a pas retourné l'identifiant utilisateur."
        );
      }

      // 2. Création du profil recruteur
      const recruteur = {
        nomEntreprise,
        posteOccupe,
        utilisateur: {
          idUtilisateur: data.idUtilisateur,
        },
      };

      const responseRecruteur = await fetch(
        "http://localhost:8080/api/recruteurs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recruteur),
        }
      );

      if (!responseRecruteur.ok) {
        throw new Error(
          "Compte créé, mais le profil recruteur n'a pas pu être enregistré."
        );
      }

      setSucces(true);
      setMessage(
        "Votre compte recruteur a été créé avec succès !"
      );

      router.push("/login");

    } catch (error) {
      console.error(
        "Erreur d'inscription :",
        error
      );

      setMessage(
        error.message ||
        "Une erreur est survenue lors de l'inscription."
      );

    } finally {
      setChargement(false);
    }
  };

  const styleChamp =
    "w-full border border-slate-300 rounded-xl px-4 py-3.5 " +
    "bg-white text-slate-900 outline-none " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

  const styleLabel =
    "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-blue-700"
          >
            Se connecter
          </Link>

        </div>
      </nav>

      {/* CONTENU */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 py-14 px-5">

        <div className="max-w-3xl mx-auto">

          {/* INTRODUCTION */}
          <div className="text-center mb-9">

            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Espace recruteur
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-5">
              Créez votre{" "}
              <span className="text-blue-700">
                compte recruteur
              </span>
            </h1>

            <p className="text-slate-500 mt-4 max-w-lg mx-auto leading-relaxed">
              Rejoignez TalentRH, publiez vos offres
              d'emploi et identifiez les candidats
              correspondant aux besoins de votre entreprise.
            </p>

          </div>

          {/* FORMULAIRE */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">

            {/* EN-TÊTE */}
            <div className="p-7 md:p-10 border-b border-slate-100">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-2xl">
                  💼
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Informations du recruteur
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Complétez les informations pour créer
                    votre compte professionnel.
                  </p>
                </div>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-7 md:p-10 space-y-6"
            >

              {/* NOM ET PRÉNOM */}
              <div className="grid sm:grid-cols-2 gap-5">

                <div>
                  <label className={styleLabel}>
                    Nom
                  </label>

                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) =>
                      setNom(e.target.value)
                    }
                    required
                    className={styleChamp}
                  />
                </div>

                <div>
                  <label className={styleLabel}>
                    Prénom
                  </label>

                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={prenom}
                    onChange={(e) =>
                      setPrenom(e.target.value)
                    }
                    required
                    className={styleChamp}
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div>
                <label className={styleLabel}>
                  Adresse email
                </label>

                <input
                  type="email"
                  placeholder="exemple@entreprise.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  className={styleChamp}
                />
              </div>

              {/* TÉLÉPHONE */}
              <div>
                <label className={styleLabel}>
                  Téléphone
                </label>

                <input
                  type="tel"
                  placeholder="Ex : 0612345678"
                  value={telephone}
                  onChange={(e) =>
                    setTelephone(e.target.value)
                  }
                  required
                  className={styleChamp}
                />
              </div>

              {/* ENTREPRISE */}
              <div className="pt-5 border-t border-slate-100">

                <h3 className="text-lg font-bold text-slate-900">
                  Informations professionnelles
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Présentez votre entreprise et votre fonction.
                </p>

                <div className="space-y-6">

                  <div>
                    <label className={styleLabel}>
                      Nom de l'entreprise
                    </label>

                    <input
                      type="text"
                      placeholder="Ex : SQLI"
                      value={nomEntreprise}
                      onChange={(e) =>
                        setNomEntreprise(e.target.value)
                      }
                      required
                      className={styleChamp}
                    />
                  </div>

                  <div>
                    <label className={styleLabel}>
                      Poste occupé
                    </label>

                    <input
                      type="text"
                      placeholder="Ex : Responsable recrutement"
                      value={posteOccupe}
                      onChange={(e) =>
                        setPosteOccupe(e.target.value)
                      }
                      required
                      className={styleChamp}
                    />
                  </div>

                </div>

              </div>

              {/* MOT DE PASSE */}
              <div className="pt-5 border-t border-slate-100">

                <label className={styleLabel}>
                  Mot de passe
                </label>

                <div className="relative">

                  <input
                    type={
                      afficherMotDePasse
                        ? "text"
                        : "password"
                    }
                    placeholder="Créez votre mot de passe"
                    value={motDePasse}
                    onChange={(e) =>
                      setMotDePasse(e.target.value)
                    }
                    required
                    minLength={8}
                    className={`${styleChamp} pr-24`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherMotDePasse(
                        !afficherMotDePasse
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {afficherMotDePasse
                      ? "Masquer"
                      : "Afficher"}
                  </button>

                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Utilisez au moins 8 caractères.
                </p>

              </div>

              {/* MESSAGE */}
              {message && (
                <div
                  className={
                    succes
                      ? "bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm"
                      : "bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
                  }
                >
                  {message}
                </div>
              )}

              {/* BOUTON */}
              <button
                type="submit"
                disabled={chargement}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chargement
                  ? "Création du compte..."
                  : "Créer mon compte recruteur →"}
              </button>

              {/* CONNEXION */}
              <p className="text-center text-sm text-slate-500">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Se connecter
                </Link>
              </p>

            </form>

          </div>

          {/* RETOUR */}
          <div className="text-center mt-8">

            <Link
              href="/inscription"
              className="text-sm font-medium text-slate-500 hover:text-blue-700 transition"
            >
              ← Choisir un autre type de compte
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-white font-bold">
            TalentRH
          </p>

          <p className="text-sm">
            Plateforme intelligente de gestion des candidatures RH
          </p>

        </div>

      </footer>

    </main>
  );
}
