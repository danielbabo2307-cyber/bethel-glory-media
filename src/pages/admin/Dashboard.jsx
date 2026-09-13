import AdminSidebar from "../../components/admin/AdminSidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import dani from "../../assets/dani.jpg"

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"

// ==================================================
// PHOTO
// ==================================================

const getPhotoUrl = (photo) => {
  if (!photo) return null

  const photoString = String(photo).trim()

  if (!photoString) return null

  if (
    photoString.startsWith("http://") ||
    photoString.startsWith("https://")
  ) {
    return photoString
  }

  const cleanPath = photoString.startsWith("/")
    ? photoString
    : `/${photoString}`

  return `${API_URL}${cleanPath}`
}

// ==================================================
// FONCTION RESPONSABLE
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
// UTILISATEUR CONNECTÉ
// ==================================================

const getUtilisateur = () => {
  let userString = localStorage.getItem("user")

  if (!userString) {
    userString = localStorage.getItem("utilisateur")
  }

  if (!userString) {
    console.warn(
      "⚠️ Aucun utilisateur trouvé dans localStorage."
    )

    return null
  }

  try {
    const utilisateur = JSON.parse(userString)

    console.log(
      "💾 UTILISATEUR LU DEPUIS LOCALSTORAGE :",
      utilisateur
    )

    return utilisateur
  } catch (error) {
    console.error(
      "❌ Impossible de lire l'utilisateur :",
      error
    )

    return null
  }
}

// ==================================================
// DATE
// ==================================================

const getDateActuelle = () => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

// ==================================================
// NORMALISER UNE RECHERCHE
// ==================================================

const normaliserRecherche = (texte) => {
  return String(texte || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

// ==================================================
// TYPE NOTIFICATION
// ==================================================

const getNotificationIcon = (type) => {
  switch (type) {
    case "utilisateur":
      return "👤"

    case "publication":
      return "🖼️"

    case "programme":
      return "📅"

    case "responsable":
      return "👥"

    case "eglise":
      return "⛪"

    case "assemblee":
      return "🏛️"

    case "contact":
      return "📩"

    case "message":
      return "💬"

    case "success":
      return "✓"

    case "warning":
      return "⚠️"

    default:
      return "🔔"
  }
}

// ==================================================
// DATE NOTIFICATION
// ==================================================

const formatDateNotification = (date) => {
  if (!date) return ""

  const dateObj = new Date(date)

  if (Number.isNaN(dateObj.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

// ==================================================
// TEMPS RELATIF NOTIFICATION
// ==================================================

const getTempsNotification = (date) => {
  if (!date) return ""

  const dateNotification = new Date(date)

  if (Number.isNaN(dateNotification.getTime())) {
    return ""
  }

  const difference = Math.max(
    0,
    Date.now() - dateNotification.getTime()
  )

  const minutes = Math.floor(
    difference / 60000
  )

  if (minutes < 1) {
    return "À l'instant"
  }

  if (minutes < 60) {
    return `Il y a ${minutes} min`
  }

  const heures = Math.floor(minutes / 60)

  if (heures < 24) {
    return `Il y a ${heures} h`
  }

  const jours = Math.floor(heures / 24)

  if (jours < 7) {
    return `Il y a ${jours} j`
  }

  return dateNotification.toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )
}

// ==================================================
// NORMALISER UNE NOTIFICATION
// ==================================================

const normaliserNotification = (
  notification,
  index = 0
) => {
  return {
    ...notification,

    id:
      notification.id ??
      `notification-${index}`,

    type:
      notification.type ||
      "message",

    titre:
      notification.titre ||
      notification.title ||
      "Nouvelle notification",

    message:
      notification.message ||
      "",

    lu:
      Number(notification.lu) === 1 ||
      notification.lu === true,

    created_at:
      notification.created_at ||
      notification.createdAt ||
      new Date().toISOString(),
  }
}

// ==================================================
// DASHBOARD
// ==================================================

function Dashboard() {
  const navigate = useNavigate()

  // ==================================================
  // RESPONSABLES
  // ==================================================

  const [responsables, setResponsables] =
    useState([])

  const [
    loadingResponsables,
    setLoadingResponsables,
  ] = useState(true)

  const [
    errorResponsables,
    setErrorResponsables,
  ] = useState("")

  // ==================================================
  // AJOUT RESPONSABLE
  // ==================================================

  const [
    showAjoutResponsable,
    setShowAjoutResponsable,
  ] = useState(false)

  const [
    ajoutResponsable,
    setAjoutResponsable,
  ] = useState({
    nom: "",
    prenom: "",
    fonction: "pasteur",
  })

  const [
    photoResponsable,
    setPhotoResponsable,
  ] = useState(null)

  const [
    previewPhotoResponsable,
    setPreviewPhotoResponsable,
  ] = useState(null)

  const [
    loadingAjoutResponsable,
    setLoadingAjoutResponsable,
  ] = useState(false)

  const [
    messageAjoutResponsable,
    setMessageAjoutResponsable,
  ] = useState({
    type: "",
    texte: "",
  })

  // ==================================================
  // UTILISATEUR CONNECTÉ
  // ==================================================

  const [
    utilisateur,
    setUtilisateur,
  ] = useState(null)

  const [
    loadingUtilisateur,
    setLoadingUtilisateur,
  ] = useState(true)

  // ==================================================
  // AUTRES ÉTATS
  // ==================================================

  const [
    deconnexion,
    setDeconnexion,
  ] = useState(false)

  const [
    recherche,
    setRecherche,
  ] = useState("")

  // ==================================================
  // NOTIFICATIONS
  // ==================================================

  const [
    notifications,
    setNotifications,
  ] = useState([])

  const [
    notificationsNonLues,
    setNotificationsNonLues,
  ] = useState(0)

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false)

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] = useState(false)

  // ==================================================
  // RÉCUPÉRER L'UTILISATEUR
  // ==================================================

  const fetchUtilisateur = async () => {
    try {
      setLoadingUtilisateur(true)

      const utilisateurLocal =
        getUtilisateur()

      console.log(
        "💾 UTILISATEUR LOCAL :",
        utilisateurLocal
      )

      if (!utilisateurLocal?.id) {
        console.error(
          "❌ Aucun ID utilisateur trouvé dans localStorage."
        )

        setUtilisateur(null)

        return
      }

      console.log(
        "👤 Récupération de l'utilisateur ID :",
        utilisateurLocal.id
      )

      const response = await api.get(
        `/utilisateurs/${utilisateurLocal.id}`
      )

      console.log(
        "📥 RÉPONSE UTILISATEUR DEPUIS LA BASE :",
        response.data
      )

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Impossible de récupérer l'utilisateur."
        )
      }

      const userData =
        response.data?.data

      if (!userData) {
        throw new Error(
          "Les informations utilisateur sont absentes."
        )
      }

      console.log(
        "✅ UTILISATEUR RÉCUPÉRÉ DEPUIS LA BASE :",
        userData
      )

      setUtilisateur(userData)

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      )

      localStorage.setItem(
        "utilisateur",
        JSON.stringify(userData)
      )
    } catch (error) {
      console.error(
        "❌ ERREUR RÉCUPÉRATION UTILISATEUR :",
        error.response?.data ||
          error.message
      )

      const utilisateurLocal =
        getUtilisateur()

      if (utilisateurLocal) {
        console.log(
          "⚠️ Utilisation des données locales."
        )

        setUtilisateur(
          utilisateurLocal
        )
      } else {
        setUtilisateur(null)
      }
    } finally {
      setLoadingUtilisateur(false)
    }
  }

  // ==================================================
  // DÉCONNEXION
  // ==================================================

  const handleLogout = () => {
    setDeconnexion(true)
  }

  // ==================================================
  // ANNULER LA DÉCONNEXION
  // ==================================================

  const annulerDeconnexion = () => {
    setDeconnexion(false)
  }

  // ==================================================
  // CONFIRMER LA DÉCONNEXION
  // ==================================================

  const confirmerDeconnexion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("utilisateur")

    console.log(
      "🚪 Déconnexion effectuée."
    )

    setDeconnexion(false)

    navigate("/", {
      replace: true,
    })
  }

  // ==================================================
  // OUVRIR MODALE AJOUT RESPONSABLE
  // ==================================================

  const ouvrirAjoutResponsable = () => {
    setAjoutResponsable({
      nom: "",
      prenom: "",
      fonction: "pasteur",
    })

    setPhotoResponsable(null)
    setPreviewPhotoResponsable(null)

    setMessageAjoutResponsable({
      type: "",
      texte: "",
    })

    setShowAjoutResponsable(true)
  }

  // ==================================================
  // FERMER MODALE AJOUT RESPONSABLE
  // ==================================================

  const fermerAjoutResponsable = () => {
    if (loadingAjoutResponsable) {
      return
    }

    setShowAjoutResponsable(false)

    setAjoutResponsable({
      nom: "",
      prenom: "",
      fonction: "pasteur",
    })

    setPhotoResponsable(null)
    setPreviewPhotoResponsable(null)

    setMessageAjoutResponsable({
      type: "",
      texte: "",
    })
  }

  // ==================================================
  // CHANGEMENT CHAMP RESPONSABLE
  // ==================================================

  const handleResponsableChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target

    setAjoutResponsable(
      (ancien) => ({
        ...ancien,
        [name]: value,
      })
    )
  }

  // ==================================================
  // CHOIX PHOTO
  // ==================================================

  const handlePhotoResponsableChange = (
    event
  ) => {
    const fichier =
      event.target.files?.[0]

    if (!fichier) {
      return
    }

    if (!fichier.type.startsWith("image/")) {
      setMessageAjoutResponsable({
        type: "error",
        texte:
          "Veuillez sélectionner une image.",
      })

      return
    }

    if (
      fichier.size >
      50 * 1024 * 1024
    ) {
      setMessageAjoutResponsable({
        type: "error",
        texte:
          "La photo ne doit pas dépasser 50 Mo.",
      })

      return
    }

    if (previewPhotoResponsable) {
      URL.revokeObjectURL(
        previewPhotoResponsable
      )
    }

    setPhotoResponsable(fichier)

    const url =
      URL.createObjectURL(fichier)

    setPreviewPhotoResponsable(url)

    setMessageAjoutResponsable({
      type: "",
      texte: "",
    })
  }

  // ==================================================
  // RESPONSABLES
  // ==================================================

  const fetchResponsables = async () => {
    try {
      setLoadingResponsables(true)
      setErrorResponsables("")

      console.log(
        "📡 Chargement des responsables..."
      )

      // IMPORTANT :
      // Le Dashboard lit simplement les responsables.
      // La route publique permet de les récupérer
      // sans exiger l'authentification administrateur.
      const response = await api.get(
        "/responsables/public"
      )

      console.log(
        "📥 RÉPONSE BRUTE RESPONSABLES :",
        response
      )

      console.log(
        "📦 DONNÉES RESPONSABLES :",
        response.data
      )

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Impossible de récupérer les responsables."
        )
      }

      const data =
        response.data.responsables

      if (!Array.isArray(data)) {
        console.error(
          "❌ response.data.responsables n'est pas un tableau :",
          data
        )

        throw new Error(
          "Le serveur a retourné un format de responsables invalide."
        )
      }

      console.log(
        "👥 Responsables reçus :",
        data
      )

      console.log(
        "✅ Nombre de responsables chargés :",
        data.length
      )

      data.forEach(
        (responsable, index) => {
          console.log(
            `👤 Responsable ${index + 1} :`,
            responsable
          )
        }
      )

      setResponsables(data)
    } catch (error) {
      console.error(
        "❌ ERREUR RESPONSABLES :",
        error
      )

      console.error(
        "❌ RÉPONSE SERVEUR :",
        error.response?.data
      )

      setErrorResponsables(
        error.response?.data?.message ||
          error.message ||
          "Erreur de récupération des responsables."
      )

      setResponsables([])
    } finally {
      setLoadingResponsables(false)
    }
  }

  // ==================================================
  // AJOUT RESPONSABLE
  // ==================================================

  const ajouterResponsable = async (
    event
  ) => {
    event.preventDefault()

    const nom =
      ajoutResponsable.nom.trim()

    const prenom =
      ajoutResponsable.prenom.trim()

    const fonction =
      ajoutResponsable.fonction

    if (
      !nom ||
      !prenom ||
      !fonction
    ) {
      setMessageAjoutResponsable({
        type: "error",
        texte:
          "Le nom, le prénom et la fonction sont obligatoires.",
      })

      return
    }

    try {
      setLoadingAjoutResponsable(true)

      setMessageAjoutResponsable({
        type: "",
        texte: "",
      })

      const formulaire =
        new FormData()

      formulaire.append(
        "nom",
        nom
      )

      formulaire.append(
        "prenom",
        prenom
      )

      formulaire.append(
        "fonction",
        fonction
      )

      if (photoResponsable) {
        formulaire.append(
          "photo",
          photoResponsable
        )
      }

      console.log(
        "📤 AJOUT RESPONSABLE :",
        {
          nom,
          prenom,
          fonction,
          photo:
            photoResponsable?.name ||
            null,
        }
      )

      // IMPORTANT :
      // L'ajout reste protégé.
      const response =
        await api.post(
          "/responsables",
          formulaire
        )

      console.log(
        "📥 RÉPONSE AJOUT RESPONSABLE :",
        response.data
      )

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Impossible d'ajouter le responsable."
        )
      }

      setMessageAjoutResponsable({
        type: "success",
        texte:
          response.data?.message ||
          "Responsable ajouté avec succès.",
      })

      await fetchResponsables()

      setAjoutResponsable({
        nom: "",
        prenom: "",
        fonction: "pasteur",
      })

      setPhotoResponsable(null)

      if (previewPhotoResponsable) {
        URL.revokeObjectURL(
          previewPhotoResponsable
        )
      }

      setPreviewPhotoResponsable(null)

      setTimeout(() => {
        setShowAjoutResponsable(false)

        setMessageAjoutResponsable({
          type: "",
          texte: "",
        })
      }, 1200)
    } catch (error) {
      console.error(
        "❌ ERREUR AJOUT RESPONSABLE :",
        error
      )

      console.error(
        "❌ RÉPONSE SERVEUR :",
        error.response?.data
      )

      setMessageAjoutResponsable({
        type: "error",
        texte:
          error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'ajout du responsable.",
      })
    } finally {
      setLoadingAjoutResponsable(false)
    }
  }

  // ==================================================
  // RÉCUPÉRER LES NOTIFICATIONS
  // ==================================================

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)

      console.log(
        "🔔 Chargement des notifications..."
      )

      const response = await api.get(
        "/notifications"
      )

      console.log(
        "📥 Réponse notifications :",
        response.data
      )

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Impossible de récupérer les notifications."
        )
      }

      const data = Array.isArray(
        response.data.data
      )
        ? response.data.data
        : []

      const notificationsNormalisees =
        data.map(
          (notification, index) =>
            normaliserNotification(
              notification,
              index
            )
        )

      notificationsNormalisees.sort(
        (a, b) => {
          const dateA = new Date(
            a.created_at
          ).getTime()

          const dateB = new Date(
            b.created_at
          ).getTime()

          return dateB - dateA
        }
      )

      setNotifications(
        notificationsNormalisees
      )

      console.log(
        "✅ Notifications chargées :",
        notificationsNormalisees.length
      )
    } catch (error) {
      console.error(
        "❌ Erreur chargement notifications :",
        error.response?.data ||
          error.message
      )

      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }

  // ==================================================
  // COMPTER LES NOTIFICATIONS NON LUES
  // ==================================================

  const fetchNotificationsNonLues =
    async () => {
      try {
        const response = await api.get(
          "/notifications/non-lues"
        )

        console.log(
          "📊 COMPTEUR NOTIFICATIONS :",
          response.data
        )

        if (!response.data?.success) {
          return
        }

        const total =
          Number(
            response.data.total ??
              response.data.nombre ??
              response.data.count
          ) || 0

        setNotificationsNonLues(
          total
        )

        console.log(
          "🔴 Notifications non lues :",
          total
        )
      } catch (error) {
        console.error(
          "❌ Erreur compteur notifications :",
          error.response?.data ||
            error.message
        )
      }
    }

  // ==================================================
  // OUVRIR / FERMER LES NOTIFICATIONS
  // ==================================================

  const ouvrirNotifications = async () => {
    const nouvelleValeur =
      !showNotifications

    setShowNotifications(
      nouvelleValeur
    )

    if (nouvelleValeur) {
      await fetchNotifications()
      await fetchNotificationsNonLues()
    }
  }

  // ==================================================
  // MARQUER UNE NOTIFICATION COMME LUE
  // ==================================================

  const marquerNotificationCommeLue =
    async (notificationId) => {
      try {
        const notification =
          notifications.find(
            (item) =>
              item.id ===
              notificationId
          )

        if (
          !notification ||
          notification.lu
        ) {
          return
        }

        await api.put(
          `/notifications/${notificationId}/lue`
        )

        setNotifications(
          (notificationsActuelles) =>
            notificationsActuelles.map(
              (item) =>
                item.id ===
                notificationId
                  ? {
                      ...item,
                      lu: 1,
                    }
                  : item
            )
        )

        setNotificationsNonLues(
          (ancienTotal) =>
            Math.max(
              0,
              ancienTotal - 1
            )
        )

        console.log(
          "✅ Notification marquée comme lue :",
          notificationId
        )
      } catch (error) {
        console.error(
          "❌ Erreur notification :",
          error.response?.data ||
            error.message
        )
      }
    }

  // ==================================================
  // MARQUER TOUTES LES NOTIFICATIONS COMME LUES
  // ==================================================

  const marquerToutesCommeLues =
    async () => {
      try {
        await api.put(
          "/notifications/lire-tout"
        )

        setNotifications(
          (notificationsActuelles) =>
            notificationsActuelles.map(
              (notification) => ({
                ...notification,
                lu: 1,
              })
            )
        )

        setNotificationsNonLues(0)

        console.log(
          "✅ Toutes les notifications sont lues."
        )
      } catch (error) {
        console.error(
          "❌ Erreur lecture notifications :",
          error.response?.data ||
            error.message
        )
      }
    }

  // ==================================================
  // CHARGEMENT INITIAL
  // ==================================================

  useEffect(() => {
    fetchUtilisateur()
    fetchResponsables()
    fetchNotifications()
    fetchNotificationsNonLues()

    const interval =
      setInterval(() => {
        fetchNotificationsNonLues()

        if (showNotifications) {
          fetchNotifications()
        }
      }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [showNotifications])

  // ==================================================
  // MODULES
  // ==================================================

  const modules = [
    {
      title: "Église",
      subtitle: "Informations",
      description:
        "Gérer les informations générales.",
      icon: "⛪",
      route: "/admin/churches",
      number: "01",
    },
    {
      title: "Assemblées",
      subtitle: "Organisation",
      description:
        "Gérer les différentes assemblées.",
      icon: "🏛️",
      route: "/admin/assemblies",
      number: "02",
    },
    {
      title: "Responsables",
      subtitle: "Équipe",
      description:
        "Gérer les pasteurs et responsables.",
      icon: "👥",
      route: "/admin/responsables",
      number: "03",
    },
    {
      title: "Programmes",
      subtitle: "Agenda",
      description:
        "Planifier les activités de l'église.",
      icon: "📅",
      route: "/admin/programs",
      number: "04",
    },
    {
      title: "Publications",
      subtitle: "Communication",
      description:
        "Créer et gérer les visuels.",
      icon: "🖼️",
      route: "/admin/publications",
      number: "05",
    },
    {
      title: "Utilisateurs",
      subtitle: "Administration",
      description:
        "Gérer les comptes administrateurs.",
      icon: "👤",
      route: "/admin/users",
      number: "06",
    },
  ]

  // ==================================================
  // RECHERCHE
  // ==================================================

  const texteRecherche =
    normaliserRecherche(recherche)

  const modulesFiltres =
    modules.filter((module) => {
      if (!texteRecherche) {
        return true
      }

      const titre =
        normaliserRecherche(
          module.title
        )

      const sousTitre =
        normaliserRecherche(
          module.subtitle
        )

      const description =
        normaliserRecherche(
          module.description
        )

      return (
        titre.includes(
          texteRecherche
        ) ||
        sousTitre.includes(
          texteRecherche
        ) ||
        description.includes(
          texteRecherche
        )
      )
    })

  const responsablesFiltres =
    responsables.filter(
      (responsable) => {
        if (!texteRecherche) {
          return true
        }

        const nom =
          normaliserRecherche(
            `${responsable.prenom || ""} ${
              responsable.nom || ""
            }`
          )

        const fonction =
          normaliserRecherche(
            getFonctionLabel(
              responsable.fonction
            )
          )

        return (
          nom.includes(
            texteRecherche
          ) ||
          fonction.includes(
            texteRecherche
          )
        )
      }
    )

  // ==================================================
  // NOM ADMINISTRATEUR
  // ==================================================

  const prenomUtilisateur =
    String(
      utilisateur?.prenom || ""
    ).trim()

  const nomUtilisateurBase =
    String(
      utilisateur?.nom || ""
    ).trim()

  const nomUtilisateur = [
    prenomUtilisateur,
    nomUtilisateurBase,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "Administrateur"

  // ==================================================
  // INITIAL
  // ==================================================

  const initialUtilisateur = (
    utilisateur?.prenom?.[0] ||
    utilisateur?.nom?.[0] ||
    "A"
  ).toUpperCase()

  // ==================================================
  // AFFICHAGE
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-gray-950">

      <AdminSidebar />

      <main className="min-h-screen pb-24">

        {/* ==================================================
            TOPBAR
        ================================================== */}

        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f7f8f6]/90 backdrop-blur-xl">

          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">

            {/* IDENTITÉ */}

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0b3328] shadow-sm">

                <img
                  src={dani}
                  alt="BETHEL GLORY"
                  className="h-10 w-10 rounded-2xl object-cover shadow-md"
                />

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-black tracking-tight text-[#0b3328]">
                  BETHEL
                </p>

                <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-gray-400">
                  GLORY MEDIA
                </p>

              </div>

            </div>

            {/* RECHERCHE DESKTOP */}

            <div className="hidden max-w-xl flex-1 px-6 md:block">

              <div className="relative">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                  ⌕
                </span>

                <input
                  type="search"
                  value={recherche}
                  onChange={(event) =>
                    setRecherche(
                      event.target.value
                    )
                  }
                  placeholder="Rechercher..."
                  aria-label="Rechercher dans l'administration"
                  className="h-11 w-full rounded-2xl border border-black/[0.06] bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#0b3328]/30 focus:ring-4 focus:ring-[#0b3328]/5"
                />

                {recherche && (
                  <button
                    type="button"
                    onClick={() =>
                      setRecherche("")
                    }
                    title="Effacer la recherche"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-sm font-black text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            {/* DROITE */}

            <div className="flex items-center gap-2">

              {/* NOTIFICATIONS */}

              <div className="relative">

                <button
                  type="button"
                  title="Notifications"
                  onClick={
                    ouvrirNotifications
                  }
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-base shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    showNotifications
                      ? "ring-4 ring-[#0b3328]/5"
                      : ""
                  }`}
                >

                  <span className="text-lg">
                    🔔
                  </span>

                  {notificationsNonLues >
                    0 && (

                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">

                      {notificationsNonLues >
                      99
                        ? "99+"
                        : notificationsNonLues}

                    </span>

                  )}

                </button>

                {/* PANNEAU NOTIFICATIONS */}

                {showNotifications && (

                  <div className="absolute right-0 top-14 z-50 w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-2xl">

                    <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">

                      <div>

                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b6b50]">
                          Centre de notifications
                        </p>

                        <h3 className="mt-1 text-base font-black text-gray-950">
                          Notifications
                        </h3>

                      </div>

                      {notificationsNonLues >
                        0 && (

                        <button
                          type="button"
                          onClick={
                            marquerToutesCommeLues
                          }
                          className="rounded-xl px-2 py-1 text-[9px] font-black text-[#0b6b50] transition hover:bg-emerald-50"
                        >
                          Tout lire
                        </button>

                      )}

                    </div>

                    <div className="max-h-[450px] overflow-y-auto">

                      {loadingNotifications && (

                        <div className="flex justify-center px-5 py-12">

                          <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#0b3328]" />

                        </div>

                      )}

                      {!loadingNotifications &&
                        notifications.length >
                          0 && (

                        <div className="divide-y divide-black/[0.05]">

                          {notifications.map(
                            (
                              notification
                            ) => (

                              <button
                                key={
                                  notification.id
                                }
                                type="button"
                                onClick={() => {

                                  if (
                                    !notification.lu
                                  ) {
                                    marquerNotificationCommeLue(
                                      notification.id
                                    )
                                  }

                                  if (
                                    notification.type ===
                                    "contact"
                                  ) {
                                    navigate(
                                      "/admin/messages"
                                    )
                                  }
                                }}
                                className={`flex w-full gap-3 px-5 py-4 text-left transition hover:bg-[#f3f7f4] ${
                                  !notification.lu
                                    ? "bg-emerald-50/50"
                                    : "bg-white"
                                }`}
                              >

                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm shadow-sm ${
                                    notification.type ===
                                    "contact"
                                      ? "bg-[#0b6b50]"
                                      : "bg-[#0b3328]"
                                  }`}
                                >

                                  {getNotificationIcon(
                                    notification.type
                                  )}

                                </div>

                                <div className="min-w-0 flex-1">

                                  <div className="flex items-start justify-between gap-2">

                                    <p className="text-xs font-black text-gray-950">
                                      {
                                        notification.titre
                                      }
                                    </p>

                                    {!notification.lu && (

                                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                                    )}

                                  </div>

                                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                                    {
                                      notification.message
                                    }
                                  </p>

                                  {notification.type ===
                                    "contact" && (

                                    <div className="mt-2 inline-flex rounded-lg bg-emerald-50 px-2 py-1">

                                      <span className="text-[9px] font-black text-[#0b6b50]">
                                        📩 Message contact
                                      </span>

                                    </div>

                                  )}

                                  <div className="mt-2 flex items-center justify-between gap-2">

                                    <p className="text-[9px] font-bold text-gray-300">
                                      {formatDateNotification(
                                        notification.created_at
                                      )}
                                    </p>

                                    <p className="text-[9px] font-bold text-[#0b6b50]">
                                      {getTempsNotification(
                                        notification.created_at
                                      )}
                                    </p>

                                  </div>

                                </div>

                              </button>

                            )
                          )}

                        </div>

                      )}

                      {!loadingNotifications &&
                        notifications.length ===
                          0 && (

                        <div className="px-5 py-12 text-center">

                          <div className="text-3xl">
                            🔔
                          </div>

                          <p className="mt-3 text-xs font-black text-gray-600">
                            Aucune notification
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            Vous êtes à jour.
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* PROFIL */}

              <div className="hidden items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 py-1.5 shadow-sm sm:flex">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0b3328] text-xs font-black text-white">

                  {initialUtilisateur}

                </div>

                <div className="max-w-32">

                  <p className="truncate text-xs font-black text-gray-900">

                    {loadingUtilisateur
                      ? "Chargement..."
                      : nomUtilisateur}

                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Administrateur
                  </p>

                </div>

              </div>

              {/* DÉCONNEXION */}

              <button
                type="button"
                onClick={handleLogout}
                title="Déconnexion"
                className="group flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0b3328] px-4 text-xs font-black text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#09281f] hover:shadow-lg active:translate-y-0"
              >

                <span className="text-base transition-transform duration-300 group-hover:translate-x-0.5">
                  ↪
                </span>

                <span className="hidden sm:inline">
                  Se déconnecter
                </span>

              </button>

            </div>

          </div>

          {/* RECHERCHE MOBILE */}

          <div className="px-4 pb-4 md:hidden">

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                ⌕
              </span>

              <input
                type="search"
                value={recherche}
                onChange={(event) =>
                  setRecherche(
                    event.target.value
                  )
                }
                placeholder="Rechercher dans l'administration..."
                aria-label="Rechercher dans l'administration"
                className="h-11 w-full rounded-2xl border border-black/[0.06] bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#0b3328]/30 focus:ring-4 focus:ring-[#0b3328]/5"
              />

              {recherche && (

                <button
                  type="button"
                  onClick={() =>
                    setRecherche("")
                  }
                  title="Effacer la recherche"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-sm font-black text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  ×
                </button>

              )}

            </div>

          </div>

        </header>

        {/* ==================================================
            PAGE
        ================================================== */}

        <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-6 sm:px-6 lg:px-10">

          {/* HERO */}

          <section className="relative mb-7 overflow-hidden rounded-[30px] bg-[#0b3328] shadow-xl">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/[0.06]" />

            <div className="absolute -bottom-28 right-24 h-64 w-64 rounded-full border border-white/[0.05]" />

            <div className="absolute right-10 top-10 hidden text-[110px] font-black leading-none text-white/[0.035] lg:block">
              B
            </div>

            <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10">

              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

                <div>

                  <div className="mb-5 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                      Système opérationnel
                    </span>

                  </div>

                  <h1 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                    Bonjour, {nomUtilisateur}
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/65 sm:text-base">

                    Bienvenue dans votre espace de gestion

                    <span className="font-bold text-white">
                      {" "}BETHEL GLORY MEDIA
                    </span>

                    .

                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-md">

                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                    Aujourd'hui
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize text-white">
                    {getDateActuelle()}
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <section className="mb-8">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0b6b50]">
                  Vue générale
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Votre activité
                </h2>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {/* RESPONSABLES */}

              <div className="group rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg">
                    👥
                  </div>

                  <span className="text-[9px] font-black text-gray-300">
                    01
                  </span>

                </div>

                <p className="mt-5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Responsables
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">

                  {loadingResponsables
                    ? "..."
                    : responsables.length}

                </p>

              </div>

              {/* MODULES */}

              <div className="group rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-lg">
                    ✦
                  </div>

                  <span className="text-[9px] font-black text-gray-300">
                    02
                  </span>

                </div>

                <p className="mt-5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Modules
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                  06
                </p>

              </div>

              {/* SESSION */}

              <div className="group rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg">
                    🔐
                  </div>

                  <span className="text-[9px] font-black text-gray-300">
                    03
                  </span>

                </div>

                <p className="mt-5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Session
                </p>

                <p className="mt-1 text-lg font-black text-emerald-700">
                  Active
                </p>

              </div>

              {/* ÉTAT */}

              <div className="group rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5">

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-lg">
                    ✓
                  </div>

                  <span className="text-[9px] font-black text-gray-300">
                    04
                  </span>

                </div>

                <p className="mt-5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  État système
                </p>

                <p className="mt-1 text-lg font-black text-emerald-700">
                  Stable
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              MODULES + ACTIONS
          ================================================== */}

          <section className="grid gap-7 xl:grid-cols-[1fr_340px]">

            {/* MODULES */}

            <div>

              <div className="mb-5 flex items-end justify-between">

                <div>

                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0b6b50]">
                    Administration
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                    Espaces de gestion
                  </h2>

                </div>

                <span className="hidden text-xs font-medium text-gray-400 sm:block">

                  {modulesFiltres.length}{" "}

                  {modulesFiltres.length > 1
                    ? "espaces"
                    : "espace"}

                </span>

              </div>

              {modulesFiltres.length >
              0 ? (

                <div className="grid gap-4 sm:grid-cols-2">

                  {modulesFiltres.map(
                    (module) => (

                      <button
                        key={module.route}
                        type="button"
                        onClick={() =>
                          navigate(
                            module.route
                          )
                        }
                        className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
                      >

                        <span className="absolute right-5 top-5 text-[10px] font-black tracking-widest text-gray-200 transition group-hover:text-[#0b3328]/20">
                          {module.number}
                        </span>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f5f2] text-xl transition duration-300 group-hover:scale-110 group-hover:bg-[#0b3328] group-hover:text-white">
                          {module.icon}
                        </div>

                        <div className="mt-6">

                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0b6b50]">
                            {module.subtitle}
                          </p>

                          <h3 className="mt-1 text-lg font-black text-gray-950">
                            {module.title}
                          </h3>

                          <p className="mt-2 max-w-sm text-sm leading-5 text-gray-500">
                            {module.description}
                          </p>

                        </div>

                        <div className="mt-6 flex items-center justify-between">

                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Ouvrir
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition group-hover:bg-[#0b3328] group-hover:text-white">
                            →
                          </span>

                        </div>

                      </button>

                    )
                  )}

                </div>

              ) : (

                <div className="rounded-[26px] border border-black/[0.06] bg-white p-12 text-center shadow-sm">

                  <div className="text-3xl">
                    ⌕
                  </div>

                  <p className="mt-3 text-sm font-bold text-gray-600">
                    Aucun résultat trouvé
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Aucun espace ou responsable ne correspond à votre recherche.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setRecherche("")
                    }
                    className="mt-3 text-xs font-black text-[#0b6b50]"
                  >
                    Effacer la recherche
                  </button>

                </div>

              )}

            </div>

            {/* COLONNE DROITE */}

            <div className="space-y-5">

              {/* ACTIONS RAPIDES */}

              <div className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">

                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b6b50]">
                  Productivité
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-950">
                  Actions rapides
                </h2>

                <div className="mt-5 space-y-2">

                  {/* NOUVELLE PUBLICATION */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/publications"
                      )
                    }
                    className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-[#f3f7f4]"
                  >

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50">
                      🖼️
                    </span>

                    <span className="flex-1">

                      <span className="block text-xs font-black text-gray-900">
                        Nouvelle publication
                      </span>

                      <span className="text-[10px] text-gray-400">
                        Créer un visuel
                      </span>

                    </span>

                    <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#0b3328]">
                      →
                    </span>

                  </button>

                  {/* NOUVEAU PROGRAMME */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/programs"
                      )
                    }
                    className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-[#f3f7f4]"
                  >

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                      📅
                    </span>

                    <span className="flex-1">

                      <span className="block text-xs font-black text-gray-900">
                        Nouveau programme
                      </span>

                      <span className="text-[10px] text-gray-400">
                        Ajouter une activité
                      </span>

                    </span>

                    <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#0b3328]">
                      →
                    </span>

                  </button>

                  {/* NOUVEAU RESPONSABLE */}

                  <button
                    type="button"
                    onClick={
                      ouvrirAjoutResponsable
                    }
                    className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-[#f3f7f4]"
                  >

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      👥
                    </span>

                    <span className="flex-1">

                      <span className="block text-xs font-black text-gray-900">
                        Nouveau responsable
                      </span>

                      <span className="text-[10px] text-gray-400">
                        Ajouter un membre
                      </span>

                    </span>

                    <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#0b3328]">
                      →
                    </span>

                  </button>

                </div>

              </div>

              {/* ÉQUIPE */}

              <div className="rounded-[26px] border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0b6b50]">
                      Équipe
                    </p>

                    <h2 className="mt-1 text-xl font-black text-gray-950">
                      Responsables
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/responsables"
                      )
                    }
                    className="text-[10px] font-black text-[#0b6b50]"
                  >
                    Voir tout →
                  </button>

                </div>

                {loadingResponsables && (

                  <div className="mt-5 flex justify-center rounded-2xl bg-gray-50 py-10">

                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#0b3328]" />

                  </div>

                )}

                {!loadingResponsables &&
                  errorResponsables && (

                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">

                    <p className="text-xs font-bold text-red-700">
                      ⚠️{" "}
                      {errorResponsables}
                    </p>

                    <button
                      type="button"
                      onClick={
                        fetchResponsables
                      }
                      className="mt-3 rounded-xl bg-red-700 px-3 py-2 text-[10px] font-black text-white"
                    >
                      Réessayer
                    </button>

                  </div>

                )}

                {!loadingResponsables &&
                  !errorResponsables &&
                  responsablesFiltres.length >
                    0 && (

                  <div className="mt-5 space-y-2">

                    {responsablesFiltres
                      .slice(0, 4)
                      .map(
                        (
                          responsable
                        ) => {

                          const photoUrl =
                            getPhotoUrl(
                              responsable.photo
                            )

                          return (

                            <button
                              key={
                                responsable.id
                              }
                              type="button"
                              onClick={() =>
                                navigate(
                                  "/admin/responsables"
                                )
                              }
                              className="group flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-[#f3f7f4]"
                            >

                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                {photoUrl ? (

                                  <img
                                    src={
                                      photoUrl
                                    }
                                    alt={`${responsable.prenom || ""} ${responsable.nom || ""}`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.style.display =
                                        "none"
                                    }}
                                  />

                                ) : (

                                  <div className="flex h-full w-full items-center justify-center text-lg">
                                    👤
                                  </div>

                                )}

                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="truncate text-xs font-black text-gray-950">

                                  {
                                    responsable.prenom ||
                                    ""
                                  }{" "}

                                  {
                                    responsable.nom ||
                                    ""
                                  }

                                </p>

                                <p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-wider text-[#0b6b50]">

                                  {getFonctionLabel(
                                    responsable.fonction
                                  )}

                                </p>

                              </div>

                              <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#0b3328]">
                                →
                              </span>

                            </button>

                          )
                        }
                      )}

                  </div>

                )}

                {!loadingResponsables &&
                  !errorResponsables &&
                  responsables.length ===
                    0 && (

                  <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center">

                    <div className="text-2xl">
                      👥
                    </div>

                    <p className="mt-2 text-xs font-bold text-gray-500">
                      Aucun responsable enregistré.
                    </p>

                    <button
                      type="button"
                      onClick={
                        ouvrirAjoutResponsable
                      }
                      className="mt-3 text-[10px] font-black text-[#0b6b50]"
                    >
                      Ajouter un responsable →
                    </button>

                  </div>

                )}

                {!loadingResponsables &&
                  !errorResponsables &&
                  responsables.length >
                    0 &&
                  responsablesFiltres.length ===
                    0 &&
                  texteRecherche && (

                  <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center">

                    <div className="text-2xl">
                      ⌕
                    </div>

                    <p className="mt-2 text-xs font-bold text-gray-500">
                      Aucun responsable trouvé.
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Essayez un autre nom ou une autre fonction.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>

          {/* FOOTER */}

          <footer className="mt-10 flex flex-col gap-2 border-t border-black/[0.06] pt-6 text-[10px] font-medium text-gray-400 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © 2026 BETHEL GLORY MEDIA
            </p>

            <p className="uppercase tracking-[0.15em]">
              Administration • Excellence • Communication
            </p>

          </footer>

        </div>

      </main>

      {/* ==================================================
          MODALE AJOUT RESPONSABLE
      ================================================== */}

      {showAjoutResponsable && (
        <>
          <style>
            {`
              @keyframes responsableOverlayIn {
                from {
                  opacity: 0;
                }

                to {
                  opacity: 1;
                }
              }

              @keyframes responsableModalIn {
                from {
                  opacity: 0;
                  transform: translateY(25px) scale(0.96);
                }

                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @keyframes responsablePhotoIn {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }

                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>

          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#061f18]/75 px-4 py-6 backdrop-blur-md"
            style={{
              animation:
                "responsableOverlayIn 0.2s ease-out forwards",
            }}
            onClick={
              fermerAjoutResponsable
            }
          >

            <div
              className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
              style={{
                animation:
                  "responsableModalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0b3328] via-[#d4af37] to-[#0b3328]" />

              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-2xl" />

              <div className="absolute -bottom-24 -left-20 h-44 w-44 rounded-full bg-[#0b3328]/10 blur-2xl" />

              <div className="relative px-6 pb-7 pt-8 sm:px-8">

                <button
                  type="button"
                  onClick={
                    fermerAjoutResponsable
                  }
                  disabled={
                    loadingAjoutResponsable
                  }
                  aria-label="Fermer"
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ×
                </button>

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0b3328] shadow-[0_12px_30px_rgba(11,51,40,0.22)]">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-white/10 text-2xl">
                      👥
                    </div>

                  </div>

                  <div className="min-w-0">

                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b6b50]">
                      BETHEL GLORY MEDIA
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                      Nouveau responsable
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Ajouter un membre de l'équipe.
                    </p>

                  </div>

                </div>

                {messageAjoutResponsable.texte && (

                  <div
                    className={`mt-6 rounded-2xl border p-4 ${
                      messageAjoutResponsable.type ===
                      "success"
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-red-100 bg-red-50"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${
                          messageAjoutResponsable.type ===
                          "success"
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {messageAjoutResponsable.type ===
                        "success"
                          ? "✓"
                          : "!"}
                      </span>

                      <p
                        className={`pt-1 text-xs font-bold ${
                          messageAjoutResponsable.type ===
                          "success"
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        {
                          messageAjoutResponsable.texte
                        }
                      </p>

                    </div>

                  </div>

                )}

                <form
                  onSubmit={
                    ajouterResponsable
                  }
                  className="mt-6"
                >

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label
                        htmlFor="responsable-prenom"
                        className="mb-2 block text-[10px] font-black uppercase tracking-wider text-gray-500"
                      >
                        Prénom
                      </label>

                      <input
                        id="responsable-prenom"
                        type="text"
                        name="prenom"
                        value={
                          ajoutResponsable.prenom
                        }
                        onChange={
                          handleResponsableChange
                        }
                        placeholder="Ex. Jonas"
                        disabled={
                          loadingAjoutResponsable
                        }
                        required
                        className="h-12 w-full rounded-2xl border border-black/[0.08] bg-gray-50 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#0b3328]/30 focus:bg-white focus:ring-4 focus:ring-[#0b3328]/5 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>

                    <div>

                      <label
                        htmlFor="responsable-nom"
                        className="mb-2 block text-[10px] font-black uppercase tracking-wider text-gray-500"
                      >
                        Nom
                      </label>

                      <input
                        id="responsable-nom"
                        type="text"
                        name="nom"
                        value={
                          ajoutResponsable.nom
                        }
                        onChange={
                          handleResponsableChange
                        }
                        placeholder="Ex. Yoboué"
                        disabled={
                          loadingAjoutResponsable
                        }
                        required
                        className="h-12 w-full rounded-2xl border border-black/[0.08] bg-gray-50 px-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#0b3328]/30 focus:bg-white focus:ring-4 focus:ring-[#0b3328]/5 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>

                  </div>

                  <div className="mt-4">

                    <label
                      htmlFor="responsable-fonction"
                      className="mb-2 block text-[10px] font-black uppercase tracking-wider text-gray-500"
                    >
                      Fonction
                    </label>

                    <select
                      id="responsable-fonction"
                      name="fonction"
                      value={
                        ajoutResponsable.fonction
                      }
                      onChange={
                        handleResponsableChange
                      }
                      disabled={
                        loadingAjoutResponsable
                      }
                      required
                      className="h-12 w-full rounded-2xl border border-black/[0.08] bg-gray-50 px-4 text-sm font-bold text-gray-800 outline-none transition focus:border-[#0b3328]/30 focus:bg-white focus:ring-4 focus:ring-[#0b3328]/5 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <option value="pasteur">
                        Pasteur
                      </option>

                      <option value="apotre">
                        Apôtre
                      </option>

                      <option value="ancien_principal">
                        Ancien principal
                      </option>

                      <option value="ancien_second">
                        Ancien second
                      </option>

                      <option value="diacre">
                        Diacre
                      </option>

                      <option value="diaconesse">
                        Diaconesse
                      </option>

                    </select>

                  </div>

                  <div className="mt-4">

                    <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-gray-500">
                      Photo
                    </label>

                    <div className="rounded-[24px] border border-dashed border-black/10 bg-gray-50 p-4">

                      <div className="flex flex-col items-center gap-4 sm:flex-row">

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/[0.05]">

                          {previewPhotoResponsable ? (

                            <img
                              src={
                                previewPhotoResponsable
                              }
                              alt="Aperçu"
                              className="h-full w-full object-cover"
                              style={{
                                animation:
                                  "responsablePhotoIn 0.25s ease-out forwards",
                              }}
                            />

                          ) : (

                            <div className="flex h-full w-full flex-col items-center justify-center text-gray-300">

                              <span className="text-3xl">
                                👤
                              </span>

                              <span className="mt-1 text-[8px] font-black uppercase">
                                Photo
                              </span>

                            </div>

                          )}

                        </div>

                        <div className="min-w-0 flex-1 text-center sm:text-left">

                          <p className="text-xs font-black text-gray-800">
                            Photo du responsable
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-gray-400">
                            JPG, PNG ou WEBP. Taille maximale
                            50 Mo.
                          </p>

                          <label
                            htmlFor="photo-responsable-dashboard"
                            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0b3328] px-4 py-2.5 text-[10px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#09281f] hover:shadow-md"
                          >
                            📷 Choisir une photo
                          </label>

                          <input
                            id="photo-responsable-dashboard"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={
                              handlePhotoResponsableChange
                            }
                            disabled={
                              loadingAjoutResponsable
                            }
                            className="hidden"
                          />

                          {photoResponsable && (

                            <p className="mt-2 truncate text-[9px] font-bold text-[#0b6b50]">
                              ✓{" "}
                              {
                                photoResponsable.name
                              }
                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={
                        fermerAjoutResponsable
                      }
                      disabled={
                        loadingAjoutResponsable
                      }
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white text-xs font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <span className="text-base">
                        ×
                      </span>

                      Annuler

                    </button>

                    <button
                      type="submit"
                      disabled={
                        loadingAjoutResponsable
                      }
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0b3328] text-xs font-black text-white shadow-[0_8px_20px_rgba(11,51,40,0.20)] transition hover:-translate-y-0.5 hover:bg-[#09281f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loadingAjoutResponsable ? (

                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Ajout...
                        </>

                      ) : (

                        <>
                          <span>
                            ✓
                          </span>

                          Ajouter
                        </>

                      )}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </>
      )}

      {/* ==================================================
          MODALE DE CONFIRMATION DE DÉCONNEXION
      ================================================== */}

      {deconnexion && (
        <>

          <style>
            {`
              @keyframes logoutOverlayIn {
                from {
                  opacity: 0;
                }

                to {
                  opacity: 1;
                }
              }

              @keyframes logoutModalIn {
                from {
                  opacity: 0;
                  transform: translateY(20px) scale(0.96);
                }

                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @keyframes logoutIconIn {
                from {
                  opacity: 0;
                  transform: scale(0.7) rotate(-8deg);
                }

                to {
                  opacity: 1;
                  transform: scale(1) rotate(0deg);
                }
              }
            `}
          </style>

          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#061f18]/70 px-4 backdrop-blur-md"
            style={{
              animation:
                "logoutOverlayIn 0.2s ease-out forwards",
            }}
            onClick={annulerDeconnexion}
          >

            <div
              className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.30)]"
              style={{
                animation:
                  "logoutModalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0b3328] via-[#d4af37] to-[#0b3328]" />

              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-2xl" />

              <div className="absolute -bottom-24 -left-20 h-44 w-44 rounded-full bg-[#0b3328]/10 blur-2xl" />

              <div className="relative px-6 pb-7 pt-8 sm:px-8">

                <button
                  type="button"
                  onClick={annulerDeconnexion}
                  aria-label="Fermer"
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition duration-200 hover:bg-gray-100 hover:text-gray-700"
                >
                  ×
                </button>

                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#0b3328] shadow-[0_12px_30px_rgba(11,51,40,0.25)]"
                  style={{
                    animation:
                      "logoutIconIn 0.4s 0.1s ease-out both",
                  }}
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-white/10">

                    <span className="text-2xl text-[#d4af37]">
                      ↪
                    </span>

                  </div>

                </div>

                <div className="mt-6 text-center">

                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0b6b50]">
                    BETHEL GLORY MEDIA
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950">
                    Déconnexion
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Êtes-vous sûr de vouloir vous déconnecter de votre espace
                    d'administration ?
                  </p>

                </div>

                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#0b3328]/10 bg-[#f3f7f4] px-4 py-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0b3328] text-sm text-white">
                    🔐
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-black uppercase tracking-wider text-[#0b6b50]">
                      Session actuelle
                    </p>

                    <p className="mt-0.5 truncate text-xs font-bold text-gray-700">
                      {nomUtilisateur}
                    </p>

                  </div>

                  <div className="ml-auto flex items-center gap-1.5">

                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />

                    <span className="text-[9px] font-black text-emerald-700">
                      Active
                    </span>

                  </div>

                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={annulerDeconnexion}
                    className="group flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white text-xs font-black text-gray-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:translate-y-0"
                  >

                    <span className="text-base transition-transform duration-300 group-hover:-translate-x-0.5">
                      ×
                    </span>

                    <span>
                      Non, rester
                    </span>

                  </button>

                  <button
                    type="button"
                    onClick={
                      confirmerDeconnexion
                    }
                    className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0b3328] text-xs font-black text-white shadow-[0_8px_20px_rgba(11,51,40,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#09281f] hover:shadow-lg active:translate-y-0"
                  >

                    <span>
                      Oui, me déconnecter
                    </span>

                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>

                  </button>

                </div>

                <p className="mt-5 text-center text-[9px] font-medium text-gray-400">
                  Vous pourrez vous reconnecter à tout moment.
                </p>

              </div>

            </div>

          </div>

        </>
      )}

    </div>
  )
}

export default Dashboard