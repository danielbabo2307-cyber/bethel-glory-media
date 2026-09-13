import { useState } from "react"
import { Link } from "react-router-dom"

function AssistantIA() {
  const [activeTool, setActiveTool] = useState("creation")
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  // ============================================================
  // URL API
  // ============================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"

  // ============================================================
  // OUTILS IA
  // ============================================================

  const tools = [
    {
      id: "creation",
      icon: "✨",
      title: "Aide à la création",
      description:
        "Décrivez votre idée et préparez rapidement le contenu d'une publication avec Gemini.",
    },
    {
      id: "automation",
      icon: "⚙️",
      title: "Automatisation",
      description:
        "Utilisez automatiquement les informations de vos programmes pour préparer vos publications.",
    },
  ]

  // ============================================================
  // CRÉATION DE CONTENU AVEC GEMINI
  // ============================================================

  const genererIdee = async () => {
    if (!prompt.trim()) {
      setResult(
        "⚠️ Veuillez d'abord décrire votre idée de publication."
      )
      return
    }

    setLoading(true)
    setResult("")

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setResult(
          "❌ Vous devez être connecté pour utiliser l'assistant IA."
        )

        setLoading(false)
        return
      }

      console.log(
        "=========================================="
      )

      console.log(
        "✨ ENVOI DE LA DEMANDE À GEMINI"
      )

      console.log(
        "📝 Demande :",
        prompt.trim()
      )

      console.log(
        "🌐 API :",
        `${API_URL}/api/ai/creation`
      )

      console.log(
        "=========================================="
      )

      // ========================================================
      // APPEL API
      // ========================================================

      const response = await fetch(
        `${API_URL}/api/ai/creation`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        }
      )

      // ========================================================
      // LECTURE DE LA RÉPONSE
      // ========================================================

      let data = null

      try {
        data = await response.json()
      } catch {
        throw new Error(
          "Le serveur a retourné une réponse invalide."
        )
      }

      console.log(
        "📥 Réponse Gemini :",
        data
      )

      // ========================================================
      // ERREUR SERVEUR
      // ========================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Erreur serveur (${response.status}).`
        )
      }

      // ========================================================
      // VÉRIFICATION DU RÉSULTAT
      // ========================================================

      if (!data.result) {
        throw new Error(
          "Gemini n'a retourné aucun résultat."
        )
      }

      // ========================================================
      // AFFICHAGE
      // ========================================================

      setResult(data.result)

      console.log(
        "🟢 Publication générée avec succès par Gemini."
      )
    } catch (error) {
      console.error(
        "❌ Erreur Gemini :",
        error
      )

      setResult(
        `❌ ${
          error.message ||
          "Impossible de contacter Gemini."
        }`
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // AUTOMATISATION
  // ============================================================

  const automatiser = () => {
    setLoading(true)
    setResult("")

    setTimeout(() => {
      const maintenant = new Date()

      const dimanche = new Date(
        maintenant
      )

      const jour =
        dimanche.getDay()

      const joursAvantDimanche =
        (7 - jour) % 7

      dimanche.setDate(
        dimanche.getDate() +
          joursAvantDimanche
      )

      const dateFormatee =
        dimanche.toLocaleDateString(
          "fr-FR",
          {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )

      setResult(
        `⚙️ INFORMATIONS AUTOMATIQUES\n\n` +
          `📅 Date : ${dateFormatee}\n` +
          `🕐 Heure : 08H00\n` +
          `📍 Lieu : ASSEMBLÉE DE BETHEL\n` +
          `⛪ Église : EPICI\n` +
          `🎨 Modèle : À sélectionner\n` +
          `©️ Filigrane : BETHEL GLORY MEDIA\n\n` +
          `Ces informations pourront ensuite être injectées automatiquement dans votre modèle de publication.`
      )

      setLoading(false)
    }, 1000)
  }

  // ============================================================
  // COPIER LE RÉSULTAT
  // ============================================================

  const copierResultat = async () => {
    if (!result) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        result
      )

      console.log(
        "📋 Résultat copié."
      )
    } catch (error) {
      console.error(
        "❌ Impossible de copier :",
        error
      )
    }
  }

  // ============================================================
  // LANCER L'OUTIL
  // ============================================================

  const lancerOutil = () => {
    if (
      activeTool ===
      "creation"
    ) {
      genererIdee()
      return
    }

    if (
      activeTool ===
      "automation"
    ) {
      automatiser()
    }
  }

  // ============================================================
  // CHANGEMENT D'OUTIL
  // ============================================================

  const changerOutil = (
    toolId
  ) => {
    setActiveTool(toolId)
    setResult("")
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">

        <div className="absolute -right-24 -top-24 h-72 w-72 animate-pulse rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 h-80 w-80 animate-pulse rounded-full bg-emerald-400/10 blur-3xl [animation-delay:1s]" />

        <div className="absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 animate-ping rounded-full bg-yellow-400/5" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <Link
            to="/"
            className="mb-8 inline-flex animate-[fadeInDown_0.8s_ease-out] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            ← Retour à l'accueil
          </Link>

          <div className="max-w-4xl">

            <div className="mb-5 inline-flex animate-[fadeInUp_0.8s_ease-out_0.15s_both] items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200 shadow-lg shadow-yellow-500/10">

              <span className="inline-block animate-bounce">
                🤖
              </span>

              BETHEL GLORY MEDIA

            </div>

            <h1 className="animate-[fadeInUp_0.9s_ease-out_0.25s_both] text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">

              Assistant

              <span className="block animate-[slideInRight_1s_ease-out_0.35s_both] text-yellow-300">
                Intelligence Artificielle
              </span>

            </h1>

            <p className="mt-6 max-w-2xl animate-[fadeInUp_0.9s_ease-out_0.45s_both] text-lg leading-8 text-green-100">

              Utilisez des outils intelligents pour simplifier
              la création de vos publications et gagner du temps.

            </p>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* CONTENU */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="mb-10 text-center">

          <span className="inline-block animate-[fadeInUp_0.7s_ease-out_both] text-sm font-bold uppercase tracking-[0.25em] text-green-700">
            Une touche d'intelligence artificielle
          </span>

          <h2 className="mt-3 animate-[fadeInUp_0.8s_ease-out_0.1s_both] text-3xl font-black text-gray-900 sm:text-4xl">
            Que souhaitez-vous faire ?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl animate-[fadeInUp_0.8s_ease-out_0.2s_both] text-gray-600">
            Choisissez un outil pour commencer à préparer votre prochaine publication.
          </p>

        </div>

        {/* ==================================================== */}
        {/* CARTES OUTILS */}
        {/* ==================================================== */}

        <div className="grid gap-6 md:grid-cols-2">

          {tools.map(
            (
              tool,
              index
            ) => {

              const active =
                activeTool ===
                tool.id

              return (

                <button
                  key={
                    tool.id
                  }
                  type="button"
                  onClick={() =>
                    changerOutil(
                      tool.id
                    )
                  }
                  style={{
                    animationDelay:
                      `${0.15 + index * 0.15}s`,
                  }}
                  className={`group relative overflow-hidden rounded-3xl border p-7 text-left opacity-0 transition-all duration-500 animate-[fadeInUp_0.8s_ease-out_forwards] hover:scale-[1.02] ${
                    active
                      ? "border-green-600 bg-green-950 text-white shadow-2xl shadow-green-900/20 -translate-y-2"
                      : "border-gray-200 bg-white text-gray-900 shadow-lg hover:-translate-y-2 hover:border-green-300"
                  }`}
                >

                  <div
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full transition duration-700 group-hover:scale-150 ${
                      active
                        ? "bg-yellow-400/10"
                        : "bg-green-100 group-hover:bg-yellow-100"
                    }`}
                  />

                  <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-green-400/5 transition duration-700 group-hover:scale-150" />

                  <div
                    className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition duration-500 group-hover:rotate-6 group-hover:scale-110 ${
                      active
                        ? "animate-pulse bg-yellow-400 text-green-950"
                        : "bg-green-100"
                    }`}
                  >
                    {tool.icon}
                  </div>

                  <h3 className="relative text-xl font-black transition-transform duration-300 group-hover:translate-x-1">
                    {tool.title}
                  </h3>

                  <p
                    className={`relative mt-3 text-sm leading-6 ${
                      active
                        ? "text-green-100"
                        : "text-gray-600"
                    }`}
                  >
                    {tool.description}
                  </p>

                  <div
                    className={`relative mt-6 text-sm font-bold transition duration-300 group-hover:translate-x-2 ${
                      active
                        ? "text-yellow-300"
                        : "text-green-700"
                    }`}
                  >
                    {active
                      ? "✓ Sélectionné"
                      : "Utiliser cet outil →"}
                  </div>

                </button>

              )
            }
          )}

        </div>

        {/* ==================================================== */}
        {/* ESPACE DE TRAVAIL */}
        {/* ==================================================== */}

        <section className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl animate-[fadeInUp_1s_ease-out_0.5s_both]">

          {/* HEADER ESPACE */}

          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <h3 className="animate-[slideInRight_0.6s_ease-out] text-xl font-black text-gray-900">

                  {activeTool ===
                    "creation" &&
                    "✨ Aide à la création"}

                  {activeTool ===
                    "automation" &&
                    "⚙️ Automatisation des informations"}

                </h3>

                <p className="mt-1 text-sm text-gray-500">

                  {activeTool ===
                    "creation" &&
                    "Décrivez simplement ce que vous souhaitez créer avec Gemini."}

                  {activeTool ===
                    "automation" &&
                    "Préparez automatiquement les informations de votre publication."}

                </p>

              </div>

              <span className="w-fit animate-pulse rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-800">

                {activeTool ===
                "creation"
                  ? "GEMINI"
                  : "BETHEL MEDIA"}

              </span>

            </div>

          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">

            {/* ================================================== */}
            {/* GAUCHE */}
            {/* ================================================== */}

            <div className="animate-[fadeInLeft_0.8s_ease-out]">

              {/* ================================================= */}
              {/* CRÉATION */}
              {/* ================================================= */}

              {activeTool ===
                "creation" && (

                <div>

                  <label className="mb-3 block text-sm font-bold text-gray-800">
                    Décrivez votre publication
                  </label>

                  <textarea
                    value={
                      prompt
                    }
                    onChange={(
                      event
                    ) =>
                      setPrompt(
                        event.target.value
                      )
                    }
                    rows={9}
                    maxLength={3000}
                    placeholder="Exemple : Crée une publication pour le culte dominical de dimanche à 08H00..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-5 text-gray-800 outline-none transition duration-300 focus:scale-[1.01] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />

                  <div className="mt-3 flex items-center justify-between">

                    <p className="text-xs text-gray-500">
                      Décrivez votre idée avec vos propres mots.
                    </p>

                    <span className="text-xs font-semibold text-gray-400">
                      {
                        prompt.length
                      }
                      /3000
                    </span>

                  </div>

                  <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4">

                    <div className="flex items-start gap-3">

                      <span className="text-2xl">
                        ✨
                      </span>

                      <div>

                        <p className="font-bold text-green-900">
                          Gemini vous accompagne
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Décrivez votre idée et Gemini préparera
                          le contenu de votre publication.
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )}

              {/* ================================================= */}
              {/* AUTOMATISATION */}
              {/* ================================================= */}

              {activeTool ===
                "automation" && (

                <div>

                  <div className="rounded-2xl border border-green-100 bg-green-50 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lg">

                    <div className="mb-5 inline-block animate-[spin_4s_linear_infinite] text-4xl">
                      ⚙️
                    </div>

                    <h4 className="text-lg font-black text-gray-900">
                      Informations intelligentes
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Le système pourra récupérer automatiquement les informations disponibles dans BETHEL GLORY STUDIO :
                    </p>

                    <div className="mt-6 space-y-3">

                      {[
                        "Date du programme",
                        "Heure",
                        "Assemblée",
                        "Intervenant",
                        "Type de programme",
                        "Modèle de publication",
                        "Filigrane",
                      ].map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={
                              item
                            }
                            style={{
                              animationDelay:
                                `${index * 0.08}s`,
                            }}
                            className="flex animate-[fadeInLeft_0.5s_ease-out_forwards] items-center gap-3 rounded-xl bg-white p-3 text-sm font-medium text-gray-700 opacity-0 shadow-sm transition duration-300 hover:translate-x-2 hover:shadow-md"
                          >

                            <span className="text-green-600">
                              ✓
                            </span>

                            {
                              item
                            }

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )}

              {/* ================================================= */}
              {/* BOUTON */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={
                  lancerOutil
                }
                disabled={
                  loading
                }
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-green-900 to-green-700 px-6 py-4 font-black text-white shadow-lg shadow-green-900/20 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] hover:from-green-800 hover:to-green-600 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "⏳ Traitement en cours..."
                  : activeTool ===
                      "creation"
                    ? "✨ Préparer ma publication"
                    : "⚙️ Automatiser les informations"}

              </button>

            </div>

            {/* ================================================== */}
            {/* DROITE */}
            {/* ================================================== */}

            <div className="animate-[fadeInRight_0.8s_ease-out]">

              <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-2xl transition duration-500 hover:shadow-green-950/20">

                {/* HEADER RESULTAT */}

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 animate-pulse items-center justify-center rounded-xl bg-yellow-400 text-green-950">
                      ✨
                    </div>

                    <div>

                      <p className="font-bold text-white">
                        Résultat IA
                      </p>

                      <p className="text-xs text-gray-400">
                        Assistant BETHEL GLORY MEDIA
                      </p>

                    </div>

                  </div>

                  <span className="animate-pulse rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">

                    {activeTool ===
                    "creation"
                      ? "GEMINI"
                      : "IA"}

                  </span>

                </div>

                {/* RESULTAT */}

                <div className="flex flex-1 p-4 sm:p-6">

                  {/* ================================================= */}
                  {/* LOADING */}
                  {/* ================================================= */}

                  {loading ? (

                    <div className="m-auto animate-[fadeInUp_0.5s_ease-out] text-center">

                      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-400 text-4xl">

                        <span className="animate-spin">
                          ✨
                        </span>

                        <span className="absolute inset-0 animate-ping rounded-2xl bg-yellow-400/20" />

                      </div>

                      <p className="font-bold text-white">
                        L'assistant travaille...
                      </p>

                      <p className="mt-2 text-sm text-gray-400">

                        {activeTool ===
                        "creation"
                          ? "Gemini prépare votre publication..."
                          : "BETHEL GLORY MEDIA prépare les informations..."}

                      </p>

                      <div className="mx-auto mt-5 flex justify-center gap-1">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:0.15s]" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:0.3s]" />

                      </div>

                    </div>

                  ) : result ? (

                    /* ==================================================
                       RESULTAT TEXTE
                       ================================================== */

                    <div className="w-full animate-[fadeInUp_0.6s_ease-out]">

                      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-400/10 bg-green-500/5 p-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-xl text-green-950">

                          {activeTool ===
                          "creation"
                            ? "✨"
                            : "⚙️"}

                        </div>

                        <div>

                          <p className="font-bold text-white">

                            {activeTool ===
                            "creation"
                              ? "Publication préparée"
                              : "Informations préparées"}

                          </p>

                          <p className="text-xs text-gray-400">

                            {activeTool ===
                            "creation"
                              ? "Généré avec Gemini"
                              : "BETHEL GLORY MEDIA"}

                          </p>

                        </div>

                      </div>

                      <div className="whitespace-pre-line rounded-2xl bg-white/5 p-5 text-sm leading-7 text-gray-200 transition duration-500 hover:bg-white/10">

                        {
                          result
                        }

                      </div>

                      <button
                        type="button"
                        onClick={
                          copierResultat
                        }
                        className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                      >
                        📋 Copier le résultat
                      </button>

                    </div>

                  ) : (

                    /* ==================================================
                       ETAT VIDE
                       ================================================== */

                    <div className="m-auto max-w-sm animate-[fadeInUp_0.8s_ease-out] text-center">

                      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-4xl transition duration-500 hover:rotate-6 hover:scale-110">

                        <span className="animate-pulse">
                          🤖
                        </span>

                        <span className="absolute -inset-2 animate-ping rounded-3xl bg-green-400/5" />

                      </div>

                      <h4 className="text-xl font-black text-white">
                        Votre assistant est prêt
                      </h4>

                      <p className="mt-3 text-sm leading-6 text-gray-400">
                        Sélectionnez une fonctionnalité, renseignez les informations nécessaires puis lancez l'assistant.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================== */}
        {/* AVERTISSEMENT */}
        {/* ====================================================== */}

        <section className="mt-10 animate-[fadeInUp_0.9s_ease-out_0.7s_both] rounded-3xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-green-50 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

            <div className="flex h-12 w-12 shrink-0 animate-bounce items-center justify-center rounded-2xl bg-yellow-400 text-2xl">
              💡
            </div>

            <div>

              <h3 className="font-black text-gray-900">
                Assistant IA BETHEL GLORY MEDIA
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                La création de contenu utilise Gemini via ton serveur Node.js. Les clés API restent côté serveur et ne sont jamais exposées dans React.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* ====================================================== */}
      {/* ANIMATIONS */}
      {/* ====================================================== */}

      <style>{`

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
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

export default AssistantIA