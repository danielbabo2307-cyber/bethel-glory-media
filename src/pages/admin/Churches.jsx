import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
function Assembles() {
  // ==========================================================
  // THÈME DE L'ANNÉE
  // ==========================================================

  const [themeAnnee, setThemeAnnee] = useState({
    id: null,
    annee: new Date().getFullYear().toString(),
    theme: "",
    verset: "",
  })

  const [loadingTheme, setLoadingTheme] = useState(true)
  const [savingTheme, setSavingTheme] = useState(false)
  const [themeMessage, setThemeMessage] = useState("")
  const [themeError, setThemeError] = useState("")

  // ==========================================================
  // RÉCUPÉRER LE THÈME DE L'ANNÉE
  // ==========================================================

  const fetchThemeAnnee = async () => {
    try {
      setLoadingTheme(true)
      setThemeError("")

      console.log("📡 Récupération du thème annuel...")

      const response = await fetch(
        `${API_URL}/api/theme-annee`
      )

      const result = await response.json()

      console.log("📥 Thème annuel reçu :", result)

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Erreur récupération thème annuel."
        )
      }

      if (!result.theme) {
        throw new Error(
          "Aucune donnée de thème reçue."
        )
      }

      setThemeAnnee({
        id: result.theme.id ?? null,

        annee:
          result.theme.annee ??
          new Date()
            .getFullYear()
            .toString(),

        theme:
          result.theme.theme ??
          "",

        verset:
          result.theme.verset ??
          "",
      })

      console.log(
        "✅ Thème annuel chargé :",
        result.theme
      )
    } catch (error) {
      console.error(
        "❌ Erreur récupération thème annuel :",
        error
      )

      setThemeError(
        error.message ||
          "Impossible de récupérer le thème annuel."
      )
    } finally {
      setLoadingTheme(false)
    }
  }

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {
    fetchThemeAnnee()
  }, [])

  // ==========================================================
  // CHANGEMENT THÈME
  // ==========================================================

  const handleThemeChange = (event) => {
    const { name, value } = event.target

    setThemeAnnee((previous) => ({
      ...previous,
      [name]: value,
    }))

    setThemeMessage("")
    setThemeError("")
  }

  // ==========================================================
  // ENREGISTRER LE THÈME
  // ==========================================================

  const handleSaveTheme = async (event) => {
    event.preventDefault()

    setThemeMessage("")
    setThemeError("")

    const annee = String(
      themeAnnee.annee || ""
    ).trim()

    const theme = String(
      themeAnnee.theme || ""
    ).trim()

    const verset = String(
      themeAnnee.verset || ""
    ).trim()

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!annee) {
      setThemeError(
        "Veuillez renseigner l'année."
      )
      return
    }

    if (!theme) {
      setThemeError(
        "Veuillez renseigner le thème de l'année."
      )
      return
    }

    // --------------------------------------------------------
    // TOKEN
    // --------------------------------------------------------

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")

    if (!token) {
      setThemeError(
        "Session administrateur introuvable. Veuillez vous reconnecter."
      )
      return
    }

    try {
      setSavingTheme(true)

      console.log(
        "📡 Enregistrement du thème annuel..."
      )

      const response = await fetch(
        `${API_URL}/api/theme-annee`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            annee,
            theme,
            verset: verset || null,
          }),
        }
      )

      const result =
        await response.json()

      console.log(
        "📥 Réponse enregistrement thème :",
        result
      )

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Erreur lors de l'enregistrement du thème."
        )
      }

      setThemeAnnee((previous) => ({
        ...previous,
        annee,
        theme,
        verset,
      }))

      setThemeMessage(
        "✓ Le thème de l'année a été enregistré avec succès."
      )

      console.log(
        "✅ Thème annuel enregistré."
      )

      setTimeout(() => {
        setThemeMessage("")
      }, 5000)
    } catch (error) {
      console.error(
        "❌ Erreur enregistrement thème :",
        error
      )

      setThemeError(
        error.message ||
          "Impossible d'enregistrer le thème."
      )
    } finally {
      setSavingTheme(false)
    }
  }

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f6f7f5] pb-32">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-[#f6f7f5]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <Link
              to="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl text-green-950 shadow-sm transition hover:bg-green-950 hover:text-white"
            >
              ←
            </Link>

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                BETHEL
              </p>

              <h1 className="text-lg font-black text-gray-900 sm:text-xl">
                Configuration annuelle
              </h1>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-4 py-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-xs font-bold text-green-800">
              Thème {themeAnnee.annee || "----"}
            </span>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="overflow-hidden rounded-[32px] bg-green-950 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-100">

                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                Administration

              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">

                Gérez le thème
                <br />
                de l'année.

              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-green-100/75 sm:text-base">

                Configurez l'année, le thème
                annuel et la référence biblique
                qui seront utilisés sur les
                différentes pages de BETHEL
                GLORY MEDIA.

              </p>

            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-yellow-400/30 bg-white/10 text-5xl shadow-inner">

              📖

            </div>

          </div>

        </section>

        {/* ===================================================
            THÈME DE L'ANNÉE
        =================================================== */}

        <section className="mt-6 overflow-hidden rounded-[30px] border border-green-900/10 bg-white shadow-sm">

          {/* EN-TÊTE */}

          <div className="bg-green-950 p-6 text-white sm:p-8">

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">

                    Configuration annuelle

                  </span>

                </div>

                <h2 className="text-2xl font-black sm:text-3xl">

                  Thème de l'année

                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-green-100/75">

                  Modifiez l'année, le thème
                  annuel et sa référence
                  biblique. Ces informations
                  sont enregistrées directement
                  dans la base de données.

                </p>

              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-white/10 px-6 py-4 text-center">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">

                  Année actuelle

                </p>

                <p className="mt-1 text-3xl font-black text-white">

                  {themeAnnee.annee || "----"}

                </p>

              </div>

            </div>

          </div>

          {/* CONTENU */}

          <form
            onSubmit={handleSaveTheme}
            className="p-6 sm:p-8"
          >

            {loadingTheme ? (

              <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50 p-10 text-center">

                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-950" />

                <p className="mt-4 text-sm font-bold text-green-900">

                  Chargement du thème
                  annuel...

                </p>

              </div>

            ) : (

              <>

                {/* FORMULAIRE */}

                <div className="grid gap-5 md:grid-cols-3">

                  {/* ANNÉE */}

                  <div>

                    <label
                      htmlFor="annee"
                      className="text-xs font-black uppercase tracking-wider text-gray-500"
                    >
                      Année
                    </label>

                    <input
                      id="annee"
                      type="text"
                      name="annee"
                      value={
                        themeAnnee.annee
                      }
                      onChange={
                        handleThemeChange
                      }
                      placeholder="2026"
                      maxLength={10}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                  </div>

                  {/* THÈME */}

                  <div className="md:col-span-2">

                    <label
                      htmlFor="theme"
                      className="text-xs font-black uppercase tracking-wider text-gray-500"
                    >
                      Thème de l'année
                    </label>

                    <input
                      id="theme"
                      type="text"
                      name="theme"
                      value={
                        themeAnnee.theme
                      }
                      onChange={
                        handleThemeChange
                      }
                      placeholder="Ex : ÊTRE REMPLI DE LA CONNAISSANCE DE DIEU"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold uppercase outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                  </div>

                  {/* VERSET */}

                  <div className="md:col-span-3">

                    <label
                      htmlFor="verset"
                      className="text-xs font-black uppercase tracking-wider text-gray-500"
                    >
                      Référence biblique
                    </label>

                    <input
                      id="verset"
                      type="text"
                      name="verset"
                      value={
                        themeAnnee.verset
                      }
                      onChange={
                        handleThemeChange
                      }
                      placeholder="Ex : Ephésiens 1 vs 16 à 17"
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                  </div>

                </div>

                {/* APERÇU */}

                <div className="mt-6 rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-700">

                    Aperçu

                  </p>

                  <p className="mt-2 text-sm font-black uppercase tracking-wider text-green-800">

                    ANNÉE {themeAnnee.annee || "----"}

                  </p>

                  <h3 className="mt-2 text-xl font-black uppercase text-green-950 sm:text-2xl">

                    {themeAnnee.theme ||
                      "Votre thème annuel apparaîtra ici"}

                  </h3>

                  {themeAnnee.verset && (

                    <p className="mt-2 text-sm font-semibold italic text-green-800">

                      {themeAnnee.verset}

                    </p>

                  )}

                </div>

                {/* ERREUR */}

                {themeError && (

                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">

                    ❌ {themeError}

                  </div>

                )}

                {/* SUCCÈS */}

                {themeMessage && (

                  <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">

                    {themeMessage}

                  </div>

                )}

                {/* BOUTON */}

                <div className="mt-6 flex justify-end">

                  <button
                    type="submit"
                    disabled={savingTheme}
                    className="rounded-2xl bg-green-950 px-7 py-3.5 font-bold text-white shadow-lg shadow-green-950/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {savingTheme
                      ? "⏳ Enregistrement..."
                      : "💾 Enregistrer le thème"}

                  </button>

                </div>

              </>

            )}

          </form>

        </section>

        {/* ===================================================
            INFORMATIONS
        =================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* ANNÉE */}

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">

                Année

              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">

                📅

              </span>

            </div>

            <p className="mt-4 text-3xl font-black text-green-950">

              {themeAnnee.annee || "----"}

            </p>

            <p className="mt-2 text-xs text-gray-400">

              Année configurée

            </p>

          </div>

          {/* THÈME */}

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">

                Thème

              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">

                📖

              </span>

            </div>

            <p className="mt-4 line-clamp-2 text-lg font-black uppercase text-green-950">

              {themeAnnee.theme ||
                "Non configuré"}

            </p>

            <p className="mt-2 text-xs text-gray-400">

              Thème annuel actuel

            </p>

          </div>

          {/* RÉFÉRENCE */}

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">

                Référence

              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">

                ✝️

              </span>

            </div>

            <p className="mt-4 line-clamp-2 text-lg font-black text-green-950">

              {themeAnnee.verset ||
                "Non renseignée"}

            </p>

            <p className="mt-2 text-xs text-gray-400">

              Référence biblique

            </p>

          </div>

        </section>

        {/* ===================================================
            NOTE
        =================================================== */}

        <div className="mt-8 rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">

              💡

            </div>

            <div>

              <p className="text-sm font-black text-yellow-900">

                Configuration du thème annuel

              </p>

              <p className="mt-1 text-xs leading-6 text-yellow-800/70">

                Le thème de l'année est
                enregistré directement dans
                la base de données BETHEL
                GLORY MEDIA. Toute modification
                effectuée ici sera également
                disponible sur les pages
                publiques qui utilisent le
                thème annuel.

              </p>

            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          NAVIGATION ADMIN
      ===================================================== */}

      <AdminSidebar />

    </div>
  )
}

export default Assembles