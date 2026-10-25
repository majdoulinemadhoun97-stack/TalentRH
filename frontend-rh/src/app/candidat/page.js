"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EspaceCandidat() {
  const [offres, setOffres] = useState([]);
  const [candidat, setCandidat] = useState(null);
  const [offresPostulees, setOffresPostulees] = useState([]);
  const [message, setMessage] = useState("");

  const [cv, setCv] = useState(null);
  const [uploadEnCours, setUploadEnCours] = useState(false);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // 1. Charger les offres
        const responseOffres = await fetch(
          "http://localhost:8080/api/offres"
        );

        const dataOffres = await responseOffres.json();
        setOffres(dataOffres);

        // 2. Récupérer l'utilisateur connecté
        const utilisateurStocke =
          localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
          setMessage("Utilisateur non connecté");
          return;
        }

        const utilisateur = JSON.parse(utilisateurStocke);

        // 3. Retrouver son profil candidat
        const responseCandidats = await fetch(
          "http://localhost:8080/api/candidats"
        );

        const candidats = await responseCandidats.json();

        const candidatConnecte = candidats.find(
          (c) =>
            c.utilisateur?.idUtilisateur ===
            utilisateur.idUtilisateur
        );

        if (!candidatConnecte) {
          setMessage("Profil candidat introuvable");
          return;
        }

        setCandidat(candidatConnecte);

        // 4. Charger les candidatures
        const responseCandidatures = await fetch(
          "http://localhost:8080/api/candidatures"
        );

        const candidatures =
          await responseCandidatures.json();

        // 5. Garder les offres déjà postulées
        const idsOffresPostulees = candidatures
          .filter(
            (c) =>
              c.candidat?.idCandidat ===
              candidatConnecte.idCandidat
          )
          .map((c) => c.offre?.idOffre);

        setOffresPostulees(idsOffresPostulees);

      } catch (error) {
        console.error("Erreur :", error);
        setMessage("Une erreur est survenue");
      }
    };

    chargerDonnees();
  }, []);

  // Déposer ou remplacer le CV
  const deposerCv = async () => {
    if (!candidat) {
      setMessage("Profil candidat introuvable");
      return;
    }

    if (!cv) {
      setMessage("Veuillez sélectionner un CV");
      return;
    }

    if (cv.type !== "application/pdf") {
      setMessage("Le CV doit être au format PDF");
      return;
    }

    try {
      setUploadEnCours(true);

      const formData = new FormData();
      formData.append("cv", cv);

      const response = await fetch(
        `http://localhost:8080/api/candidats/${candidat.idCandidat}/cv`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors du dépôt du CV"
        );
      }

      const candidatModifie =
        await response.json();

      setCandidat(candidatModifie);
      setCv(null);

      setMessage("CV déposé avec succès");

    } catch (error) {
      console.error("Erreur :", error);

      setMessage(
        "Erreur lors du dépôt du CV"
      );

    } finally {
      setUploadEnCours(false);
    }
  };

  // Postuler à une offre
  const postuler = async (offre) => {
    if (!candidat) {
      setMessage("Profil candidat introuvable");
      return;
    }

    // Empêcher de postuler sans CV
    if (!candidat.cheminCv) {
      setMessage(
        "Veuillez d'abord déposer votre CV avant de postuler."
      );
      return;
    }

    const candidature = {
      lettreMotivation: null,
      scoreCompatibilite: null,

      candidat: {
        idCandidat: candidat.idCandidat,
      },

      offre: {
        idOffre: offre.idOffre,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/candidatures",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candidature),
        }
      );

      if (!response.ok) {
        setMessage(
          "Vous avez déjà postulé à cette offre"
        );
        return;
      }

      const data = await response.json();

      console.log(
        "Candidature créée :",
        data
      );

      setOffresPostulees((ancienneListe) => [
        ...ancienneListe,
        offre.idOffre,
      ]);

      setMessage(
        `Candidature envoyée pour "${offre.titre}" avec succès`
      );

    } catch (error) {
      console.error("Erreur :", error);

      setMessage(
        "Erreur lors de l'envoi de la candidature"
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
            href="/candidat"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-5">

            <Link
              href="/candidat"
              className="text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-semibold"
            >
              Offres
            </Link>

            <Link
              href="/candidat/mes-candidatures"
              className="text-slate-600 hover:text-blue-700 px-3 py-2 font-medium transition"
            >
              Mes candidatures
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


      {/* EN-TÊTE */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                👋 Espace candidat
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
                Trouvez l&apos;opportunité qui
                <span className="text-blue-700">
                  {" "}vous correspond
                </span>
              </h1>

              <p className="text-slate-600 mt-3 max-w-2xl">
                Consultez les offres disponibles, déposez votre CV
                et laissez TalentRH analyser la compatibilité de
                votre profil avec les besoins des recruteurs.
              </p>

            </div>

            {candidat && (
              <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">

                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                  Profil connecté
                </p>

                <p className="font-semibold text-slate-900 mt-1">
                  {candidat.utilisateur?.prenom}{" "}
                  {candidat.utilisateur?.nom}
                </p>

                {candidat.profilProfessionnel && (
                  <p className="text-sm text-slate-500 mt-1">
                    {candidat.profilProfessionnel}
                  </p>
                )}

              </div>
            )}

          </div>

        </div>

      </section>


      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* MESSAGE */}
        {message && (
          <div className="mb-8 bg-white border border-blue-100 rounded-xl px-5 py-4 shadow-sm flex items-start gap-3">

            <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              i
            </div>

            <p className="text-slate-700 pt-1">
              {message}
            </p>

          </div>
        )}


        {/* BLOC CV */}
        <section className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">

          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700"></div>

          <div className="p-7 lg:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="w-14 h-14 shrink-0 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-2xl">
                  📄
                </div>

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Mon CV
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Votre CV est utilisé pour analyser vos compétences
                    et calculer votre score de compatibilité.
                  </p>

                  {candidat?.cheminCv ? (

                    <div className="inline-flex items-center gap-2 mt-4 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      <span>✓</span>
                      CV enregistré
                    </div>

                  ) : (

                    <div className="inline-flex items-center gap-2 mt-4 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                      <span>!</span>
                      CV requis pour postuler
                    </div>

                  )}

                </div>

              </div>


              <div className="flex flex-col sm:flex-row gap-3 lg:max-w-xl">

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setCv(
                      e.target.files?.[0] || null
                    )
                  }
                  className="block w-full text-sm text-slate-600 border border-slate-300 rounded-xl bg-slate-50
                  file:mr-4 file:py-3 file:px-4
                  file:border-0 file:bg-slate-100
                  file:text-slate-700 file:font-medium
                  hover:file:bg-slate-200"
                />

                <button
                  type="button"
                  onClick={deposerCv}
                  disabled={uploadEnCours}
                  className="shrink-0 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {uploadEnCours
                    ? "Envoi..."
                    : candidat?.cheminCv
                    ? "Remplacer le CV"
                    : "Déposer le CV"}
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* TITRE OFFRES */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-12 mb-6">

          <div>

            <p className="text-blue-700 font-semibold text-sm">
              Opportunités
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Offres disponibles
            </h2>

            <p className="text-slate-500 mt-2">
              Découvrez les offres publiées par les recruteurs.
            </p>

          </div>

          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
            {offres.length}{" "}
            {offres.length > 1 ? "offres" : "offre"}
          </div>

        </div>


        {/* LISTE DES OFFRES */}
        {offres.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <div className="text-4xl">
              💼
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">
              Aucune offre disponible
            </h3>

            <p className="text-slate-500 mt-2">
              De nouvelles opportunités seront bientôt disponibles.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {offres.map((offre) => {

              const dejaPostule =
                offresPostulees.includes(
                  offre.idOffre
                );

              const cvDisponible =
                candidat?.cheminCv;

              const boutonDesactive =
                dejaPostule || !cvDisponible;

              let texteBouton = "Postuler maintenant";

              if (dejaPostule) {
                texteBouton = "✓ Déjà postulé";
              } else if (!cvDisponible) {
                texteBouton = "CV requis pour postuler";
              }

              const competences =
                offre.competencesRequises
                  ? offre.competencesRequises
                      .split(",")
                      .map((competence) =>
                        competence.trim()
                      )
                      .filter(Boolean)
                  : [];

              return (

                <article
                  key={offre.idOffre}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition duration-300 flex flex-col"
                >

                  {/* HAUT DE CARTE */}
                  <div className="flex justify-between items-start gap-4">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 shrink-0 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {offre.recruteur?.nomEntreprise
                          ?.charAt(0)
                          ?.toUpperCase() || "E"}
                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition">
                          {offre.titre}
                        </h3>

                        <p className="text-blue-700 font-semibold mt-1">
                          {offre.recruteur?.nomEntreprise}
                        </p>

                      </div>

                    </div>

                    {offre.typeContrat && (
                      <span className="shrink-0 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold">
                        {offre.typeContrat}
                      </span>
                    )}

                  </div>


                  {/* INFOS */}
                  <div className="flex flex-wrap gap-2 mt-5">

                    {offre.localisation && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                        📍 {offre.localisation}
                      </span>
                    )}

                    {offre.salaire && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                        💰 {offre.salaire} DH
                      </span>
                    )}

                    {offre.datePublication && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                        📅 {offre.datePublication}
                      </span>
                    )}

                  </div>


                  {/* DESCRIPTION */}
                  <p className="text-slate-600 mt-5 leading-relaxed">
                    {offre.description}
                  </p>


                  {/* COMPÉTENCES */}
                  {competences.length > 0 && (

                    <div className="mt-6">

                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Compétences recherchées
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {competences.map(
                          (competence, index) => (

                            <span
                              key={`${competence}-${index}`}
                              className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium"
                            >
                              {competence}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* BOUTON */}
                  <div className="mt-auto pt-7">

                    <button
                      type="button"
                      onClick={() =>
                        postuler(offre)
                      }
                      disabled={boutonDesactive}
                      className={
                        boutonDesactive
                          ? dejaPostule
                            ? "w-full bg-green-50 text-green-700 border border-green-100 px-5 py-3 rounded-xl font-semibold cursor-not-allowed"
                            : "w-full bg-slate-100 text-slate-400 border border-slate-200 px-5 py-3 rounded-xl font-semibold cursor-not-allowed"
                          : "w-full bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm"
                      }
                    >
                      {texteBouton}
                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

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