import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"

// ==================================================
// DIMANCHES
// ==================================================

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

// ==================================================
// PROGRAMMES PAR DÉFAUT
// ==================================================

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

// ==================================================
// COMPOSANT
// ==================================================

function Programs1() {
  const sundays = getNextSundays(6)

  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem("bethel_programs_admin")

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return {}
      }
    }

    return {}
  })

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: "",
    time: "",
    description: "",
  })

  // ==================================================
  // SAUVEGARDE LOCAL
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      "bethel_programs_admin",
      JSON.stringify(programs)
    )
  }, [programs])

  // ==================================================
  // MODIFICATION
  // ==================================================

  const handleEdit = (sunday, index) => {
    const existingProgram = programs[sunday.id]

    if (existingProgram) {
      setForm({
        title: existingProgram.title,
        time: existingProgram.time,
        description: existingProgram.description,
      })
    } else {
      const defaultProgram =
        defaultPrograms[index % defaultPrograms.length]

      setForm({
        title: defaultProgram.title,
        time: defaultProgram.time,
        description: defaultProgram.description,
      })
    }

    setEditingId(sunday.id)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ==================================================
  // CHANGEMENT FORMULAIRE
  // ==================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // ==================================================
  // SAUVEGARDE
  // ==================================================

  const handleSave = (sunday) => {
    if (!form.title.trim()) {
      alert("Veuillez saisir le nom du programme.")
      return
    }

    if (!form.time.trim()) {
      alert("Veuillez saisir l'heure du programme.")
      return
    }

    setPrograms((previous) => ({
      ...previous,
      [sunday.id]: {
        title: form.title.trim(),
        time: form.time.trim(),
        description: form.description.trim(),
      },
    }))

    setEditingId(null)

    setForm({
      title: "",
      time: "",
      description: "",
    })
  }

  // ==================================================
  // ANNULATION
  // ==================================================

  const handleCancel = () => {
    setEditingId(null)

    setForm({
      title: "",
      time: "",
      description: "",
    })
  }

  // ==================================================
  // SUPPRESSION
  // ==================================================

  const handleDelete = (sunday) => {
    const confirmed = window.confirm(
      `Supprimer le programme du ${sunday.date} ?`
    )

    if (!confirmed) {
      return
    }

    setPrograms((previous) => {
      const updated = { ...previous }

      delete updated[sunday.id]

      return updated
    })
  }

  // ==================================================
  // PROGRAMME À AFFICHER
  // ==================================================

  const getProgram = (sunday, index) => {
    if (programs[sunday.id]) {
      return programs[sunday.id]
    }

    return defaultPrograms[index % defaultPrograms.length]
  }

  // ==================================================
  // STATISTIQUES
  // ==================================================

  const customizedCount = sundays.filter(
    (sunday) => Boolean(programs[sunday.id])
  ).length

  const defaultCount = sundays.length - customizedCount

  // ==================================================
  // RENDU
  // ==================================================

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
                    flex h-11 w-11 items-center justify-center
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
                    BETHEL 
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                    Programmes
                  </h1>
                </div>

              </div>

              <div
                className="
                  hidden items-center gap-2
                  rounded-2xl
                  border border-green-100
                  bg-white
                  px-4 py-3
                  shadow-sm
                  sm:flex
                "
              >
                <span className="text-lg">◷</span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Planning
                  </p>

                  <p className="text-sm font-black text-green-950">
                    6 dimanches
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
                absolute -right-16 -top-20
                h-52 w-52
                rounded-full
                bg-green-700/30
                blur-2xl
              "
            />

            <div
              className="
                absolute -bottom-24 -left-10
                h-48 w-48
                rounded-full
                bg-yellow-400/10
                blur-3xl
              "
            />

            <div className="relative">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-2xl">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-100">
                      Planning de l'Assemblée
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Les prochains dimanches
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                    Gérez facilement les programmes de l'Assemblée
                    de Bethel pour les six prochains dimanches.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 sm:w-auto">

                  <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                    <p className="text-2xl font-black">
                      {sundays.length}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-green-200">
                      Dimanches
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                    <p className="text-2xl font-black">
                      {customizedCount}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-green-200">
                      Personnalisés
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <section className="mt-5 grid gap-4 sm:grid-cols-3">

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-xl">
                  📅
                </span>

                <span className="text-xs font-bold text-gray-400">
                  TOTAL
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {sundays.length}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Dimanches planifiés
              </p>
            </div>

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-xl">
                  ✨
                </span>

                <span className="text-xs font-bold text-gray-400">
                  MODIFIÉS
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {customizedCount}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Programmes personnalisés
              </p>
            </div>

            <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-xl">
                  ◷
                </span>

                <span className="text-xs font-bold text-gray-400">
                  STANDARD
                </span>
              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {defaultCount}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Programmes par défaut
              </p>
            </div>

          </section>

          {/* ==================================================
              FORMULAIRE
          ================================================== */}

          {editingId && (
            <section
              className="
                mt-6
                overflow-hidden
                rounded-[28px]
                border border-green-100
                bg-white
                shadow-sm
              "
            >

              <div className="bg-green-50/70 px-5 py-5 sm:px-7">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-950 text-sm text-white">
                        ✏️
                      </span>

                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                        Modification
                      </p>

                    </div>

                    <h2 className="mt-3 text-2xl font-black text-gray-950">
                      Modifier le programme
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Personnalisez les informations du dimanche sélectionné.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-white
                      text-gray-500
                      shadow-sm
                      transition
                      hover:bg-gray-100
                    "
                  >
                    ✕
                  </button>

                </div>

              </div>

              <div className="p-5 sm:p-7">

                <div className="grid gap-5 md:grid-cols-2">

                  {/* NOM */}

                  <div>

                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Nom du programme
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Ex : Culte dominical"
                      className="
                        mt-2 w-full
                        rounded-2xl
                        border border-gray-200
                        bg-gray-50
                        px-4 py-3.5
                        text-sm font-medium
                        text-gray-900
                        outline-none
                        transition
                        focus:border-green-700
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-100
                      "
                    />

                  </div>

                  {/* HEURE */}

                  <div>

                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Heure
                    </label>

                    <input
                      type="text"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      placeholder="Ex : 08h00"
                      className="
                        mt-2 w-full
                        rounded-2xl
                        border border-gray-200
                        bg-gray-50
                        px-4 py-3.5
                        text-sm font-medium
                        text-gray-900
                        outline-none
                        transition
                        focus:border-green-700
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-100
                      "
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="md:col-span-2">

                    <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Description du programme..."
                      className="
                        mt-2 w-full
                        resize-none
                        rounded-2xl
                        border border-gray-200
                        bg-gray-50
                        px-4 py-3.5
                        text-sm leading-6
                        text-gray-900
                        outline-none
                        transition
                        focus:border-green-700
                        focus:bg-white
                        focus:ring-4
                        focus:ring-green-100
                      "
                    />

                  </div>

                </div>

                {/* BOUTONS */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => {
                      const sunday = sundays.find(
                        (item) => item.id === editingId
                      )

                      if (sunday) {
                        handleSave(sunday)
                      }
                    }}
                    className="
                      flex-1
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
                    ✓ Enregistrer les modifications
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="
                      rounded-2xl
                      border border-gray-200
                      bg-gray-50
                      px-6 py-3.5
                      text-sm font-bold
                      text-gray-600
                      transition
                      hover:bg-gray-100
                    "
                  >
                    Annuler
                  </button>

                </div>

              </div>

            </section>
          )}

          {/* ==================================================
              TITRE LISTE
          ================================================== */}

          <section className="mt-8">

            <div className="mb-5 flex items-end justify-between gap-4">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                  Planning
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Programmes à venir
                </h2>

              </div>

              <p className="hidden text-xs font-semibold text-gray-400 sm:block">
                {sundays.length} échéances
              </p>

            </div>

            {/* ==================================================
                LISTE
            ================================================== */}

            <div className="space-y-4">

              {sundays.map((sunday, index) => {

                const program = getProgram(sunday, index)

                const isCustom =
                  Boolean(programs[sunday.id])

                const isEditing =
                  editingId === sunday.id

                return (
                  <article
                    key={sunday.id}
                    className={`
                      overflow-hidden
                      rounded-[28px]
                      border
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      ${
                        isEditing
                          ? "border-green-300 ring-4 ring-green-50"
                          : "border-gray-100 hover:-translate-y-0.5 hover:shadow-lg"
                      }
                    `}
                  >

                    <div className="p-5 sm:p-6">

                      <div className="grid gap-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">

                        {/* DATE */}

                        <div
                          className="
                            relative overflow-hidden
                            rounded-[22px]
                            bg-green-950
                            p-5
                            text-white
                          "
                        >

                          <div
                            className="
                              absolute -right-8 -top-8
                              h-20 w-20
                              rounded-full
                              bg-green-700/40
                            "
                          />

                          <div className="relative">

                            <div className="flex items-center justify-between">

                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-green-300">
                                Dimanche
                              </span>

                              <span className="text-lg">
                                📅
                              </span>

                            </div>

                            <p className="mt-3 text-base font-black leading-5">
                              {sunday.date}
                            </p>

                          </div>

                        </div>

                        {/* PROGRAMME */}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                              Programme
                            </span>

                            {isCustom ? (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-green-800">
                                Personnalisé
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-500">
                                Standard
                              </span>
                            )}

                          </div>

                          <h3 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
                            {program.title}
                          </h3>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            {program.description}
                          </p>

                        </div>

                        {/* HEURE + ACTIONS */}

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                          <div
                            className="
                              rounded-2xl
                              border border-green-100
                              bg-green-50
                              px-5 py-3
                              text-center
                            "
                          >

                            <p className="text-[9px] font-black uppercase tracking-wider text-green-700">
                              Heure
                            </p>

                            <p className="mt-0.5 text-xl font-black text-green-950">
                              {program.time}
                            </p>

                          </div>

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(sunday, index)
                              }
                              className="
                                flex-1
                                rounded-2xl
                                border border-green-200
                                bg-white
                                px-4 py-3
                                text-xs font-black
                                text-green-950
                                transition
                                hover:bg-green-950
                                hover:text-white
                              "
                            >
                              ✏️ Modifier
                            </button>

                            {isCustom && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(sunday)
                                }
                                className="
                                  flex h-11 w-11
                                  shrink-0
                                  items-center justify-center
                                  rounded-2xl
                                  border border-red-100
                                  bg-red-50
                                  text-red-600
                                  transition
                                  hover:bg-red-100
                                "
                                aria-label="Supprimer"
                              >
                                🗑️
                              </button>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                )
              })}

            </div>

          </section>

          {/* ==================================================
              NOTE
          ================================================== */}

          <section
            className="
              mt-8
              overflow-hidden
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
                  flex h-11 w-11 shrink-0
                  items-center justify-center
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
                  Fonctionnement
                </p>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Les six prochains dimanches sont calculés
                  automatiquement. Utilisez « Modifier » pour
                  personnaliser le programme et l'heure de chaque
                  dimanche.
                </p>

              </div>

            </div>

          </section>

          {/* ESPACE BAS */}

          <div className="h-6" />

        </div>

      </main>

    </div>
  )
}

export default Programs1