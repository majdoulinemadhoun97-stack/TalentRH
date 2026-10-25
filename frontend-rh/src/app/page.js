import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentRH
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="px-5 py-2.5 text-slate-700 font-medium hover:text-blue-700 transition"
            >
              Se connecter
            </Link>

            <Link
              href="/inscription"
              className="px-5 py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Créer un compte
            </Link>

          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">

          {/* TEXTE */}
          <div>

            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
               Recrutement intelligent
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Trouvez le talent
              <span className="text-blue-700">
                {" "}qui fait la différence
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              TalentRH facilite la rencontre entre candidats
              et recruteurs grâce à l&apos;analyse intelligente
              des CV et au matching basé sur les compétences.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                href="/inscription-candidat"
                className="px-7 py-3.5 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm"
              >
                Je suis candidat
              </Link>

              <Link
                href="/inscription-recruteur"
                className="px-7 py-3.5 bg-white text-blue-700 border border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Je suis recruteur
              </Link>

            </div>

            <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-500">

              <span>
                ✓ Analyse du CV
              </span>

              <span>
                ✓ Matching intelligent
              </span>

              <span>
                ✓ Score de compatibilité
              </span>

            </div>

          </div>


          {/* IMAGE */}
          <div className="relative">

            <div className="absolute -inset-5 bg-blue-100 rounded-3xl blur-3xl opacity-40"></div>

            <div className="relative bg-white p-3 rounded-3xl shadow-xl border border-slate-100">

              <Image
  src="/talentrh-hero-new.png"
  alt="TalentRH - plateforme intelligente de recrutement"
  width={1600}
  height={1000}
  priority
  unoptimized
  className="w-full h-auto rounded-2xl"
/>

            </div>

          </div>

        </div>

      </section>


      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 bg-white">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center">

            <p className="text-blue-700 font-semibold">
              Comment ça marche ?
            </p>

            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3">
              Un recrutement plus simple et plus intelligent
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              TalentRH analyse les compétences du candidat
              et les compare automatiquement aux besoins
              de chaque offre.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6 mt-14">

            {/* CARTE 1 */}
            <div className="border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📄
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mt-5">
                Analyse du CV
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Le candidat dépose son CV et TalentRH
                extrait automatiquement les compétences
                présentes dans son profil.
              </p>

            </div>


            {/* CARTE 2 */}
            <div className="border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🧠
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mt-5">
                Matching intelligent
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Les compétences du CV sont comparées
                aux compétences recherchées dans
                l&apos;offre d&apos;emploi.
              </p>

            </div>


            {/* CARTE 3 */}
            <div className="border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition">

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mt-5">
                Score de compatibilité
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Un score est calculé afin d&apos;aider
                le recruteur à identifier et classer
                les profils les plus adaptés.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* SECTION CANDIDAT / RECRUTEUR */}
      <section className="bg-slate-50 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-8">

            {/* CANDIDAT */}
            <div className="bg-white border border-slate-200 rounded-3xl p-9">

              <span className="text-3xl">
                👩‍💻
              </span>

              <h3 className="text-2xl font-bold text-slate-900 mt-5">
                Vous êtes candidat ?
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Créez votre profil, déposez votre CV,
                consultez les offres disponibles et
                suivez vos candidatures.
              </p>

              <Link
                href="/inscription-candidat"
                className="inline-block mt-6 text-blue-700 font-semibold hover:underline"
              >
                Créer mon profil →
              </Link>

            </div>


            {/* RECRUTEUR */}
            <div className="bg-blue-700 rounded-3xl p-9 text-white">

              <span className="text-3xl">
                💼
              </span>

              <h3 className="text-2xl font-bold mt-5">
                Vous êtes recruteur ?
              </h3>

              <p className="text-blue-100 mt-3 leading-relaxed">
                Publiez vos offres, consultez les
                candidatures et identifiez rapidement
                les profils correspondant à vos besoins.
              </p>

              <Link
                href="/inscription-recruteur"
                className="inline-block mt-6 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Espace recruteur
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row gap-4 justify-between items-center">

          <p className="text-white font-bold text-lg">
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