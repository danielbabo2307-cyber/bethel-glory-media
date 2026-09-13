import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function getNextSundays(number = 6) {
  const today = new Date()
  const day = today.getDay()

  const daysUntilSunday = day === 0 ? 0 : 7 - day

  const firstSunday = new Date(today)
  firstSunday.setDate(today.getDate() + daysUntilSunday)

  const sundays = []

  for (let i = 0; i < number; i++) {
    const sunday = new Date(firstSunday)
    sunday.setDate(firstSunday.getDate() + i * 7)

    const dateLabel = sunday
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase()

    const year = sunday.getFullYear()
    const month = String(sunday.getMonth() + 1).padStart(2, "0")
    const dayNumber = String(sunday.getDate()).padStart(2, "0")

    sundays.push({
      id: `${year}-${month}-${dayNumber}`,
      date: dateLabel,
    })
  }

  return sundays
}

// ==========================================================
// PROGRAMMES PAR DÉFAUT
// ==========================================================

const defaultPrograms = [
  {
    title: "Culte d'adoration",
    time: "08h00",
    description:
      "Un temps de louange, d'adoration, de prière et d'enseignement de la Parole de Dieu.",
  },

  {
    title: "Semaine spirituelle",
    time: "08h00",
    description:
      "Un moment particulier consacré à l'adoration et à la communion fraternelle.",
  },

  {
    title: "Culte d'adoration",
    time: "08h30",
    description:
      "Un temps de recherche de Dieu, de prière et d'édification spirituelle.",
  },
]

// ==========================================================
// COMPOSANT PROGRAMS
// ==========================================================

function Programs() {
  const sundays = getNextSundays()

  const [programs, setPrograms] = useState({})

  // ==========================================================
  // RÉCUPÉRATION DES PROGRAMMES
  // ==========================================================

  useEffect(() => {
    const loadPrograms = () => {
      const saved = localStorage.getItem("bethel_programs_admin")

      if (saved) {
        try {
          setPrograms(JSON.parse(saved))
        } catch {
          setPrograms({})
        }
      } else {
        setPrograms({})
      }
    }

    loadPrograms()

    window.addEventListener("storage", loadPrograms)
    window.addEventListener("focus", loadPrograms)

    return () => {
      window.removeEventListener("storage", loadPrograms)
      window.removeEventListener("focus", loadPrograms)
    }
  }, [])

  // ==========================================================
  // PROGRAMME D'UN DIMANCHE
  // ==========================================================

  const getProgram = (sunday, index) => {
    if (programs[sunday.id]) {
      return programs[sunday.id]
    }

    return defaultPrograms[index % defaultPrograms.length]
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8f7]">

      {/* ==================================================
          ANIMATIONS CSS
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
            transform: scale(0.8);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floating {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -22px, 0);
          }
        }

        @keyframes floatingReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(20px, 18px, 0);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }

          50% {
            opacity: 0.7;
            transform: scale(1.18);
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes dateSlide {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes numberPop {
          from {
            opacity: 0;
            transform: scale(0.4) rotate(-10deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0);
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

        @keyframes lineGrow {
          from {
            width: 0;
          }

          to {
            width: 100%;
          }
        }

        .hero-fade-up {
          animation: heroFadeUp 0.9s ease-out both;
        }

        .hero-fade-down {
          animation: heroFadeDown 0.8s ease-out both;
        }

        .hero-scale {
          animation: heroScale 0.8s ease-out both;
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

        .date-slide {
          animation: dateSlide 0.8s ease-out both;
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
            rgba(255, 255, 255, 0.12),
            transparent
          );
          transform: translateX(-120%);
          animation: shimmer 4s ease-in-out infinite;
        }

        .program-line {
          width: 18%;
          transition: width 0.7s ease;
        }

        .program-card:hover .program-line {
          width: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up,
          .hero-fade-down,
          .hero-scale,
          .floating,
          .floating-reverse,
          .pulse-glow,
          .card-appear,
          .date-slide,
          .icon-float,
          .number-pop,
          .shimmer-effect::after {
            animation: none !important;
          }

          .program-line {
            transition: none !important;
          }
        }
      `}</style>


      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-green-950 pt-32">

        {/* ==================================================
            DÉCORATIONS ANIMÉES
        ================================================== */}

        <div className="floating absolute -left-32 top-20 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />

        <div className="floating-reverse absolute -right-32 top-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="pulse-glow absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-400/10 blur-3xl" />


        {/* Petites lumières */}

        <div className="absolute left-[15%] top-40 h-2 w-2 animate-ping rounded-full bg-yellow-300/70" />

        <div className="absolute right-[20%] top-52 h-2 w-2 animate-pulse rounded-full bg-green-300/70" />

        <div className="absolute left-[28%] top-72 h-1.5 w-1.5 animate-pulse rounded-full bg-white/50" />

        <div className="absolute right-[32%] top-32 h-1.5 w-1.5 animate-ping rounded-full bg-yellow-300/50" />


        <div className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8">

          {/* =====================================================
              RETOUR
          ====================================================== */}

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
            
          {/* =====================================================
              TITRE HERO
          ====================================================== */}

          <div className="mx-auto mt-16 max-w-4xl text-center">

            {/* Badge */}

            <div
              className="hero-scale mx-auto inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300 backdrop-blur"
              style={{
                animationDelay: "0.15s",
              }}
            >

              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              EPICI

            </div>


            {/* Titre */}

            <h1
              className="hero-fade-up mt-7 text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl"
              style={{
                animationDelay: "0.3s",
              }}
            >

              Nos

              <span className="block text-yellow-400 transition-all duration-500 hover:tracking-wider">
                Programmes
              </span>

            </h1>


            {/* Description */}

            <p
              className="hero-fade-up mx-auto mt-7 max-w-3xl text-lg leading-8 text-green-100"
              style={{
                animationDelay: "0.5s",
              }}
            >

              Retrouvez les prochains programmes et rendez-vous
              de l'Assemblée de Bethel. Des moments de foi,
              de prière, d'adoration et de communion fraternelle.

            </p>


            {/* =================================================
                STATISTIQUES
            ================================================== */}

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{
                  animationDelay: "0.7s",
                }}
              >

                <span className="text-yellow-300">
                  {String(sundays.length).padStart(2, "0")}
                </span>{" "}

                prochains dimanches

              </div>


              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{
                  animationDelay: "0.85s",
                }}
              >

                ⛪ Assemblée de Bethel

              </div>


              <div
                className="hero-fade-up rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                style={{
                  animationDelay: "1s",
                }}
              >

                📍 Abidjan

              </div>

            </div>

          </div>

        </div>


        {/* Transition */}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f6f8f7] to-transparent" />

      </section>


      {/* =========================================================
          CONTENU PRINCIPAL
      ========================================================== */}

      <main className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">


        {/* =====================================================
            INTRODUCTION
        ====================================================== */}

        <section className="relative -mt-2">

          <div
            className="card-appear rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-10"
            style={{
              animationDelay: "0.2s",
            }}
          >

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

              <div className="max-w-2xl">

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
                  Calendrier spirituel
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">

                  Des rendez-vous

                  <span className="text-green-800">
                    {" "}pour grandir ensemble
                  </span>

                </h2>

                <p className="mt-4 leading-8 text-gray-600">

                  Consultez les prochains programmes de l'Assemblée
                  de Bethel et préparez-vous à vivre des moments
                  de foi, de prière, d'adoration et d'édification.

                </p>

              </div>


              {/* ==================================================
                  ICÔNE ANIMÉE
              ================================================== */}

              <div className="icon-float hidden h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-green-50 text-5xl shadow-sm md:flex">

                📅

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PROGRAMMES
        ====================================================== */}

        <section className="mt-16">

          {/* ==================================================
              TITRE
          ================================================== */}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p
                className="hero-fade-up text-sm font-bold uppercase tracking-[0.2em] text-green-700"
              >
                Calendrier
              </p>

              <h2
                className="hero-fade-up mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-4xl"
              >
                Nos prochains programmes
              </h2>

            </div>


            <p className="max-w-md text-sm leading-6 text-gray-500 sm:text-right">

              Retrouvez les rendez-vous prévus pour les
              prochains dimanches à l'Assemblée de Bethel.

            </p>

          </div>


          {/* ===================================================
              LISTE
          ==================================================== */}

          <div className="space-y-6">

            {sundays.map((sunday, index) => {

              const program = getProgram(sunday, index)

              return (

                <article
                  key={sunday.id}
                  className="program-card card-appear group overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    animationDelay: `${0.2 + index * 0.15}s`,
                  }}
                >

                  <div className="flex flex-col lg:flex-row">

                  
                    {/* =================================================
                        DATE
                    ================================================== */}

                    <div className="shimmer-effect relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-700 p-7 text-white lg:w-64 lg:shrink-0">

                      {/* Lumière */}

                      <div className="floating absolute -left-16 -top-16 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

                      <div className="floating-reverse absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />


                      <div
                        className="date-slide relative"
                        style={{
                          animationDelay: `${0.3 + index * 0.12}s`,
                        }}
                      >

                        {/* Numéro */}

                        <div className="flex items-center justify-between">

                          <span className="text-xs font-black uppercase tracking-[0.2em] text-green-300">
                            Dimanche
                          </span>


                          <span
                            className="number-pop flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm font-black text-white backdrop-blur"
                            style={{
                              animationDelay: `${0.5 + index * 0.12}s`,
                            }}
                          >

                            {String(index + 1).padStart(2, "0")}

                          </span>

                        </div>


                        {/* Date */}

                        <p className="mt-8 text-lg font-black leading-7 text-white transition-transform duration-500 group-hover:translate-x-1">

                          {sunday.date}

                        </p>


                        {/* Indicateur */}

                        <div className="mt-6 flex items-center gap-2">

                          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

                          <span className="text-xs font-bold uppercase tracking-wider text-green-200">
                            Rendez-vous spirituel
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        CONTENU
                    ================================================== */}

                    <div className="flex min-w-0 flex-1 flex-col p-7 md:p-8">

                      {/* Badges */}

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-green-700 transition-all duration-300 group-hover:bg-green-100">
                          Programme
                        </span>


                        {programs[sunday.id] && (

                          <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-700 transition-all duration-300 group-hover:scale-105">

                            Mis à jour

                          </span>

                        )}

                      </div>


                      {/* ==================================================
                          TITRE
                      ================================================== */}

                      <h3 className="mt-4 text-2xl font-black tracking-tight text-gray-950 transition-all duration-300 group-hover:translate-x-1 group-hover:text-green-800 md:text-3xl">

                        {program.title}

                      </h3>


                      {/* Description */}

                      <p className="mt-3 max-w-3xl leading-7 text-gray-600">

                        {program.description}

                      </p>


                      {/* ==================================================
                          SÉPARATION ANIMÉE
                      ================================================== */}

                      <div className="my-6 h-px w-full bg-gray-100">

                        <div className="program-line h-px bg-green-700" />

                      </div>


                      {/* ==================================================
                          INFORMATIONS
                      ================================================== */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                        {/* Assemblée */}

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-green-950 group-hover:text-white">

                            ⛪

                          </div>


                          <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Assemblée
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-800">
                              Assemblée de Bethel
                            </p>

                          </div>

                        </div>


                        {/* ==================================================
                            HEURE
                        ================================================== */}

                        <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-4 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-green-200 group-hover:bg-green-100 group-hover:shadow-md">

                          <div className="flex items-center gap-2">

                            <span className="text-lg transition-transform duration-500 group-hover:rotate-12">
                              🕐
                            </span>

                            <p className="text-xs font-black uppercase tracking-wider text-green-700">
                              Heure
                            </p>

                          </div>

                          <p className="mt-1 text-xl font-black text-green-950">

                            {program.time || "À confirmer"}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>

              )
            })}

          </div>

        </section>


        {/* =====================================================
            STATISTIQUES
        ====================================================== */}

        <section className="mt-20 grid gap-5 sm:grid-cols-3">


          {/* ==================================================
              STAT 1
          ================================================== */}

          <div
            className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            style={{
              animationDelay: "0.2s",
            }}
          >

            <div className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">

              📅

            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">

              {sundays.length}

            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">

              Prochains dimanches

            </p>

          </div>


          {/* ==================================================
              STAT 2
          ================================================== */}

          <div
            className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            style={{
              animationDelay: "0.35s",
            }}
          >

            <div
              className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-2xl"
              style={{
                animationDelay: "0.5s",
              }}
            >

              🕐

            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">

              08h00

            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">

              Horaire habituel

            </p>

          </div>


          {/* ==================================================
              STAT 3
          ================================================== */}

          <div
            className="card-appear group rounded-[2rem] border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            style={{
              animationDelay: "0.5s",
            }}
          >

            <div
              className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl"
              style={{
                animationDelay: "1s",
              }}
            >

              ⛪

            </div>

            <p className="mt-5 text-3xl font-black text-green-950 transition-transform duration-300 group-hover:scale-110">

              EPICI

            </p>

            <p className="mt-1 text-sm font-semibold text-gray-500">

              Assemblée de Bethel

            </p>

          </div>

        </section>


        {/* =====================================================
            CTA FINAL
        ====================================================== */}

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

              🙏

            </div>


            <p className="hero-fade-up mt-6 text-sm font-bold uppercase tracking-[0.25em] text-green-300">

              Assemblée de Bethel

            </p>


            <h2 className="hero-fade-up mx-auto mt-3 max-w-2xl text-3xl font-black text-white md:text-4xl">

              Venez vivre un moment

              <span className="block text-yellow-400">

                avec nous

              </span>

            </h2>


            <p className="mx-auto mt-5 max-w-2xl leading-7 text-green-100">

              Nous vous invitons à participer à nos différents
              programmes et à partager des moments de foi,
              de prière, d'adoration et de communion fraternelle.

            </p>


            {/* ==================================================
                BOUTONS
            ================================================== */}

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-yellow-400 px-7 py-4 font-black text-green-950 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-yellow-300 hover:shadow-2xl"
              >

                <span>
                  Nous contacter
                </span>

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>

              </Link>


              <Link
                to="/assemblies"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl"
              >

                Voir les assemblées

              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            NOTE
        ====================================================== */}

        <div
          className="card-appear mt-8 flex items-start gap-3 rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{
            animationDelay: "0.5s",
          }}
        >

          <div className="icon-float flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">

            ℹ

          </div>

          <p className="text-sm leading-6 text-gray-600">

            Les programmes affichés peuvent être actualisés
            par l'administration de l'Assemblée de Bethel.

          </p>

        </div>

      </main>

    </div>
  )
}

export default Programs