"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CandidaturesRecruteur() {
  const [candidatures, setCandidatures] = useState([]);
  const [offres, setOffres] = useState([]);
  const [offreSelectionnee, setOffreSelectionnee] = useState("");
  const [recruteur, setRecruteur] = useState(null);
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // 1. Utilisateur connecté
        const utilisateurStocke =
          localStorage.getItem("utilisateur");

        if (!utilisateurStocke) {
          setMessage("Utilisateur non connecté");
          setChargement(false);
          return;
        }

        const utilisateur = JSON.parse(utilisateurStocke);

        // 2. Recruteur connecté
        const responseRecruteurs = await fetch(
          "http://localhost:8080/api/recruteurs"
        );

        const recruteurs = await responseRecruteurs.json();

        const recruteurConnecte = recruteurs.find(
          (r) =>
            r.utilisateur?.idUtilisateur ===
            utilisateur.idUtilisateur
        );

        if (!recruteurConnecte) {
          setMessage("Profil recruteur introuvable");
          setChargement(false);
          return;
        }

        setRecruteur(recruteurConnecte);

        // 3. Offres du recruteur
        const responseOffres = await fetch(
          "http://localhost:8080/api/offres"
        );

        const toutesLesOffres =
          await responseOffres.json();

        const mesOffres = toutesLesOffres.filter(
          (offre) =>
            offre.recruteur?.idRecruteur ===
            recruteurConnecte.idRecruteur
        );

        setOffres(mesOffres);

        // 4. Candidatures
        const responseCandidatures = await fetch(
          "http://localhost:8080/api/candidatures"
        );

        const toutesLesCandidatures =
          await responseCandidatures.json();

        const mesCandidatures =
          toutesLesCandidatures.filter(
            (c) =>
              c.offre?.recruteur?.idRecruteur ===
              recruteurConnecte.idRecruteur
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

    chargerDonnees();
  }, []);

  // Modifier le statut
  const modifierStatut = async (
    idCandidature,
    nouveauStatut
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/candidatures/${idCandidature}/statut?statut=${nouveauStatut}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la modification du statut"
        );
      }

      const candidatureModifiee =
        await response.json();

      setCandidatures((ancienneListe) =>
        ancienneListe.map((c) =>
          c.idCandidature === idCandidature
            ? candidatureModifiee
            : c
        )
      );

      setMessage("Statut modifié avec succès");

    } catch (error) {
      console.error("Erreur :", error);

      setMessage(
        "Impossible de modifier le statut"
      );
    }
  };

  // Filtrer par offre
  const candidaturesFiltrees = offreSelectionnee
    ? candidatures.filter(
        (c) =>
          c.offre?.idOffre ===
          Number(offreSelectionnee)
      )
    : candidatures;

  // Trier par score décroissant
  const candidaturesTriees = [
    ...candidaturesFiltrees,
  ].sort((a, b) => {
    const scoreA =
      a.scoreCompatibilite != null
        ? a.scoreCompatibilite
        : -1;

    const scoreB =
      b.scoreCompatibilite != null
        ? b.scoreCompatibilite
        : -1;

    return scoreB - scoreA;
  });

  // Rang avec gestion des égalités
  const obtenirRang = (index) => {
    const candidatureActuelle =
      candidaturesTriees[index];

    if (
      candidatureActuelle.scoreCompatibilite == null
    ) {
      return null;
    }

    const scoresSuperieurs = [
      ...new Set(
        candidaturesTriees
          .filter(
            (c) =>
              c.scoreCompatibilite != null &&
              c.scoreCompatibilite >
                candidatureActuelle.scoreCompatibilite
          )
          .map(
            (c) => c.scoreCompatibilite
          )
      ),
    ];

    return scoresSuperieurs.length + 1;
  };

  // Texte statut
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

  // Couleur du statut
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

  // Couleur barre score
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
            href="/recruteur"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-5">

            <Link
              href="/recruteur"
              className="text-slate-600 hover:text-blue-700 px-3 py-2 font-medium transition"
            >
              Publier une offre
            </Link>

            <Link
              href="/recruteur/candidatures"
              className="text-blue-700 bg-blue-50 px-4 py-2 rounded-lg font-semibold"
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
                📊 Gestion des candidatures
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-4">
                Candidatures
                <span className="text-blue-700">
                  {" "}reçues
                </span>
              </h1>

              <p className="text-slate-600 mt-3 max-w-2xl">
                Analysez les profils, consultez leur score
                de compatibilité et identifiez rapidement
                les candidats correspondant à vos offres.
              </p>

            </div>


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

                </div>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* MESSAGE */}
        {message && (
          <div className="mb-7 bg-white border border-blue-100 rounded-xl p-4 shadow-sm flex items-center gap-3">

            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              i
            </div>

            <p className="text-slate-700">
              {message}
            </p>

          </div>
        )}


        {/* STATISTIQUES */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Candidatures
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {candidatures.length}
            </p>

          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Offres publiées
            </p>

            <p className="text-3xl font-bold text-blue-700 mt-2">
              {offres.length}
            </p>

          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Profils présélectionnés
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {
                candidatures.filter(
                  (c) =>
                    c.statut === "PRESELECTIONNEE" ||
                    c.statut === "ACCEPTEE"
                ).length
              }
            </p>

          </div>

        </div>


        {/* FILTRE */}
        {offres.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <p className="text-blue-700 font-semibold text-sm">
                  Classement intelligent
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Filtrer les candidats par offre
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Sélectionnez une offre pour afficher
                  le classement selon le score de compatibilité.
                </p>

              </div>


              <select
                value={offreSelectionnee}
                onChange={(e) =>
                  setOffreSelectionnee(
                    e.target.value
                  )
                }
                className="border border-slate-300 rounded-xl px-4 py-3 bg-white min-w-full lg:min-w-80 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >

                <option value="">
                  Toutes les offres
                </option>

                {offres.map((offre) => (
                  <option
                    key={offre.idOffre}
                    value={offre.idOffre}
                  >
                    {offre.titre}
                  </option>
                ))}

              </select>

            </div>

          </section>
        )}


        {/* CHARGEMENT */}
        {chargement ? (

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-700 rounded-full animate-spin mx-auto"></div>

            <p className="text-slate-500 mt-4">
              Chargement des candidatures...
            </p>

          </div>

        ) : candidaturesTriees.length === 0 ? (

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <div className="text-4xl">
              👥
            </div>

            <h3 className="text-xl font-bold text-slate-900 mt-4">
              Aucune candidature
            </h3>

            <p className="text-slate-500 mt-2">
              Aucune candidature reçue pour cette offre.
            </p>

          </div>

        ) : (

          <>
            {/* TITRE LISTE */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-10 mb-6">

              <div>

                <p className="text-blue-700 font-semibold text-sm">
                  {offreSelectionnee
                    ? "Classement TalentRH"
                    : "Tous les profils"}
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {offreSelectionnee
                    ? "Candidats classés par compatibilité"
                    : "Liste des candidatures"}
                </h2>

              </div>

              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                {candidaturesTriees.length}{" "}
                {candidaturesTriees.length > 1
                  ? "candidats"
                  : "candidat"}
              </div>

            </div>


            {/* CARTES */}
            <div className="grid lg:grid-cols-2 gap-6">

              {candidaturesTriees.map(
                (candidature, index) => {

                  const rang =
                    obtenirRang(index);

                  const score =
                    candidature.scoreCompatibilite;

                  const prenom =
                    candidature.candidat
                      ?.utilisateur?.prenom || "";

                  const nom =
                    candidature.candidat
                      ?.utilisateur?.nom || "";

                  const initiale =
                    prenom?.charAt(0)?.toUpperCase() ||
                    nom?.charAt(0)?.toUpperCase() ||
                    "C";

                  return (

                    <article
                      key={candidature.idCandidature}
                      className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition duration-300"
                    >

                      {/* RANG */}
                      {offreSelectionnee &&
                        rang != null && (

                          <div
                            className={
                              rang === 1
                                ? "absolute -top-3 -right-3 bg-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-md"
                                : "absolute -top-3 -right-3 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-xl font-bold"
                            }
                          >
                            #{rang}
                          </div>

                        )}


                      {/* CANDIDAT */}
                      <div className="flex items-start gap-4 pr-12">

                        <div className="w-14 h-14 shrink-0 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold">
                          {initiale}
                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-slate-900">
                            {prenom} {nom}
                          </h3>

                          <p className="text-blue-700 font-semibold mt-1">
                            {candidature.offre?.titre}
                          </p>

                          {candidature.candidat
                            ?.profilProfessionnel && (

                            <p className="text-sm text-slate-500 mt-1">
                              {
                                candidature.candidat
                                  .profilProfessionnel
                              }
                            </p>

                          )}

                        </div>

                      </div>


                      {/* DATE */}
                      <div className="flex flex-wrap gap-2 mt-5">

                        <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm">
                          📅{" "}
                          {candidature.dateCandidature}
                        </span>

                        <span
                          className={`px-3 py-2 rounded-lg text-sm font-semibold ${couleurStatut(
                            candidature.statut
                          )}`}
                        >
                          {afficherStatut(
                            candidature.statut
                          )}
                        </span>

                      </div>


                      {/* SCORE */}
                      {score != null ? (

                        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5">

                          <div className="flex justify-between items-center">

                            <div>

                              <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                                Matching TalentRH
                              </p>

                              <p className="text-sm font-semibold text-slate-700 mt-1">
                                Score de compatibilité
                              </p>

                            </div>

                            <div>

                              <span className="text-3xl font-bold text-blue-700">
                                {score}
                              </span>

                              <span className="text-blue-700 font-bold">
                                %
                              </span>

                            </div>

                          </div>


                          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-4">

                            <div
                              className={`h-full rounded-full ${couleurScore(
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

                        </div>

                      ) : (

                        <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-3">

                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            🧠
                          </div>

                          <div>

                            <p className="font-semibold text-slate-700">
                              Analyse en cours
                            </p>

                            <p className="text-sm text-slate-500">
                              Score non disponible.
                            </p>

                          </div>

                        </div>

                      )}


                      {/* MODIFIER STATUT */}
                      <div className="mt-6 pt-5 border-t border-slate-100">

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Mettre à jour le statut
                        </label>

                        <select
                          value={candidature.statut}
                          onChange={(e) =>
                            modifierStatut(
                              candidature.idCandidature,
                              e.target.value
                            )
                          }
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        >

                          <option value="RECUE">
                            Reçue
                          </option>

                          <option value="EN_ANALYSE">
                            En analyse
                          </option>

                          <option value="PRESELECTIONNEE">
                            Présélectionnée
                          </option>

                          <option value="REFUSEE">
                            Refusée
                          </option>

                          <option value="ACCEPTEE">
                            Acceptée
                          </option>

                        </select>

                      </div>

                    </article>

                  );
                }
              )}

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