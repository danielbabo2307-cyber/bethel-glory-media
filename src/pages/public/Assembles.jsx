import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import dani from "../../assets/dani.jpg"

function Assembles() {
  // ==========================================================
  // RÉCUPÉRER LES ASSEMBLÉES DE L'ADMINISTRATION
  // ==========================================================

  const getAssemblies = () => {
    try {
      const saved = localStorage.getItem("bethel_assemblies")

      if (saved) {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed)) {
          return parsed
        }
      }

      return []
    } catch (error) {
      console.error(
        "❌ Impossible de récupérer les assemblées :",
        error
      )

      return []
    }
  }

  // ==========================================================
  // ÉTAT DES ASSEMBLÉES
  // ==========================================================

  const [assemblies, setAssemblies] = useState(getAssemblies)

  // ==========================================================
  // SYNCHRONISATION AVEC L'ADMINISTRATION
  // ==========================================================

  useEffect(() => {
    const updateAssemblies = () => {
      setAssemblies(getAssemblies())
    }

    window.addEventListener("storage", updateAssemblies)
    window.addEventListener("focus", updateAssemblies)

    return () => {
      window.removeEventListener("storage", updateAssemblies)
      window.removeEventListener("focus", updateAssemblies)
    }
  }, [])

  // ==========================================================
  // IMAGE DE L'ASSEMBLÉE
  // ==========================================================

  const getImage = (logo) => {
    if (!logo) {
      return dani
    }

    return logo
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8f7]">

      {/* ==================================================
          ANIMATION CSS LOCALE
      ================================================== */}

      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(45px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floating {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -22px, 0);
          }
        }

        @keyframes floatingReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, 18px, 0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes numberPop {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lineGrow {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .hero-fade-up {
          animation: heroFadeUp 1s ease-out both;
        }

        .hero-fade-down {
          animation: heroFadeDown 0.9s ease-out both;
        }

        .hero-scale {
          animation: heroScale 0.9s ease-out both;
        }

        .floating {
          animation: floating 6s ease-in-out infinite;
        }

        .floating-reverse {
          animation: floatingReverse 7s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .card-appear {
          animation: cardAppear 0.8s ease-out both;
        }

        .icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }

        .number-pop {
          animation: numberPop 0.6s ease-out both;
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.12),
            transparent
          );
          transform: translateX(-120%);
          animation: shimmer 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up,
          .hero-fade-down,
          .hero-scale,
          .floating,
          .floating-reverse,
          .pulse-glow,
          .card-appear,
          .icon-float,
          .number-pop,
          .shimmer-effect::after {
            animation: none !important;
          }
        }
      `}</style>


      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-green-950 pt-32">

        {/* ==================================================
            DÉCORATIONS ANIMÉES
        ================================================== */}

        <div
          className="floating absolute -left-32 top-20 h-96 w-96 rounded-full bg-green-500/20 blur-3xl"
        />

        <div
          className="floating-reverse absolute -right-32 top-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"
        />

        <div
          className="pulse-glow absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-400/10 blur-3xl"
        />

        {/* Petits points décoratifs */}

        <div className="absolute left-[15%] top-36 h-2 w-2 animate-ping rounded-full bg-yellow-300/70" />

        <div
          className="absolute right-[20%] top-52 h-2 w-2 animate-pulse rounded-full bg-green-300/70"
        />

        <div className="absolute left-[25%] top-72 h-1.5 w-1.5 animate-pulse rounded-full bg-white/50" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8">

          {/* ==================================================
              RETOUR
          ================================================== */}

          <div className="hero-fade-down">

            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:bg-white/20 hover:shadow-lg"
            >

              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Retour à l'accueil

            </Link>

          </div>


          {/* ==================================================
              TITRE HERO
          ================================================== */}

          <div className="mx-auto mt-16 max-w-4xl text-center">

            {/* Badge */}

            <div
              className="hero-scale mx-auto inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur"
              style={{ animationDelay: "0.15s" }}
            >

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              EPICI

            </div>


            {/* Titre */}

            <h1
              className="hero-fade-up mt-7 text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl"
              style={{ animationDelay: "0.3s" }}
            >

              Nos

              <span className="block text-yellow-400 transition-all duration-500 hover:tracking-wider">
                Assemblées
              </span>

            </h1>


            {/* Description */}

            <p
              className="hero-fade-up mx-auto mt-7 max-w-3xl text-lg leading-8 text-green-100"
              style={{ animationDelay: "0.5s" }}
            >

              Découvrez les différentes assemblées de l'Église
              de Pentecôte Internationale de Côte d'Ivoire,
              secteur d'Abobo, district d'Abobo Est.

            </p>


            {/* ==================================================
                STATISTIQUES HERO
            ================================================== */}

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{ animationDelay: "0.7s" }}
              >

                ⛪ {assemblies.length} assemblée
                {assemblies.length > 1 ? "s" : ""}

              </div>

              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{ animationDelay: "0.85s" }}
              >

                📍 Abidjan

              </div>

              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{ animationDelay: "1s" }}
              >

                ✦ EPICI

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            TRANSITION
        ================================================== */}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f6f8f7] to-transparent" />

      </section>


      {/* ==================================================
          CONTENU PRINCIPAL
      ================================================== */}

      <main className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">


        {/* ==================================================
            INTRODUCTION
        ================================================== */}

        <section className="relative -mt-2">

          <div
            className="card-appear rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-10"
            style={{ animationDelay: "0.2s" }}
          >

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              <div className="max-w-2xl">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
                  Nos communautés
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">

                  Une même foi,

                  <span className="text-green-800">
                    {" "}plusieurs assemblées
                  </span>

                </h2>

                <p className="mt-4 leading-8 text-gray-600">

                  Chaque assemblée constitue une communauté où
                  les fidèles peuvent se retrouver, prier, apprendre
                  la Parole de Dieu et servir ensemble.

                </p>

              </div>


              {/* ==================================================
                  ICÔNE ANIMÉE
              ================================================== */}

              <div className="icon-float hidden h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-green-50 text-5xl shadow-sm md:flex">
                ⛪
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            ASSEMBLÉES
        ================================================== */}

        <section className="mt-16">

          {/* ==================================================
              TITRE
          ================================================== */}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="hero-fade-up text-sm font-bold uppercase tracking-[0.2em] text-green-700">
                Où nous trouver
              </p>

              <h2 className="hero-fade-up mt-2 text-3xl font-black text-gray-950 md:text-4xl">
                Nos communautés
              </h2>

            </div>

            <p className="max-w-md text-sm leading-6 text-gray-500 sm:text-right">

              Découvrez les différentes communautés présentes
              dans le district 
              d'Abobo Est.

            </p>

          </div>


          {/* ==================================================
              AUCUNE ASSEMBLÉE
          ================================================== */}

          {assemblies.length === 0 && (

            <div
              className="card-appear rounded-[2rem] border border-gray-100 bg-white p-12 text-center shadow-sm"
            >

              <div className="icon-float mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-green-50 text-4xl">
                ⛪
              </div>

              <h3 className="mt-6 text-2xl font-black text-gray-950">
                Aucune assemblée disponible
              </h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-500">

                Les informations des assemblées apparaîtront ici
                dès qu'elles seront enregistrées dans
                l'administration.

              </p>

            </div>

          )}


          {/* ==================================================
              CARTES
          ================================================== */}

          {assemblies.length > 0 && (

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {assemblies.map((assembly, index) => (

                <div
                  key={assembly.id ?? index}
                  className="card-appear group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                  style={{
                    animationDelay: `${0.15 + index * 0.15}s`,
                  }}
                >

                  {/* ==================================================
                      IMAGE / LOGO
                  ================================================== */}

                  <div className="shimmer-effect relative h-64 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-700">

                    {/* Lumière 1 */}

                    <div className="floating absolute -left-16 -top-16 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

                    {/* Lumière 2 */}

                    <div className="floating-reverse absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />


                    {/* ==================================================
                        LOGO
                    ================================================== */}

                    <div className="relative flex h-full items-center justify-center">

                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-yellow-400/70 bg-black/20 p-2 shadow-2xl backdrop-blur-sm transition-all duration-700 group-hover:scale-125 group-hover:rotate-3">

                        <div className="absolute inset-1 rounded-full border border-white/20 transition-all duration-700 group-hover:scale-110 group-hover:border-yellow-300/50" />

                        <img
                          src={getImage(assembly.logo)}
                          alt={`Logo de ${assembly.name}`}
                          className="h-full w-full rounded-full object-contain transition-all duration-700 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = dani
                          }}
                        />

                      </div>

                    </div>


                    {/* ==================================================
                        BADGE
                    ================================================== */}

                    <div className="absolute left-5 top-5">

                      <span
                        className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all duration-500 group-hover:scale-105 ${
                          assembly.status === "Assemblée principale"
                            ? "border-yellow-300/30 bg-yellow-400/90 text-green-950"
                            : "border-white/20 bg-green-950/80 text-white"
                        }`}
                      >

                        {assembly.status || "Assemblée"}

                      </span>

                    </div>


                    {/* ==================================================
                        NUMÉRO
                    ================================================== */}

                    <div
                      className="number-pop absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm font-black text-white backdrop-blur-md"
                      style={{
                        animationDelay: `${0.4 + index * 0.15}s`,
                      }}
                    >

                      {String(index + 1).padStart(2, "0")}

                    </div>

                  </div>


                  {/* ==================================================
                      CONTENU
                  ================================================== */}

                  <div className="p-7">

                    <h3 className="text-2xl font-black tracking-tight text-gray-950 transition-colors duration-300 group-hover:text-green-800">
                      {assembly.name}
                    </h3>


                    {/* ==================================================
                        LOCALISATION
                    ================================================== */}

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 transition-all duration-300 group-hover:bg-green-100 group-hover:translate-x-1">

                      <span>
                        📍
                      </span>

                      {assembly.city}

                    </div>


                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <p className="mt-5 leading-7 text-gray-600">

                      {assembly.description ||
                        "Une communauté chrétienne engagée dans la foi, la prière et le service de Dieu."}

                    </p>


                    {/* ==================================================
                        SÉPARATION
                    ================================================== */}

                    <div className="my-6 h-px w-full bg-gray-100">
                      <div
                        className="h-px bg-green-700 transition-all duration-700 group-hover:w-full"
                        style={{ width: "20%" }}
                      />
                    </div>


                    {/* ==================================================
                        INFORMATIONS
                    ================================================== */}

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Communauté
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          Secteur d'Abobo
                        </p>

                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg transition-all duration-500 group-hover:rotate-6 group-hover:bg-green-950 group-hover:text-white group-hover:scale-110">
                        ⛪
                      </div>

                    </div>


                    {/* ==================================================
                        RESPONSABLE
                    ================================================== */}

                    {assembly.pastor && (

                      <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:bg-green-50">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Responsable
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          👤 {assembly.pastor}
                        </p>

                      </div>

                    )}


                    {/* ==================================================
                        ADRESSE
                    ================================================== */}

                    {assembly.address && (

                      <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:bg-green-50">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Adresse
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          📍 {assembly.address}
                        </p>

                      </div>

                    )}


                    {/* ==================================================
                        TÉLÉPHONE
                    ================================================== */}

                    {assembly.phone && (

                      <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 transition-all duration-300 hover:translate-x-1 hover:bg-green-50">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Téléphone
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          ☎️ {assembly.phone}
                        </p>

                      </div>

                    )}


                    {/* ==================================================
                        BOUTON
                    ================================================== */}

                    <Link
                      to={`/assemblies/${assembly.id}`}
                      className="group/button relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-green-800 px-5 py-3.5 font-bold text-green-900 transition-all duration-300 hover:-translate-y-1 hover:bg-green-950 hover:text-white hover:shadow-lg"
                    >

                      <span className="relative z-10">
                        Voir l'assemblée
                      </span>

                      <span className="relative z-10 text-lg transition-transform duration-300 group-hover/button:translate-x-2">
                        →
                      </span>

                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ==================================================
            SECTION STATISTIQUES
        ================================================== */}

        <section className="mt-20 grid gap-5 sm:grid-cols-3">

          {/* STAT 1 */}

          <div className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

            <div className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              ⛪
            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">
              {assemblies.length}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Assemblées
            </p>

          </div>


          {/* STAT 2 */}

          <div className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

            <div
              className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-2xl"
              style={{ animationDelay: "0.5s" }}
            >
              📍
            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">
              Abidjan
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Zone principale
            </p>

          </div>


          {/* STAT 3 */}

          <div className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

            <div
              className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl"
              style={{ animationDelay: "1s" }}
            >
              🤝
            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">
              EPICI
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">
              Notre famille
            </p>

          </div>

        </section>


        {/* ==================================================
            SECTION INFÉRIEURE
        ================================================== */}

        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-green-950 px-8 py-14 text-center shadow-2xl md:px-12">

          {/* ==================================================
              DÉCORATIONS
          ================================================== */}

          <div className="floating absolute -left-24 -top-24 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />

          <div className="floating-reverse absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="pulse-glow absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-3xl" />


          <div className="relative">

            {/* ==================================================
                ICÔNE
            ================================================== */}

            <div className="icon-float mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl backdrop-blur">
              🤝
            </div>


            <p className="hero-fade-up mt-6 text-sm font-bold uppercase tracking-[0.25em] text-green-300">
              Une communauté
            </p>


            <h2 className="hero-fade-up mx-auto mt-3 max-w-2xl text-3xl font-black text-white md:text-4xl">

              Trouvez une assemblée

              <span className="block text-yellow-400">
                près de vous
              </span>

            </h2>


            <p className="mx-auto mt-5 max-w-2xl leading-7 text-green-100">

              Retrouvez les informations de nos assemblées
              et découvrez les programmes proposés chaque semaine.

            </p>


            {/* ==================================================
                BOUTONS
            ================================================== */}

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                to="/programs"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-yellow-400 px-7 py-4 font-black text-green-950 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-yellow-300 hover:shadow-2xl"
              >

                <span className="relative z-10">
                  Voir les programmes
                </span>

                <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>

              </Link>


              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl"
              >

                <span>
                  Retour à l'accueil
                </span>

              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Assembles