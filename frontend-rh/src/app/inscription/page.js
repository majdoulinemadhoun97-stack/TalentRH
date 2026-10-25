import Link from "next/link";

export default function Inscription() {
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
            className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
          >
            Se connecter
          </Link>

        </div>
      </nav>


      {/* CONTENU */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 min-h-[calc(100vh-80px)] flex items-center">

        <div className="max-w-5xl mx-auto w-full px-6 py-16">

          {/* INTRODUCTION */}
          <div className="text-center">

            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Bienvenue sur TalentRH
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-6">
              Rejoignez
              <span className="text-blue-700">
                {" "}TalentRH
              </span>
            </h1>

            <p className="text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Créez votre compte et découvrez une nouvelle
              façon de connecter les talents aux
              opportunités professionnelles.
            </p>

            <h2 className="text-lg font-semibold text-slate-700 mt-8">
              Quel type de compte souhaitez-vous créer ?
            </h2>

          </div>


          {/* CARTES */}
          <div className="grid md:grid-cols-2 gap-7 mt-10">

            {/* CANDIDAT */}
            <Link
              href="/inscription-candidat"
              className="group bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >

              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👩‍💻
              </div>

              <div className="mt-7">

                <p className="text-sm font-semibold text-blue-700">
                  ESPACE CANDIDAT
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Je suis candidat
                </h3>

                <p className="text-slate-500 mt-4 leading-relaxed">
                  Découvrez les offres d'emploi, déposez
                  votre CV et trouvez des opportunités
                  correspondant à vos compétences.
                </p>

              </div>


              {/* FONCTIONNALITÉS */}
              <div className="space-y-3 mt-8 mb-9">

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Créer mon profil professionnel
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Déposer mon CV
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Suivre mes candidatures
                </div>

              </div>


              {/* BOUTON */}
              <div className="mt-auto bg-blue-700 text-white text-center py-3.5 rounded-xl font-semibold group-hover:bg-blue-800 transition">
                Créer un compte candidat →
              </div>

            </Link>


            {/* RECRUTEUR */}
            <Link
              href="/inscription-recruteur"
              className="group bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >

              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                💼
              </div>

              <div className="mt-7">

                <p className="text-sm font-semibold text-blue-700">
                  ESPACE RECRUTEUR
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Je suis recruteur
                </h3>

                <p className="text-slate-500 mt-4 leading-relaxed">
                  Publiez vos offres, analysez les
                  candidatures et identifiez les profils
                  correspondant aux besoins de votre entreprise.
                </p>

              </div>


              {/* FONCTIONNALITÉS */}
              <div className="space-y-3 mt-8 mb-9">

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Publier mes offres d'emploi
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Consulter les scores de compatibilité
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="text-blue-600 font-bold">✓</span>
                  Classer et gérer les candidatures
                </div>

              </div>


              {/* BOUTON */}
              <div className="mt-auto bg-slate-900 text-white text-center py-3.5 rounded-xl font-semibold group-hover:bg-blue-700 transition">
                Créer un compte recruteur →
              </div>

            </Link>

          </div>


          {/* CONNEXION */}
          <div className="text-center mt-10">

            <p className="text-slate-500">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-blue-700 font-semibold hover:underline"
              >
                Se connecter
              </Link>
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">

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