import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"

// ==========================================================
// CONFIGURATION DU STOCKAGE
// ==========================================================

// Nombre maximum de photos par assemblée
const MAX_PHOTOS = 8

// Taille maximale approximative d'une image après compression
const MAX_IMAGE_SIZE_KB = 500

// ==========================================================
// OUTILS IMAGES
// ==========================================================

/**
 * Compresse une image avant de la stocker.
 *
 * Les images sont transformées en JPEG afin de réduire
 * fortement leur taille par rapport au Base64 original.
 */
const compressImage = (
  fileOrDataUrl,
  maxWidth = 1400,
  quality = 0.72
) => {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      try {
        let width = image.width
        let height = image.height

        // Réduction de la largeur
        if (width > maxWidth) {
          const ratio = maxWidth / width

          width = maxWidth
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement("canvas")

        canvas.width = width
        canvas.height = height

        const context = canvas.getContext("2d")

        if (!context) {
          reject(
            new Error(
              "Impossible d'utiliser le canvas du navigateur."
            )
          )
          return
        }

        // Fond blanc pour les PNG avec transparence
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, width, height)

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        )

        let compressed = canvas.toDataURL(
          "image/jpeg",
          quality
        )

        // Si l'image reste trop lourde, on recommence
        // avec une qualité plus faible.
        const maxBytes =
          MAX_IMAGE_SIZE_KB * 1024

        let currentQuality = quality

        while (
          compressed.length * 0.75 > maxBytes &&
          currentQuality > 0.35
        ) {
          currentQuality -= 0.08

          compressed = canvas.toDataURL(
            "image/jpeg",
            currentQuality
          )
        }

        resolve(compressed)
      } catch (error) {
        reject(error)
      }
    }

    image.onerror = () => {
      reject(
        new Error(
          "Impossible de charger cette image."
        )
      )
    }

    if (
      typeof fileOrDataUrl === "string" &&
      fileOrDataUrl.startsWith("data:")
    ) {
      image.src = fileOrDataUrl
    } else {
      const reader = new FileReader()

      reader.onload = () => {
        image.src = reader.result
      }

      reader.onerror = () => {
        reject(
          new Error(
            "Impossible de lire le fichier."
          )
        )
      }

      reader.readAsDataURL(fileOrDataUrl)
    }
  })
}

// ==========================================================
// ESTIMATION TAILLE STOCKAGE
// ==========================================================

const getStorageSizeKB = (data) => {
  try {
    const text = JSON.stringify(data)

    return Math.round(
      new Blob([text]).size / 1024
    )
  } catch {
    return 0
  }
}

// ==========================================================
// ASSEMBLÉES PAR DÉFAUT
// ==========================================================

const defaultAssemblies = [
  {
    id: 1,
    name: "Assemblée de Bethel",
    city: "Abidjan",
    status: "Assemblée principale",
    description:
      "Une communauté engagée dans la prière, l'enseignement de la Parole et le service de Dieu.",
    slogan: "",
    mission: "",
    vision: "",
    address: "",
    phone: "",
    pastor: "",
    logo: null,
    photos: [],
  },

  {
    id: 2,
    name: "Assemblée d'Akéikoi",
    city: "Abidjan",
    status: "Assemblée",
    description:
      "Une communauté chrétienne accueillante qui grandit dans la foi et la communion.",
    slogan: "",
    mission: "",
    vision: "",
    address: "",
    phone: "",
    pastor: "",
    logo: null,
    photos: [],
  },

  {
    id: 3,
    name: "Assemblée d'Abgéikoi",
    city: "Abidjan",
    status: "Assemblée",
    description:
      "Une assemblée dédiée à la prière, à l'évangélisation et à l'accompagnement des fidèles.",
    slogan: "",
    mission: "",
    vision: "",
    address: "",
    phone: "",
    pastor: "",
    logo: null,
    photos: [],
  },
]

// ==========================================================
// NORMALISATION
// ==========================================================

const normalizeAssembly = (assembly) => ({
  ...assembly,

  slogan: assembly.slogan || "",
  mission: assembly.mission || "",
  vision: assembly.vision || "",
  description: assembly.description || "",
  address: assembly.address || "",
  phone: assembly.phone || "",
  pastor: assembly.pastor || "",
  logo: assembly.logo || null,

  photos: Array.isArray(assembly.photos)
    ? assembly.photos.filter(
        (photo) =>
          typeof photo === "string" &&
          photo.length > 0
      )
    : [],
})

// ==========================================================
// RÉCUPÉRATION INITIALE
// ==========================================================

const getInitialAssemblies = () => {
  try {
    const saved = localStorage.getItem(
      "bethel_assemblies"
    )

    if (saved) {
      const parsed = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        return parsed.map(normalizeAssembly)
      }
    }
  } catch (error) {
    console.error(
      "❌ Impossible de récupérer les assemblées :",
      error
    )
  }

  return defaultAssemblies
}

// ==========================================================
// COMPOSANT
// ==========================================================

function Assembles() {
  // ==========================================================
  // RÉCUPÉRER LES ASSEMBLÉES
  // ==========================================================

  const [assemblies, setAssemblies] = useState(
    getInitialAssemblies
  )

  // ==========================================================
  // ÉTATS
  // ==========================================================

  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  // ID de l'assemblée dont le menu ⋮ est ouvert
  const [openMenuId, setOpenMenuId] = useState(null)

  const [storageWarning, setStorageWarning] =
    useState("")

  const [processingImage, setProcessingImage] =
    useState(false)

  const [form, setForm] = useState({
    name: "",
    city: "",
    status: "Assemblée",
    description: "",
    slogan: "",
    mission: "",
    vision: "",
    address: "",
    phone: "",
    pastor: "",
    logo: null,
    photos: [],
  })

  // ==========================================================
  // SAUVEGARDE SÉCURISÉE
  // ==========================================================

  useEffect(() => {
    try {
      const data = JSON.stringify(assemblies)

      localStorage.setItem(
        "bethel_assemblies",
        data
      )

      setStorageWarning("")
    } catch (error) {
      console.error(
        "❌ Erreur de sauvegarde :",
        error
      )

      if (
        error?.name === "QuotaExceededError" ||
        error?.code === 22
      ) {
        setStorageWarning(
          "Le stockage du navigateur est presque plein. Les images ont été compressées, mais certaines anciennes images peuvent encore occuper beaucoup d'espace."
        )
      } else {
        setStorageWarning(
          "Impossible d'enregistrer les données dans le navigateur."
        )
      }
    }
  }, [assemblies])

  // ==========================================================
  // CHANGEMENT DES CHAMPS
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // ==========================================================
  // LOGO
  // ==========================================================

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Vérification du type
    if (!file.type.startsWith("image/")) {
      alert(
        "Veuillez sélectionner une image PNG, JPG ou JPEG."
      )

      event.target.value = ""
      return
    }

    try {
      setProcessingImage(true)
      setStorageWarning("")

      const compressed = await compressImage(
        file,
        1000,
        0.72
      )

      setForm((previous) => ({
        ...previous,
        logo: compressed,
      }))
    } catch (error) {
      console.error(
        "❌ Erreur logo :",
        error
      )

      alert(
        "Impossible de traiter le logo sélectionné."
      )
    } finally {
      setProcessingImage(false)
      event.target.value = ""
    }
  }

  // ==========================================================
  // PHOTOS DU TEMPLE
  // ==========================================================

  const handlePhotosChange = async (event) => {
    const files = Array.from(
      event.target.files || []
    )

    if (files.length === 0) return

    const currentPhotos = Array.isArray(
      form.photos
    )
      ? form.photos
      : []

    const remainingSlots =
      MAX_PHOTOS - currentPhotos.length

    if (remainingSlots <= 0) {
      alert(
        `Vous avez atteint la limite de ${MAX_PHOTOS} photos pour cette assemblée.`
      )

      event.target.value = ""
      return
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots
    )

    if (files.length > remainingSlots) {
      alert(
        `Vous pouvez encore ajouter seulement ${remainingSlots} photo(s).`
      )
    }

    try {
      setProcessingImage(true)
      setStorageWarning("")

      const compressedImages = []

      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          continue
        }

        const compressed =
          await compressImage(
            file,
            1400,
            0.72
          )

        compressedImages.push(
          compressed
        )
      }

      if (
        compressedImages.length === 0
      ) {
        alert(
          "Aucune image valide n'a été sélectionnée."
        )

        return
      }

      setForm((previous) => ({
        ...previous,

        photos: [
          ...(previous.photos || []),
          ...compressedImages,
        ].slice(0, MAX_PHOTOS),
      }))
    } catch (error) {
      console.error(
        "❌ Erreur lors du traitement des photos :",
        error
      )

      alert(
        "Une erreur est survenue pendant la compression des photos."
      )
    } finally {
      setProcessingImage(false)
      event.target.value = ""
    }
  }

  // ==========================================================
  // SUPPRIMER UNE PHOTO
  // ==========================================================

  const removePhoto = (indexToRemove) => {
    setForm((previous) => ({
      ...previous,

      photos: (
        previous.photos || []
      ).filter(
        (_, index) =>
          index !== indexToRemove
      ),
    }))
  }

  // ==========================================================
  // SUPPRIMER LE LOGO
  // ==========================================================

  const removeLogo = () => {
    setForm((previous) => ({
      ...previous,
      logo: null,
    }))
  }

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setForm({
      name: "",
      city: "",
      status: "Assemblée",
      description: "",
      slogan: "",
      mission: "",
      vision: "",
      address: "",
      phone: "",
      pastor: "",
      logo: null,
      photos: [],
    })

    setEditingId(null)
    setShowForm(false)
    setStorageWarning("")
  }

  // ==========================================================
  // ENREGISTRER
  // ==========================================================

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      !form.name.trim() ||
      !form.city.trim()
    ) {
      alert(
        "Veuillez renseigner au minimum le nom et la ville."
      )

      return
    }

    const cleanForm = {
      ...form,

      name: form.name.trim(),
      city: form.city.trim(),

      description:
        form.description.trim(),

      slogan:
        form.slogan.trim(),

      mission:
        form.mission.trim(),

      vision:
        form.vision.trim(),

      address:
        form.address.trim(),

      phone:
        form.phone.trim(),

      pastor:
        form.pastor.trim(),

      photos: Array.isArray(
        form.photos
      )
        ? form.photos.slice(
            0,
            MAX_PHOTOS
          )
        : [],
    }

    // ========================================================
    // VÉRIFICATION DE LA TAILLE
    // ========================================================

    let nextAssemblies

    if (editingId) {
      nextAssemblies = assemblies.map(
        (assembly) =>
          assembly.id === editingId
            ? {
                ...assembly,
                ...cleanForm,
              }
            : assembly
      )
    } else {
      const newAssembly = {
        id: Date.now(),
        ...cleanForm,
      }

      nextAssemblies = [
        ...assemblies,
        newAssembly,
      ]
    }

    const estimatedKB =
      getStorageSizeKB(
        nextAssemblies
      )

    console.log(
      `📦 Taille estimée des assemblées : ${estimatedKB} KB`
    )

    // On évite d'ajouter une énorme quantité de données.
    if (estimatedKB > 4500) {
      alert(
        "Les données des assemblées sont trop volumineuses pour le stockage du navigateur.\n\nSupprimez quelques anciennes photos ou réduisez le nombre de photos avant d'enregistrer."
      )

      return
    }

    setAssemblies(nextAssemblies)

    // Fermer également le menu s'il était ouvert
    setOpenMenuId(null)

    resetForm()
  }

  // ==========================================================
  // MODIFIER
  // ==========================================================

  const handleEdit = (assembly) => {
    setForm({
      name: assembly.name || "",
      city: assembly.city || "",
      status:
        assembly.status ||
        "Assemblée",

      description:
        assembly.description || "",

      slogan:
        assembly.slogan || "",

      mission:
        assembly.mission || "",

      vision:
        assembly.vision || "",

      address:
        assembly.address || "",

      phone:
        assembly.phone || "",

      pastor:
        assembly.pastor || "",

      logo:
        assembly.logo || null,

      photos:
        Array.isArray(
          assembly.photos
        )
          ? assembly.photos
          : [],
    })

    setEditingId(assembly.id)
    setShowForm(true)
    setStorageWarning("")

    // Fermer le menu
    setOpenMenuId(null)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ==========================================================
  // SUPPRIMER
  // ==========================================================

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette assemblée ?"
      )

    if (!confirmed) return

    setAssemblies((previous) =>
      previous.filter(
        (assembly) =>
          assembly.id !== id
      )
    )

    // Fermer le menu
    setOpenMenuId(null)
  }

  // ==========================================================
  // NETTOYER LES ANCIENNES IMAGES
  // ==========================================================

  const clearAssemblyStorage = () => {
    const confirmed =
      window.confirm(
        "Cette action va supprimer les assemblées actuellement enregistrées dans ce navigateur.\n\nVoulez-vous continuer ?"
      )

    if (!confirmed) return

    localStorage.removeItem(
      "bethel_assemblies"
    )

    setAssemblies(
      defaultAssemblies
    )

    setStorageWarning("")
    setOpenMenuId(null)

    alert(
      "Le stockage des assemblées a été nettoyé."
    )
  }

  // ==========================================================
  // OUVRIR / FERMER MENU
  // ==========================================================

  const toggleAssemblyMenu = (id) => {
    setOpenMenuId((previousId) =>
      previousId === id
        ? null
        : id
    )
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
                Assemblées
              </h1>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-4 py-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-xs font-bold text-green-800">
              {assemblies.length} assemblée(s)
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          CONTENU
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* =====================================================
            ALERTE STOCKAGE
        ===================================================== */}

        {storageWarning && (

          <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  ⚠️
                </div>

                <div>

                  <p className="text-sm font-black text-red-900">
                    Stockage du navigateur presque plein
                  </p>

                  <p className="mt-1 text-xs leading-6 text-red-800/80">
                    {storageWarning}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  clearAssemblyStorage
                }
                className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Nettoyer le stockage
              </button>

            </div>

          </div>

        )}


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="overflow-hidden rounded-[32px] bg-green-950 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-100">

                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                Administration

              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">

                Gérez vos
                <br />
                assemblées.

              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-green-100/75 sm:text-base">

                Ajoutez, modifiez et organisez
                les différentes assemblées de
                votre église depuis un espace
                simple et professionnel.

              </p>

            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-yellow-400/30 bg-white/10 text-5xl shadow-inner">

              🏛️

            </div>

          </div>

        </section>


        {/* =====================================================
            STATISTIQUES
        ===================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Assemblées
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                🏛️
              </span>

            </div>

            <p className="mt-4 text-3xl font-black text-green-950">
              {assemblies.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Enregistrées
            </p>

          </div>


          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Ville principale
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                📍
              </span>

            </div>

            <p className="mt-4 text-2xl font-black text-green-950">
              Abidjan
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Côte d'Ivoire
            </p>

          </div>


          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Statut
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                ✓
              </span>

            </div>

            <div className="mt-4 flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <p className="text-2xl font-black text-green-950">
                Actif
              </p>

            </div>

            <p className="mt-2 text-xs text-gray-400">
              Gestion disponible
            </p>

          </div>

        </section>


        {/* =====================================================
            BOUTON AJOUT
        ===================================================== */}

        {!showForm && (

          <div className="mt-8 flex justify-end">

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="rounded-2xl bg-green-950 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-950/20 transition hover:bg-green-900"
            >
              + Ajouter une assemblée
            </button>

          </div>

        )}


        {/* =====================================================
            FORMULAIRE
        ===================================================== */}

        {showForm && (

          <section className="mt-8 overflow-hidden rounded-[30px] border border-gray-200/70 bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6 sm:p-8">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">

                    {editingId
                      ? "Modification"
                      : "Nouvelle assemblée"}

                  </p>

                  <h2 className="mt-1 text-2xl font-black text-gray-900">

                    {editingId
                      ? "Modifier l'assemblée"
                      : "Ajouter une assemblée"}

                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Renseignez les informations de l'assemblée.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
                >
                  ✕ Fermer
                </button>

              </div>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 p-6 sm:p-8 md:grid-cols-2"
            >

              {/* NOM */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Nom de l'assemblée
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex : Assemblée de Bethel"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* VILLE */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Ville
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ex : Abidjan"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* STATUT */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Statut
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                >

                  <option>
                    Assemblée principale
                  </option>

                  <option>
                    Assemblée
                  </option>

                  <option>
                    Nouvelle assemblée
                  </option>

                </select>

              </div>


              {/* RESPONSABLE */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Responsable
                </label>

                <input
                  type="text"
                  name="pastor"
                  value={form.pastor}
                  onChange={handleChange}
                  placeholder="Nom du responsable"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* ADRESSE */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Adresse
                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Adresse de l'assemblée"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* TELEPHONE */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Téléphone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ex : 07 00 00 00 00"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
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
                  placeholder="Présentez brièvement cette assemblée..."
                  className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* SLOGAN */}

              <div className="md:col-span-2">

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Slogan de l'assemblée
                </label>

                <input
                  type="text"
                  name="slogan"
                  value={form.slogan}
                  onChange={handleChange}
                  placeholder="Ex : Une famille, une foi, une vision"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* MISSION */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Mission
                </label>

                <textarea
                  name="mission"
                  value={form.mission}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Quelle est la mission de cette assemblée ?"
                  className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* VISION */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Vision
                </label>

                <textarea
                  name="vision"
                  value={form.vision}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Quelle est la vision de cette assemblée ?"
                  className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>


              {/* =================================================
                  LOGO
              ================================================= */}

              <div className="md:col-span-2">

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Logo de l'assemblée
                </label>

                <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center">

                  <label className="flex min-h-[150px] flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition hover:border-green-600 hover:bg-green-50">

                    <div>

                      <div className="text-4xl">
                        🖼️
                      </div>

                      <p className="mt-2 text-sm font-black text-gray-800">
                        Choisir un logo
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG ou JPEG
                      </p>

                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={
                        handleLogoChange
                      }
                      className="hidden"
                    />

                  </label>


                  {form.logo && (

                    <div className="relative flex justify-center">

                      <img
                        src={form.logo}
                        alt="Aperçu du logo"
                        className="h-32 w-32 rounded-2xl border border-gray-200 bg-white object-contain p-2 shadow-sm"
                      />

                      <button
                        type="button"
                        onClick={
                          removeLogo
                        }
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white shadow-lg hover:bg-red-700"
                      >
                        ×
                      </button>

                    </div>

                  )}

                </div>

              </div>


              {/* =================================================
                  PHOTOS
              ================================================= */}

              <div className="md:col-span-2">

                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

                  <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Photos du temple
                  </label>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black text-green-700">
                    Maximum {MAX_PHOTOS} photos
                  </span>

                </div>


                <div className="mt-3">

                  <label
                    className={`flex min-h-[180px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition ${
                      processingImage
                        ? "cursor-wait opacity-70"
                        : "cursor-pointer hover:border-green-600 hover:bg-green-50"
                    }`}
                  >

                    <div>

                      <div className="text-5xl">

                        {processingImage
                          ? "⏳"
                          : "🏛️"}

                      </div>

                      <p className="mt-3 text-sm font-black text-gray-800">

                        {processingImage
                          ? "Traitement des images..."
                          : "Ajouter les photos du temple"}

                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Les images seront automatiquement compressées.
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        JPG, JPEG ou PNG
                      </p>

                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      multiple
                      disabled={
                        processingImage
                      }
                      onChange={
                        handlePhotosChange
                      }
                      className="hidden"
                    />

                  </label>

                </div>


                {/* APERÇU PHOTOS */}

                {form.photos &&
                  form.photos.length > 0 && (

                    <div className="mt-6">

                      <div className="mb-4 flex items-center justify-between">

                        <div>

                          <p className="text-sm font-black text-gray-800">
                            Photos sélectionnées
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Ces photos seront visibles sur la page de l'assemblée.
                          </p>

                        </div>

                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">

                          {form.photos.length} /{" "}
                          {MAX_PHOTOS} photo
                          {form.photos.length > 1
                            ? "s"
                            : ""}

                        </span>

                      </div>


                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                        {form.photos.map(
                          (
                            photo,
                            index
                          ) => (

                            <div
                              key={`${index}-${photo.slice(
                                0,
                                20
                              )}`}
                              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm"
                            >

                              <img
                                src={photo}
                                alt={`Photo du temple ${
                                  index + 1
                                }`}
                                className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                              />

                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8">

                                <p className="text-xs font-bold text-white">
                                  Photo{" "}
                                  {index + 1}
                                </p>

                              </div>


                              <button
                                type="button"
                                onClick={() =>
                                  removePhoto(
                                    index
                                  )
                                }
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white opacity-90 shadow-lg transition hover:bg-red-700 group-hover:opacity-100"
                                title="Supprimer cette photo"
                              >
                                ×
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

              </div>


              {/* =================================================
                  BOUTONS
              ================================================= */}

              <div className="flex flex-col gap-3 pt-3 sm:flex-row md:col-span-2">

                <button
                  type="submit"
                  disabled={
                    processingImage
                  }
                  className="rounded-2xl bg-green-950 px-7 py-3.5 font-bold text-white shadow-lg shadow-green-950/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {processingImage
                    ? "⏳ Traitement..."
                    : editingId
                    ? "✓ Enregistrer les modifications"
                    : "+ Ajouter l'assemblée"}

                </button>


                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="rounded-2xl border border-gray-200 px-7 py-3.5 font-bold text-gray-600 transition hover:bg-gray-100"
                >
                  Annuler
                </button>

              </div>

            </form>

          </section>

        )}


        {/* =====================================================
            LISTE
        ===================================================== */}

        <section className="mt-10">

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                Répertoire
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-900">
                Vos assemblées
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {assemblies.length} assemblée(s) enregistrée(s)
              </p>

            </div>

          </div>


          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {assemblies.map(
              (assembly) => (

                <article
                  key={assembly.id}
                  className="group overflow-visible rounded-[30px] border border-gray-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE / LOGO */}

                  <div className="relative flex h-44 overflow-hidden rounded-t-[30px] items-center justify-center bg-green-950">

                    <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-700" />

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10" />

                    <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-yellow-400/10" />


                    {assembly.logo ? (

                      <img
                        src={assembly.logo}
                        alt={assembly.name}
                        className="relative h-24 w-24 rounded-[28px] border-2 border-yellow-400 bg-white object-contain p-2 shadow-xl transition duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border-2 border-yellow-400 bg-white/10 text-5xl text-yellow-400 shadow-xl transition duration-300 group-hover:scale-105">
                        ✝
                      </div>

                    )}

                  </div>


                  {/* CONTENU */}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-3">

                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-green-800">
                        {assembly.status}
                      </span>


                      {/* =================================================
                          MENU TROIS POINTS
                      ================================================= */}

                      <div className="relative">

                        <button
                          type="button"
                          onClick={() =>
                            toggleAssemblyMenu(
                              assembly.id
                            )
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black transition ${
                            openMenuId === assembly.id
                              ? "bg-green-950 text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-900"
                          }`}
                          aria-label={`Options de ${assembly.name}`}
                          aria-expanded={
                            openMenuId ===
                            assembly.id
                          }
                        >
                          ⋮
                        </button>


                        {/* =================================================
                            MENU DÉROULANT
                        ================================================= */}

                        {openMenuId ===
                          assembly.id && (

                          <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl">

                            {/* VOIR */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                alert(
                                  `Assemblée : ${assembly.name}\n\nVille : ${assembly.city}\nStatut : ${assembly.status}`
                                )
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-900"
                            >

                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                                👁️
                              </span>

                              <span>
                                Voir
                              </span>

                            </button>


                            {/* MODIFIER */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                handleEdit(
                                  assembly
                                )
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-900"
                            >

                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                                ✏️
                              </span>

                              <span>
                                Modifier
                              </span>

                            </button>


                            {/* PHOTOS */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                alert(
                                  `${assembly.photos?.length || 0} photo(s) enregistrée(s) pour ${assembly.name}.`
                                )
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-900"
                            >

                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                                📷
                              </span>

                              <span>
                                Voir les photos
                              </span>

                            </button>


                            {/* SÉPARATION */}

                            <div className="my-1 border-t border-gray-100" />


                            {/* SUPPRIMER */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                handleDelete(
                                  assembly.id
                                )
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                            >

                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                                🗑️
                              </span>

                              <span>
                                Supprimer
                              </span>

                            </button>

                          </div>

                        )}

                      </div>

                    </div>


                    <h3 className="mt-5 text-xl font-black text-gray-900">
                      {assembly.name}
                    </h3>


                    <p className="mt-2 text-sm font-bold text-green-700">
                      📍 {assembly.city}
                    </p>


                    {/* SLOGAN */}

                    {assembly.slogan && (

                      <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3">

                        <p className="text-[10px] font-black uppercase tracking-wider text-yellow-700">
                          Slogan
                        </p>

                        <p className="mt-1 text-sm font-bold italic text-gray-800">
                          «{" "}
                          {assembly.slogan}{" "}
                          »
                        </p>

                      </div>

                    )}


                    {/* RESPONSABLE */}

                    {assembly.pastor && (

                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">

                        <span className="text-sm">
                          👤
                        </span>

                        <p className="text-xs font-bold text-gray-600">
                          {assembly.pastor}
                        </p>

                      </div>

                    )}


                    {/* DESCRIPTION */}

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                      {assembly.description}
                    </p>


                    {/* PHOTOS */}

                    {Array.isArray(
                      assembly.photos
                    ) &&
                      assembly.photos
                        .length >
                        0 && (

                        <div className="mt-4 flex items-center gap-2">

                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                            📷
                          </span>

                          <div>

                            <p className="text-xs font-black text-gray-700">
                              Galerie du temple
                            </p>

                            <p className="text-[11px] text-gray-400">

                              {
                                assembly
                                  .photos
                                  .length
                              }{" "}
                              photo
                              {assembly
                                .photos
                                .length >
                              1
                                ? "s"
                                : ""}

                            </p>

                          </div>

                        </div>

                      )}


                    {/* INFORMATIONS */}

                    {(assembly.address ||
                      assembly.phone) && (

                      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">

                        {assembly.address && (

                          <p className="text-xs text-gray-500">
                            📍{" "}
                            {
                              assembly.address
                            }
                          </p>

                        )}

                        {assembly.phone && (

                          <p className="text-xs text-gray-500">
                            ☎️{" "}
                            {
                              assembly.phone
                            }
                          </p>

                        )}

                      </div>

                    )}


                    {/* ACTIONS */}

                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <button
                        onClick={() =>
                          handleEdit(
                            assembly
                          )
                        }
                        className="rounded-2xl border border-green-700 px-4 py-3 text-sm font-bold text-green-900 transition hover:bg-green-950 hover:text-white"
                      >
                        ✏️ Modifier
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(
                            assembly.id
                          )
                        }
                        className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        🗑️ Supprimer
                      </button>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>


          {/* AUCUNE ASSEMBLÉE */}

          {assemblies.length ===
            0 && (

            <div className="rounded-[30px] border border-gray-200/70 bg-white p-16 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-green-50 text-4xl">
                🏛️
              </div>

              <h3 className="mt-5 text-2xl font-black text-gray-900">
                Aucune assemblée
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Cliquez sur « Ajouter une assemblée »
                pour commencer à créer votre répertoire.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-6 rounded-2xl bg-green-950 px-6 py-3 font-bold text-white shadow-lg"
              >
                + Ajouter une assemblée
              </button>

            </div>

          )}

        </section>


        {/* =====================================================
            NOTE
        ===================================================== */}

        <div className="mt-8 rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
              💡
            </div>

            <div>

              <p className="text-sm font-black text-yellow-900">
                Stockage optimisé
              </p>

              <p className="mt-1 text-xs leading-6 text-yellow-800/70">

                Les images sont automatiquement
                compressées avant d'être conservées
                dans le navigateur. Vous pouvez ajouter
                jusqu'à {MAX_PHOTOS} photos par assemblée.

                <br />

                Pour une version professionnelle,
                nous pourrons ensuite déplacer les
                images vers le serveur et MySQL afin
                de ne plus dépendre de la limite de
                stockage du navigateur.

              </p>

            </div>

          </div>

        </div>

      </main>


      {/* =====================================================
          NAVIGATION BASSE
      ===================================================== */}

      <AdminSidebar />

    </div>
  )
}

export default Assembles