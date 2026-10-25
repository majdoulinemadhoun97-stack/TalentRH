"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EspaceRecruteur() {
  const [recruteur, setRecruteur] = useState(null);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [competencesRequises, setCompetencesRequises] =
    useState("");
  const [typeContrat, setTypeContrat] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [salaire, setSalaire] = useState("");
  const [message, setMessage] = useState("");

  // Retrouver le profil recruteur connecté
  useEffect(() => {
    const chargerRecruteur = async () => {
      try {
        const utilisateurStocke =
          localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
          setMessage("Utilisateur non connecté");
          return;
        }

        const utilisateur =
          JSON.parse(utilisateurStocke);

        const response = await fetch(
          "http://localhost:8080/api/recruteurs"
        );

        if (!response.ok) {
          throw new Error(
            "Erreur lors du chargement des recruteurs"
          );
        }

        const recruteurs = await response.json();

        const recruteurConnecte = recruteurs.find(
          (r) =>
            r.utilisateur?.idUtilisateur ===
            utilisateur.idUtilisateur
        );

        if (recruteurConnecte) {
          setRecruteur(recruteurConnecte);
        } else {
          setMessage("Profil recruteur introuvable");
        }

      } catch (error) {
        console.error(error);

        setMessage(
          "Erreur lors du chargement du profil"
        );
      }
    };

    chargerRecruteur();
  }, []);

  // Publier une offre
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recruteur) {
      setMessage("Profil recruteur introuvable");
      return;
    }

    const offre = {
      titre,
      description,
      competencesRequises,
      typeContrat,
      localisation,

      salaire: salaire
        ? Number(salaire)
        : null,

      datePublication:
        new Date()
          .toISOString()
          .split("T")[0],

      statut: "ACTIVE",

      recruteur: {
        idRecruteur:
          recruteur.idRecruteur,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/offres",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(offre),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la publication"
        );
      }

      const data =
        await response.json();

      console.log(
        "Offre publiée :",
        data
      );

      setMessage(
        "Offre publiée avec succès"
      );

      // Vider le formulaire
      setTitre("");
      setDescription("");
      setCompetencesRequises("");
      setTypeContrat("");
      setLocalisation("");
      setSalaire("");

    } catch (error) {
      console.error(error);

      setMessage(
        "Erreur lors de la publication de l'offre"
      );
    }
  };

  // Déconnexion
  const seDeconnecter = () => {
    localStorage.removeItem("utilisateur");
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap justify-between items-center gap-4">

          <Link
            href="/recruteur"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-5">

            <Link
              href="/recruteur"
              className="text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-semibold"
            >
              Publier une offre
            </Link>

            <Link
              href="/recruteur/candidatures"
              className="text-slate-600 hover:text-blue-700 px-3 py-2 font-medium transition"
            >
              Candidatures reçues
            </Link>

            <button
              type="button"
              onClick={seDeconnecter}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium transition"
            >
              Déconnexion
            </button>

          </div>

        </div>

      </nav>


      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                💼 Espace recruteur
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
                Trouvez les
                <span className="text-blue-700">
                  {" "}meilleurs talents
                </span>
              </h1>

              <p className="text-slate-600 mt-3 max-w-2xl">
                Publiez vos offres et laissez TalentRH
                analyser les candidatures afin
                d&apos;identifier les profils correspondant
                à vos besoins.
              </p>

            </div>


            {/* ENTREPRISE */}
            {recruteur && (

              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">

                <div className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {recruteur.nomEntreprise
                    ?.charAt(0)
                    ?.toUpperCase() || "E"}
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Entreprise
                  </p>

                  <p className="font-bold text-slate-900 mt-1">
                    {recruteur.nomEntreprise}
                  </p>

                  {recruteur.posteOccupe && (
                    <p className="text-sm text-slate-500">
                      {recruteur.posteOccupe}
                    </p>
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* CONTENU */}
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">

        {/* MESSAGE */}
        {message && (

          <div className="mb-7 bg-white border border-blue-100 rounded-xl p-4 shadow-sm flex items-center gap-3">

            <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              i
            </div>

            <p className="text-slate-700">
              {message}
            </p>

          </div>

        )}


        {/* FORMULAIRE */}
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* HAUT DU FORMULAIRE */}
          <div className="border-b border-slate-100 p-7 lg:p-8">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-2xl">
                📢
              </div>

              <div>

                <p className="text-blue-700 text-sm font-semibold">
                  Nouvelle opportunité
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Publier une offre d&apos;emploi
                </h2>

                <p className="text-slate-500 mt-2">
                  Renseignez les informations du poste et
                  les compétences recherchées.
                </p>

              </div>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="p-7 lg:p-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {/* TITRE */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Titre du poste
                </label>

                <input
                  type="text"
                  placeholder="Ex : Développeur Java"
                  value={titre}
                  onChange={(e) =>
                    setTitre(e.target.value)
                  }
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />

              </div>


              {/* DESCRIPTION */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description de l&apos;offre
                </label>

                <textarea
                  placeholder="Présentez les missions et les responsabilités du poste..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  required
                  rows="5"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition resize-none"
                />

              </div>


              {/* COMPÉTENCES */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Compétences requises
                </label>

                <input
                  type="text"
                  placeholder="Ex : Java, Spring Boot, MySQL, React, Git"
                  value={competencesRequises}
                  onChange={(e) =>
                    setCompetencesRequises(
                      e.target.value
                    )
                  }
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />

                <div className="flex items-start gap-2 mt-2">

                  <span className="text-blue-600">
                    💡
                  </span>

                  <p className="text-sm text-slate-500">
                    Séparez les compétences par des virgules.
                    Elles seront utilisées pour calculer le
                    score de compatibilité des candidats.
                  </p>

                </div>

              </div>


              {/* CONTRAT */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type de contrat
                </label>

                <select
                  value={typeContrat}
                  onChange={(e) =>
                    setTypeContrat(
                      e.target.value
                    )
                  }
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                >

                  <option value="">
                    Sélectionner un contrat
                  </option>

                  <option value="CDI">
                    CDI
                  </option>

                  <option value="CDD">
                    CDD
                  </option>

                  <option value="STAGE">
                    Stage
                  </option>

                  <option value="FREELANCE">
                    Freelance
                  </option>

                </select>

              </div>


              {/* LOCALISATION */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Localisation
                </label>

                <input
                  type="text"
                  placeholder="Ex : Oujda"
                  value={localisation}
                  onChange={(e) =>
                    setLocalisation(
                      e.target.value
                    )
                  }
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />

              </div>


              {/* SALAIRE */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Salaire mensuel
                  <span className="text-slate-400 font-normal">
                    {" "}(optionnel)
                  </span>
                </label>

                <div className="relative">

                  <input
                    type="number"
                    placeholder="Ex : 8000"
                    value={salaire}
                    onChange={(e) =>
                      setSalaire(
                        e.target.value
                      )
                    }
                    min="0"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-16 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    DH
                  </span>

                </div>

              </div>

            </div>


            {/* RÉSUMÉ IA */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 shrink-0 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                  🧠
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Matching intelligent TalentRH
                  </h3>

                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Lorsqu&apos;un candidat postulera,
                    son CV sera analysé et ses compétences
                    seront comparées à celles renseignées
                    dans cette offre afin de calculer son
                    score de compatibilité.
                  </p>

                </div>

              </div>

            </div>


            {/* BOUTON */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">

              <p className="text-sm text-slate-400">
                Les champs marqués comme obligatoires
                doivent être renseignés.
              </p>

              <button
                type="submit"
                className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm"
              >
                Publier l&apos;offre →
              </button>

            </div>

          </form>

        </section>

      </div>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 mt-16">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-white font-bold">
            TalentRH
          </p>

          <p className="text-sm">
            Recrutement intelligent basé sur les compétences
          </p>

        </div>

      </footer>

    </main>
  );
}