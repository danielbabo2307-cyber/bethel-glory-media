
import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { useEffect, useState } from "react"
import api from "../../services/api"

// ==================================================
// URL DU SERVEUR
// ==================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
// ==================================================
// FONCTIONS AUTORISÉES
// ==================================================

const fonctions = [
  {
    value: "pasteur",
    label: "Pasteur",
  },
  {
    value: "apotre",
    label: "Apôtre",
  },
  {
    value: "ancien_principal",
    label: "Ancien principal",
  },
  {
    value: "ancien_second",
    label: "Ancien second",
  },
  {
    value: "diacre",
    label: "Diacre",
  },
  {
    value: "diaconesse",
    label: "Diaconesse",
  },
]

// ==================================================
// FORMULAIRE INITIAL
// ==================================================

const formInitial = {
  prenom: "",
  nom: "",
  fonction: "",
  email: "",
  telephone: "",
  photo: null,
}

// ==================================================
// COMPOSANT
// ==================================================

function Responsables() {
  const [responsables, setResponsables] = useState([])
  const [formData, setFormData] = useState(formInitial)

  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [photoPreview, setPhotoPreview] = useState(null)

  // ==================================================
  // URL PHOTO
  // ==================================================

  const getPhotoUrl = (photo) => {
    if (!photo) {
      return null
    }

    let photoPath = String(photo).trim()

    if (!photoPath) {
      return null
    }

    // URL complète
    if (
      photoPath.startsWith("http://") ||
      photoPath.startsWith("https://")
    ) {
      return `${photoPath}${
        photoPath.includes("?") ? "&" : "?"
      }v=${Date.now()}`
    }

    photoPath = photoPath.replace(/\\/g, "/")
    photoPath = photoPath.replace(/^\.\/+/, "")

    // uploads/...
    if (photoPath.startsWith("uploads/")) {
      photoPath = `/${photoPath}`
    }

    // responsables/...
    if (photoPath.startsWith("responsables/")) {
      photoPath = `/uploads/${photoPath}`
    }

    // /uploads/...
    if (!photoPath.startsWith("/")) {
      photoPath = `/${photoPath}`
    }

    return `${API_URL}${photoPath}${
      photoPath.includes("?") ? "&" : "?"
    }v=${Date.now()}`
  }

  // ==================================================
  // RÉCUPÉRER LES RESPONSABLES
  // ==================================================

  const fetchResponsables = async () => {
    try {
      setLoading(true)
      setError("")

      console.log("📡 Chargement des responsables...")

const response = await api.get("/responsables/public")
      const result = response.data

      console.log("📦 Réponse responsables :", result)

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Erreur de récupération des responsables."
        )
      }

      // IMPORTANT :
      // Le backend actuel renvoie :
      // { success: true, responsables: [...] }
      const data = Array.isArray(result.responsables)
        ? result.responsables
        : []

      console.log(
        "👥 Nombre de responsables :",
        data.length
      )

      data.forEach((responsable) => {
        const url = getPhotoUrl(responsable.photo)

        console.log(
          `👤 ${responsable.prenom || ""} ${
            responsable.nom || ""
          }`,
          "PHOTO =",
          responsable.photo
        )

        console.log("🖼️ URL PHOTO =", url)
      })
      console.log("👥 RESPONSABLES REÇUS :", data)
console.log("🔢 NOMBRE REÇU :", data.length)

      setResponsables(data)
    } catch (err) {
      console.error(
        "❌ Erreur récupération responsables :",
        err
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur de récupération des responsables."
      )

      setResponsables([])
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // CHARGEMENT INITIAL
  // ==================================================

  useEffect(() => {
    fetchResponsables()
  }, [])

  // ==================================================
  // CHANGEMENT INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ==================================================
  // CHANGEMENT PHOTO
  // ==================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        photo: null,
      }))

      setPhotoPreview(null)

      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Format non accepté. Utilisez JPG, PNG ou WEBP."
      )

      e.target.value = ""

      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        "La photo ne doit pas dépasser 5 Mo."
      )

      e.target.value = ""

      return
    }

    setError("")

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }))

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    const previewUrl = URL.createObjectURL(file)

    setPhotoPreview(previewUrl)

    console.log(
      "📸 Nouvelle photo sélectionnée :",
      file.name
    )

    console.log("📦 Type :", file.type)
    console.log("📏 Taille :", file.size)
  }

  // ==================================================
  // NETTOYAGE APERÇU PHOTO
  // ==================================================

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  // ==================================================
  // AJOUTER / MODIFIER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage("")
    setError("")

    try {
      // ================================================
      // VALIDATIONS
      // ================================================

      if (!formData.prenom.trim()) {
        throw new Error("Le prénom est obligatoire.")
      }

      if (!formData.nom.trim()) {
        throw new Error("Le nom est obligatoire.")
      }

      if (!formData.fonction) {
        throw new Error("Veuillez sélectionner une fonction.")
      }

      const fonctionValide = fonctions.some(
        (fonction) =>
          fonction.value === formData.fonction
      )

      if (!fonctionValide) {
        throw new Error(
          "La fonction sélectionnée n'est pas valide."
        )
      }

      // ================================================
      // FORM DATA
      // ================================================

      const data = new FormData()

      data.append(
        "prenom",
        formData.prenom.trim()
      )

      data.append(
        "nom",
        formData.nom.trim()
      )

      data.append(
        "fonction",
        formData.fonction
      )

      data.append(
        "email",
        formData.email?.trim() || ""
      )

      data.append(
        "telephone",
        formData.telephone?.trim() || ""
      )

      // ================================================
      // PHOTO
      // ================================================

      if (formData.photo instanceof File) {
        console.log(
          "📸 PHOTO ENVOYÉE AU SERVEUR"
        )

        console.log(
          "Nom :",
          formData.photo.name
        )

        console.log(
          "Type :",
          formData.photo.type
        )

        console.log(
          "Taille :",
          formData.photo.size
        )

        data.append(
          "photo",
          formData.photo,
          formData.photo.name
        )
      } else {
        console.log(
          "ℹ️ Aucune nouvelle photo sélectionnée"
        )
      }

      console.log(
        "📤 Envoi responsable :",
        {
          mode: editingId
            ? "MODIFICATION"
            : "AJOUT",
          id: editingId,
          prenom: formData.prenom,
          nom: formData.nom,
          fonction: formData.fonction,
          email: formData.email,
          telephone: formData.telephone,
          photo: formData.photo,
        }
      )

      // ================================================
      // REQUÊTE API
      // ================================================

      let response

      if (!editingId) {
        response = await api.post(
          "/responsables",
          data
        )
      } else {
        response = await api.put(
          `/responsables/${editingId}`,
          data
        )
      }

      const result = response.data

      console.log(
        "📥 Réponse serveur :",
        result
      )

      // ================================================
      // VÉRIFICATION
      // ================================================

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Impossible d'enregistrer le responsable."
        )
      }

      // ================================================
      // PHOTO RETOUR SERVEUR
      // ================================================

      console.log(
        "🖼️ PHOTO RETOUR SERVEUR :",
        result.photo
      )

      // ================================================
      // MESSAGE
      // ================================================

      setMessage(
        editingId
          ? "Responsable modifié avec succès."
          : "Responsable ajouté avec succès."
      )

      // ================================================
      // RESET
      // ================================================

      setFormData({
        ...formInitial,
      })

      setEditingId(null)

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }

      setPhotoPreview(null)

      // ================================================
      // RECHARGER LA LISTE
      // ================================================

      await fetchResponsables()
    } catch (err) {
      console.error(
        "❌ Erreur enregistrement :",
        err
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue."
      )
    } finally {
      setSaving(false)
    }
  }

  // ==================================================
  // MODIFIER
  // ==================================================

  const handleEdit = (responsable) => {
    console.log(
      "✏️ Modification responsable :",
      responsable
    )

    setEditingId(responsable.id)

    setFormData({
      prenom: responsable.prenom || "",
      nom: responsable.nom || "",
      fonction: responsable.fonction || "",
      email: responsable.email || "",
      telephone: responsable.telephone || "",
      photo: null,
    })

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    setPhotoPreview(null)

    setMessage("")
    setError("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ==================================================
  // SUPPRIMER
  // ==================================================

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce responsable ?"
    )

    if (!confirmation) {
      return
    }

    try {
      setError("")
      setMessage("")

      console.log(
        "🗑️ Suppression responsable :",
        id
      )

      const response = await api.delete(
        `/responsables/${id}`
      )

      const result = response.data

      console.log(
        "📥 Réponse suppression :",
        result
      )

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Impossible de supprimer."
        )
      }

      setMessage(
        "Responsable supprimé avec succès."
      )

      await fetchResponsables()
    } catch (err) {
      console.error(
        "❌ Erreur suppression :",
        err
      )

      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer le responsable."
      )
    }
  }

  // ==================================================
  // RESET FORMULAIRE
  // ==================================================

  const resetForm = () => {
    setFormData({
      ...formInitial,
    })

    setEditingId(null)

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }

    setPhotoPreview(null)

    setMessage("")
    setError("")
  }

  // ==================================================
  // LABEL FONCTION
  // ==================================================

  const getFonctionLabel = (fonction) => {
    const item = fonctions.find(
      (f) => f.value === fonction
    )

    return item
      ? item.label
      : fonction || "Responsable"
  }

  // ==================================================
  // RESPONSABLE EN COURS DE MODIFICATION
  // ==================================================

  const editingResponsable = editingId
    ? responsables.find(
        (r) => r.id === editingId
      )
    : null

  // ==================================================
  // PHOTO ACTUELLE
  // ==================================================

  const currentPhotoUrl =
    editingResponsable?.photo
      ? getPhotoUrl(
          editingResponsable.photo
        )
      : null

  // ==================================================
  // RENDU
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f6f7f5] pb-32">

      {/* ==================================================
          HEADER
      ================================================== */}

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
                Responsables
              </h1>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-4 py-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-xs font-bold text-green-800">
              {responsables.length} responsable(s)
            </span>

          </div>

        </div>

      </header>

      {/* ==================================================
          CONTENU
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="overflow-hidden rounded-[32px] bg-green-950 p-7 text-white shadow-xl sm:p-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-green-100">

                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />

                Équipe de direction

              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">

                Les responsables
                <br />
                de votre assemblée.

              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-green-100/75 sm:text-base">

                Gérez les responsables, leurs fonctions,
                leurs coordonnées et leurs photos depuis
                votre espace d'administration.

              </p>

            </div>

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] border border-yellow-400/30 bg-white/10 text-5xl shadow-inner">
              👥
            </div>

          </div>

        </section>

        {/* ==================================================
            STATISTIQUES
        ================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Responsables
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
                👥
              </span>

            </div>

            <p className="mt-4 text-3xl font-black text-green-950">
              {responsables.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Enregistrés
            </p>

          </div>

          <div className="rounded-[24px] border border-gray-200/70 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Fonctions
              </p>

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
                ✦
              </span>

            </div>

            <p className="mt-4 text-3xl font-black text-green-950">
              {fonctions.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Fonctions disponibles
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
              API connectée
            </p>

          </div>

        </section>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        {message && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            ❌ {error}
          </div>
        )}

        {/* ==================================================
            FORMULAIRE
        ================================================== */}

        <section className="mt-8 overflow-hidden rounded-[30px] border border-gray-200/70 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-6 sm:p-8">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                  {editingId
                    ? "Modification"
                    : "Nouvel enregistrement"}
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900">

                  {editingId
                    ? "Modifier le responsable"
                    : "Ajouter un responsable"}

                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Renseignez les informations du responsable.
                </p>

              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
                >
                  ✕ Annuler la modification
                </button>
              )}

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* PRÉNOM */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Prénom
                </label>

                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex : Jonas"
                  required
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>

              {/* NOM */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Nom
                </label>

                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex : YOBOUE"
                  required
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>

              {/* FONCTION */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Fonction
                </label>

                <select
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                >

                  <option value="">
                    Sélectionnez une fonction
                  </option>

                  {fonctions.map((fonction) => (
                    <option
                      key={fonction.value}
                      value={fonction.value}
                    >
                      {fonction.label}
                    </option>
                  ))}

                </select>

              </div>

              {/* EMAIL */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex : pasteur@email.com"
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
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Ex : 07 00 00 00 00"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

              </div>

              {/* PHOTO */}

              <div>

                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Photo du responsable
                </label>

                <label className="mt-2 flex min-h-[54px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition hover:border-green-600 hover:bg-green-50">

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    📷
                  </span>

                  <div>

                    <p className="text-sm font-bold text-gray-700">
                      Choisir une photo
                    </p>

                    <p className="text-[10px] text-gray-400">
                      JPG, PNG ou WEBP • 5 Mo maximum
                    </p>

                  </div>

                  <input
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </label>

              </div>

            </div>

            {/* ==================================================
                APERÇU PHOTO
            ================================================== */}

            {photoPreview && (
              <div className="mt-6 rounded-[24px] bg-green-50 p-5">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  <img
                    src={photoPreview}
                    alt="Aperçu de la nouvelle photo"
                    className="h-32 w-32 rounded-2xl object-cover shadow-md"
                  />

                  <div>

                    <p className="text-sm font-black text-green-900">
                      📸 Nouvelle photo sélectionnée
                    </p>

                    <p className="mt-1 text-xs leading-6 text-green-800/70">
                      Cette photo sera envoyée au serveur lors
                      de l'enregistrement.
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                PHOTO ACTUELLE
            ================================================== */}

            {editingId &&
              !photoPreview &&
              currentPhotoUrl && (
                <div className="mt-6 rounded-[24px] bg-gray-50 p-5">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    <img
                      src={currentPhotoUrl}
                      alt="Photo actuelle"
                      className="h-32 w-32 rounded-2xl object-cover shadow-md"
                      onLoad={() => {
                        console.log(
                          "✅ Photo actuelle chargée :",
                          currentPhotoUrl
                        )
                      }}
                      onError={(e) => {
                        console.error(
                          "❌ Photo actuelle introuvable :",
                          currentPhotoUrl
                        )

                        console.error(
                          "📁 Valeur API :",
                          editingResponsable?.photo
                        )

                        e.currentTarget.style.display =
                          "none"
                      }}
                    />

                    <div>

                      <p className="text-sm font-black text-gray-800">
                        🖼️ Photo actuelle
                      </p>

                      <p className="mt-1 text-xs leading-6 text-gray-500">
                        Laissez le champ photo vide pour
                        conserver cette photo.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            {/* ==================================================
                AUCUNE PHOTO
            ================================================== */}

            {editingId &&
              !photoPreview &&
              !currentPhotoUrl && (
                <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                  <p className="text-sm font-bold text-yellow-800">
                    ⚠️ Aucune photo actuellement enregistrée
                  </p>

                  <p className="mt-1 text-xs leading-6 text-yellow-700">
                    Sélectionnez une photo ci-dessus pour
                    ajouter une photo à ce responsable.
                  </p>

                </div>
              )}

            {/* ==================================================
                BOUTONS
            ================================================== */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-green-950 px-7 py-3.5 font-bold text-white shadow-lg shadow-green-950/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "⏳ Enregistrement..."
                  : editingId
                    ? "✓ Enregistrer les modifications"
                    : "+ Enregistrer le responsable"}

              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-gray-200 px-7 py-3.5 font-bold text-gray-600 transition hover:bg-gray-100"
              >

                {editingId
                  ? "Annuler"
                  : "Réinitialiser"}

              </button>

            </div>

          </form>

        </section>

        {/* ==================================================
            LISTE DES RESPONSABLES
        ================================================== */}

        <section className="mt-10">

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
                Répertoire
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-900">
                Responsables enregistrés
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {responsables.length} responsable(s)
                enregistré(s)
              </p>

            </div>

          </div>

          {/* CHARGEMENT */}

          {loading && (
            <div className="rounded-[30px] border border-gray-200/70 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-green-900" />

              <p className="text-sm font-semibold text-gray-500">
                Chargement des responsables...
              </p>

            </div>
          )}

          {/* AUCUN RESPONSABLE */}

          {!loading &&
            responsables.length === 0 && (
              <div className="rounded-[30px] border border-gray-200/70 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-green-50 text-4xl">
                  👥
                </div>

                <h3 className="mt-5 text-xl font-black text-gray-900">
                  Aucun responsable
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Aucun responsable n'est actuellement
                  enregistré dans votre assemblée.
                </p>

              </div>
            )}

          {/* RESPONSABLES */}

          {!loading &&
            responsables.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {responsables.map((responsable) => {

                  const photoUrl =
                    getPhotoUrl(
                      responsable.photo
                    )

                  return (
                    <article
                      key={responsable.id}
                      className="group overflow-hidden rounded-[30px] border border-gray-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* PHOTO */}

                      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-green-950">

                        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-700" />

                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />

                        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full border border-yellow-400/10" />

                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${responsable.prenom || ""} ${
                              responsable.nom || ""
                            }`}
                            className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                            onLoad={() => {
                              console.log(
                                "✅ PHOTO AFFICHÉE :",
                                responsable.prenom,
                                responsable.nom,
                                photoUrl
                              )
                            }}
                            onError={(e) => {
                              console.error(
                                "❌ PHOTO NON AFFICHÉE :",
                                responsable.prenom,
                                responsable.nom
                              )

                              console.error(
                                "📁 PHOTO API :",
                                responsable.photo
                              )

                              console.error(
                                "🌐 URL :",
                                photoUrl
                              )

                              e.currentTarget.style.display =
                                "none"

                              const parent =
                                e.currentTarget.parentElement

                              if (
                                parent &&
                                !parent.querySelector(
                                  ".photo-error"
                                )
                              ) {
                                const placeholder =
                                  document.createElement(
                                    "div"
                                  )

                                placeholder.className =
                                  "photo-error relative z-10 flex h-full w-full items-center justify-center"

                                placeholder.innerHTML =
                                  `<span class="text-7xl">👤</span>`

                                parent.appendChild(
                                  placeholder
                                )
                              }
                            }}
                          />
                        ) : (
                          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">

                            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border-2 border-yellow-400 bg-white/10 text-6xl text-yellow-400 shadow-xl">
                              👤
                            </div>

                            <p className="mt-3 text-xs font-bold text-white/60">
                              Aucune photo
                            </p>

                          </div>
                        )}

                      </div>

                      {/* INFORMATIONS */}

                      <div className="p-6">

                        <div className="flex items-center justify-between gap-3">

                          <span className="rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-green-800">
                            {getFonctionLabel(
                              responsable.fonction
                            )}
                          </span>

                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-xs text-green-700">
                            ✓
                          </span>

                        </div>

                        <h3 className="mt-4 text-2xl font-black text-gray-900">

                          {responsable.prenom}{" "}
                          {responsable.nom}

                        </h3>

                        <div className="mt-4 space-y-2">

                          {responsable.email && (
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">

                              <span className="text-sm">
                                📧
                              </span>

                              <p className="truncate text-xs font-semibold text-gray-600">
                                {responsable.email}
                              </p>

                            </div>
                          )}

                          {responsable.telephone && (
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">

                              <span className="text-sm">
                                📞
                              </span>

                              <p className="text-xs font-semibold text-gray-600">
                                {responsable.telephone}
                              </p>

                            </div>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-6 grid grid-cols-2 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                responsable
                              )
                            }
                            className="rounded-2xl border border-green-700 px-4 py-3 text-sm font-bold text-green-900 transition hover:bg-green-950 hover:text-white"
                          >
                            ✏️ Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                responsable.id
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
                })}

              </div>
            )}

        </section>

        {/* ==================================================
            NOTE
        ================================================== */}

        <div className="mt-8 rounded-[24px] border border-yellow-200 bg-yellow-50 p-5">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
              💡
            </div>

            <div>

              <p className="text-sm font-black text-yellow-900">
                Gestion des responsables
              </p>

              <p className="mt-1 text-xs leading-6 text-yellow-800/70">

                Les responsables sont enregistrés directement
                via votre API. Les photos sont envoyées au serveur
                et affichées automatiquement dans le répertoire.

              </p>

            </div>

          </div>

        </div>

      </main>

      {/* ==================================================
          NAVIGATION BASSE
      ================================================== */}

      <AdminSidebar />

    </div>
  )
}

export default Responsables
