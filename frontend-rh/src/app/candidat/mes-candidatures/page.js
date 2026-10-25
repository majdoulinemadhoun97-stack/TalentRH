"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const chargerCandidatures = async () => {
      try {
        // 1. Récupérer l'utilisateur connecté
        const utilisateurStocke =
          localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
          setMessage("Utilisateur non connecté");
          setChargement(false);
          return;
        }

        const utilisateur =
          JSON.parse(utilisateurStocke);

        // 2. Récupérer les candidats
        const responseCandidats = await fetch(
          "http://localhost:8080/api/candidats"
        );

        const candidats =
          await responseCandidats.json();

        // 3. Retrouver le candidat connecté
        const candidatConnecte = candidats.find(
          (c) =>
            c.utilisateur?.idUtilisateur ===
            utilisateur.idUtilisateur
        );

        if (!candidatConnecte) {
          setMessage("Profil candidat introuvable");
          setChargement(false);
          return;
        }

        // 4. Récupérer toutes les candidatures
        const responseCandidatures = await fetch(
          "http://localhost:8080/api/candidatures"
        );

        const toutesLesCandidatures =
          await responseCandidatures.json();

        // 5. Garder seulement celles du candidat connecté
        const mesCandidatures =
          toutesLesCandidatures.filter(
            (c) =>
              c.candidat?.idCandidat ===
              candidatConnecte.idCandidat
          );

        setCandidatures(mesCandidatures);
        setChargement(false);

      } catch (error) {
        console.error("Erreur :", error);

        setMessage(
          "Erreur lors du chargement des candidatures"
        );

        setChargement(false);
      }
    };

    chargerCandidatures();
  }, []);

  // Affichage du statut
  const afficherStatut = (statut) => {
    switch (statut) {
      case "RECUE":
        return "Reçue";

      case "EN_ANALYSE":
        return "En analyse";

      case "PRESELECTIONNEE":
        return "Présélectionnée";

      case "REFUSEE":
        return "Refusée";

      case "ACCEPTEE":
        return "Acceptée";

      default:
        return statut;
    }
  };

  // Couleur du badge selon le statut
  const couleurStatut = (statut) => {
    switch (statut) {
      case "RECUE":
        return "bg-slate-100 text-slate-700";

      case "EN_ANALYSE":
        return "bg-amber-50 text-amber-700";

      case "PRESELECTIONNEE":
        return "bg-blue-50 text-blue-700";

      case "REFUSEE":
        return "bg-red-50 text-red-700";

      case "ACCEPTEE":
        return "bg-green-50 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Couleur de la barre du score
  const couleurScore = (score) => {
    if (score >= 75) {
      return "bg-green-500";
    }

    if (score >= 50) {
      return "bg-blue-600";
    }

    return "bg-amber-500";
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
              className="text-slate-600 hover:text-blue-700 px-3 py-2 font-medium transition"
            >
              Offres
            </Link>

            <Link
              href="/candidat/mes-candidatures"
              className="text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-semibold"
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


      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-slate-100">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            📊 Suivi des candidatures
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
            Mes
            <span className="text-blue-700">
              {" "}candidatures
            </span>
          </h1>

          <p className="text-slate-600 mt-3 max-w-2xl">
            Suivez l&apos;avancement de vos candidatures
            et consultez votre score de compatibilité
            calculé par TalentRH.
          </p>

        </div>

      </section>


      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* MESSAGE */}
        {message && (
          <div className="mb-7 bg-white border border-blue-100 rounded-xl p-4 shadow-sm">

            <p className="text-slate-700">
              {message}
            </p>

          </div>
        )}


        {/* CHARGEMENT */}
        {chargement ? (

          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto"></div>

            <p className="text-slate-500 mt-4">
              Chargement de vos candidatures...
            </p>

          </div>

        ) : candidatures.length === 0 ? (

          /* AUCUNE CANDIDATURE */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">

            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              💼
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-5">
              Aucune candidature
            </h2>

            <p className="text-slate-500 mt-2">
              Vous n&apos;avez encore postulé à aucune offre.
            </p>

            <Link
              href="/candidat"
              className="inline-block mt-6 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
            >
              Découvrir les offres
            </Link>

          </div>

        ) : (

          <>
            {/* COMPTEUR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">

              <div>

                <p className="text-blue-700 font-semibold text-sm">
                  Votre suivi
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Candidatures envoyées
                </h2>

              </div>

              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                {candidatures.length}{" "}
                {candidatures.length > 1
                  ? "candidatures"
                  : "candidature"}
              </div>

            </div>


            {/* CARTES */}
            <div className="grid lg:grid-cols-2 gap-6">

              {candidatures.map((candidature) => {

                const score =
                  candidature.scoreCompatibilite;

                const entreprise =
                  candidature.offre?.recruteur
                    ?.nomEntreprise;

                return (

                  <article
                    key={candidature.idCandidature}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition duration-300"
                  >

                    {/* EN-TÊTE CARTE */}
                    <div className="flex justify-between items-start gap-4">

                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 shrink-0 bg-blue-700 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                          {entreprise
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}
                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-slate-900">
                            {candidature.offre?.titre}
                          </h3>

                          <p className="text-blue-700 font-semibold mt-1">
                            {entreprise}
                          </p>

                        </div>

                      </div>


                      {/* STATUT */}
                      <span
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${couleurStatut(
                          candidature.statut
                        )}`}
                      >
                        {afficherStatut(
                          candidature.statut
                        )}
                      </span>

                    </div>


                    {/* INFORMATIONS */}
                    <div className="flex flex-wrap gap-2 mt-5">

                      {candidature.offre?.localisation && (
                        <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                          📍{" "}
                          {
                            candidature.offre
                              .localisation
                          }
                        </span>
                      )}

                      {candidature.offre?.typeContrat && (
                        <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                          📄{" "}
                          {
                            candidature.offre
                              .typeContrat
                          }
                        </span>
                      )}

                      <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                        📅{" "}
                        {candidature.dateCandidature}
                      </span>

                    </div>


                    {/* SCORE IA */}
                    {score != null ? (

                      <div className="mt-7 bg-slate-50 border border-slate-100 rounded-2xl p-5">

                        <div className="flex justify-between items-center">

                          <div>

                            <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                              Matching TalentRH
                            </p>

                            <p className="text-sm font-semibold text-slate-700 mt-1">
                              Score de compatibilité
                            </p>

                          </div>

                          <div className="text-right">

                            <span className="text-3xl font-bold text-blue-700">
                              {score}
                            </span>

                            <span className="text-blue-700 font-semibold">
                              %
                            </span>

                          </div>

                        </div>


                        {/* BARRE DE SCORE */}
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-4">

                          <div
                            className={`h-full rounded-full transition-all duration-500 ${couleurScore(
                              score
                            )}`}
                            style={{
                              width: `${Math.min(
                                Math.max(score, 0),
                                100
                              )}%`,
                            }}
                          ></div>

                        </div>


                        <div className="flex justify-between mt-2 text-xs text-slate-400">

                          <span>0 %</span>
                          <span>100 %</span>

                        </div>

                      </div>

                    ) : (

                      <div className="mt-7 bg-slate-50 border border-slate-100 rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            🧠
                          </div>

                          <div>

                            <p className="font-semibold text-slate-700">
                              Analyse en cours
                            </p>

                            <p className="text-sm text-slate-500">
                              Le score de compatibilité
                              n&apos;est pas encore disponible.
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                  </article>

                );
              })}

            </div>

          </>

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