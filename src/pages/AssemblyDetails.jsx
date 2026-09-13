import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

function AssemblyDetails() {
  // ==========================================================
  // RÉCUPÉRER L'ID DE L'ASSEMBLÉE
  // ==========================================================

  const { id } = useParams()

  // ==========================================================
  // ÉTAT
  // ==========================================================

  const [assembly, setAssembly] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // ==========================================================
  // RÉCUPÉRER L'ASSEMBLÉE DEPUIS LOCALSTORAGE
  // ==========================================================

  const loadAssembly = () => {
    try {
      const saved = localStorage.getItem("bethel_assemblies")

      if (!saved) {
        setAssembly(null)
        setLoading(false)
        return
      }

      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        setAssembly(null)
        setLoading(false)
        return
      }

      const foundAssembly = parsed.find(
        (item) => String(item.id) === String(id)
      )

      if (foundAssembly) {
        setAssembly({
          ...foundAssembly,
          slogan: foundAssembly.slogan || "",
          mission: foundAssembly.mission || "",
          vision: foundAssembly.vision || "",
          description: foundAssembly.description || "",
          address: foundAssembly.address || "",
          phone: foundAssembly.phone || "",
          pastor: foundAssembly.pastor || "",
          logo: foundAssembly.logo || null,
          photos: Array.isArray(foundAssembly.photos)
            ? foundAssembly.photos
            : [],
        })
      } else {
        setAssembly(null)
      }
    } catch (error) {
      console.error(
        "❌ Impossible de récupérer l'assemblée :",
        error
      )

      setAssembly(null)
    }

    setLoading(false)
  }

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

  useEffect(() => {
    loadAssembly()

    const handleStorage = () => {
      loadAssembly()
    }

    const handleFocus = () => {
      loadAssembly()
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("focus", handleFocus)
    }
  }, [id])

  // ==========================================================
  // SCROLL EN HAUT
  // ==========================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [id])

  // ==========================================================
  // PHOTO PRINCIPALE
  // ==========================================================

  const mainPhoto =
    assembly?.photos?.length > 0
      ? assembly.photos[0]
      : assembly?.logo || null

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7f5]">

        <style>{`
          @keyframes loadingPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 1;
            }

            50% {
              transform: scale(1.12);
              opacity: 0.75;
            }
          }

          @keyframes loadingSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes loadingFade {
            from {
              opacity: 0;
              transform: translateY(15px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .loading-icon {
            animation: loadingPulse 1.5s ease-in-out infinite;
          }

          .loading-ring {
            animation: loadingSpin 1.5s linear infinite;
          }

          .loading-text {
            animation: loadingFade 0.7s ease-out both;
          }
        `}</style>

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative text-center">

          <div className="relative mx-auto h-20 w-20">

            <div className="loading-ring absolute inset-0 rounded-3xl border-2 border-green-200 border-t-green-950" />

            <div className="loading-icon absolute inset-2 flex items-center justify-center rounded-2xl bg-green-950 text-3xl">
              🏛️
            </div>

          </div>

          <p className="loading-text mt-6 text-sm font-bold text-gray-500">
            Chargement de l'assemblée...
          </p>

          <div className="mx-auto mt-4 h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">

            <div className="h-full w-1/2 animate-pulse rounded-full bg-green-950" />

          </div>

        </div>

      </div>
    )
  }

  // ==========================================================
  // ASSEMBLÉE INTROUVABLE
  // ==========================================================

  if (!assembly) {
    return (
      <div className="min-h-screen bg-[#f6f7f5]">

        <style>{`
          @keyframes notFoundAppear {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes notFoundIcon {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-8px) rotate(4deg);
            }
          }

          .not-found-card {
            animation: notFoundAppear 0.7s ease-out both;
          }

          .not-found-icon {
            animation: notFoundIcon 3s ease-in-out infinite;
          }
        `}</style>

        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5">

          <div className="not-found-card w-full rounded-[32px] border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-12">

            <div className="not-found-icon mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-green-50 text-5xl">
              🏛️
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
              BETHEL
            </p>

            <h1 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              Assemblée introuvable
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Cette assemblée n'existe pas ou n'est plus disponible.
            </p>

            <Link
              to="/assemblies"
              className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-green-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl"
            >

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Retour aux assemblées

            </Link>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f7f5] pb-24">

      {/* ======================================================
          ANIMATIONS CSS
      ====================================================== */}

      <style>{`
        @keyframes pageFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes headerSlide {
          from {
            opacity: 0;
            transform: translateY(-25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroAppear {
          from {
            opacity: 0;
            transform: translateY(45px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes heroImage {
          from {
            opacity: 0;
            transform: scale(1.12);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes contentAppear {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes contentLeft {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes contentRight {
          from {
            opacity: 0;
            transform: translateX(35px);
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

        @keyframes logoAppear {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-8deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes badgeAppear {
          from {
            opacity: 0;
            transform: scale(0.7);
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

        @keyframes galleryAppear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalImage {
          from {
            opacity: 0;
            transform: scale(0.8);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes decorativeFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(18px, -20px, 0);
          }
        }

        @keyframes decorativeReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-20px, 18px, 0);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(1);
          }

          50% {
            opacity: 0.65;
            transform: scale(1.2);
          }
        }

        .page-fade {
          animation: pageFade 0.5s ease-out both;
        }

        .header-slide {
          animation: headerSlide 0.7s ease-out both;
        }

        .hero-appear {
          animation: heroAppear 0.9s ease-out both;
        }

        .hero-image {
          animation: heroImage 1.2s ease-out both;
        }

        .content-appear {
          animation: contentAppear 0.8s ease-out both;
        }

        .content-left {
          animation: contentLeft 0.8s ease-out both;
        }

        .content-right {
          animation: contentRight 0.8s ease-out both;
        }

        .icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }

        .logo-appear {
          animation: logoAppear 0.7s ease-out both;
        }

        .badge-appear {
          animation: badgeAppear 0.6s ease-out both;
        }

        .gallery-appear {
          animation: galleryAppear 0.7s ease-out both;
        }

        .modal-appear {
          animation: modalAppear 0.25s ease-out both;
        }

        .modal-image {
          animation: modalImage 0.4s ease-out both;
        }

        .decorative-float {
          animation: decorativeFloat 6s ease-in-out infinite;
        }

        .decorative-reverse {
          animation: decorativeReverse 7s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .page-fade,
          .header-slide,
          .hero-appear,
          .hero-image,
          .content-appear,
          .content-left,
          .content-right,
          .icon-float,
          .logo-appear,
          .badge-appear,
          .gallery-appear,
          .modal-appear,
          .modal-image,
          .decorative-float,
          .decorative-reverse,
          .pulse-glow {
            animation: none !important;
          }
        }
      `}</style>


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="header-slide sticky top-0 z-40 border-b border-gray-200/70 bg-[#f6f7f5]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link
            to="/assemblies"
            className="group flex items-center gap-3"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl text-green-950 shadow-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-green-950 group-hover:text-white group-hover:shadow-lg">
              ←
            </span>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                dictrict d'Abobo Est
              </p>

              <p className="text-sm font-black text-gray-900">
                Nos assemblées
              </p>

            </div>

          </Link>


          <span className="hidden rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-green-100 sm:block">
            Présentation de l'assemblée
          </span>

        </div>

      </header>


      {/* ======================================================
          CONTENU
      ====================================================== */}

      <main className="page-fade mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="hero-appear relative overflow-hidden rounded-[32px] bg-green-950 shadow-xl">

          {/* ==================================================
              DÉCORATIONS
          ================================================== */}

          <div className="decorative-float absolute -right-20 -top-20 h-72 w-72 rounded-full border border-yellow-400/10" />

          <div className="decorative-reverse absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/5" />

          <div className="pulse-glow absolute right-20 top-20 h-32 w-32 rounded-full bg-yellow-400/5 blur-3xl" />

          <div className="absolute left-[20%] top-20 h-2 w-2 animate-pulse rounded-full bg-yellow-400/60" />

          <div className="absolute right-[25%] top-32 h-1.5 w-1.5 animate-ping rounded-full bg-white/40" />


          <div className="relative grid lg:grid-cols-2">


            {/* =================================================
                IMAGE
            ================================================== */}

            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[500px]">

              {mainPhoto ? (

                <img
                  src={mainPhoto}
                  alt={assembly.name}
                  className="hero-image absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                />

              ) : (

                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-green-700">

                  <div className="icon-float text-8xl text-yellow-400/80">
                    ✝
                  </div>

                </div>

              )}


              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/20 to-transparent" />


              {/* ==================================================
                  LOGO
              ================================================== */}

              {assembly.logo && (

                <div className="logo-appear absolute bottom-6 left-6">

                  <img
                    src={assembly.logo}
                    alt={`Logo ${assembly.name}`}
                    className="h-24 w-24 rounded-[26px] border-2 border-yellow-400 bg-white object-contain p-2 shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-2 sm:h-28 sm:w-28"
                  />

                </div>

              )}

            </div>


            {/* =================================================
                INFORMATIONS HERO
            ================================================== */}

            <div className="flex flex-col justify-center p-7 text-white sm:p-10 lg:p-12">


              {/* STATUT */}

              <div
                className="badge-appear mb-5"
                style={{
                  animationDelay: "0.2s",
                }}
              >

                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 transition-all duration-300 hover:scale-105 hover:bg-yellow-400/20">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />

                  {assembly.status || "Assemblée"}

                </span>

              </div>


              {/* NOM */}

              <h1
                className="content-right max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl"
                style={{
                  animationDelay: "0.3s",
                }}
              >
                {assembly.name}
              </h1>


              {/* VILLE */}

              {assembly.city && (

                <p
                  className="content-right mt-4 flex items-center gap-2 text-sm font-bold text-green-100"
                  style={{
                    animationDelay: "0.45s",
                  }}
                >

                  <span className="transition-transform duration-300 hover:scale-125">
                    📍
                  </span>

                  {assembly.city}

                </p>

              )}


              {/* SLOGAN */}

              {assembly.slogan && (

                <div
                  className="content-right mt-7 border-l-2 border-yellow-400 pl-5"
                  style={{
                    animationDelay: "0.6s",
                  }}
                >

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">
                    Notre slogan
                  </p>

                  <p className="mt-2 text-lg font-bold italic leading-7 text-white sm:text-xl">
                    « {assembly.slogan} »
                  </p>

                </div>

              )}


              {/* DESCRIPTION */}

              {assembly.description && (

                <p
                  className="content-right mt-7 max-w-xl text-sm leading-7 text-green-100/75 sm:text-base"
                  style={{
                    animationDelay: "0.75s",
                  }}
                >
                  {assembly.description}
                </p>

              )}

            </div>

          </div>

        </section>


        {/* ====================================================
            INFORMATIONS RAPIDES
        ==================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


          {/* RESPONSABLE */}

          {assembly.pastor && (

            <div
              className="content-left group rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
              style={{
                animationDelay: "0.15s",
              }}
            >

              <div className="flex items-center gap-4">

                <div className="icon-float flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-xl transition-all duration-300 group-hover:bg-green-950 group-hover:text-white">
                  👤
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Responsable
                  </p>

                  <p className="mt-1 truncate text-sm font-black text-gray-900">
                    {assembly.pastor}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ADRESSE */}

          {assembly.address && (

            <div
              className="content-appear group rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-yellow-200 hover:shadow-xl"
              style={{
                animationDelay: "0.25s",
              }}
            >

              <div className="flex items-center gap-4">

                <div className="icon-float flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-xl transition-all duration-300 group-hover:bg-yellow-400 group-hover:scale-110">
                  📍
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Adresse
                  </p>

                  <p className="mt-1 text-sm font-bold leading-5 text-gray-900">
                    {assembly.address}
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* TELEPHONE */}

          {assembly.phone && (

            <div
              className="content-right group rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
              style={{
                animationDelay: "0.35s",
              }}
            >

              <div className="flex items-center gap-4">

                <div className="icon-float flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-xl transition-all duration-300 group-hover:bg-green-950 group-hover:text-white">
                  ☎️
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Téléphone
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-900">
                    {assembly.phone}
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* ====================================================
            MISSION + VISION
        ==================================================== */}

        {(assembly.mission || assembly.vision) && (

          <section className="mt-8 grid gap-6 lg:grid-cols-2">


            {/* MISSION */}

            {assembly.mission && (

              <article
                className="content-left group rounded-[30px] border border-gray-200/70 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-8"
                style={{
                  animationDelay: "0.2s",
                }}
              >

                <div className="flex items-center gap-4">

                  <div className="icon-float flex h-14 w-14 items-center justify-center rounded-2xl bg-green-950 text-2xl text-yellow-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    🎯
                  </div>

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                      Notre engagement
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-gray-900">
                      Notre mission
                    </h2>

                  </div>

                </div>


                <div className="mt-6 overflow-hidden rounded-2xl bg-green-50 p-5 transition-all duration-500 group-hover:bg-green-100">

                  <p className="text-sm leading-7 text-gray-600">
                    {assembly.mission}
                  </p>

                </div>

              </article>

            )}


            {/* VISION */}

            {assembly.vision && (

              <article
                className="content-right group rounded-[30px] border border-gray-200/70 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-8"
                style={{
                  animationDelay: "0.35s",
                }}
              >

                <div className="flex items-center gap-4">

                  <div className="icon-float flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    👁️
                  </div>

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-700">
                      Notre direction
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-gray-900">
                      Notre vision
                    </h2>

                  </div>

                </div>


                <div className="mt-6 rounded-2xl bg-yellow-50 p-5 transition-all duration-500 group-hover:bg-yellow-100">

                  <p className="text-sm leading-7 text-gray-600">
                    {assembly.vision}
                  </p>

                </div>

              </article>

            )}

          </section>

        )}


        {/* ====================================================
            DESCRIPTION
        ==================================================== */}

        {assembly.description && (

          <section className="content-appear mt-8 overflow-hidden rounded-[30px] bg-white shadow-sm">

            <div className="grid lg:grid-cols-[0.35fr_1fr]">

              <div className="group bg-green-950 p-7 text-white sm:p-8">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">
                  À propos
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Notre assemblée
                </h2>

                <div className="mt-6 h-1 w-12 rounded-full bg-yellow-400 transition-all duration-700 group-hover:w-24" />

              </div>


              <div className="p-7 sm:p-8">

                <p className="text-sm leading-8 text-gray-600 sm:text-base">
                  {assembly.description}
                </p>

              </div>

            </div>

          </section>

        )}


        {/* ====================================================
            GALERIE
        ==================================================== */}

        {Array.isArray(assembly.photos) &&
          assembly.photos.length > 0 && (

            <section className="mt-10">

              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                    Découvrir le temple
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
                    Galerie de l'assemblée
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Découvrez quelques images de notre temple.
                  </p>

                </div>


                <span className="self-start rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-800 transition-all duration-300 hover:scale-105 sm:self-auto">

                  {assembly.photos.length} photo
                  {assembly.photos.length > 1 ? "s" : ""}

                </span>

              </div>


              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                {assembly.photos.map((photo, index) => (

                  <button
                    key={`${index}-${photo.slice(0, 20)}`}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className="gallery-appear group relative aspect-square overflow-hidden rounded-[24px] bg-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                    style={{
                      animationDelay: `${0.1 + index * 0.1}s`,
                    }}
                  >

                    <img
                      src={photo}
                      alt={`${assembly.name} - Photo ${index + 1}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />


                    {/* OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />


                    {/* BOUTON */}

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">

                      🔍 Voir la photo

                    </div>


                    {/* NUMÉRO */}

                    <div className="absolute right-3 top-3 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-black/50 text-xs font-black text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">

                      {index + 1}

                    </div>

                  </button>

                ))}

              </div>

            </section>

          )}


        {/* ====================================================
            CONTACT / CTA
        ==================================================== */}

        <section className="content-appear relative mt-10 overflow-hidden rounded-[32px] bg-green-950 p-7 text-white shadow-xl sm:p-10">

          {/* DÉCORATIONS */}

          <div className="decorative-float absolute -left-24 -top-24 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />

          <div className="decorative-reverse absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="pulse-glow absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-3xl" />


          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
                Bienvenue à
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {assembly.name}
              </h2>

              {assembly.slogan && (

                <p className="mt-3 max-w-xl text-sm italic leading-6 text-green-100/75">
                  « {assembly.slogan} »
                </p>

              )}

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <Link
                to="/assemblies"
                className="group rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-center text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-950 hover:shadow-xl"
              >

                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                {" "}Toutes les assemblées

              </Link>


              {assembly.phone && (

                <a
                  href={`tel:${assembly.phone.replace(/\s/g, "")}`}
                  className="group rounded-2xl bg-yellow-400 px-6 py-3.5 text-center text-sm font-black text-green-950 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >

                  <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                    ☎️
                  </span>

                  {" "}Nous contacter

                </a>

              )}

            </div>

          </div>

        </section>


        {/* ====================================================
            RETOUR
        ==================================================== */}

        <div className="content-appear mt-8 text-center">

          <Link
            to="/assemblies"
            className="group inline-flex items-center gap-2 text-sm font-bold text-green-800 transition-all duration-300 hover:-translate-x-1 hover:text-green-950"
          >

            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            Retour à la liste des assemblées

          </Link>

        </div>

      </main>


      {/* ======================================================
          MODAL PHOTO
      ====================================================== */}

      {selectedPhoto && (

        <div
          className="modal-appear fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >

          {/* CERCLE DÉCORATIF */}

          <div className="pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-3xl" />


          {/* FERMER */}

          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="group absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition-all duration-300 hover:rotate-90 hover:bg-white/20"
            aria-label="Fermer"
          >

            ×

          </button>


          {/* IMAGE */}

          <img
            src={selectedPhoto}
            alt={assembly.name}
            className="modal-image relative max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />


          {/* INDICATION */}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-5 py-2 text-xs font-bold text-white backdrop-blur-sm">

            Cliquez en dehors de l'image pour fermer

          </div>

        </div>

      )}

    </div>
  )
}

export default AssemblyDetails