import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

// ============================================================
// CLÉ LOCALSTORAGE
// ============================================================

const STORAGE_KEY = "bethel_templates"

// ============================================================
// MODÈLES INITIAUX
// ============================================================

const initialTemplates = [
  {
    id: 1,
    name: "Élégance Royale",
    slug: "elegance-royale",
    category: "Dimanche",
    format: "1080 × 1350",
    style: "gold",
    description: "Un modèle élégant pour les cultes du dimanche.",
    active: true,
  },
  {
    id: 2,
    name: "Grâce & Lumière",
    slug: "grace-lumiere",
    category: "Dimanche",
    format: "1080 × 1350",
    style: "purple",
    description: "Un design lumineux et spirituel.",
    active: true,
  },
  {
    id: 3,
    name: "Dimanche Royal",
    slug: "dimanche-royal",
    category: "Dimanche",
    format: "1080 × 1350",
    style: "blue",
    description: "Un visuel premium pour annoncer le culte.",
    active: true,
  },
  {
    id: 4,
    name: "Présence Divine",
    slug: "presence-divine",
    category: "Dimanche",
    format: "1080 × 1350",
    style: "green",
    description: "Un modèle sobre avec une identité spirituelle forte.",
    active: true,
  },

  {
    id: 5,
    name: "Parole Vivante",
    slug: "parole-vivante",
    category: "Prédication",
    format: "1080 × 1350",
    style: "dark",
    description: "Idéal pour présenter un message ou une prédication.",
    active: true,
  },
  {
    id: 6,
    name: "Révélation",
    slug: "revelation",
    category: "Prédication",
    format: "1080 × 1350",
    style: "purple",
    description: "Un design puissant pour les enseignements.",
    active: true,
  },
  {
    id: 7,
    name: "La Parole",
    slug: "la-parole",
    category: "Prédication",
    format: "1080 × 1350",
    style: "brown",
    description: "Style chaleureux pour les messages bibliques.",
    active: true,
  },
  {
    id: 8,
    name: "Impact Spirituel",
    slug: "impact-spirituel",
    category: "Prédication",
    format: "1080 × 1350",
    style: "red",
    description: "Un modèle dynamique et très visuel.",
    active: true,
  },

  {
    id: 9,
    name: "Louange Céleste",
    slug: "louange-celeste",
    category: "Louange",
    format: "1080 × 1350",
    style: "blue",
    description: "Un modèle lumineux pour les programmes de louange.",
    active: true,
  },
  {
    id: 10,
    name: "Adoration",
    slug: "adoration",
    category: "Louange",
    format: "1080 × 1350",
    style: "purple",
    description: "Ambiance profonde et élégante.",
    active: true,
  },
  {
    id: 11,
    name: "Chant de Victoire",
    slug: "chant-victoire",
    category: "Louange",
    format: "1080 × 1350",
    style: "orange",
    description: "Un modèle énergique pour les célébrations.",
    active: true,
  },
  {
    id: 12,
    name: "Atmosphère Divine",
    slug: "atmosphere-divine",
    category: "Louange",
    format: "1080 × 1350",
    style: "cyan",
    description: "Un design moderne avec une ambiance céleste.",
    active: true,
  },

  {
    id: 13,
    name: "Grande Conférence",
    slug: "grande-conference",
    category: "Événement",
    format: "1080 × 1350",
    style: "black-gold",
    description: "Modèle premium pour les grandes conférences.",
    active: true,
  },
  {
    id: 14,
    name: "Semaine Spirituelle",
    slug: "semaine-spirituelle",
    category: "Événement",
    format: "1080 × 1350",
    style: "purple",
    description: "Parfait pour les semaines spirituelles.",
    active: true,
  },
  {
    id: 15,
    name: "Retraite Spirituelle",
    slug: "retraite-spirituelle",
    category: "Événement",
    format: "1080 × 1350",
    style: "green",
    description: "Un visuel adapté aux retraites spirituelles.",
    active: true,
  },
  {
    id: 16,
    name: "Veillée de Prière",
    slug: "veillee-priere",
    category: "Événement",
    format: "1080 × 1350",
    style: "night",
    description: "Design sombre et élégant pour une veillée.",
    active: true,
  },

  {
    id: 17,
    name: "Jeunesse en Feu",
    slug: "jeunesse-en-feu",
    category: "Jeunesse",
    format: "1080 × 1350",
    style: "red",
    description: "Un modèle moderne pour la jeunesse.",
    active: true,
  },
  {
    id: 18,
    name: "Génération Bethel",
    slug: "generation-bethel",
    category: "Jeunesse",
    format: "1080 × 1350",
    style: "blue",
    description: "Design dynamique pour les jeunes.",
    active: true,
  },
  {
    id: 19,
    name: "Jeunesse Connect",
    slug: "jeunesse-connect",
    category: "Jeunesse",
    format: "1080 × 1350",
    style: "cyan",
    description: "Un modèle contemporain et coloré.",
    active: true,
  },
  {
    id: 20,
    name: "Nouvelle Génération",
    slug: "nouvelle-generation",
    category: "Jeunesse",
    format: "1080 × 1350",
    style: "purple",
    description: "Une identité forte pour les programmes jeunesse.",
    active: true,
  },

  {
    id: 21,
    name: "Femmes de Destinée",
    slug: "femmes-destinee",
    category: "Départements",
    format: "1080 × 1350",
    style: "pink",
    description: "Modèle élégant pour les activités des femmes.",
    active: true,
  },
  {
    id: 22,
    name: "Hommes de Foi",
    slug: "hommes-de-foi",
    category: "Départements",
    format: "1080 × 1350",
    style: "blue",
    description: "Design sobre pour les activités des hommes.",
    active: true,
  },
  {
    id: 23,
    name: "École du Dimanche",
    slug: "ecole-dimanche",
    category: "Départements",
    format: "1080 × 1350",
    style: "orange",
    description: "Un modèle chaleureux pour les enfants.",
    active: true,
  },
  {
    id: 24,
    name: "Chorale Bethel",
    slug: "chorale-bethel",
    category: "Départements",
    format: "1080 × 1350",
    style: "green",
    description: "Visuel musical pour la chorale.",
    active: true,
  },

  {
    id: 25,
    name: "Verset du Jour",
    slug: "verset-du-jour",
    category: "Inspirations",
    format: "1080 × 1350",
    style: "cream",
    description: "Présentez facilement un verset biblique.",
    active: true,
  },
  {
    id: 26,
    name: "Pensée du Jour",
    slug: "pensee-du-jour",
    category: "Inspirations",
    format: "1080 × 1350",
    style: "purple",
    description: "Un design minimaliste pour les pensées spirituelles.",
    active: true,
  },
  {
    id: 27,
    name: "Bonne Semaine",
    slug: "bonne-semaine",
    category: "Inspirations",
    format: "1080 × 1350",
    style: "green",
    description: "Souhaitez une excellente semaine à la communauté.",
    active: true,
  },
  {
    id: 28,
    name: "Bonne Journée",
    slug: "bonne-journee",
    category: "Inspirations",
    format: "1080 × 1350",
    style: "orange",
    description: "Une publication simple et chaleureuse.",
    active: true,
  },

  {
    id: 29,
    name: "Annonce Premium",
    slug: "annonce-premium",
    category: "Annonces",
    format: "1080 × 1350",
    style: "black-gold",
    description: "Pour les annonces importantes de l'église.",
    active: true,
  },
  {
    id: 30,
    name: "Invitation Royale",
    slug: "invitation-royale",
    category: "Annonces",
    format: "1080 × 1350",
    style: "gold",
    description: "Invitez votre communauté avec élégance.",
    active: true,
  },
  {
    id: 31,
    name: "Annonce Moderne",
    slug: "annonce-moderne",
    category: "Annonces",
    format: "1080 × 1350",
    style: "cyan",
    description: "Un design moderne et très lisible.",
    active: true,
  },
  {
    id: 32,
    name: "À Ne Pas Manquer",
    slug: "a-ne-pas-manquer",
    category: "Annonces",
    format: "1080 × 1350",
    style: "red",
    description: "Attirez immédiatement l'attention.",
    active: true,
  },
]

// ============================================================
// CONFIGURATION DES DESIGNS
// ============================================================

const styleConfig = {
  gold: {
    background: "from-green-950 via-green-800 to-yellow-700",
    accent: "text-yellow-300",
    line: "bg-yellow-400",
    label: "Or & Vert",
  },

  purple: {
    background: "from-purple-950 via-purple-800 to-fuchsia-600",
    accent: "text-purple-200",
    line: "bg-yellow-300",
    label: "Violet",
  },

  blue: {
    background: "from-blue-950 via-blue-800 to-cyan-600",
    accent: "text-cyan-200",
    line: "bg-yellow-300",
    label: "Bleu",
  },

  green: {
    background: "from-green-950 via-emerald-800 to-green-500",
    accent: "text-emerald-200",
    line: "bg-yellow-300",
    label: "Vert",
  },

  dark: {
    background: "from-gray-950 via-gray-900 to-gray-700",
    accent: "text-gray-200",
    line: "bg-yellow-300",
    label: "Sombre",
  },

  brown: {
    background: "from-stone-950 via-amber-900 to-orange-700",
    accent: "text-orange-200",
    line: "bg-yellow-300",
    label: "Marron",
  },

  red: {
    background: "from-red-950 via-red-800 to-orange-600",
    accent: "text-red-100",
    line: "bg-yellow-300",
    label: "Rouge",
  },

  orange: {
    background: "from-orange-950 via-orange-700 to-yellow-500",
    accent: "text-orange-100",
    line: "bg-white",
    label: "Orange",
  },

  cyan: {
    background: "from-cyan-950 via-cyan-800 to-blue-500",
    accent: "text-cyan-100",
    line: "bg-yellow-300",
    label: "Cyan",
  },

  "black-gold": {
    background: "from-black via-gray-900 to-yellow-800",
    accent: "text-yellow-200",
    line: "bg-yellow-400",
    label: "Noir & Or",
  },

  night: {
    background: "from-slate-950 via-indigo-950 to-purple-900",
    accent: "text-indigo-200",
    line: "bg-yellow-300",
    label: "Nuit",
  },

  pink: {
    background: "from-pink-950 via-rose-800 to-pink-500",
    accent: "text-pink-100",
    line: "bg-yellow-300",
    label: "Rose",
  },

  cream: {
    background: "from-stone-900 via-amber-800 to-yellow-600",
    accent: "text-yellow-100",
    line: "bg-white",
    label: "Crème",
  },
}

// ============================================================
// UTILITAIRES DATE
// ============================================================

function getSundayForPublication() {
  const today = new Date()

  const day = today.getDay()

  const sunday = new Date(today)

  const daysUntilSunday = day === 0 ? 0 : 7 - day

  sunday.setDate(today.getDate() + daysUntilSunday)

  sunday.setHours(0, 0, 0, 0)

  return sunday
}

function formatPublicationDate(date) {
  if (!date) return ""

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatDateForUrl(date) {
  if (!date) return ""

  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, "0")

  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// ============================================================
// SLUG AUTOMATIQUE
// ============================================================

function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ============================================================
// COMPOSANT STAT
// ============================================================

function Stat({ number, label, icon }) {
  return (
    <div className="group rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-black text-gray-950">{number}</p>

          <p className="mt-1 text-sm font-medium text-gray-500">
            {label}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl transition duration-300 group-hover:rotate-12 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

function Templates() {
  const navigate = useNavigate()

  // ==========================================================
  // CHARGEMENT DES MODÈLES
  // ==========================================================

  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const parsed = JSON.parse(saved)

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (error) {
      console.error(
        "Erreur chargement des modèles :",
        error
      )
    }

    return initialTemplates
  })

  const [search, setSearch] = useState("")

  const [category, setCategory] = useState("Toutes")

  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [editingTemplate, setEditingTemplate] = useState(null)

  const [publicationSunday, setPublicationSunday] = useState(
    getSundayForPublication()
  )

  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  const emptyForm = {
    name: "",
    category: "Dimanche",
    format: "1080 × 1350",
    style: "green",
    description: "",
  }

  const [form, setForm] = useState(emptyForm)

  // ==========================================================
  // SAUVEGARDE AUTOMATIQUE
  // ==========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(templates)
      )
    } catch (error) {
      console.error(
        "Erreur sauvegarde des modèles :",
        error
      )
    }
  }, [templates])

  // ==========================================================
  // MISE À JOUR AUTOMATIQUE DU DIMANCHE
  // ==========================================================

  useEffect(() => {
    const updateSunday = () => {
      setPublicationSunday(getSundayForPublication())
    }

    updateSunday()

    const interval = setInterval(
      updateSunday,
      60 * 1000
    )

    return () => clearInterval(interval)
  }, [])

  // ==========================================================
  // CATÉGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        templates.map((template) => template.category)
      )
    )

    return ["Toutes", ...uniqueCategories]
  }, [templates])

  // ==========================================================
  // FILTRAGE
  // ==========================================================

  const filteredTemplates = templates.filter((template) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      template.name
        .toLowerCase()
        .includes(searchText) ||
      template.category
        .toLowerCase()
        .includes(searchText) ||
      template.description
        .toLowerCase()
        .includes(searchText)

    const matchesCategory =
      category === "Toutes" ||
      template.category === category

    return matchesSearch && matchesCategory
  })

  // ==========================================================
  // ACTIVER / DÉSACTIVER
  // ==========================================================

  function toggleTemplate(id) {
    setTemplates((current) =>
      current.map((template) =>
        template.id === id
          ? {
              ...template,
              active: !template.active,
            }
          : template
      )
    )
  }

  // ==========================================================
  // UTILISER UN MODÈLE
  // ==========================================================

  function useTemplate(template) {
    if (!template.active) {
      alert("Ce modèle est actuellement désactivé.")
      return
    }

    const date = formatDateForUrl(publicationSunday)

    navigate(
      `/publications?template=${encodeURIComponent(
        template.slug
      )}&date=${date}`
    )
  }

  // ==========================================================
  // OUVRIR CRÉATION
  // ==========================================================

  function openCreateModal() {
    setEditingTemplate(null)

    setForm(emptyForm)

    setShowCreateModal(true)
  }

  // ==========================================================
  // FERMER MODAL
  // ==========================================================

  function closeCreateModal() {
    setShowCreateModal(false)

    setEditingTemplate(null)

    setForm(emptyForm)
  }

  // ==========================================================
  // MODIFICATION
  // ==========================================================

  function openEditModal(template) {
    setEditingTemplate(template)

    setForm({
      name: template.name,
      category: template.category,
      format: template.format,
      style: template.style,
      description: template.description,
    })

    setShowCreateModal(true)
  }

  // ==========================================================
  // CHANGEMENT FORMULAIRE
  // ==========================================================

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ==========================================================
  // CRÉATION / MODIFICATION
  // ==========================================================

  function saveTemplate(event) {
    event.preventDefault()

    const name = form.name.trim()

    const description = form.description.trim()

    if (!name) {
      alert("Veuillez saisir le nom du modèle.")
      return
    }

    if (!description) {
      alert("Veuillez saisir une description.")
      return
    }

    // --------------------------------------------------------
    // MODIFICATION
    // --------------------------------------------------------

    if (editingTemplate) {
      setTemplates((current) =>
        current.map((template) =>
          template.id === editingTemplate.id
            ? {
                ...template,
                name,
                category: form.category,
                format: form.format,
                style: form.style,
                description,
                slug:
                  template.slug ||
                  createSlug(name),
              }
            : template
        )
      )

      closeCreateModal()

      return
    }

    // --------------------------------------------------------
    // NOUVEAU MODÈLE
    // --------------------------------------------------------

    const newId =
      templates.length > 0
        ? Math.max(
            ...templates.map(
              (template) => Number(template.id) || 0
            )
          ) + 1
        : 1

    let slug = createSlug(name)

    // Évite les doublons de slug
    const originalSlug = slug

    let counter = 2

    while (
      templates.some(
        (template) => template.slug === slug
      )
    ) {
      slug = `${originalSlug}-${counter}`

      counter++
    }

    const newTemplate = {
      id: newId,
      name,
      slug,
      category: form.category,
      format: form.format,
      style: form.style,
      description,
      active: true,
    }

    setTemplates((current) => [
      ...current,
      newTemplate,
    ])

    closeCreateModal()

    // Affiche automatiquement la nouvelle catégorie si besoin
    setCategory(form.category)

    alert(
      `Le modèle « ${name} » a été créé avec succès.`
    )
  }

  // ==========================================================
  // SUPPRIMER UN MODÈLE
  // ==========================================================

  function deleteTemplate(template) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le modèle « ${template.name} » ?`
    )

    if (!confirmed) return

    setTemplates((current) =>
      current.filter(
        (item) => item.id !== template.id
      )
    )

    if (
      selectedTemplate &&
      selectedTemplate.id === template.id
    ) {
      setSelectedTemplate(null)
    }
  }

  // ==========================================================
  // RETOUR
  // ==========================================================

  function handleBack() {
    navigate(-1)
  }

  // ==========================================================
  // DESIGN ACTUEL DU FORMULAIRE
  // ==========================================================

  const selectedFormDesign =
    styleConfig[form.style] || styleConfig.green

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7f6] px-4 py-8 sm:px-6 lg:px-8">
      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes titleEnter {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(45px) scale(.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-130%) rotate(15deg);
          }

          100% {
            transform: translateX(250%) rotate(15deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 rgba(234,179,8,0);
          }

          50% {
            box-shadow: 0 0 35px rgba(234,179,8,.25);
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(.92) translateY(25px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes overlayEnter {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .templates-page {
          animation: pageEnter .7s ease-out both;
        }

        .templates-title {
          animation: titleEnter .8s ease-out both;
        }

        .template-card {
          animation: cardEnter .65s ease-out both;
        }

        .template-card:hover .template-preview {
          transform: scale(1.045);
        }

        .template-card:hover .template-shine {
          animation: shine .9s ease-out;
        }

        .template-card:hover .template-floating {
          animation: floating 1.4s ease-in-out infinite;
        }

        .template-use-button {
          animation: pulseGlow 2.2s ease-in-out infinite;
        }

        .modal-overlay {
          animation: overlayEnter .25s ease-out both;
        }

        .modal-content {
          animation: modalEnter .35s ease-out both;
        }
      `}</style>

      <div className="templates-page mx-auto max-w-7xl">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="templates-title mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex items-start gap-4">
            {/* RETOUR */}

            <button
              type="button"
              onClick={handleBack}
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-xl font-black text-gray-700 shadow-sm transition duration-300 hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-800 hover:shadow-md"
              title="Retour"
            >
              ← 
            </button>

            <div>
              <p className="font-black uppercase tracking-[0.25em] text-green-700">
                BETHEL GLORY MEDIA
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                Bibliothèque des modèles
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Choisissez un modèle graphique et commencez
                directement la création de votre publication.
              </p>
            </div>
          </div>

          {/* AJOUTER */}

          <button
            type="button"
            onClick={openCreateModal}
            className="group rounded-2xl bg-green-950 px-6 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl active:scale-95"
          >
            <span className="mr-2 inline-block text-xl transition duration-300 group-hover:rotate-90">
              +
            </span>

            Ajouter un modèle
          </button>
        </div>

        {/* ====================================================
            DIMANCHE CONCERNÉ
        ==================================================== */}

        <div className="mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-green-950 via-green-800 to-emerald-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-lg">
                📅
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">
                  Date 
                </p>

                <h2 className="mt-1 text-xl font-black capitalize sm:text-2xl">
                  {formatPublicationDate(
                    publicationSunday
                  )}
                </h2>

                <p className="mt-1 text-xs text-white/60">
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-center backdrop-blur">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
                Publication
              </p>

              <p className="mt-1 text-sm font-black">
                DIMANCHE
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="mb-8 grid gap-5 sm:grid-cols-3">
          <Stat
            number={templates.length}
            label="Modèles disponibles"
            icon="🎨"
          />

          <Stat
            number={
              templates.filter(
                (template) => template.active
              ).length
            }
            label="Modèles actifs"
            icon="✓"
          />

          <Stat
            number={categories.length - 1}
            label="Catégories"
            icon="▦"
          />
        </div>

        {/* ====================================================
            RECHERCHE
        ==================================================== */}

        <div className="mb-8 rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔎
              </span>

              <input
                type="text"
                placeholder="Rechercher un modèle, une catégorie..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 font-medium outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* CATÉGORIES */}

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-black transition ${
                  category === item
                    ? "bg-green-950 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================
            RESULTATS
        ==================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
              Galerie
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-950">
              {filteredTemplates.length} modèles
            </h2>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-500 shadow-sm">
            {category}
          </div>
        </div>

        {/* ====================================================
            GRILLE
        ==================================================== */}

        {filteredTemplates.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template, index) => {
              const design =
                styleConfig[template.style] ||
                styleConfig.green

              return (
                <article
                  key={template.id}
                  className="template-card group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition duration-500 hover:-translate-y-3 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 45}ms`,
                  }}
                >
                  {/* APERÇU */}

                  <div
                    className={`template-preview relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${design.background} transition duration-700`}
                  >
                    <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                    <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-yellow-300/10 blur-3xl" />

                    <div className="template-shine absolute -left-1/2 top-0 h-[180%] w-1/3 bg-white/20 blur-xl" />

                    <div className="template-floating absolute inset-5 rounded-[22px] border border-white/25 bg-black/10 p-4 text-white backdrop-blur-[2px]">
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          <p
                            className={`text-[9px] font-black uppercase tracking-[0.3em] ${design.accent}`}
                          >
                            BETHEL GLORY
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

                            <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                              MEDIA
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
                            {template.category}
                          </p>

                          <h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                            {template.name}
                          </h3>

                          <div
                            className={`mx-auto my-4 h-1 w-12 rounded-full ${design.line}`}
                          />

                          <p className="text-[10px] leading-4 text-white/80">
                            Votre thème ici
                          </p>
                        </div>

                        {/* DATE AUTOMATIQUE */}

                        <div className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                            DIMANCHE
                          </p>

                          <p className="mt-1 text-xs font-black capitalize">
                            {formatPublicationDate(
                              publicationSunday
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATUT */}

                    <div className="absolute right-4 top-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-black shadow-lg ${
                          template.active
                            ? "bg-white text-green-900"
                            : "bg-gray-800 text-white"
                        }`}
                      >
                        {template.active
                          ? "ACTIF"
                          : "INACTIF"}
                      </span>
                    </div>

                    {/* APERÇU */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplate(template)
                      }
                      className="absolute bottom-4 left-4 rounded-xl bg-black/40 px-3 py-2 text-xs font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                    >
                      👁 Aperçu
                    </button>
                  </div>

                  {/* INFORMATIONS */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-gray-950">
                          {template.name}
                        </h3>

                        <p className="mt-1 text-xs font-bold text-green-700">
                          {template.category}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-500">
                        {template.format}
                      </span>
                    </div>

                    <p className="mt-3 min-h-[40px] text-xs leading-5 text-gray-500">
                      {template.description}
                    </p>

                    {/* DATE */}

                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                      <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                        Date du dimanche
                      </p>

                      <p className="mt-1 text-xs font-black capitalize text-gray-700">
                        📅{" "}
                        {formatPublicationDate(
                          publicationSunday
                        )}
                      </p>
                    </div>

                    {/* UTILISER */}

                    <button
                      type="button"
                      onClick={() =>
                        useTemplate(template)
                      }
                      disabled={!template.active}
                      className={`template-use-button mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black transition ${
                        template.active
                          ? "bg-green-950 text-white hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl"
                          : "cursor-not-allowed bg-gray-200 text-gray-400"
                      }`}
                    >
                      <span>✦</span>

                      Utiliser ce modèle

                      <span className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    {/* ACTIONS */}

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleTemplate(template.id)
                        }
                        className="rounded-xl bg-gray-100 px-2 py-2 text-[10px] font-bold text-gray-700 transition hover:bg-gray-200"
                      >
                        {template.active
                          ? "Désactiver"
                          : "Activer"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(template)
                        }
                        className="rounded-xl border border-gray-200 px-2 py-2 text-[10px] font-bold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTemplate(template)
                        }
                        className="rounded-xl border border-red-100 bg-red-50 px-2 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ====================================================
            AUCUN RÉSULTAT
        ==================================================== */}

        {filteredTemplates.length === 0 && (
          <div className="rounded-[30px] bg-white p-14 text-center shadow-sm">
            <div className="text-6xl">🔍</div>

            <h2 className="mt-5 text-2xl font-black text-gray-950">
              Aucun modèle trouvé
            </h2>

            <p className="mt-2 text-gray-500">
              Essayez une autre recherche ou choisissez
              une autre catégorie.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("")
                setCategory("Toutes")
              }}
              className="mt-6 rounded-2xl bg-green-950 px-6 py-3 font-black text-white transition hover:bg-green-900"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* ====================================================
            INFORMATION
        ==================================================== */}

        <div className="mt-10 rounded-[28px] border border-green-100 bg-green-50 p-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
              💡
            </div>

            <div>
              <p className="font-black text-green-950">
                Comment utiliser un modèle ?
              </p>

              <p className="mt-1 text-sm leading-6 text-green-800">
                Parcourez la bibliothèque, choisissez le modèle
                qui vous convient puis cliquez sur
                « Utiliser ce modèle ». Vous serez automatiquement
                envoyé vers l'espace de création avec le modèle
                sélectionné et la date du dimanche concerné.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MODAL APERÇU
      ====================================================== */}

      {selectedTemplate && (
        <div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="modal-content w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${
                (
                  styleConfig[
                    selectedTemplate.style
                  ] || styleConfig.green
                ).background
              }`}
            >
              <div className="absolute inset-6 rounded-[26px] border border-white/25 bg-black/10 p-6 text-center text-white">
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">
                    BETHEL GLORY MEDIA
                  </p>

                  <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-white/70">
                    {selectedTemplate.category}
                  </p>

                  <h2 className="mt-4 text-4xl font-black">
                    {selectedTemplate.name}
                  </h2>

                  <div
                    className={`my-6 h-1 w-20 rounded-full ${
                      (
                        styleConfig[
                          selectedTemplate.style
                        ] || styleConfig.green
                      ).line
                    }`}
                  />

                  <p className="text-sm text-white/80">
                    {selectedTemplate.description}
                  </p>

                  <p className="mt-12 text-xs font-bold uppercase tracking-widest text-white/60">
                    {formatPublicationDate(
                      publicationSunday
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTemplate(null)
                }
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-black text-gray-950">
                {selectedTemplate.name}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {selectedTemplate.description}
              </p>

              <button
                type="button"
                onClick={() =>
                  useTemplate(selectedTemplate)
                }
                className="mt-5 w-full rounded-2xl bg-green-950 px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl"
              >
                Utiliser ce modèle →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MODAL CRÉATION / MODIFICATION
      ====================================================== */}

      {showCreateModal && (
        <div
          className="modal-overlay fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeCreateModal}
        >
          <div
            className="modal-content my-8 w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                HEADER MODAL
            ================================================= */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 sm:px-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-700">
                  BETHEL GLORY MEDIA
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950 sm:text-3xl">
                  {editingTemplate
                    ? "Modifier le modèle"
                    : "Créer un nouveau modèle"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingTemplate
                    ? "Modifiez les informations de votre modèle."
                    : "Créez votre propre modèle pour enrichir la bibliothèque."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl text-gray-600 transition duration-300 hover:rotate-90 hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {/* =================================================
                CONTENU MODAL
            ================================================= */}

            <form onSubmit={saveTemplate}>
              <div className="grid lg:grid-cols-2">
                {/* =================================================
                    FORMULAIRE
                ================================================= */}

                <div className="p-6 sm:p-8">
                  <div className="space-y-5">
                    {/* NOM */}

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                        Nom du modèle
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Ex : Dimanche de Gloire"
                       required
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-bold text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      />
                    </div>

                    {/* CATÉGORIE */}

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                        Catégorie
                      </label>

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-bold text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      >
                        <option value="Dimanche">
                          Dimanche
                        </option>

                        <option value="Prédication">
                          Prédication
                        </option>

                        <option value="Louange">
                          Louange
                        </option>

                        <option value="Événement">
                          Événement
                        </option>

                        <option value="Jeunesse">
                          Jeunesse
                        </option>

                        <option value="Départements">
                          Départements
                        </option>

                        <option value="Inspirations">
                          Inspirations
                        </option>

                        <option value="Annonces">
                          Annonces
                        </option>

                        <option value="Autre">
                          Autre
                        </option>
                      </select>
                    </div>

                    {/* FORMAT */}

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                        Format
                      </label>

                      <select
                        name="format"
                        value={form.format}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-bold text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      >
                        <option value="1080 × 1350">
                          1080 × 1350 — Portrait
                        </option>

                        <option value="1080 × 1080">
                          1080 × 1080 — Carré
                        </option>

                        <option value="1080 × 1920">
                          1080 × 1920 — Story
                        </option>

                        <option value="1920 × 1080">
                          1920 × 1080 — Paysage
                        </option>
                      </select>
                    </div>

                    {/* STYLE */}

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                        Design / Couleur
                      </label>

                      <select
                        name="style"
                        value={form.style}
                        onChange={handleFormChange}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-bold text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      >
                        {Object.entries(
                          styleConfig
                        ).map(([key, config]) => (
                          <option
                            key={key}
                            value={key}
                          >
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DESCRIPTION */}

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows="4"
                        placeholder="Décrivez votre nouveau modèle..."
                        className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    APERÇU EN DIRECT
                ================================================= */}

                <div className="bg-gray-50 p-6 sm:p-8">
                  <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                      Aperçu en direct
                    </p>

                    <h3 className="mt-1 text-xl font-black text-gray-950">
                      Votre nouveau modèle
                    </h3>
                  </div>

                  <div
                    className={`relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[30px] bg-gradient-to-br ${selectedFormDesign.background} shadow-2xl`}
                  >
                    {/* DÉCORATIONS */}

                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-yellow-300/10 blur-3xl" />

                    {/* CARTE */}

                    <div className="absolute inset-6 rounded-[25px] border border-white/25 bg-black/10 p-5 text-white backdrop-blur-[2px]">
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          <p
                            className={`text-[9px] font-black uppercase tracking-[0.3em] ${selectedFormDesign.accent}`}
                          >
                            BETHEL GLORY
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />

                            <span className="text-[8px] font-bold uppercase tracking-widest text-white/70">
                              MEDIA
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
                            {form.category}
                          </p>

                          <h3 className="mt-3 break-words text-2xl font-black leading-tight">
                            {form.name ||
                              "Votre modèle"}
                          </h3>

                          <div
                            className={`mx-auto my-4 h-1 w-12 rounded-full ${selectedFormDesign.line}`}
                          />

                          <p className="px-3 text-[10px] leading-4 text-white/80">
                            {form.description ||
                              "Votre description apparaîtra ici."}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                            DIMANCHE
                          </p>

                          <p className="mt-1 text-xs font-black capitalize">
                            {formatPublicationDate(
                              publicationSunday
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INFOS */}

                  <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">
                        Format
                      </span>

                      <span className="text-xs font-black text-gray-900">
                        {form.format}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">
                        Design
                      </span>

                      <span className="text-xs font-black text-green-700">
                        {selectedFormDesign.label}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">
                        Date
                      </span>

                      <span className="text-xs font-black capitalize text-gray-900">
                        {formatPublicationDate(
                          publicationSunday
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FOOTER MODAL
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-black text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-green-950 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl active:scale-95"
                >
                  {editingTemplate
                    ? "✓ Enregistrer les modifications"
                    : "✦ Créer le modèle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates