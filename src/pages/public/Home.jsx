
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link, useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  // ============================================================
  // ÉTAT DE CONNEXION
  // ============================================================

  const [utilisateur, setUtilisateur] = useState(null)

  // ============================================================
  // ÉTAT DE DÉCONNEXION
  // ============================================================

  const [deconnexion, setDeconnexion] = useState(false)

  // ============================================================
  // ÉTAT DES ASSEMBLÉES
  // ============================================================

  const [assemblies, setAssemblies] = useState([])

  // ============================================================
  // VÉRIFIER L'UTILISATEUR CONNECTÉ
  // ============================================================

  useEffect(() => {
    const verifierConnexion = () => {
      try {
        const userStocke =
          localStorage.getItem("user") ||
          localStorage.getItem("utilisateur")

        if (userStocke) {
          const user = JSON.parse(userStocke)

          setUtilisateur(user)

          console.log(
            "👤 UTILISATEUR CONNECTÉ SUR HOME :",
            user
          )
        } else {
          setUtilisateur(null)

          console.log(
            "👤 AUCUN UTILISATEUR CONNECTÉ"
          )
        }
      } catch (error) {
        console.error(
          "❌ Erreur lecture utilisateur :",
          error
        )

        setUtilisateur(null)
      }
    }

    verifierConnexion()

    const intervalle = setInterval(
      verifierConnexion,
      1000
    )

    return () => clearInterval(intervalle)
  }, [])

  // ============================================================
  // CHARGER LES ASSEMBLÉES
  // ============================================================

  useEffect(() => {
    const chargerAssemblies = () => {
      try {
        const saved = localStorage.getItem(
          "bethel_assemblies"
        )

        if (!saved) {
          setAssemblies([])
          return
        }

        const parsed = JSON.parse(saved)

        if (!Array.isArray(parsed)) {
          setAssemblies([])
          return
        }

        const cleanedAssemblies = parsed.map(
          (assembly) => ({
            ...assembly,

            slogan: assembly.slogan || "",
            mission: assembly.mission || "",
            vision: assembly.vision || "",
            description:
              assembly.description || "",
            address: assembly.address || "",
            phone: assembly.phone || "",
            pastor: assembly.pastor || "",
            logo: assembly.logo || null,

            photos: Array.isArray(assembly.photos)
              ? assembly.photos
              : [],
          })
        )

        setAssemblies(cleanedAssemblies)

        console.log(
          "🏛️ ASSEMBLÉES CHARGÉES SUR HOME :",
          cleanedAssemblies
        )
      } catch (error) {
        console.error(
          "❌ Erreur chargement des assemblées :",
          error
        )

        setAssemblies([])
      }
    }

    chargerAssemblies()

    const handleStorage = () => {
      chargerAssemblies()
    }

    const handleFocus = () => {
      chargerAssemblies()
    }

    window.addEventListener(
      "storage",
      handleStorage
    )

    window.addEventListener(
      "focus",
      handleFocus
    )

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      )

      window.removeEventListener(
        "focus",
        handleFocus
      )
    }
  }, [])

  // ============================================================
  // DEMANDER LA DÉCONNEXION
  // ============================================================

  const handleLogout = () => {
    console.log(
      "🔐 DEMANDE DE DÉCONNEXION DEPUIS HOME"
    )

    setDeconnexion(true)
  }

  // ============================================================
  // ANNULER LA DÉCONNEXION
  // ============================================================

  const annulerDeconnexion = () => {
    console.log(
      "❌ DÉCONNEXION ANNULÉE"
    )

    setDeconnexion(false)
  }

  // ============================================================
  // CONFIRMER LA DÉCONNEXION
  // ============================================================

  const confirmerDeconnexion = () => {
    console.log(
      "🚪 DÉCONNEXION EFFECTUÉE DEPUIS HOME"
    )

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("utilisateur")

    setUtilisateur(null)
    setDeconnexion(false)

    navigate("/", {
      replace: true,
    })
  }

  // ============================================================
  // FERMER LA FENÊTRE AVEC ÉCHAP
  // ============================================================

  useEffect(() => {
    const gererToucheEchap = (event) => {
      if (
        event.key === "Escape" &&
        deconnexion
      ) {
        setDeconnexion(false)
      }
    }

    document.addEventListener(
      "keydown",
      gererToucheEchap
    )

    return () => {
      document.removeEventListener(
        "keydown",
        gererToucheEchap
      )
    }
  }, [deconnexion])

  // ============================================================
  // RÔLES
  // ============================================================

  const estAdministrateur =
    utilisateur?.role === "administrateur"

  const estUtilisateur =
    utilisateur?.role === "utilisateur"

  const estConnecte =
    estAdministrateur || estUtilisateur

  // ============================================================
  // DATE ACTUELLE
  // ============================================================

  const maintenant = new Date()

  const jourSemaine =
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
    })
      .format(maintenant)
      .toUpperCase()

  const dateComplete =
    new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
      .format(maintenant)
      .toUpperCase()

  // ============================================================
  // PROGRAMMES DE CHAQUE JOUR
  // ============================================================

  const programmesDuJour = {
    0: {
      titre: "CULTE DOMINICAL",
      heure: "08H00",
    },

    1: {
      titre: "CULTE EN FAMILLE",
      heure: "",
    },

    2: {
      titre: "CULTE DU MINISTÈRE DES FEMMES",
      heure: "18H30",
    },

    3: {
      titre: "CULTE DU SOIR DU MERCREDI",
      heure: "18H30",
    },

    4: {
      titre: "CULTE EN FAMILLE",
      heure: "",
    },

    5: {
      titre: "CULTE DU SOIR DU VENDREDI",
      heure: "18H30",
    },

    6: {
      titre: "LES VISITES",
      heure: "",
    },
  }

  const programmeDuJour =
    programmesDuJour[maintenant.getDay()]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ==========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-green-950 pt-32 text-white">

        <div className="hero-light-left absolute -left-20 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />

        <div className="hero-light-right absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2 lg:px-8">

          <div className="animate-fade-in-up">

            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition duration-300 hover:bg-white/15">

              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

              ASSEMBLÉE DE BETHEL

            </div>

            <h1 className="animate-title max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">

              BETHEL

              <span className="block text-yellow-400">
                GLORY MEDIA
              </span>

            </h1>

            <p className="animate-description mt-6 max-w-xl text-lg leading-8 text-green-100">
              Une plateforme moderne pour créer, gérer
              et partager facilement les publications
              de notre assemblée.
            </p>

            <div className="animate-buttons mt-8 flex flex-wrap gap-4">

              {!estConnecte && (
                <Link
                  to="/login"
                  className="hero-button rounded-xl bg-yellow-400 px-6 py-3 font-bold text-green-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >
                  🔐 Se connecter
                </Link>
              )}

              {estUtilisateur && (
                <Link
                  to="/templates"
                  className="hero-button rounded-xl bg-yellow-400 px-6 py-3 font-bold text-green-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >
                  🎨 Voir les modèles
                </Link>
              )}

              {estAdministrateur && (
                <Link
                  to="/admin"
                  className="hero-button rounded-xl bg-yellow-400 px-6 py-3 font-bold text-green-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >
                  👑 Administration
                </Link>
              )}

              <Link
                to="/church"
                className="hero-button rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
              >
                ⛪ Découvrir l'église
              </Link>

              {estConnecte && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="hero-button rounded-xl border border-red-300/30 bg-red-500/10 px-6 py-3 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-red-500/20 hover:shadow-lg"
                >
                  🚪 Déconnexion
                </button>
              )}

            </div>

          </div>

          {/* APERÇU PUBLICATION DU JOUR */}

          <div className="relative animate-slide-in-right">

            <div className="animate-float mx-auto max-w-md rounded-[2rem] bg-white p-3 shadow-2xl">

              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-green-950 via-green-700 to-green-400">

                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">

                  <p className="text-xs font-bold tracking-[0.4em]">
                    ASSEMBLÉE DE BETHEL
                  </p>

                  <div className="my-6 h-px w-16 bg-white/50" />

                  <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                    {programmeDuJour.titre}
                  </h2>

                  <p className="mt-8 text-lg font-semibold">
                    {jourSemaine}
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    {dateComplete}
                  </p>

                  {programmeDuJour.heure && (
                    <div className="mt-10 rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm transition duration-300 hover:bg-white/20">

                      <p className="text-sm font-semibold">
                        {programmeDuJour.heure}
                        {" • "}
                        ASSEMBLÉE DE BETHEL
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ==========================================================
          FONCTIONNALITÉS
      ========================================================== */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="animate-on-scroll mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
              Une plateforme complète
            </p>

            <h2 className="mt-4 text-4xl font-black text-green-950">
              Tout pour vos publications
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              BETHEL GLORY MEDIA facilite la création et
              la gestion des supports de communication
              de l'assemblée.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-3">

            {/* ======================================================
                GALERIE DE MODÈLES
                TOUTE LA CARTE EST CLIQUABLE
            ====================================================== */}

            <Link
              to="/templates"
              className="feature-card group block cursor-pointer rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                🎨
              </div>

              <h3 className="mt-6 text-xl font-bold text-green-950">
                Galerie de modèles
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Découvrez les différents modèles disponibles
                pour les cultes, prédications, événements,
                départements et annonces.
              </p>

              <div className="mt-6 flex items-center gap-2 font-bold text-green-700">

                <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />

                Plusieurs modèles disponibles

              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-950 px-5 py-3 font-bold text-white transition duration-300 group-hover:-translate-y-1 group-hover:bg-green-900 group-hover:shadow-lg">

                🎨 Voir les modèles

                <span className="transition duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>

            </Link>


            {/* ======================================================
                PROGRAMMES / PUBLICATIONS
            ====================================================== */}

            {estAdministrateur ? (

              <Link
                to="/admin/programs"
                className="feature-card group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                  📅
                </div>

                <h3 className="mt-6 text-xl font-bold text-green-950">
                  Programmes
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Gérez les programmes et les informations
                  associées aux différents jours de l'assemblée.
                </p>

                <span className="mt-6 inline-block font-bold text-green-700 transition duration-300 group-hover:translate-x-2">
                  Gérer les programmes →
                </span>

              </Link>

            ) : (

              <Link
                to="/publications"
                className="feature-card group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                  📝
                </div>

                <h3 className="mt-6 text-xl font-bold text-green-950">
                  Mes publications
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Retrouvez vos publications et préparez
                  facilement vos nouveaux contenus.
                </p>

                <span className="mt-6 inline-block font-bold text-green-700 transition duration-300 group-hover:translate-x-2">
                  Gérer mes publications →
                </span>

              </Link>

            )}


            {/* ======================================================
                INTELLIGENCE ARTIFICIELLE
            ====================================================== */}

            <div className="feature-card group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                ✨
              </div>

              <h3 className="mt-6 text-xl font-bold text-green-950">
                Intelligence artificielle
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Une technologie conçue pour vous accompagner
                dans la préparation de vos contenus et
                l'automatisation de certaines informations.
              </p>

              <div className="mt-6 flex items-center gap-2 font-bold text-purple-700">

                <span className="h-2 w-2 animate-pulse rounded-full bg-purple-600" />

                Création intelligente

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================================
          CRÉATION
      ========================================================== */}

      <section className="bg-gray-50 py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div className="animate-on-scroll">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                Simple et rapide
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-green-950">

                Créez vos publications

                <span className="block text-green-700">
                  en quelques étapes
                </span>

              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Notre système permet de centraliser les
                informations et de faciliter la préparation
                des supports de communication de l'assemblée.
              </p>


              <div className="mt-10 space-y-6">

                <div className="step-item flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-950 font-bold text-white">
                    1
                  </div>

                  <div>

                    <h3 className="font-bold text-green-950">
                      Choisissez un modèle
                    </h3>

                    <p className="mt-1 text-gray-600">
                      Sélectionnez le modèle correspondant
                      à votre programme.
                    </p>

                  </div>

                </div>


                <div className="step-item flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-950 font-bold text-white">
                    2
                  </div>

                  <div>

                    <h3 className="font-bold text-green-950">
                      Ajoutez les informations
                    </h3>

                    <p className="mt-1 text-gray-600">
                      Indiquez le programme, la date, l'heure
                      et les informations nécessaires.
                    </p>

                  </div>

                </div>


                <div className="step-item flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-950 font-bold text-white">
                    3
                  </div>

                  <div>

                    <h3 className="font-bold text-green-950">
                      Générez votre publication
                    </h3>

                    <p className="mt-1 text-gray-600">
                      Votre publication est prête à être
                      utilisée et partagée.
                    </p>

                  </div>

                </div>

              </div>


              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  to="/publications"
                  className="rounded-xl bg-green-950 px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-green-900 hover:shadow-lg"
                >
                  📝 Créer une publication
                </Link>

                {estAdministrateur && (
                  <Link
                    to="/admin/programs"
                    className="rounded-xl border border-green-950 px-6 py-3 font-bold text-green-950 transition duration-300 hover:-translate-y-1 hover:bg-green-950 hover:text-white"
                  >
                    📅 Gérer les programmes
                  </Link>
                )}

              </div>

            </div>


            <div className="animate-slide-in-right relative">

              <div className="rounded-[2rem] bg-green-950 p-8 shadow-2xl transition duration-500 hover:-translate-y-2">

                <div className="rounded-3xl bg-white p-8">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Programme du jour
                      </p>

                      <h3 className="mt-2 text-2xl font-black text-green-950">
                        {programmeDuJour.titre}
                      </h3>

                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                      📅
                    </div>

                  </div>


                  <div className="mt-8 space-y-4">

                    <div className="rounded-2xl bg-gray-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">

                      <p className="text-sm text-gray-500">
                        Jour
                      </p>

                      <p className="mt-1 font-bold text-green-950">
                        {jourSemaine}
                      </p>

                    </div>


                    <div className="rounded-2xl bg-gray-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">

                      <p className="text-sm text-gray-500">
                        Date
                      </p>

                      <p className="mt-1 font-bold text-green-950">
                        {dateComplete}
                      </p>

                    </div>


                    {programmeDuJour.heure && (
                      <div className="rounded-2xl bg-green-50 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">

                        <p className="text-sm text-gray-500">
                          Heure
                        </p>

                        <p className="mt-1 font-bold text-green-950">
                          {programmeDuJour.heure}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==========================================================
          IA
      ========================================================== */}

      <section
        id="intelligence-artificielle"
        className="relative overflow-hidden bg-green-950 py-24 text-white"
      >

        <div className="ai-light absolute -left-20 top-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="ai-light absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div className="animate-on-scroll">

              <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                ✨ Technologie
              </div>

              <h2 className="text-4xl font-black leading-tight sm:text-5xl">

                Une intelligence

                <span className="block text-yellow-400">
                  au service de vos publications
                </span>

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-green-100">
                BETHEL GLORY MEDIA intègre une assistance
                intelligente pour vous aider à préparer vos
                contenus plus rapidement et à automatiser
                certaines informations.
              </p>


              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-green-950">
                    ✓
                  </span>

                  <span className="text-green-100">
                    Aide à la création de contenu
                  </span>

                </div>


                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-green-950">
                    ✓
                  </span>

                  <span className="text-green-100">
                    Génération de textes avec Gemini
                  </span>

                </div>


                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-green-950">
                    ✓
                  </span>

                  <span className="text-green-100">
                    Automatisation des informations
                  </span>

                </div>

              </div>


              <div className="mt-10">

                <Link
                  to="/assistant-ia"
                  className="ai-main-button inline-flex items-center gap-3 rounded-2xl bg-yellow-400 px-7 py-4 font-black text-green-950 shadow-xl transition duration-300 hover:-translate-y-2 hover:bg-yellow-300 hover:shadow-2xl"
                >

                  <span className="text-xl">
                    ✨
                  </span>

                  Accéder à l'assistant IA

                  <span className="text-xl">
                    →
                  </span>

                </Link>

              </div>

            </div>


            <div className="animate-slide-in-right relative">

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur transition duration-500 hover:-translate-y-2">

                <div className="rounded-3xl bg-white p-8 text-center">

                  <div className="ai-icon mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-4xl shadow-lg">
                    ✨
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-green-950">
                    Création intelligente
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    Préparez rapidement vos contenus grâce
                    aux outils intelligents intégrés à votre
                    plateforme.
                  </p>


                  <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-sm text-gray-500">
                        Programme
                      </span>

                      <span className="text-right font-bold text-green-950">
                        {programmeDuJour.titre}
                      </span>

                    </div>


                    <div className="mt-4 flex items-center justify-between gap-4">

                      <span className="text-sm text-gray-500">
                        Date
                      </span>

                      <span className="font-bold text-green-950">
                        {dateComplete}
                      </span>

                    </div>


                    {programmeDuJour.heure && (
                      <div className="mt-4 flex items-center justify-between gap-4">

                        <span className="text-sm text-gray-500">
                          Heure
                        </span>

                        <span className="font-bold text-green-950">
                          {programmeDuJour.heure}
                        </span>

                      </div>
                    )}

                  </div>


                  <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3">

                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

                    <span className="text-sm font-bold text-green-800">
                      Assistance intelligente disponible
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <Footer />


      {/* ==========================================================
          MODAL DE DÉCONNEXION
      ========================================================== */}

      {deconnexion && (

        <div
          className="logout-modal fixed inset-0 z-[100] flex items-center justify-center bg-[#061f18]/70 px-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              annulerDeconnexion()
            }
          }}
        >

          <div
            className="logout-modal-content relative w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 px-6 pb-8 pt-7 text-center text-white">

              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />

              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />


              <button
                type="button"
                onClick={annulerDeconnexion}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition duration-300 hover:rotate-90 hover:bg-white/20"
                aria-label="Fermer"
              >
                ×
              </button>


              <div className="logout-icon relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-4xl shadow-lg backdrop-blur">
                🚪
              </div>

              <h2 className="relative mt-5 text-2xl font-black">
                Déconnexion
              </h2>

              <p className="relative mt-2 text-sm font-medium text-green-100">
                BETHEL GLORY MEDIA
              </p>

            </div>


            <div className="px-6 pb-7 pt-7">

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                  🔐
                </div>

                <p className="font-semibold leading-6 text-green-950">
                  Êtes-vous sûr de vouloir vous
                  déconnecter de votre espace ?
                </p>


                {utilisateur && (
                  <div className="mt-4 rounded-xl bg-white px-4 py-3 shadow-sm">

                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Session actuelle
                    </p>

                    <p className="mt-1 truncate font-bold text-green-700">
                      {utilisateur.nom ||
                        utilisateur.username ||
                        utilisateur.email ||
                        "Utilisateur"}
                    </p>

                  </div>
                )}

              </div>


              <div className="mt-6 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={annulerDeconnexion}
                  className="logout-cancel-button rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-bold text-gray-700 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                >
                  Non, rester
                </button>


                <button
                  type="button"
                  onClick={confirmerDeconnexion}
                  className="logout-confirm-button rounded-xl bg-green-950 px-4 py-3 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl"
                >
                  Oui, me déconnecter
                </button>

              </div>


              <p className="mt-5 text-center text-xs text-gray-400">
                Appuyez sur{" "}
                <span className="font-bold">
                  Échap
                </span>{" "}
                pour annuler
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ==========================================================
          ANIMATIONS CSS
      ========================================================== */}

      <style>{`

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        @keyframes heroLight {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }


        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-14px);
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
              0 0 18px
              rgba(250, 204, 21, 0.55)
            );
          }
        }


        @keyframes cardAppear {
          from {
            opacity: 0;
            transform:
              translateY(45px)
              scale(0.95);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }


        @keyframes aiPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 0
              rgba(134, 239, 172, 0.15);
          }

          50% {
            transform: scale(1.08);
            box-shadow:
              0 0 0 18px
              rgba(134, 239, 172, 0);
          }
        }


        @keyframes aiLight {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.35;
          }

          50% {
            transform: scale(1.25);
            opacity: 0.8;
          }
        }


        @keyframes modalBackground {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }


        @keyframes modalAppear {
          from {
            opacity: 0;
            transform:
              translateY(35px)
              scale(0.92);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }


        @keyframes logoutIcon {
          0% {
            opacity: 0;
            transform:
              scale(0.5)
              rotate(-15deg);
          }

          70% {
            transform:
              scale(1.08)
              rotate(3deg);
          }

          100% {
            opacity: 1;
            transform:
              scale(1)
              rotate(0);
          }
        }


        @keyframes modalGlow {
          0%,
          100% {
            box-shadow:
              0 25px 60px
              rgba(0, 0, 0, 0.25);
          }

          50% {
            box-shadow:
              0 30px 80px
              rgba(22, 101, 52, 0.30);
          }
        }


        .animate-fade-in-up {
          animation:
            fadeInUp
            1s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }


        .animate-title {
          animation:
            fadeInUp
            1s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.15s
            both;
        }


        .animate-description {
          animation:
            fadeInUp
            1s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.35s
            both;
        }


        .animate-buttons {
          animation:
            fadeInUp
            1s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.55s
            both;
        }


        .animate-slide-in-right {
          animation:
            fadeInUp
            1s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.25s
            both;
        }


        .animate-float {
          animation:
            float
            4s
            ease-in-out
            infinite;
        }


        .hero-light-left,
        .hero-light-right {
          animation:
            heroLight
            6s
            ease-in-out
            infinite;
        }


        .hero-button {
          animation:
            goldGlow
            3s
            ease-in-out
            infinite;
        }


        .feature-card {
          animation:
            cardAppear
            0.9s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;

          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }


        .feature-card:nth-child(1) {
          animation-delay: 0.1s;
        }


        .feature-card:nth-child(2) {
          animation-delay: 0.25s;
        }


        .feature-card:nth-child(3) {
          animation-delay: 0.4s;
        }


        .feature-card:hover {
          transform:
            translateY(-10px)
            scale(1.015);

          box-shadow:
            0 25px 50px -12px
            rgba(0, 0, 0, 0.18);
        }


        .assembly-card {
          animation:
            cardAppear
            0.9s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }


        .assembly-placeholder {
          animation:
            float
            4s
            ease-in-out
            infinite;
        }


        .step-item {
          transition:
            transform 0.3s ease,
            padding-left 0.3s ease;
        }


        .step-item:hover {
          transform:
            translateX(8px);
        }


        .ai-light {
          animation:
            aiLight
            7s
            ease-in-out
            infinite;
        }


        .ai-icon {
          animation:
            aiPulse
            2.8s
            ease-in-out
            infinite;
        }


        .ai-main-button {
          animation:
            goldGlow
            2.5s
            ease-in-out
            infinite;
        }


        .logout-modal {
          animation:
            modalBackground
            0.25s
            ease-out
            both;
        }


        .logout-modal-content {
          animation:
            modalAppear
            0.45s
            cubic-bezier(0.22, 1, 0.36, 1)
            both,
            modalGlow
            3s
            ease-in-out
            0.45s
            infinite;
        }


        .logout-icon {
          animation:
            logoutIcon
            0.55s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }


        .logout-cancel-button,
        .logout-confirm-button {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background-color 0.3s ease,
            border-color 0.3s ease;
        }


        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

        }

      `}</style>

    </div>
  )
}

export default Home
