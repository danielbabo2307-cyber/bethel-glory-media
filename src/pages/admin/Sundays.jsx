import { useMemo, useState } from "react"

const availableTemplates = [
  {
    id: 1,
    name: "Modèle 01",
  },
  {
    id: 2,
    name: "Modèle 02",
  },
  {
    id: 3,
    name: "Modèle 03",
  },
  {
    id: 4,
    name: "Modèle 04",
  },
  {
    id: 5,
    name: "Modèle 05",
  },
  {
    id: 6,
    name: "Modèle 06",
  },
  {
    id: 7,
    name: "Modèle 07",
  },
  {
    id: 8,
    name: "Modèle 08",
  },
]

function getNextSunday() {
  const today = new Date()
  const day = today.getDay()

  const daysUntilSunday = day === 0 ? 0 : 7 - day

  const nextSunday = new Date(today)

  nextSunday.setDate(today.getDate() + daysUntilSunday)
  nextSunday.setHours(0, 0, 0, 0)

  return nextSunday
}

function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function generateSundays(number = 8) {
  const firstSunday = getNextSunday()

  return Array.from({ length: number }, (_, index) => {
    const date = new Date(firstSunday)

    date.setDate(firstSunday.getDate() + index * 7)

    return {
      id: index + 1,
      date,
      theme: "",
      templates: [],
      active: true,
    }
  })
}

function Sundays() {
  const [sundays, setSundays] = useState(() =>
    generateSundays(8)
  )

  const nextSundayText = useMemo(() => {
    return formatDate(getNextSunday())
  }, [])

  function updateTheme(id, value) {
    setSundays((current) =>
      current.map((sunday) =>
        sunday.id === id
          ? {
              ...sunday,
              theme: value,
            }
          : sunday
      )
    )
  }

  function toggleTemplate(sundayId, templateId) {
    setSundays((current) =>
      current.map((sunday) => {
        if (sunday.id !== sundayId) {
          return sunday
        }

        const alreadySelected =
          sunday.templates.includes(templateId)

        return {
          ...sunday,
          templates: alreadySelected
            ? sunday.templates.filter(
                (id) => id !== templateId
              )
            : [...sunday.templates, templateId],
        }
      })
    )
  }

  function saveSunday(sunday) {
    alert(
      `${formatDate(sunday.date)}\n\n` +
        `Thème : ${
          sunday.theme || "Aucun thème"
        }\n\n` +
        `Modèles sélectionnés : ${
          sunday.templates.length
        }`
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="font-semibold uppercase tracking-wide text-green-700">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              Gestion des dimanches
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Préparez chaque dimanche avec son thème et
              plusieurs modèles de publication.
            </p>
          </div>

          <div className="rounded-2xl bg-green-900 px-6 py-4 text-white shadow-lg">
            <p className="text-sm text-green-200">
              Prochain dimanche
            </p>

            <p className="mt-1 font-bold capitalize">
              {nextSundayText}
            </p>
          </div>

        </div>

        {/* STATISTIQUES */}

        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          <Stat
            number={sundays.length}
            label="Dimanches préparés"
            icon="📅"
          />

          <Stat
            number={availableTemplates.length}
            label="Modèles disponibles"
            icon="🎨"
          />

          <Stat
            number={sundays.reduce(
              (total, sunday) =>
                total + sunday.templates.length,
              0
            )}
            label="Modèles associés"
            icon="🖼️"
          />

        </div>

        {/* DIMANCHES */}

        <div className="space-y-6">

          {sundays.map((sunday) => (

            <div
              key={sunday.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >

              {/* DATE */}

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                    📅
                  </div>

                  <div>

                    <p className="text-xl font-bold capitalize text-gray-900">
                      {formatDate(sunday.date)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {sunday.templates.length} modèle(s)
                      sélectionné(s)
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => saveSunday(sunday)}
                  className="rounded-xl bg-green-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Enregistrer
                </button>

              </div>

              {/* THEME */}

              <div className="mt-6">

                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Thème du dimanche
                </label>

                <input
                  type="text"
                  value={sunday.theme}
                  onChange={(event) =>
                    updateTheme(
                      sunday.id,
                      event.target.value
                    )
                  }
                  placeholder="Ex : La puissance de la foi"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600"
                />

              </div>

              {/* MODELES */}

              <div className="mt-6">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Modèles disponibles
                    </h2>

                    <p className="text-sm text-gray-500">
                      Sélectionnez plusieurs modèles pour
                      ce dimanche.
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    {sunday.templates.length} sélectionné(s)
                  </span>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {availableTemplates.map((template) => {

                    const selected =
                      sunday.templates.includes(
                        template.id
                      )

                    return (
                      <button
                        key={template.id}
                        onClick={() =>
                          toggleTemplate(
                            sunday.id,
                            template.id
                          )
                        }
                        className={`rounded-2xl border-2 p-4 text-left transition ${
                          selected
                            ? "border-green-700 bg-green-50"
                            : "border-gray-100 bg-gray-50 hover:border-green-300"
                        }`}
                      >

                        {/* APERCU */}

                        <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-gradient-to-br from-green-950 via-green-800 to-green-600">

                          <div className="text-center text-white">

                            <div className="text-3xl">
                              ✨
                            </div>

                            <p className="mt-3 text-xs font-bold tracking-widest">
                              BETHEL GLORY
                            </p>

                            <p className="mt-4 text-lg font-bold">
                              DIMANCHE
                            </p>

                            <p className="mt-2 text-xs text-green-200">
                              {formatDate(sunday.date)}
                            </p>

                          </div>

                        </div>

                        {/* NOM */}

                        <div className="mt-3 flex items-center justify-between">

                          <span className="font-semibold text-gray-900">
                            {template.name}
                          </span>

                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                              selected
                                ? "bg-green-700 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {selected ? "✓" : "+"}
                          </span>

                        </div>

                      </button>
                    )
                  })}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  )
}

function Stat({ number, label, icon }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-3xl font-bold text-gray-900">
            {number}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {label}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
          {icon}
        </div>

      </div>

    </div>
  )
}

export default Sundays