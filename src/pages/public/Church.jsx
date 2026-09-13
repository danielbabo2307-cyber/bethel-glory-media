
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

// ==================================================
// URL DU SERVEUR
// ==================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
// ==================================================
// THÈME PAR DÉFAUT
// Utilisé uniquement si l'API ne répond pas
// ==================================================

const THEME_PAR_DEFAUT = {
  annee: "2026",
  titre: "CONNAÎTRE DIEU POUR ÊTRE EXCELLENT",
  reference: "Philippiens 3:13",
}

// ==================================================
// FONCTION : LABEL DE LA FONCTION
// ==================================================

const getFonctionLabel = (fonction) => {
  const fonctions = {
    pasteur: "Pasteur",
    apotre: "Apôtre",
    ancien_principal: "Ancien principal",
    ancien_second: "Ancien second",
    diacre: "Diacre",
    diaconesse: "Diaconesse",
  }

  return fonctions[fonction] || fonction || "Responsable"
}

// ==================================================
// COMPOSANT CHURCH
// ==================================================

function Church() {
  // ==================================================
  // RESPONSABLES
  // ==================================================

  const [responsables, setResponsables] = useState([])

  const [loadingResponsables, setLoadingResponsables] =
    useState(true)

  const [errorResponsables, setErrorResponsables] =
    useState("")

  // ==================================================
  // THÈME DE L'ANNÉE
  // ==================================================

  const [themeAnnee, setThemeAnnee] =
    useState(THEME_PAR_DEFAUT)

  const [loadingTheme, setLoadingTheme] =
    useState(true)

  const [errorTheme, setErrorTheme] =
    useState("")

  // ==================================================
  // RÉCUPÉRER LES RESPONSABLES
  // ==================================================

  const fetchResponsables = async () => {
    try {
      setLoadingResponsables(true)
      setErrorResponsables("")

      console.log(
        "📡 Récupération des responsables..."
      )

      const response = await fetch(
        `${API_URL}/api/responsables/public`
      )

      console.log(
        "📊 Status responsables :",
        response.status
      )

      const result = await response.json()

      console.log(
        "📥 Réponse responsables :",
        result
      )

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Impossible de récupérer les responsables."
        )
      }

      // ==================================================
      // IMPORTANT :
      // Le serveur renvoie :
      //
      // {
      //   success: true,
      //   responsables: [...]
      // }
      // ==================================================

      if (
        !Array.isArray(result.responsables)
      ) {
        throw new Error(
          "Les données reçues par le serveur sont invalides."
        )
      }

      console.log(
        "👥 Nombre de responsables :",
        result.responsables.length
      )

      setResponsables(
        result.responsables
      )
    } catch (error) {
      console.error(
        "❌ Erreur récupération responsables :",
        error
      )

      setErrorResponsables(
        error.message ||
          "Une erreur est survenue lors du chargement."
      )

      setResponsables([])
    } finally {
      setLoadingResponsables(false)
    }
  }

  // ==================================================
  // RÉCUPÉRER LE THÈME DE L'ANNÉE
  // ==================================================

  const fetchThemeAnnee = async () => {
    try {
      setLoadingTheme(true)
      setErrorTheme("")

      console.log(
        "📖 Récupération du thème de l'année..."
      )

      const response = await fetch(
        `${API_URL}/api/theme-annee`
      )

      console.log(
        "📊 Status thème :",
        response.status
      )

      const result =
        await response.json()

      console.log(
        "📥 Réponse thème :",
        result
      )

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Impossible de récupérer le thème de l'année."
        )
      }

      if (
        !result.theme
      ) {
        throw new Error(
          "Aucune donnée de thème reçue."
        )
      }

      // ==================================================
      // CONVERSION DES DONNÉES API
      //
      // API :
      // annee
      // theme
      // verset
      //
      // FRONTEND :
      // annee
      // titre
      // reference
      // ==================================================

      setThemeAnnee({
        annee:
          result.theme.annee ||
          THEME_PAR_DEFAUT.annee,

        titre:
          result.theme.theme ||
          THEME_PAR_DEFAUT.titre,

        reference:
          result.theme.verset ||
          THEME_PAR_DEFAUT.reference,
      })

      console.log(
        "✅ Thème de l'année chargé :",
        result.theme
      )
    } catch (error) {
      console.error(
        "❌ Erreur récupération thème :",
        error
      )

      setErrorTheme(
        error.message ||
          "Impossible de charger le thème."
      )

      // On conserve le thème par défaut
      setThemeAnnee(
        THEME_PAR_DEFAUT
      )
    } finally {
      setLoadingTheme(false)
    }
  }

  // ==================================================
  // CHARGEMENT INITIAL
  // ==================================================

  useEffect(() => {
    fetchResponsables()
    fetchThemeAnnee()
  }, [])

  // ==================================================
  // CONSTRUIRE L'URL DE LA PHOTO
  // ==================================================

  const getPhotoUrl = (photo) => {
    if (!photo) {
      return null
    }

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo
    }

    return `${API_URL}${
      photo.startsWith("/")
        ? ""
        : "/"
    }${photo}`
  }

  // ==================================================
  // AFFICHAGE
  // ==================================================

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8f7]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-green-950 pt-32">

        {/* DÉCORATIONS ANIMÉES */}

        <div className="absolute -left-32 top-20 h-96 w-96 animate-pulse rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute -right-32 top-0 h-96 w-96 animate-pulse rounded-full bg-yellow-400/10 blur-3xl [animation-delay:1s]" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 animate-pulse rounded-full bg-green-400/10 blur-3xl [animation-delay:2s]" />

        {/* PETITES PARTICULES */}

        <div className="absolute left-[15%] top-40 h-2 w-2 animate-ping rounded-full bg-yellow-300" />

        <div className="absolute right-[20%] top-52 h-2 w-2 animate-ping rounded-full bg-green-300 [animation-delay:700ms]" />

        <div className="absolute bottom-32 left-[30%] h-2 w-2 animate-ping rounded-full bg-white/50 [animation-delay:1.2s]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8">

          {/* RETOUR */}

          <div className="animate-[fadeDown_0.8s_ease-out]">

            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl"
            >

              <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Retour à l'accueil

            </Link>

          </div>

          {/* CONTENU HERO */}

          <div className="mx-auto mt-16 max-w-4xl text-center">

            <div className="animate-[fadeUp_0.8s_ease-out]">

              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300 backdrop-blur transition-all duration-500 hover:scale-105 hover:bg-green-400/20">

                <span className="relative flex h-2 w-2">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />

                </span>

                SECTEUR D'ABOBO · DISTRICT D'ABOBO EST

              </div>

            </div>

            {/* TITRE */}

            <h1 className="mt-7 animate-[fadeUp_1s_ease-out] text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">

              Assemblée de

              <span className="block animate-[goldGlow_2s_ease-in-out_infinite] text-yellow-400">

                Bethel

              </span>

            </h1>

            {/* THÈME DE L'ANNÉE */}

            <div className="mx-auto mt-8 max-w-3xl animate-[themeAppear_1.2s_ease-out]">

              <div className="group relative overflow-hidden rounded-[2rem] border border-yellow-400/30 bg-white/10 px-6 py-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-white/15 hover:shadow-yellow-400/10">

                {/* LUEUR GAUCHE */}

                <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl transition-all duration-700 group-hover:scale-125" />

                {/* LUEUR DROITE */}

                <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-green-400/20 blur-3xl transition-all duration-700 group-hover:scale-125" />

                {/* LIGNE LUMINEUSE HAUT */}

                <div className="absolute left-1/2 top-0 h-[2px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                {/* ÉTOILES */}

                <span className="absolute left-5 top-5 animate-pulse text-yellow-300">
                  ✦
                </span>

                <span className="absolute right-5 top-5 animate-pulse text-yellow-300 [animation-delay:500ms]">
                  ✦
                </span>

                <span className="absolute bottom-5 left-8 animate-pulse text-yellow-300/70 [animation-delay:1s]">
                  ✧
                </span>

                <span className="absolute bottom-5 right-8 animate-pulse text-yellow-300/70 [animation-delay:1.5s]">
                  ✧
                </span>

                {/* CONTENU */}

                <div className="relative">

                  {/* CHARGEMENT */}

                  {loadingTheme && (
                    <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-green-200">

                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-200/30 border-t-green-200" />

                      Chargement du thème...

                    </div>
                  )}

                  {/* LABEL */}

                  <div className="flex items-center justify-center gap-3">

                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-400 sm:w-16" />

                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300 sm:text-sm sm:tracking-[0.25em]">

                      Thème de l'année{" "}

                      {themeAnnee.annee}

                    </span>

                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-400 sm:w-16" />

                  </div>

                  {/* ICÔNE */}

                  <div className="mx-auto mt-5 flex h-14 w-14 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl border border-yellow-400/40 bg-yellow-400/10 text-2xl shadow-lg shadow-yellow-500/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">

                    📖

                  </div>

                  {/* TITRE DU THÈME */}

                  <h2 className="mt-5 animate-[themeGlow_3s_ease-in-out_infinite] text-xl font-black leading-tight tracking-tight text-white sm:text-2xl md:text-3xl">

                    « {themeAnnee.titre} »

                  </h2>

                  {/* RÉFÉRENCE */}

                  <div className="mt-5 flex items-center justify-center gap-2">

                    <span className="text-yellow-400">
                      ✦
                    </span>

                    <p className="text-sm font-bold italic text-green-200 sm:text-base">

                      {themeAnnee.reference}

                    </p>

                    <span className="text-yellow-400">
                      ✦
                    </span>

                  </div>

                  {/* ERREUR */}

                  {errorTheme && (
                    <p className="mt-4 text-xs text-yellow-200/70">
                      {errorTheme}
                    </p>
                  )}

                </div>

                {/* LIGNE LUMINEUSE BAS */}

                <div className="absolute bottom-0 left-1/2 h-[2px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />

              </div>

            </div>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-7 max-w-2xl animate-[fadeUp_1.4s_ease-out] text-lg leading-8 text-green-100">

              Une communauté engagée à servir Dieu,
              grandir dans la foi et partager son message
              avec amour.

            </p>

            {/* BADGES */}

            <div className="mt-10 flex flex-wrap justify-center gap-3">

              <div className="animate-[fadeUp_1.5s_ease-out] rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/20">

                ✦ EPICI

              </div>

              <div className="animate-[fadeUp_1.7s_ease-out] rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/20">

                📍 Abidjan

              </div>

              <div className="animate-[fadeUp_1.9s_ease-out] rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/20">

                🤝 Communauté

              </div>

            </div>

          </div>

        </div>

        {/* TRANSITION */}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f6f8f7] to-transparent" />

      </section>

      {/* ==================================================
          CONTENU PRINCIPAL
      ================================================== */}

      <main className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">

        {/* ==================================================
            PRÉSENTATION
        ================================================== */}

        <section className="relative -mt-2">

          <div className="grid gap-6 lg:grid-cols-5">

            {/* QUI SOMMES-NOUS */}

            <div className="group relative animate-[fadeLeft_0.9s_ease-out] overflow-hidden rounded-[2rem] bg-green-950 p-8 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-3 lg:p-10">

              <div className="absolute -right-20 -top-20 h-56 w-56 animate-pulse rounded-full bg-green-400/10 blur-3xl transition duration-500 group-hover:bg-green-400/20" />

              <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-yellow-400/10 blur-3xl [animation-delay:1s]" />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-white/10 text-xl backdrop-blur transition-transform duration-300 group-hover:rotate-6">

                    ✦

                  </div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">

                    Qui sommes-nous ?

                  </p>

                </div>

                <h2 className="mt-8 text-3xl font-black sm:text-4xl">

                  Assemblée de

                  <span className="block text-yellow-400">

                    Bethel

                  </span>

                </h2>

                <p className="mt-7 max-w-2xl text-base leading-8 text-green-100">

                  L'Assemblée de Bethel fait partie de
                  l'Église de Pentecôte Internationale de
                  Côte d'Ivoire (EPICI).

                </p>

                <p className="mt-4 max-w-2xl text-base leading-8 text-green-100">

                  Notre objectif est de créer un espace où
                  chacun peut découvrir la foi, grandir
                  spirituellement et servir Dieu avec ses dons.

                </p>

                <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-green-300">

                  <span className="h-px w-10 bg-green-400/50 transition-all duration-500 group-hover:w-20" />

                  Une communauté de foi

                </div>

              </div>

            </div>

            {/* INFORMATIONS */}

            <div className="animate-[fadeRight_0.9s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-2 lg:p-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">

                    À propos

                  </p>

                  <h2 className="mt-2 text-3xl font-black text-gray-950">

                    Informations

                  </h2>

                </div>

                <div className="flex h-12 w-12 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-green-50 text-xl">

                  ℹ️

                </div>

              </div>

              <div className="mt-8 space-y-3">

                {/* ÉGLISE */}

                <div className="group animate-[fadeUp_0.8s_ease-out] rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50 hover:shadow-md">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">

                      ⛪

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-green-700">

                        Église

                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">

                        Église de Pentecôte Internationale de Côte d'Ivoire

                      </p>

                    </div>

                  </div>

                </div>

                {/* ASSEMBLÉE */}

                <div className="group animate-[fadeUp_1s_ease-out] rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50 hover:shadow-md">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">

                      🏛️

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-green-700">

                        Assemblée

                      </p>

                      <p className="mt-1 font-semibold text-gray-800">

                        Assemblée de Bethel

                      </p>

                    </div>

                  </div>

                </div>

                {/* VILLE */}

                <div className="group animate-[fadeUp_1.2s_ease-out] rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50 hover:shadow-md">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">

                      📍

                    </div>

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-green-700">

                        Localisation

                      </p>

                      <p className="mt-1 font-semibold text-gray-800">

                        Abidjan, Côte d'Ivoire

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            RESPONSABLES
        ================================================== */}

        <section className="mt-28">

          {/* TITRE */}

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex animate-[fadeUp_0.8s_ease-out] items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 transition-all duration-300 hover:scale-105">

              <span className="animate-pulse">
                ✦
              </span>

              NOTRE ÉQUIPE

            </div>

            <h2 className="mt-5 animate-[fadeUp_1s_ease-out] text-4xl font-black tracking-tight text-gray-950 md:text-5xl">

              Nos responsables

            </h2>

            <p className="mt-5 animate-[fadeUp_1.2s_ease-out] text-lg leading-8 text-gray-600">

              Découvrez les responsables qui servent et
              accompagnent la communauté de l'Assemblée
              de Bethel.

            </p>

          </div>

          {/* CHARGEMENT */}

          {loadingResponsables && (

            <div className="mt-12 animate-[fadeUp_0.6s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">

                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-800" />

              </div>

              <p className="mt-5 animate-pulse font-semibold text-gray-600">

                Chargement des responsables...

              </p>

            </div>

          )}

          {/* ERREUR */}

          {!loadingResponsables &&
            errorResponsables && (

              <div className="mt-12 animate-[shake_0.5s_ease-out] rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl">

                  !

                </div>

                <p className="mt-4 font-semibold text-red-700">

                  {errorResponsables}

                </p>

                <button
                  type="button"
                  onClick={fetchResponsables}
                  className="mt-5 rounded-xl bg-red-700 px-6 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-red-800 hover:shadow-lg active:scale-95"
                >

                  Réessayer

                </button>

              </div>

            )}

          {/* AUCUN RESPONSABLE */}

          {!loadingResponsables &&
            !errorResponsables &&
            responsables.length === 0 && (

              <div className="mt-12 animate-[fadeUp_0.8s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-3xl bg-green-50 text-4xl">

                  👥

                </div>

                <p className="mt-5 font-semibold text-gray-500">

                  Aucun responsable enregistré pour le moment.

                </p>

              </div>

            )}

          {/* LISTE */}

          {!loadingResponsables &&
            !errorResponsables &&
            responsables.length > 0 && (

              <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {responsables.map(
                  (
                    responsable,
                    index
                  ) => {

                    const photoUrl =
                      getPhotoUrl(
                        responsable.photo
                      )

                    const nomComplet =
                      [
                        responsable.prenom,
                        responsable.nom,
                      ]
                        .filter(Boolean)
                        .join(" ")

                    const animationDelay =
                      `${index * 150}ms`

                    return (

                      <div
                        key={responsable.id}
                        style={{
                          animationDelay,
                        }}
                        className="group animate-[cardAppear_0.8s_ease-out_both] overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                      >

                        {/* PHOTO */}

                        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-green-100 via-gray-100 to-green-50">

                          {photoUrl ? (

                            <img
                              src={photoUrl}
                              alt={nomComplet}
                              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                              loading="lazy"
                              onError={(event) => {

                                console.error(
                                  "❌ Impossible de charger la photo :",
                                  photoUrl
                                )

                                event.currentTarget.style.display =
                                  "none"

                                const parent =
                                  event.currentTarget.parentElement

                                if (parent) {

                                  parent.innerHTML = `
                                    <div class="flex h-full w-full items-center justify-center text-7xl">
                                      👤
                                    </div>
                                  `
                                }

                              }}
                            />

                          ) : (

                            <div className="flex h-full w-full animate-[float_3s_ease-in-out_infinite] items-center justify-center text-7xl">

                              👤

                            </div>

                          )}

                          {/* EFFET LUMINEUX */}

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-green-950/20 via-transparent to-yellow-300/20 opacity-0 transition duration-700 group-hover:opacity-100" />

                          {/* DÉGRADÉ */}

                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                          {/* BADGE FONCTION */}

                          <div className="absolute left-5 top-5">

                            <span className="inline-flex animate-[badgeAppear_0.8s_ease-out] rounded-full border border-white/20 bg-green-950/85 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105">

                              {getFonctionLabel(
                                responsable.fonction
                              )}

                            </span>

                          </div>

                        </div>

                        {/* INFORMATIONS */}

                        <div className="p-7">

                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">

                            Responsable

                          </p>

                          <h3 className="mt-2 text-2xl font-black tracking-tight text-gray-950 transition-colors duration-300 group-hover:text-green-800">

                            {nomComplet ||
                              "Responsable"}

                          </h3>

                          <div className="mt-5 space-y-2">

                            {responsable.email && (

                              <div className="group/info flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-green-50">

                                <span className="text-sm transition-transform duration-300 group-hover/info:scale-125">

                                  ✉️

                                </span>

                                <p className="min-w-0 break-words text-sm text-gray-600">

                                  {responsable.email}

                                </p>

                              </div>

                            )}

                            {responsable.telephone && (

                              <div className="group/info flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-green-50">

                                <span className="text-sm transition-transform duration-300 group-hover/info:scale-125">

                                  📞

                                </span>

                                <p className="text-sm text-gray-600">

                                  {responsable.telephone}

                                </p>

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    )
                  }
                )}

              </div>

            )}

        </section>

        {/* ==================================================
            NOTRE MISSION
        ================================================== */}

        <section className="mt-28">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex animate-[fadeUp_0.8s_ease-out] items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 transition-all duration-300 hover:scale-105">

              <span className="animate-pulse">
                ✦
              </span>

              NOTRE MISSION

            </div>

            <h2 className="mt-5 animate-[fadeUp_1s_ease-out] text-4xl font-black tracking-tight text-gray-950 md:text-5xl">

              Une communauté,

              <span className="block animate-[goldGlow_2s_ease-in-out_infinite] text-green-800">

                une foi, une mission

              </span>

            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* PRIÈRE */}

            <div className="group animate-[cardAppear_0.8s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-green-50 text-3xl transition duration-500 group-hover:scale-125 group-hover:rotate-6">

                🙏

              </div>

              <h3 className="mt-6 text-xl font-black text-gray-950">

                Prière

              </h3>

              <p className="mt-3 leading-7 text-gray-600">

                Cultiver une vie de prière et de communion
                avec Dieu.

              </p>

            </div>

            {/* PAROLE */}

            <div className="group animate-[cardAppear_0.8s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 [animation-delay:150ms] hover:-translate-y-3 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-yellow-50 text-3xl [animation-delay:500ms] transition duration-500 group-hover:scale-125 group-hover:rotate-6">

                📖

              </div>

              <h3 className="mt-6 text-xl font-black text-gray-950">

                Parole

              </h3>

              <p className="mt-3 leading-7 text-gray-600">

                Grandir dans la connaissance et la compréhension
                de la Parole de Dieu.

              </p>

            </div>

            {/* SERVICE */}

            <div className="group animate-[cardAppear_0.8s_ease-out] rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 [animation-delay:300ms] hover:-translate-y-3 hover:shadow-xl">

              <div className="mx-auto flex h-16 w-16 animate-[float_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-red-50 text-3xl [animation-delay:1s] transition duration-500 group-hover:scale-125 group-hover:rotate-6">

                ❤️

              </div>

              <h3 className="mt-6 text-xl font-black text-gray-950">

                Service

              </h3>

              <p className="mt-3 leading-7 text-gray-600">

                Mettre nos dons et nos talents au service
                de Dieu et de la communauté.

              </p>

            </div>

          </div>

        </section>

        {/* ==================================================
            PROGRAMMES
        ================================================== */}

        <section className="mt-20">

          <div className="group relative animate-[fadeUp_0.9s_ease-out] overflow-hidden rounded-[2rem] bg-green-950 px-8 py-12 text-center shadow-xl transition-all duration-500 hover:shadow-2xl md:px-12">

            {/* DÉCORATIONS */}

            <div className="absolute -left-20 -top-20 h-56 w-56 animate-pulse rounded-full bg-green-400/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-56 w-56 animate-pulse rounded-full bg-yellow-400/10 blur-3xl [animation-delay:1s]" />

            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl transition-all duration-700 group-hover:scale-150" />

            <div className="relative">

              <p className="animate-[fadeUp_0.7s_ease-out] text-sm font-bold uppercase tracking-[0.25em] text-green-300">

                Découvrez nos activités

              </p>

              <h2 className="mt-4 animate-[fadeUp_0.9s_ease-out] text-3xl font-black text-white md:text-4xl">

                Participez à la vie de l'assemblée

              </h2>

              <p className="mx-auto mt-4 max-w-2xl animate-[fadeUp_1.1s_ease-out] text-green-100">

                Retrouvez tous les programmes et activités
                de l'Assemblée de Bethel.

              </p>

              <Link
                to="/programs"
                className="group/button mt-8 inline-flex animate-[fadeUp_1.3s_ease-out] items-center gap-2 rounded-xl bg-yellow-400 px-7 py-4 font-black text-green-950 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-yellow-300 hover:shadow-2xl active:scale-95"
              >

                Voir les programmes

                <span className="text-lg transition-transform duration-300 group-hover/button:translate-x-2">

                  →

                </span>

              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* ==================================================
          ANIMATIONS CSS
      ================================================== */}

      <style>{`

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(45px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes badgeAppear {
          from {
            opacity: 0;
            transform: translateX(-20px) scale(0.9);
          }

          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes themeAppear {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes goldGlow {
          0%,
          100% {
            filter: drop-shadow(
              0 0 0px
              rgba(250, 204, 21, 0)
            );
          }

          50% {
            filter: drop-shadow(
              0 0 12px
              rgba(250, 204, 21, 0.35)
            );
          }
        }

        @keyframes themeGlow {
          0%,
          100% {
            text-shadow:
              0 0 0px
              rgba(250, 204, 21, 0);
          }

          50% {
            text-shadow:
              0 0 18px
              rgba(250, 204, 21, 0.25);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-6px);
          }

          75% {
            transform: translateX(6px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>

    </div>
  )
}

export default Church


