"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setChargement(true);

    const loginData = {
      email,
      motDePasse,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/utilisateurs/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        setMessage("Email ou mot de passe incorrect");
        setChargement(false);
        return;
      }

      const utilisateur = await response.json();

      console.log(
        "Utilisateur connecté :",
        utilisateur
      );

      // Mémoriser l'utilisateur connecté
      localStorage.setItem(
        "utilisateur",
        JSON.stringify(utilisateur)
      );

      setMessage("Connexion réussie");

      // Redirection selon le rôle
      if (utilisateur.role === "CANDIDAT") {
        router.push("/candidat");
      } else if (
        utilisateur.role === "RECRUTEUR"
      ) {
        router.push("/recruteur");
      }

    } catch (error) {
      console.error(
        "Erreur de connexion :",
        error
      );

      setMessage(
        "Impossible de se connecter au serveur"
      );
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <Link
            href="/inscription"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
          >
            Créer un compte
          </Link>

        </div>

      </nav>


      {/* CONTENU */}
      <section className="min-h-[calc(100vh-73px)] flex items-center">

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-12">

          <div className="grid lg:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto">

            {/* PARTIE GAUCHE */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-blue-700 to-blue-900 p-12 text-white flex-col justify-between">

              <div>

                <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-medium">
                  ✨ Recrutement intelligent
                </div>

                <h1 className="text-4xl font-bold leading-tight mt-7">
                  Le recrutement basé
                  sur les compétences.
                </h1>

                <p className="text-blue-100 mt-5 leading-relaxed">
                  TalentRH facilite la rencontre entre
                  les candidats et les recruteurs grâce
                  à l&apos;analyse des CV et au matching
                  intelligent.
                </p>

              </div>


              {/* FONCTIONNALITÉS */}
              <div className="space-y-4 mt-12">

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold">
                      Analyse du CV
                    </p>

                    <p className="text-sm text-blue-200">
                      Extraction des compétences
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold">
                      Matching intelligent
                    </p>

                    <p className="text-sm text-blue-200">
                      Comparaison avec les offres
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold">
                      Score de compatibilité
                    </p>

                    <p className="text-sm text-blue-200">
                      Classement des profils
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* PARTIE DROITE */}
            <div className="p-8 sm:p-12 lg:p-14">

              <div className="max-w-md mx-auto">

                <div className="lg:hidden mb-7">

                  <span className="inline-flex bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    TalentRH
                  </span>

                </div>

                <p className="text-blue-700 text-sm font-semibold">
                  Bienvenue
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  Connectez-vous
                </h2>

                <p className="text-slate-500 mt-3 mb-8">
                  Accédez à votre espace TalentRH.
                </p>


                {/* FORMULAIRE */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* EMAIL */}
                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Adresse email
                    </label>

                    <input
                      type="email"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    />

                  </div>


                  {/* MOT DE PASSE */}
                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mot de passe
                    </label>

                    <input
                      type="password"
                      placeholder="Votre mot de passe"
                      value={motDePasse}
                      onChange={(e) =>
                        setMotDePasse(
                          e.target.value
                        )
                      }
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    />

                  </div>


                  {/* MESSAGE */}
                  {message && (

                    <div
                      className={
                        message === "Connexion réussie"
                          ? "bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3 text-sm"
                          : "bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm"
                      }
                    >
                      {message}
                    </div>

                  )}


                  {/* BOUTON */}
                  <button
                    type="submit"
                    disabled={chargement}
                    className="w-full bg-blue-700 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {chargement
                      ? "Connexion..."
                      : "Se connecter"}
                  </button>

                </form>


                {/* INSCRIPTION */}
                <div className="mt-8 pt-7 border-t border-slate-100 text-center">

                  <p className="text-sm text-slate-500">
                    Vous n&apos;avez pas encore de compte ?
                  </p>

                  <Link
                    href="/inscription"
                    className="inline-block text-blue-700 font-semibold mt-2 hover:text-blue-800"
                  >
                    Créer un compte →
                  </Link>

                </div>


                {/* RETOUR */}
                <div className="text-center mt-6">

                  <Link
                    href="/"
                    className="text-sm text-slate-400 hover:text-slate-600 transition"
                  >
                    ← Retour à l&apos;accueil
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}