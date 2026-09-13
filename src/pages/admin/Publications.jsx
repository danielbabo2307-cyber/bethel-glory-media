import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

function Publications() {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ============================================================
  // RÉCUPÉRATION DES PUBLICATIONS
  // ============================================================

  useEffect(() => {
    chargerPublications()
  }, [])

  async function chargerPublications() {
    try {
      setLoading(true)
      setError("")

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken")

      const response = await fetch(`${API_URL}/api/publications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message || "Impossible de récupérer les publications."
        )
      }

      setPublications(
        Array.isArray(data?.publications)
          ? data.publications
          : Array.isArray(data)
            ? data
            : []
      )
    } catch (err) {
      console.error("Erreur chargement publications :", err)

      setError(
        err.message ||
          "Une erreur est survenue lors du chargement des publications."
      )

      setPublications([])
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // STATISTIQUES
  // ============================================================

  const totalPublications = publications.length

  const totalVisuels = publications.filter(
    (publication) =>
      publication?.fichier_final ||
      publication?.image_id ||
      publication?.image
  ).length

  const publicationsTerminees = publications.filter(
    (publication) =>
      publication?.statut === "terminee" ||
      publication?.statut === "terminee"
  ).length

  // ============================================================
  // STATUT
  // ============================================================

  function getStatutLabel(statut) {
    switch (statut) {
      case "terminee":
        return "Terminée"

      case "en_traitement":
        return "En traitement"

      case "brouillon":
        return "Brouillon"

      case "erreur":
        return "Erreur"

      default:
        return statut || "Brouillon"
    }
  }

  function getStatutClasses(statut) {
    switch (statut) {
      case "terminee":
        return "bg-green-100 text-green-700"

      case "en_traitement":
        return "bg-blue-100 text-blue-700"

      case "erreur":
        return "bg-red-100 text-red-700"

      case "brouillon":
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  // ============================================================
  // DATE
  // ============================================================

  function formaterDate(date) {
    if (!date) return "Date inconnue"

    try {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    } catch {
      return "Date inconnue"
    }
  }

  // ============================================================
  // IMAGE
  // ============================================================

  function getImageUrl(publication) {
    const fichier =
      publication?.fichier_final ||
      publication?.fichier_traite ||
      publication?.image

    if (!fichier) return null

    if (
      fichier.startsWith("http://") ||
      fichier.startsWith("https://")
    ) {
      return fichier
    }

    if (fichier.startsWith("/")) {
      return `${API_URL}${fichier}`
    }

    return `${API_URL}/${fichier}`
  }

  // ============================================================
  // RENDU
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f5f7f6] pb-32">

      <AdminSidebar />

      <main className="px-4 pt-5 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="mb-8">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <Link
                  to="/admin"
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    text-lg font-bold text-green-950
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                  aria-label="Retour au tableau de bord"
                >
                  ←
                </Link>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                    BETHEL GLORY MEDIA
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                    Publications
                  </h1>

                </div>

              </div>

              <div
                className="
                  hidden items-center gap-2
                  rounded-2xl
                  border border-gray-100
                  bg-white
                  px-4 py-3
                  shadow-sm
                  sm:flex
                "
              >

                <span className="text-lg">
                  🖼️
                </span>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Média
                  </p>

                  <p className="text-sm font-black text-green-950">
                    Publications
                  </p>

                </div>

              </div>

            </div>

          </header>

          {/* ==================================================
              HERO
          ================================================== */}

          <section
            className="
              relative overflow-hidden
              rounded-[30px]
              bg-green-950
              p-6 text-white
              shadow-[0_20px_60px_rgba(6,78,59,0.18)]
              sm:p-8
            "
          >

            <div
              className="
                absolute -right-20 -top-20
                h-60 w-60
                rounded-full
                bg-green-700/30
                blur-2xl
              "
            />

            <div
              className="
                absolute -bottom-24 -left-10
                h-52 w-52
                rounded-full
                bg-yellow-400/10
                blur-3xl
              "
            />

            <div className="relative">

              <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-2xl">

                  <div
                    className="
                      mb-4 inline-flex
                      items-center gap-2
                      rounded-full
                      border border-white/10
                      bg-white/10
                      px-3 py-1.5
                    "
                  >

                    <span className="h-2 w-2 rounded-full bg-yellow-400" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-100">
                      Communication digitale
                    </span>

                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Donnez vie à vos publications
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                    Créez, gérez et préparez les visuels de
                    communication de votre église depuis votre
                    espace d'administration.
                  </p>

                </div>

                <Link
                  to="/publications"
                  className="
                    inline-flex
                    items-center justify-center
                    gap-2
                    rounded-2xl
                    bg-white
                    px-6 py-3.5
                    text-sm font-black
                    text-green-950
                    shadow-xl
                    transition
                    hover:-translate-y-0.5
                    hover:bg-green-50
                    active:scale-[0.98]
                  "
                >

                  <span className="text-lg">
                    +
                  </span>

                  Créer une publication

                </Link>

              </div>

            </div>

          </section>

          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <section className="mt-5 grid gap-4 sm:grid-cols-3">

            {/* TOTAL */}

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-green-50
                    text-xl
                  "
                >
                  🖼️
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  TOTAL
                </span>

              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">

                {loading ? "..." : totalPublications}

              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Publications
              </p>

            </div>

            {/* VISUELS */}

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-yellow-50
                    text-xl
                  "
                >
                  ✨
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  VISUELS
                </span>

              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">

                {loading ? "..." : totalVisuels}

              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Créations graphiques
              </p>

            </div>

            {/* STATUT */}

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-gray-100
                    text-xl
                  "
                >
                  ✓
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  STATUT
                </span>

              </div>

              <p className="mt-5 text-xl font-black text-green-700">
                {loading
                  ? "..."
                  : publicationsTerminees > 0
                    ? `${publicationsTerminees} terminée${
                        publicationsTerminees > 1 ? "s" : ""
                      }`
                    : "Prêt"}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                {publicationsTerminees > 0
                  ? "Publications finalisées"
                  : "Espace disponible"}
              </p>

            </div>

          </section>

          {/* ==================================================
              MESSAGE ERREUR
          ================================================== */}

          {error && (
            <div
              className="
                mt-6
                rounded-2xl
                border border-red-200
                bg-red-50
                px-5 py-4
                text-sm
                font-medium
                text-red-700
              "
            >
              <div className="flex items-start gap-3">

                <span className="text-lg">
                  ⚠️
                </span>

                <div>

                  <p className="font-black">
                    Impossible de charger les publications
                  </p>

                  <p className="mt-1">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={chargerPublications}
                    className="
                      mt-3
                      rounded-xl
                      bg-red-700
                      px-4 py-2
                      text-xs
                      font-black
                      text-white
                      transition
                      hover:bg-red-800
                    "
                  >
                    Réessayer
                  </button>

                </div>

              </div>
            </div>
          )}

          {/* ==================================================
              PUBLICATIONS
          ================================================== */}

          <section className="mt-8">

            <div className="mb-5 flex items-end justify-between gap-4">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                  Bibliothèque
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Vos publications
                </h2>

              </div>

              <span className="hidden rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-gray-400 shadow-sm sm:block">

                {loading
                  ? "Chargement..."
                  : `${totalPublications} publication${
                      totalPublications > 1 ? "s" : ""
                    }`}

              </span>

            </div>

            {/* ==================================================
                CHARGEMENT
            ================================================== */}

            {loading && (
              <div
                className="
                  overflow-hidden
                  rounded-[30px]
                  border border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                <div className="p-6 sm:p-10">

                  <div
                    className="
                      flex min-h-[300px]
                      flex-col
                      items-center
                      justify-center
                      rounded-[26px]
                      bg-gray-50
                    "
                  >

                    <div
                      className="
                        h-12 w-12
                        animate-spin
                        rounded-full
                        border-4
                        border-gray-200
                        border-t-green-700
                      "
                    />

                    <p className="mt-5 text-sm font-bold text-gray-500">
                      Chargement des publications...
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                AUCUNE PUBLICATION
            ================================================== */}

            {!loading && publications.length === 0 && !error && (
              <div
                className="
                  overflow-hidden
                  rounded-[30px]
                  border border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                <div className="p-6 sm:p-10">

                  <div
                    className="
                      relative overflow-hidden
                      rounded-[26px]
                      border-2 border-dashed
                      border-gray-200
                      bg-gray-50/70
                      px-5 py-12
                      text-center
                      sm:px-10
                    "
                  >

                    <div
                      className="
                        absolute -left-10 -top-10
                        h-24 w-24
                        rounded-full
                        bg-green-100/60
                        blur-xl
                      "
                    />

                    <div
                      className="
                        absolute -bottom-10 -right-10
                        h-24 w-24
                        rounded-full
                        bg-yellow-100/50
                        blur-xl
                      "
                    />

                    <div className="relative">

                      <div
                        className="
                          mx-auto flex h-20 w-20
                          items-center justify-center
                          rounded-[26px]
                          bg-white
                          text-4xl
                          shadow-md
                        "
                      >
                        🖼️
                      </div>

                      <h3 className="mt-6 text-xl font-black text-gray-950">
                        Aucune publication
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Les publications que vous créerez
                        apparaîtront automatiquement dans cette
                        bibliothèque.
                      </p>

                      <Link
                        to="/publications"
                        className="
                          mt-6 inline-flex
                          items-center justify-center
                          gap-2
                          rounded-2xl
                          bg-green-950
                          px-6 py-3.5
                          text-sm font-black
                          text-white
                          shadow-lg
                          shadow-green-950/15
                          transition
                          hover:bg-green-900
                          active:scale-[0.98]
                        "
                      >

                        <span className="text-lg">
                          +
                        </span>

                        Créer ma première publication

                      </Link>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                LISTE DES PUBLICATIONS
            ================================================== */}

            {!loading && publications.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {publications.map((publication) => {

                  const imageUrl = getImageUrl(publication)

                  return (
                    <article
                      key={publication.id}
                      className="
                        overflow-hidden
                        rounded-[26px]
                        border border-gray-100
                        bg-white
                        shadow-sm
                        transition
                        hover:-translate-y-1
                        hover:shadow-lg
                      "
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              publication.titre ||
                              "Publication BETHEL GLORY MEDIA"
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-500
                              hover:scale-105
                            "
                            onError={(event) => {
                              event.currentTarget.style.display = "none"
                            }}
                          />
                        ) : (
                          <div
                            className="
                              flex h-full
                              items-center justify-center
                              bg-gradient-to-br
                              from-green-950
                              to-green-800
                              text-5xl
                            "
                          >
                            🖼️
                          </div>
                        )}

                        <div className="absolute left-3 top-3">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3 py-1.5
                              text-[10px]
                              font-black
                              ${getStatutClasses(publication.statut)}
                            `}
                          >
                            {getStatutLabel(publication.statut)}
                          </span>

                        </div>

                      </div>

                      {/* CONTENU */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-black text-gray-950">

                              {publication.titre ||
                                "Publication sans titre"}

                            </h3>

                            <p className="mt-1 text-xs font-medium text-gray-400">

                              {formaterDate(
                                publication.created_at
                              )}

                            </p>

                          </div>

                          <span className="shrink-0 text-lg">
                            ✨
                          </span>

                        </div>

                        {publication.texte && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                            {publication.texte}
                          </p>
                        )}

                        {publication.verset && (
                          <div
                            className="
                              mt-4
                              rounded-xl
                              bg-green-50
                              px-3 py-2
                              text-xs
                              font-semibold
                              italic
                              text-green-800
                            "
                          >
                            {publication.verset}
                          </div>
                        )}

                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                            text-[10px]
                            font-bold
                            text-gray-400
                          "
                        >

                          {publication.assemblee_nom && (
                            <span className="rounded-lg bg-gray-100 px-2 py-1">
                              📍 {publication.assemblee_nom}
                            </span>
                          )}

                          {publication.modele_nom && (
                            <span className="rounded-lg bg-gray-100 px-2 py-1">
                              🎨 {publication.modele_nom}
                            </span>
                          )}

                        </div>

                      </div>

                    </article>
                  )
                })}

              </div>
            )}

          </section>

          {/* ==================================================
              INFORMATIONS
          ================================================== */}

          <section
            className="
              mt-6
              rounded-[26px]
              border border-green-100
              bg-green-50
              p-5
              sm:p-6
            "
          >

            <div className="flex gap-4">

              <div
                className="
                  flex h-11 w-11
                  shrink-0 items-center justify-center
                  rounded-2xl
                  bg-white
                  text-xl
                  shadow-sm
                "
              >
                💡
              </div>

              <div>

                <p className="font-black text-green-950">
                  Gestion des publications
                </p>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Utilisez le bouton « Créer une publication »
                  pour accéder à l'espace de création et préparer
                  vos prochains visuels.
                </p>

              </div>

            </div>

          </section>

          <div className="h-6" />

        </div>

      </main>

    </div>
  )
}

export default Publications