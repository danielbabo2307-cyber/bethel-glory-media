
import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  Link,
  useSearchParams,
} from "react-router-dom"

import { toPng } from "html-to-image"

import dani from "../../assets/dani.jpg"

// ============================================================
// MODÈLES
// ============================================================

// -----------------------------
// Modèles 001 → 004
// -----------------------------

import PremiumPurple from "../../templates/PremiumPurple"
import PremiumBlue from "../../templates/PremiumBlue"
import PremiumGreen from "../../templates/PremiumGreen"
import PremiumGold from "../../templates/PremiumGold"

// -----------------------------
// Modèles 005 → 008
// -----------------------------

import ParoleVivante from "../../templates/ParoleVivante"
import Revelation from "../../templates/Revelation"
import LaParole from "../../templates/LaParole"
import ImpactSpirituel from "../../templates/ImpactSpirituel"

// -----------------------------
// Modèles 009 → 012
// -----------------------------

import LouangeCeleste from "../../templates/LouangeCeleste"
import Adoration from "../../templates/Adoration"
import ChantVictoire from "../../templates/ChantVictoire"
import AtmosphereDivine from "../../templates/AtmosphereDivine"

// -----------------------------
// Modèles 013 → 016
// -----------------------------

import GrandeConference from "../../templates/GrandeConference"
import SemaineSpirituelle from "../../templates/SemaineSpirituelle"
import RetraiteSpirituelle from "../../templates/RetraiteSpirituelle"
import VeilleePriere from "../../templates/VeilleePriere"

// -----------------------------
// Modèles 017 → 020
// -----------------------------

import JeunesseEnFeu from "../../templates/JeunesseEnFeu"
import GenerationBethel from "../../templates/GenerationBethel"
import JeunesseConnect from "../../templates/JeunesseConnect"
import NouvelleGeneration from "../../templates/NouvelleGeneration"

// -----------------------------
// Modèles 021 → 024
// -----------------------------

import FemmesDestinee from "../../templates/FemmesDestinee"
import HommesFoi from "../../templates/HommesFoi"
import EcoleDimanche from "../../templates/EcoleDimanche"
import ChoraleBethel from "../../templates/ChoraleBethel"

// -----------------------------
// Modèles 025 → 028
// -----------------------------

import VersetJour from "../../templates/VersetJour"
import PenseeJour from "../../templates/PenseeJour"
import BonneSemaine from "../../templates/BonneSemaine"
import BonneJournee from "../../templates/BonneJournee"

// -----------------------------
// Modèles 029 → 032
// -----------------------------

import AnnoncePremium from "../../templates/AnnoncePremium"
import InvitationRoyale from "../../templates/InvitationRoyale"
import AnnonceModerne from "../../templates/AnnonceModerne"
import ANePasManquer from "../../templates/ANePasManquer"

// -----------------------------
// Modèles 034 → 043
// -----------------------------

import Modele034 from "../../templates/Modele034"
import Modele035 from "../../templates/Modele035"
import Modele036 from "../../templates/Modele036"
import Modele037 from "../../templates/Modele037"
import Modele038 from "../../templates/Modele038"
import Modele039 from "../../templates/Modele039"
import Modele040 from "../../templates/Modele040"
import Modele041 from "../../templates/Modele041"
import Modele042 from "../../templates/Modele042"
import Modele043 from "../../templates/Modele043"

// ============================================================
// API
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_URL || "http://localhost:5000"

// ============================================================
// LOGO
// ============================================================

const getLogoUrl = (logo) => {
  if (!logo) {
    return dani
  }

  const value = String(logo).trim()

  if (!value) {
    return dani
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value
  }

  const chemin = value.startsWith("/")
    ? value
    : `/${value}`

  return `${API_URL}${chemin}`
}

// ============================================================
// NORMALISER TEXTE
// ============================================================

const normalizeText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
}

// ============================================================
// FORMATER DATE
// ============================================================

const formatDate = (date) => {
  if (!(date instanceof Date)) {
    return ""
  }

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date
    .toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase()
}

// ============================================================
// FORMAT DATE PUBLICATION
// ============================================================

const formatDatePublication = (date) => {
  if (!(date instanceof Date)) {
    return ""
  }

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date
    .toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase()
}

// ============================================================
// PARSER DATE URL
// ============================================================

const parseDateFromUrl = (dateString) => {
  if (!dateString) {
    return null
  }

  const match = String(dateString).match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  )

  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(
    year,
    month - 1,
    day
  )

  date.setHours(
    0,
    0,
    0,
    0
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

// ============================================================
// NORMALISER DATE MYSQL
// ============================================================

const normalizeMysqlDate = (value) => {
  if (!value) {
    return null
  }

  const text = String(value).substring(
    0,
    10
  )

  return parseDateFromUrl(text)
}

// ============================================================
// DATE → YYYY-MM-DD
// ============================================================

const formatMysqlDate = (date) => {
  if (!(date instanceof Date)) {
    return ""
  }

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0")

  const day = String(
    date.getDate()
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

// ============================================================
// NOM FICHIER
// ============================================================

const cleanFileName = (text) => {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

// ============================================================
// FICHIER → DATA URL
// ============================================================

const fileToDataUrl = (file) => {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = () => {
        reject(
          new Error(
            "Impossible de lire l'image sélectionnée."
          )
        )
      }

      reader.readAsDataURL(file)
    }
  )
}

// ============================================================
// ATTENDRE IMAGES
// ============================================================

const waitForImages = async (element) => {
  if (!element) {
    return
  }

  const images = Array.from(
    element.querySelectorAll("img")
  )

  if (images.length === 0) {
    return
  }

  await Promise.all(
    images.map((img) => {
      if (
        img.complete &&
        img.naturalWidth > 0
      ) {
        return Promise.resolve()
      }

      return new Promise(
        (resolve) => {
          const handleLoad = () => {
            cleanup()
            resolve()
          }

          const handleError = () => {
            cleanup()
            resolve()
          }

          const cleanup = () => {
            img.removeEventListener(
              "load",
              handleLoad
            )

            img.removeEventListener(
              "error",
              handleError
            )
          }

          img.addEventListener(
            "load",
            handleLoad,
            { once: true }
          )

          img.addEventListener(
            "error",
            handleError,
            { once: true }
          )
        }
      )
    })
  )
}

// ============================================================
// EXTRAIRE LISTE API
// ============================================================

const extractList = (
  data,
  keys = []
) => {
  if (Array.isArray(data)) {
    return data
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key]
    }
  }

  return []
}

// ============================================================
// BIBLIOTHÈQUE DES MODÈLES
// ============================================================

const publicationModels = {
  "elegance-royale": {
    name: "Élégance Royale",
    category: "Dimanche",
    style: "gold",
  },

  "grace-lumiere": {
    name: "Grâce & Lumière",
    category: "Dimanche",
    style: "purple",
  },

  "dimanche-royal": {
    name: "Dimanche Royal",
    category: "Dimanche",
    style: "blue",
  },

  "presence-divine": {
    name: "Présence Divine",
    category: "Dimanche",
    style: "green",
  },

  "parole-vivante": {
    name: "Parole Vivante",
    category: "Prédication",
    style: "dark",
  },

  revelation: {
    name: "Révélation",
    category: "Prédication",
    style: "purple",
  },

  "la-parole": {
    name: "La Parole",
    category: "Prédication",
    style: "brown",
  },

  "impact-spirituel": {
    name: "Impact Spirituel",
    category: "Prédication",
    style: "red",
  },

  "louange-celeste": {
    name: "Louange Céleste",
    category: "Louange",
    style: "blue",
  },

  adoration: {
    name: "Adoration",
    category: "Louange",
    style: "purple",
  },

  "chant-de-victoire": {
    name: "Chant de Victoire",
    category: "Louange",
    style: "orange",
  },

  "atmosphere-divine": {
    name: "Atmosphère Divine",
    category: "Louange",
    style: "cyan",
  },

  "grande-conference": {
    name: "Grande Conférence",
    category: "Événement",
    style: "black-gold",
  },

  "semaine-spirituelle": {
    name: "Semaine Spirituelle",
    category: "Événement",
    style: "purple",
  },

  "retraite-spirituelle": {
    name: "Retraite Spirituelle",
    category: "Événement",
    style: "green",
  },

  "veillee-de-priere": {
    name: "Veillée de Prière",
    category: "Événement",
    style: "night",
  },

  "jeunesse-en-feu": {
    name: "Jeunesse en Feu",
    category: "Jeunesse",
    style: "red",
  },

  "generation-bethel": {
    name: "Génération Bethel",
    category: "Jeunesse",
    style: "blue",
  },

  "jeunesse-connect": {
    name: "Jeunesse Connect",
    category: "Jeunesse",
    style: "cyan",
  },

  "nouvelle-generation": {
    name: "Nouvelle Génération",
    category: "Jeunesse",
    style: "purple",
  },

  "femmes-de-destinee": {
    name: "Femmes de Destinée",
    category: "Départements",
    style: "pink",
  },

  "hommes-de-foi": {
    name: "Hommes de Foi",
    category: "Départements",
    style: "blue",
  },

  "ecole-du-dimanche": {
    name: "École du Dimanche",
    category: "Départements",
    style: "orange",
  },

  "chorale-bethel": {
    name: "Chorale Bethel",
    category: "Départements",
    style: "green",
  },

  "verset-du-jour": {
    name: "Verset du Jour",
    category: "Inspirations",
    style: "cream",
  },

  "pensee-du-jour": {
    name: "Pensée du Jour",
    category: "Inspirations",
    style: "purple",
  },

  "bonne-semaine": {
    name: "Bonne Semaine",
    category: "Inspirations",
    style: "green",
  },

  "bonne-journee": {
    name: "Bonne Journée",
    category: "Inspirations",
    style: "orange",
  },

  "annonce-premium": {
    name: "Annonce Premium",
    category: "Annonces",
    style: "black-gold",
  },

  "invitation-royale": {
    name: "Invitation Royale",
    category: "Annonces",
    style: "gold",
  },

  "annonce-moderne": {
    name: "Annonce Moderne",
    category: "Annonces",
    style: "cyan",
  },

  "a-ne-pas-manquer": {
    name: "À Ne Pas Manquer",
    category: "Annonces",
    style: "red",
  },

  // ==========================================================
  // 034 → 043
  // ==========================================================

  "modele-034": {
    name: "Modèle 034",
    category: "Nouveautés",
    style: "blue-gold",
  },

  "modele-035": {
    name: "Modèle 035",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-036": {
    name: "Modèle 036",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-037": {
    name: "Modèle 037",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-038": {
    name: "Modèle 038",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-039": {
    name: "Modèle 039",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-040": {
    name: "Modèle 040",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-041": {
    name: "Modèle 041",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-042": {
    name: "Modèle 042",
    category: "Nouveautés",
    style: "créatif",
  },

  "modele-043": {
    name: "Modèle 043",
    category: "Nouveautés",
    style: "créatif",
  },
}

// ============================================================
// COMPOSANTS REACT
// ============================================================

const templateComponents = {
  "elegance-royale": PremiumGold,
  "grace-lumiere": PremiumPurple,
  "dimanche-royal": PremiumBlue,
  "presence-divine": PremiumGreen,

  "parole-vivante": ParoleVivante,
  revelation: Revelation,
  "la-parole": LaParole,
  "impact-spirituel": ImpactSpirituel,

  "louange-celeste": LouangeCeleste,
  adoration: Adoration,
  "chant-de-victoire": ChantVictoire,
  "atmosphere-divine": AtmosphereDivine,

  "grande-conference": GrandeConference,
  "semaine-spirituelle": SemaineSpirituelle,
  "retraite-spirituelle": RetraiteSpirituelle,
  "veillee-de-priere": VeilleePriere,

  "jeunesse-en-feu": JeunesseEnFeu,
  "generation-bethel": GenerationBethel,
  "jeunesse-connect": JeunesseConnect,
  "nouvelle-generation": NouvelleGeneration,

  "femmes-de-destinee": FemmesDestinee,
  "hommes-de-foi": HommesFoi,
  "ecole-du-dimanche": EcoleDimanche,
  "chorale-bethel": ChoraleBethel,

  "verset-du-jour": VersetJour,
  "pensee-du-jour": PenseeJour,
  "bonne-semaine": BonneSemaine,
  "bonne-journee": BonneJournee,

  "annonce-premium": AnnoncePremium,
  "invitation-royale": InvitationRoyale,
  "annonce-moderne": AnnonceModerne,
  "a-ne-pas-manquer": ANePasManquer,

  "modele-034": Modele034,
  "modele-035": Modele035,
  "modele-036": Modele036,
  "modele-037": Modele037,
  "modele-038": Modele038,
  "modele-039": Modele039,
  "modele-040": Modele040,
  "modele-041": Modele041,
  "modele-042": Modele042,
  "modele-043": Modele043,
}

// ============================================================
// PAGE
// ============================================================

function Publications() {
  const [searchParams] =
    useSearchParams()

  const urlTemplate =
    searchParams.get("template")

  const urlDate =
    searchParams.get("date")

  const initialTemplate =
    urlTemplate &&
    templateComponents[urlTemplate]
      ? urlTemplate
      : "grace-lumiere"

  const requestedDateObject =
    parseDateFromUrl(urlDate)

  const requestedDateKey =
    requestedDateObject
      ? formatMysqlDate(
          requestedDateObject
        )
      : ""

  // ==========================================================
  // ÉTATS
  // ==========================================================

  const [preview, setPreview] =
    useState(null)

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState(initialTemplate)

  const [
    selectedSunday,
    setSelectedSunday,
  ] = useState(null)

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false)

  const [
    assemblees,
    setAssemblees,
  ] = useState([])

  const [
    selectedAssembleeId,
    setSelectedAssembleeId,
  ] = useState("")

  const [
    dimanches,
    setDimanches,
  ] = useState([])

  const [
    selectedDimancheId,
    setSelectedDimancheId,
  ] = useState(null)

  const [
    modelesDB,
    setModelesDB,
  ] = useState([])

  const [
    selectedModeleId,
    setSelectedModeleId,
  ] = useState(null)

  const [
    isLoadingData,
    setIsLoadingData,
  ] = useState(true)

  const [
    errorData,
    setErrorData,
  ] = useState("")

  const posterRef =
    useRef(null)

  // ==========================================================
  // TOKEN
  // ==========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    )
  }

  // ==========================================================
  // ASSEMBLÉE SÉLECTIONNÉE
  // ==========================================================

  const selectedAssemblee =
    assemblees.find(
      (assemblee) =>
        String(assemblee.id) ===
        String(selectedAssembleeId)
    ) || null

  const assembleeData =
    selectedAssemblee || {}

  const assembleeLogo =
    getLogoUrl(
      selectedAssemblee?.logo
    )

  // ==========================================================
  // MODÈLE
  // ==========================================================

  const selectedLibraryModel =
    publicationModels[
      selectedTemplate
    ] ||
    publicationModels[
      "grace-lumiere"
    ]

  const SelectedTemplateComponent =
    templateComponents[
      selectedTemplate
    ]

  const currentTemplate = {
    name:
      selectedLibraryModel.name,

    description:
      selectedLibraryModel.category ===
      "Dimanche"
        ? "Élégant et adapté au culte"
        : `Création ${selectedLibraryModel.category}`,
  }

  // ==========================================================
  // SCROLL MODÈLES
  // ==========================================================

  useEffect(() => {
    if (
      window.location.hash !==
      "#modeles"
    ) {
      return
    }

    const timer =
      setTimeout(() => {
        const element =
          document.getElementById(
            "modeles"
          )

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // ==========================================================
  // CHARGER ASSEMBLÉES + MODÈLES
  // ==========================================================

  useEffect(() => {
    let mounted = true

    const chargerDonnees =
      async () => {
        try {
          setIsLoadingData(true)
          setErrorData("")

          const token =
            getToken()

          if (!token) {
            throw new Error(
              "Votre session a expiré. Veuillez vous reconnecter."
            )
          }

          // ----------------------------------------------------
          // ASSEMBLÉES
          // ----------------------------------------------------

          const responseAssemblees =
            await fetch(
              `${API_URL}/api/assemblees`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const dataAssemblees =
            await responseAssemblees.json()

          if (
            !responseAssemblees.ok
          ) {
            throw new Error(
              dataAssemblees?.message ||
                "Impossible de charger les assemblées."
            )
          }

          const listeAssemblees =
            extractList(
              dataAssemblees,
              [
                "assemblees",
                "assemblies",
                "data",
              ]
            )

          const assembleesActives =
            listeAssemblees
              .filter((assemblee) => {
                if (
                  assemblee.actif === undefined ||
                  assemblee.actif === null
                ) {
                  return true
                }

                return (
                  Number(assemblee.actif) === 1 ||
                  assemblee.actif === true ||
                  String(assemblee.actif).toLowerCase() === "true"
                )
              })
              .sort(
                (a, b) =>
                  String(
                    a.nom || ""
                  ).localeCompare(
                    String(
                      b.nom || ""
                    ),
                    "fr",
                    {
                      sensitivity:
                        "base",
                    }
                  )
              )

          if (!mounted) {
            return
          }

          setAssemblees(
            assembleesActives
          )

          if (
            assembleesActives.length >
            0
          ) {
            setSelectedAssembleeId(
              String(
                assembleesActives[0]
                  .id
              )
            )
          } else {
            setSelectedAssembleeId("")
          }

          // ----------------------------------------------------
          // MODÈLES MYSQL
          // ----------------------------------------------------

          const responseModeles =
            await fetch(
              `${API_URL}/api/modeles-publication`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const dataModeles =
            await responseModeles.json()

          if (
            !responseModeles.ok
          ) {
            throw new Error(
              dataModeles?.message ||
                "Impossible de charger les modèles."
            )
          }

          console.log(
            "Réponse complète API modèles :",
            dataModeles
          )

          const listeModeles =
            extractList(
              dataModeles,
              [
                "modeles",
                "modeles_publication",
                "data",
              ]
            )

          const modelesActifs =
            listeModeles.filter(
              (modele) =>
                modele &&
                (
                  Number(
                    modele.actif
                  ) === 1 ||
                  modele.actif === true
                )
            )

          if (!mounted) {
            return
          }

          setModelesDB(
            modelesActifs
          )

          console.log(
            "Modèles actifs utilisables :",
            modelesActifs
          )
        } catch (error) {
          console.error(
            "Erreur chargement des données :",
            error
          )

          if (mounted) {
            setErrorData(
              error?.message ||
                "Impossible de charger les données."
            )
          }
        } finally {
          if (mounted) {
            setIsLoadingData(false)
          }
        }
      }

    chargerDonnees()

    return () => {
      mounted = false
    }
  }, [])

  // ==========================================================
  // SYNCHRONISER MODÈLE FRONTEND / MYSQL
  // ==========================================================

  useEffect(() => {
    const modeleFrontend =
      publicationModels[
        selectedTemplate
      ]

    if (!modeleFrontend) {
      setSelectedModeleId(null)
      return
    }

    if (!Array.isArray(modelesDB)) {
      setSelectedModeleId(null)
      return
    }

    if (modelesDB.length === 0) {
      setSelectedModeleId(null)
      return
    }

    const slugFrontend =
      normalizeText(
        selectedTemplate
      )

    const nomFrontend =
      normalizeText(
        modeleFrontend.name
      )

    const modeleCorrespondant =
      modelesDB.find(
        (modele) => {
          const slugDB =
            normalizeText(
              modele?.slug
            )

          const nomDB =
            normalizeText(
              modele?.nom
            )

          return (
            slugDB ===
              slugFrontend ||
            nomDB ===
              nomFrontend
          )
        }
      )

    if (modeleCorrespondant) {
      const idModele =
        Number(
          modeleCorrespondant.id
        )

      if (
        Number.isInteger(
          idModele
        ) &&
        idModele > 0
      ) {
        setSelectedModeleId(
          idModele
        )

        console.log(
          "Modèle synchronisé :",
          {
            frontend:
              selectedTemplate,
            nom:
              modeleFrontend.name,
            dbId:
              idModele,
            dbSlug:
              modeleCorrespondant.slug,
            dbNom:
              modeleCorrespondant.nom,
          }
        )

        return
      }
    }

    console.warn(
      "Modèle absent de MySQL :",
      {
        slug:
          selectedTemplate,
        nom:
          modeleFrontend.name,
      }
    )

    setSelectedModeleId(null)
  }, [
    selectedTemplate,
    modelesDB,
  ])

  // ==========================================================
  // CHARGER DIMANCHES
  // ==========================================================

  useEffect(() => {
    let mounted = true

    const chargerDimanches =
      async () => {
        if (
          !selectedAssembleeId
        ) {
          setDimanches([])
          setSelectedDimancheId(null)
          setSelectedSunday(null)
          return
        }

        try {
          setDimanches([])
          setSelectedDimancheId(null)
          setSelectedSunday(null)
          setErrorData("")

          const token =
            getToken()

          if (!token) {
            throw new Error(
              "Votre session a expiré. Veuillez vous reconnecter."
            )
          }

          const response =
            await fetch(
              `${API_URL}/api/dimanches?assemblee_id=${encodeURIComponent(
                selectedAssembleeId
              )}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            await response.json()

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Impossible de charger les dimanches."
            )
          }

          const listeDimanches =
            extractList(
              data,
              [
                "dimanches",
                "data",
              ]
            )

          const dimanchesActifs =
            listeDimanches
              .filter((dimanche) => {
                if (
                  dimanche.actif === undefined ||
                  dimanche.actif === null
                ) {
                  return true
                }

                return (
                  Number(dimanche.actif) === 1 ||
                  dimanche.actif === true ||
                  String(dimanche.actif).toLowerCase() === "true"
                )
              })
              .filter(
                (dimanche) =>
                  normalizeMysqlDate(
                    dimanche.date_dimanche
                  ) !== null
              )
              .sort(
                (a, b) =>
                  String(
                    a.date_dimanche
                  )
                    .substring(0, 10)
                    .localeCompare(
                      String(
                        b.date_dimanche
                      ).substring(
                        0,
                        10
                      )
                    )
              )

          if (!mounted) {
            return
          }

          setDimanches(
            dimanchesActifs
          )

          if (
            dimanchesActifs.length ===
            0
          ) {
            setSelectedDimancheId(
              null
            )

            setSelectedSunday(
              null
            )

            return
          }

          const dimancheCorrespondant =
            requestedDateKey
              ? dimanchesActifs.find(
                  (dimanche) =>
                    String(
                      dimanche.date_dimanche
                    ).substring(
                      0,
                      10
                    ) ===
                    requestedDateKey
                )
              : null

          const dimancheSelectionne =
            dimancheCorrespondant ||
            dimanchesActifs[0]

          const dateDB =
            normalizeMysqlDate(
              dimancheSelectionne.date_dimanche
            )

          if (!dateDB) {
            return
          }

          setSelectedDimancheId(
            dimancheSelectionne.id
          )

          setSelectedSunday(
            dateDB
          )
        } catch (error) {
          console.error(
            "Erreur chargement dimanches :",
            error
          )

          if (mounted) {
            setDimanches([])
            setSelectedDimancheId(null)
            setSelectedSunday(null)

            setErrorData(
              error?.message ||
                "Impossible de charger les dimanches."
            )
          }
        }
      }

    chargerDimanches()

    return () => {
      mounted = false
    }
  }, [
    selectedAssembleeId,
    requestedDateKey,
  ])

  // ==========================================================
  // CHOISIR DIMANCHE
  // ==========================================================

  const handleSelectSunday =
    (dimanche) => {
      if (!dimanche) {
        return
      }

      const date =
        normalizeMysqlDate(
          dimanche.date_dimanche
        )

      if (!date) {
        return
      }

      setSelectedSunday(date)

      setSelectedDimancheId(
        dimanche.id
      )
    }

  // ==========================================================
  // IMAGE
  // ==========================================================

  const handleImageChange =
    async (event) => {
      const file =
        event.target.files?.[0]

      if (!file) {
        return
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Veuillez sélectionner une image PNG, JPG, JPEG ou WEBP."
        )

        event.target.value = ""

        return
      }

      try {
        const imageDataUrl =
          await fileToDataUrl(
            file
          )

        setPreview(
          imageDataUrl
        )
      } catch (error) {
        console.error(
          "Erreur image :",
          error
        )

        alert(
          "Impossible de charger cette image."
        )
      }
    }

  // ==========================================================
  // CHOISIR MODÈLE
  // ==========================================================

  const handleSelectTemplate =
    (slug) => {
      if (
        !templateComponents[slug]
      ) {
        return
      }

      setSelectedTemplate(slug)

      console.log(
        "Modèle sélectionné :",
        slug
      )
    }

  // ==========================================================
  // GÉNÉRER
  // ==========================================================

  const handleGenerate =
    async () => {
      if (!preview) {
        alert(
          "Veuillez importer une image avant de générer la publication."
        )

        return
      }

      if (!posterRef.current) {
        alert(
          "Impossible de récupérer le visuel."
        )

        return
      }

      if (!selectedAssembleeId) {
        alert(
          "Veuillez sélectionner une assemblée."
        )

        return
      }

      if (!selectedDimancheId) {
        alert(
          "Veuillez sélectionner un dimanche."
        )

        return
      }

      if (!selectedSunday) {
        alert(
          "La date du dimanche est introuvable."
        )

        return
      }

      const modeleFrontend =
        publicationModels[
          selectedTemplate
        ]

      const slugFrontend =
        normalizeText(
          selectedTemplate
        )

      const nomFrontend =
        normalizeText(
          modeleFrontend?.name
        )

      const modeleDB =
        modelesDB.find(
          (modele) => {
            const slugDB =
              normalizeText(
                modele?.slug
              )

            const nomDB =
              normalizeText(
                modele?.nom
              )

            return (
              slugDB ===
                slugFrontend ||
              nomDB ===
                nomFrontend
            )
          }
        )

      const modeleIdFinal =
        modeleDB
          ? Number(
              modeleDB.id
            )
          : Number(
              selectedModeleId
            )

      if (
        !Number.isInteger(
          modeleIdFinal
        ) ||
        modeleIdFinal <= 0
      ) {
        alert(
          `Le modèle « ${selectedLibraryModel.name} » n'existe pas dans la base de données.`
        )

        return
      }

      const token =
        getToken()

      if (!token) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter."
        )

        return
      }

      let captureModeActivated =
        false

      try {
        setIsGenerating(true)

        const poster =
          posterRef.current

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        )

        poster.classList.add(
          "capture-mode"
        )

        captureModeActivated =
          true

        await waitForImages(
          poster
        )

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              300
            )
        )

        const images =
          Array.from(
            poster.querySelectorAll(
              "img"
            )
          )

        for (
          const image of images
        ) {
          if (
            !image.complete ||
            image.naturalWidth === 0
          ) {
            throw new Error(
              "Une image du visuel n'a pas pu être chargée correctement."
            )
          }
        }

        const dataUrl =
          await toPng(
            poster,
            {
              cacheBust: true,
              pixelRatio: 3,
              backgroundColor:
                "#000000",
              skipFonts: false,
              width:
                poster.offsetWidth,
              height:
                poster.offsetHeight,
            }
          )

        const dateName =
          cleanFileName(
            formatDate(
              selectedSunday
            )
          )

        const templateName =
          cleanFileName(
            selectedLibraryModel.name
          )

        const fileName =
          `bethel-glory-media-${templateName}-${dateName}.png`

        const responseImage =
          await fetch(dataUrl)

        if (!responseImage.ok) {
          throw new Error(
            "Impossible de convertir le visuel en fichier."
          )
        }

        const blob =
          await responseImage.blob()

        const file =
          new File(
            [blob],
            fileName,
            {
              type: "image/png",
            }
          )

        const formData =
          new FormData()

        formData.append(
          "fichier",
          file
        )

        formData.append(
          "assemblee_id",
          String(
            selectedAssembleeId
          )
        )

        formData.append(
          "dimanche_id",
          String(
            selectedDimancheId
          )
        )

        formData.append(
          "modele_id",
          String(
            modeleIdFinal
          )
        )

        formData.append(
          "titre",
          selectedLibraryModel.name
        )

        formData.append(
          "texte",
          `Publication ${selectedLibraryModel.name}`
        )

        formData.append(
          "verset",
          ""
        )

        formData.append(
          "statut",
          "terminee"
        )

        // ------------------------------------------------------
        // ENREGISTREMENT SERVEUR
        // ------------------------------------------------------

        const responsePublication =
          await fetch(
            `${API_URL}/api/publications`,
            {
              method: "POST",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              body: formData,
            }
          )

        const dataPublication =
          await responsePublication.json()

        if (
          !responsePublication.ok
        ) {
          throw new Error(
            dataPublication?.message ||
              "Impossible d'enregistrer la publication."
          )
        }

        console.log(
          "Publication enregistrée :",
          dataPublication
        )

        // ------------------------------------------------------
        // TÉLÉCHARGEMENT
        // ------------------------------------------------------

        const link =
          document.createElement(
            "a"
          )

        link.href = dataUrl
        link.download =
          fileName

        document.body.appendChild(
          link
        )

        link.click()

        document.body.removeChild(
          link
        )

        alert(
          "Publication générée et enregistrée avec succès."
        )
      } catch (error) {
        console.error(
          "Erreur génération publication :",
          error
        )

        alert(
          error?.message ||
            "Une erreur est survenue pendant la génération."
        )
      } finally {
        if (
          captureModeActivated &&
          posterRef.current
        ) {
          posterRef.current.classList.remove(
            "capture-mode"
          )
        }

        setIsGenerating(false)
      }
    }

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f6f8f7]">

      <style>{`

        @keyframes pageFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes heroDown {
          from {
            opacity: 0;
            transform: translateY(-35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroUp {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floating {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(25px, -25px, 0);
          }
        }

        @keyframes floatingReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-25px, 20px, 0);
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }

          50% {
            opacity: 0.55;
            transform: scale(1.25);
          }
        }

        @keyframes cardUp {
          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardLeft {
          from {
            opacity: 0;
            transform: translateX(-55px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardRight {
          from {
            opacity: 0;
            transform: translateX(55px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(250, 204, 21, 0);
          }

          50% {
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.2);
          }
        }

        @keyframes previewAppear {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(25px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes previewSwitch {
          0% {
            opacity: 0.3;
            transform: scale(0.96);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes selectedPop {
          0% {
            transform: scale(0.75);
          }

          60% {
            transform: scale(1.15);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes uploadPulse {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(22, 101, 52, 0);
          }

          50% {
            box-shadow: 0 0 25px rgba(22, 101, 52, 0.12);
          }
        }

        @keyframes ctaAppear {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-fade {
          animation: pageFade 0.7s ease-out both;
        }

        .hero-down {
          animation: heroDown 0.8s ease-out both;
        }

        .hero-up {
          animation: heroUp 0.85s ease-out both;
        }

        .hero-scale {
          animation: heroScale 0.7s ease-out both;
        }

        .floating {
          animation: floating 6s ease-in-out infinite;
        }

        .floating-reverse {
          animation: floatingReverse 7s ease-in-out infinite;
        }

        .glow {
          animation: glow 4s ease-in-out infinite;
        }

        .card-up {
          animation: cardUp 0.8s ease-out both;
        }

        .card-left {
          animation: cardLeft 0.8s ease-out both;
        }

        .card-right {
          animation: cardRight 0.8s ease-out both;
        }

        .icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 2.8s ease-in-out infinite;
        }

        .preview-appear {
          animation: previewAppear 0.8s ease-out both;
        }

        .preview-switch {
          animation: previewSwitch 0.45s ease-out both;
        }

        .selected-pop {
          animation: selectedPop 0.4s ease-out both;
        }

        .upload-pulse {
          animation: uploadPulse 3s ease-in-out infinite;
        }

        .cta-appear {
          animation: ctaAppear 0.8s ease-out both;
        }

        .capture-mode,
        .capture-mode * {
          animation: none !important;
          transition: none !important;
        }

        .capture-mode {
          transform: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .page-fade,
          .hero-down,
          .hero-up,
          .hero-scale,
          .floating,
          .floating-reverse,
          .glow,
          .card-up,
          .card-left,
          .card-right,
          .icon-float,
          .pulse-glow,
          .preview-appear,
          .preview-switch,
          .selected-pop,
          .upload-pulse,
          .cta-appear {
            animation: none !important;
          }
        }

      `}</style>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-green-950 pt-24 sm:pt-32">

        <div className="floating absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl sm:h-96 sm:w-96" />

        <div className="floating-reverse absolute -right-32 top-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="glow absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-green-400/10 blur-3xl sm:h-72 sm:w-72" />

        <div className="absolute left-[15%] top-40 h-2 w-2 animate-pulse rounded-full bg-yellow-300/70" />

        <div className="absolute right-[20%] top-48 h-2 w-2 animate-ping rounded-full bg-white/40" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">

          <Link
            to="/"
            className="hero-down group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20 sm:px-5"
          >
            <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            Retour à l'accueil
          </Link>

          <div className="mx-auto mt-12 max-w-4xl text-center sm:mt-16">

            <div
              className="hero-scale mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-300 backdrop-blur sm:px-4 sm:text-sm"
              style={{
                animationDelay:
                  "0.15s",
              }}
            >
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-yellow-300" />

              BETHEL GLORY MEDIA
            </div>

            <h1
              className="hero-up mt-6 text-4xl font-black tracking-tight text-white sm:mt-7 sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                animationDelay:
                  "0.3s",
              }}
            >
              Créer une

              <span className="block text-yellow-400">
                publication
              </span>
            </h1>

            <p
              className="hero-up mx-auto mt-6 max-w-3xl text-base leading-7 text-green-100 sm:mt-7 sm:text-lg sm:leading-8"
              style={{
                animationDelay:
                  "0.45s",
              }}
            >
              Importez votre photo,
              choisissez votre modèle,
              sélectionnez votre
              assemblée et votre
              dimanche pour préparer
              votre visuel de
              communication.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:mt-10 sm:gap-3">

              <div className="hero-up rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
                <span className="text-yellow-300">
                  {
                    Object.keys(
                      publicationModels
                    ).length
                  }
                </span>{" "}
                modèles disponibles
              </div>

              <div className="hero-up rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
                <span className="text-yellow-300">
                  {
                    dimanches.length
                  }
                </span>{" "}
                dimanches disponibles
              </div>

              <div className="hero-up rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
                <span className="text-yellow-300">
                  {
                    assemblees.length
                  }
                </span>{" "}
                assemblées disponibles
              </div>

              <div className="hero-up rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
                Création visuelle
              </div>

            </div>

          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f6f8f7] to-transparent" />

      </section>

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <main className="page-fade mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">

        {/* INTRO */}

        <section className="relative -mt-2">

          <div
            className="card-up group rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl sm:p-8 md:p-10"
            style={{
              animationDelay:
                "0.2s",
            }}
          >

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">

              <div className="max-w-2xl">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:text-sm">
                  Studio de création
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
                  Préparez votre{" "}
                  <span className="text-green-800">
                    visuel
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                  Suivez les différentes
                  étapes pour personnaliser
                  votre publication,
                  sélectionner votre
                  assemblée, votre dimanche
                  et visualiser immédiatement
                  le résultat final.
                </p>

              </div>

              <div className="icon-float hidden h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-green-50 text-5xl shadow-sm md:flex">
                🎨
              </div>

            </div>

          </div>

        </section>

        {/* ERREUR */}

        {errorData && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            ⚠️ {errorData}
          </div>
        )}

        {/* CREATION */}

        <section className="mt-12 sm:mt-16">

          <div
            className="card-up mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between"
            style={{
              animationDelay:
                "0.25s",
            }}
          >

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700 sm:text-sm">
                Création
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
                Construisez votre publication
              </h2>

            </div>

            <p className="max-w-md text-sm leading-6 text-gray-500 sm:text-right">
              Personnalisez votre image,
              votre modèle, votre
              assemblée et le dimanche
              associé à votre publication.
            </p>

          </div>

          {/* MODÈLE TRANSMIS */}

          {urlTemplate &&
            libraryTemplateForDisplay()}

          {/* ASSEMBLÉE */}

          <div className="mb-6 rounded-[2rem] border border-green-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-green-700 sm:text-xs">
                  Assemblée
                </p>

                <h3 className="mt-1 text-lg font-black text-gray-950">
                  Assemblée concernée
                </h3>

                {selectedAssemblee && (
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedAssemblee.nom}

                    {selectedAssemblee.ville
                      ? ` · ${selectedAssemblee.ville}`
                      : ""}

                    {selectedAssemblee.quartier
                      ? ` · ${selectedAssemblee.quartier}`
                      : ""}
                  </p>
                )}

                {!selectedAssembleeId &&
                  assemblees.length === 0 && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      Aucune assemblée active disponible.
                    </p>
                  )}

              </div>

              <select
                value={
                  selectedAssembleeId ||
                  ""
                }
                onChange={(event) => {
                  const nouvelleAssembleeId =
                    event.target.value

                  setSelectedAssembleeId(
                    nouvelleAssembleeId
                  )

                  setSelectedDimancheId(
                    null
                  )

                  setSelectedSunday(
                    null
                  )

                  setDimanches([])

                  setErrorData("")
                }}
                disabled={
                  isLoadingData ||
                  assemblees.length ===
                    0
                }
                className="min-w-[280px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <option value="">
                  Sélectionner une assemblée
                </option>

                {assemblees.map(
                  (assemblee) => (
                    <option
                      key={
                        assemblee.id
                      }
                      value={
                        assemblee.id
                      }
                    >
                      {assemblee.nom}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* PANNEAUX */}

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7">

            {/* CONTRÔLE */}

            <div
              className="card-left overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
              style={{
                animationDelay:
                  "0.35s",
              }}
            >

              <div className="p-4 sm:p-6 md:p-8">

                {/* ÉTAPE 1 */}

                <div>

                  <div className="flex items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-950 text-xs font-black text-yellow-300 sm:h-12 sm:w-12 sm:text-sm">
                      01
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-green-700 sm:text-xs">
                        Première étape
                      </p>

                      <h3 className="mt-1 text-lg font-black text-gray-950 sm:text-xl">
                        Votre photo
                      </h3>

                    </div>

                  </div>

                  <label className="upload-pulse group mt-5 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition duration-500 hover:-translate-y-1 hover:border-green-600 hover:bg-green-50 sm:mt-6 sm:p-8">

                    {preview ? (
                      <div className="relative w-full">

                        <img
                          src={preview}
                          alt="Aperçu"
                          className="preview-appear mx-auto max-h-64 w-auto max-w-full rounded-2xl object-contain shadow-lg"
                        />

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-950 px-3 py-2 text-[10px] font-black text-white shadow-lg sm:px-4 sm:text-xs">

                          <span className="h-2 w-2 rounded-full bg-green-400" />

                          Image sélectionnée

                        </div>

                      </div>
                    ) : (
                      <>
                        <div className="icon-float flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl sm:h-16 sm:w-16 sm:text-3xl">
                          🖼️
                        </div>

                        <span className="mt-4 text-sm font-black text-gray-800 sm:text-base">
                          Importer une image
                        </span>

                        <span className="mt-2 text-xs text-gray-500 sm:text-sm">
                          PNG, JPG, JPEG ou WEBP
                        </span>

                        <span className="mt-4 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-gray-500 shadow-sm sm:px-4 sm:text-xs">
                          Cliquez pour parcourir
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />

                  </label>

                </div>

                <div className="my-8 h-px bg-gray-100 sm:my-10" />

                {/* ÉTAPE 2 */}

                <div
                  id="modeles"
                  className="scroll-mt-24"
                >

                  <div className="flex items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-950 text-xs font-black text-yellow-300 sm:h-12 sm:w-12 sm:text-sm">
                      02
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-green-700 sm:text-xs">
                        Deuxième étape
                      </p>

                      <h3 className="mt-1 text-lg font-black text-gray-950 sm:text-xl">
                        Choisir un modèle
                      </h3>

                    </div>

                  </div>

                  <div className="mt-5 grid max-h-[700px] gap-3 overflow-y-auto pr-1 sm:mt-6 sm:grid-cols-2">

                    {Object.entries(
                      publicationModels
                    ).map(
                      (
                        [
                          slug,
                          model,
                        ],
                        index
                      ) => {

                        const isSelected =
                          selectedTemplate ===
                          slug

                        return (
                          <button
                            key={
                              slug
                            }
                            type="button"
                            onClick={() =>
                              handleSelectTemplate(
                                slug
                              )
                            }
                            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-500 sm:p-4 ${
                              isSelected
                                ? "selected-pop border-yellow-400 bg-green-950 shadow-xl"
                                : "border-gray-200 bg-white hover:-translate-y-1 hover:border-green-400 hover:bg-green-50/50 hover:shadow-md"
                            }`}
                          >

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ${
                                isSelected
                                  ? "bg-yellow-400 text-green-950"
                                  : "bg-green-950 text-yellow-300"
                              }`}
                            >
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div className="min-w-0 flex-1">

                              <p
                                className={`truncate text-sm font-black sm:text-base ${
                                  isSelected
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {
                                  model.name
                                }
                              </p>

                              <div className="mt-1 flex flex-wrap items-center gap-1.5">

                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                    isSelected
                                      ? "bg-white/10 text-green-200"
                                      : "bg-green-50 text-green-700"
                                  }`}
                                >
                                  {
                                    model.category
                                  }
                                </span>

                                <span
                                  className={`text-[9px] font-bold uppercase ${
                                    isSelected
                                      ? "text-yellow-300"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {
                                    model.style
                                  }
                                </span>

                              </div>

                            </div>

                            {isSelected && (
                              <span className="selected-pop flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-green-950 shadow-lg">
                                ✓
                              </span>
                            )}

                          </button>
                        )
                      }
                    )}

                  </div>

                </div>

                <div className="my-8 h-px bg-gray-100 sm:my-10" />

                {/* ÉTAPE 3 */}

                <div>

                  <div className="flex items-center gap-3 sm:gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-950 text-xs font-black text-yellow-300 sm:h-12 sm:w-12 sm:text-sm">
                      03
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-green-700 sm:text-xs">
                        Troisième étape
                      </p>

                      <h3 className="mt-1 text-lg font-black text-gray-950 sm:text-xl">
                        Choisir le dimanche
                      </h3>

                    </div>

                  </div>

                  {dimanches.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
                      {selectedAssembleeId
                        ? "Aucun dimanche enregistré pour cette assemblée."
                        : "Sélectionnez une assemblée pour afficher ses dimanches."}
                    </div>
                  ) : (
                    <div className="mt-5 space-y-2.5">

                      {dimanches.map(
                        (
                          dimanche,
                          index
                        ) => {

                          const dateDimanche =
                            normalizeMysqlDate(
                              dimanche.date_dimanche
                            )

                          if (
                            !dateDimanche
                          ) {
                            return null
                          }

                          const isSelected =
                            Number(
                              selectedDimancheId
                            ) ===
                            Number(
                              dimanche.id
                            )

                          return (
                            <button
                              type="button"
                              key={
                                dimanche.id
                              }
                              onClick={() =>
                                handleSelectSunday(
                                  dimanche
                                )
                              }
                              className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-500 sm:gap-4 sm:p-4 ${
                                isSelected
                                  ? "selected-pop border-green-700 bg-green-50 shadow-md"
                                  : "border-gray-200 bg-white hover:-translate-y-1 hover:border-green-400 hover:bg-green-50/40 hover:shadow-sm"
                              }`}
                            >

                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-black sm:h-10 sm:w-10 sm:text-xs ${
                                  isSelected
                                    ? "bg-green-950 text-yellow-300"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="text-[9px] font-black uppercase tracking-wider text-green-700 sm:text-[10px]">
                                  Dimanche
                                </p>

                                <p className="mt-1 truncate text-xs font-black text-gray-900 sm:text-sm">
                                  {formatDate(
                                    dateDimanche
                                  )}
                                </p>

                              </div>

                              {isSelected && (
                                <span className="selected-pop flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-black text-white shadow-md sm:h-8 sm:w-8 sm:text-sm">
                                  ✓
                                </span>
                              )}

                            </button>
                          )
                        }
                      )}

                    </div>
                  )}

                </div>

                {/* ÉTAT */}

                <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-4">

                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                    État de la publication
                  </p>

                  <div className="mt-3 space-y-2 text-xs">

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">
                        Assemblée
                      </span>

                      <span className="font-black text-gray-900">
                        {selectedAssembleeId
                          ? "✓"
                          : "⚠️"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">
                        Dimanche
                      </span>

                      <span className="font-black text-gray-900">
                        {selectedDimancheId
                          ? "✓"
                          : "⚠️"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">
                        Date DB
                      </span>

                      <span className="font-black text-gray-900">
                        {selectedSunday
                          ? formatMysqlDate(
                              selectedSunday
                            )
                          : "⚠️"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">
                        Modèle DB
                      </span>

                      <span className="font-black text-gray-900">
                        {selectedModeleId
                          ? `✓ #${selectedModeleId}`
                          : "⚠️"}
                      </span>
                    </div>

                  </div>

                </div>

                {/* BOUTON */}

                <button
                  type="button"
                  onClick={
                    handleGenerate
                  }
                  disabled={
                    isGenerating ||
                    isLoadingData
                  }
                  className={`pulse-glow group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-black text-white shadow-lg transition-all duration-500 sm:mt-8 sm:gap-3 sm:px-6 sm:text-base ${
                    isGenerating
                      ? "cursor-wait bg-green-800"
                      : "bg-green-950 hover:-translate-y-2 hover:bg-green-900 hover:shadow-2xl"
                  }`}
                >

                  {isGenerating ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Génération et enregistrement...
                    </>
                  ) : (
                    <>
                      <span className="text-base transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125 sm:text-lg">
                        ✨
                      </span>

                      Générer la publication

                      <span className="transition-transform duration-500 group-hover:translate-x-2">
                        →
                      </span>
                    </>
                  )}

                </button>

              </div>

            </div>

            {/* APERÇU */}

            <div
              className="card-right relative overflow-hidden rounded-[2rem] bg-green-950 p-4 shadow-xl sm:p-6 md:p-8"
              style={{
                animationDelay:
                  "0.5s",
              }}
            >

              <div className="floating-reverse absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />

              <div className="floating absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-green-600/20 blur-3xl" />

              <div className="glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-3xl" />

              <div className="relative">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300 sm:text-xs">
                      Studio
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white sm:text-2xl md:text-3xl">
                      Aperçu du modèle
                    </h2>

                  </div>

                  <div className="pulse-glow w-fit rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black text-white backdrop-blur-md sm:px-4 sm:text-xs">
                    {
                      selectedLibraryModel.name
                    }
                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">

                  <span className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold text-green-100 sm:text-xs">
                    {selectedSunday
                      ? formatDate(
                          selectedSunday
                        )
                      : "Date non sélectionnée"}
                  </span>

                  <span className="rounded-full bg-yellow-400/10 px-3 py-2 text-[10px] font-bold text-yellow-300 sm:text-xs">
                    {
                      currentTemplate.description
                    }
                  </span>

                  <span className="rounded-full bg-green-400/10 px-3 py-2 text-[10px] font-bold text-green-200 sm:text-xs">
                    {
                      selectedLibraryModel.category
                    }
                  </span>

                  {selectedAssemblee && (
                    <span className="rounded-full bg-green-300/10 px-3 py-2 text-[10px] font-bold text-green-200 sm:text-xs">
                      {
                        selectedAssemblee.nom
                      }
                    </span>
                  )}

                </div>

                {/* INFORMATIONS ASSEMBLÉE */}

                {selectedAssemblee && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md">

                        <img
                          src={
                            assembleeLogo
                          }
                          alt={
                            assembleeData.nom ||
                            "Logo assemblée"
                          }
                          className="h-full w-full object-contain"
                          onError={(event) => {
                            if (
                              event.currentTarget.dataset.fallback ===
                              "1"
                            ) {
                              return
                            }

                            event.currentTarget.dataset.fallback =
                              "1"

                            event.currentTarget.src =
                              dani
                          }}
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-xs font-black text-white sm:text-sm">
                          {
                            assembleeData.nom
                          }
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-green-300 sm:text-xs">

                          {
                            assembleeData.ville
                          }

                          {
                            assembleeData.quartier
                              ? ` · ${assembleeData.quartier}`
                              : ""
                          }

                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {/* POSTER */}

                <div className="preview-appear mt-5 flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/10 p-2.5 backdrop-blur-sm sm:mt-6 sm:min-h-[520px] sm:p-4 md:min-h-[600px] md:p-6">

                  <div
                    ref={
                      posterRef
                    }
                    className="relative w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl"
                  >

                    {SelectedTemplateComponent ? (
                      <div
                        key={`${selectedTemplate}-${selectedAssembleeId || "aucune"}-${selectedDimancheId || "aucun"}`}
                        className="preview-switch w-full"
                      >

                        <SelectedTemplateComponent
                          image={
                            preview
                          }

                          photo={
                            preview
                          }

                          preview={
                            preview
                          }

                          date={
                            selectedSunday
                              ? formatDatePublication(
                                  selectedSunday
                                )
                              : ""
                          }

                          dateDimanche={
                            selectedSunday
                              ? formatDatePublication(
                                  selectedSunday
                                )
                              : ""
                          }

                          assemblee={
                            selectedAssemblee
                          }

                          assembleeData={
                            assembleeData
                          }

                          nomEglise={
                            selectedAssemblee?.eglise_nom ||
                            ""
                          }

                          nomAssemblee={
                            assembleeData.nom ||
                            ""
                          }

                          nomAssemble={
                            assembleeData.nom ||
                            ""
                          }

                          ville={
                            assembleeData.ville ||
                            ""
                          }

                          quartier={
                            assembleeData.quartier ||
                            ""
                          }

                          adresse={
                            assembleeData.adresse ||
                            ""
                          }

                          telephone={
                            assembleeData.telephone ||
                            ""
                          }

                          logoAssemblee={
                            assembleeLogo
                          }

                          logo={
                            assembleeLogo
                          }

                          assembleeId={
                            assembleeData.id
                          }

                          motif={
                            selectedLibraryModel.name
                          }

                          filigrane={
                            selectedLibraryModel.name
                          }

                          modele={
                            selectedLibraryModel.name
                          }

                          modeleSlug={
                            selectedTemplate
                          }

                        />

                      </div>
                    ) : (
                      <div className="flex min-h-[500px] items-center justify-center bg-gray-900 text-center text-white">

                        <div>

                          <div className="text-5xl">
                            🎨
                          </div>

                          <p className="mt-4 text-sm font-bold">
                            Aucun modèle sélectionné
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* FOOTER */}

                <div className="mt-5 flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <p className="text-[10px] font-bold text-green-300 sm:text-xs">
                      Modèle sélectionné
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-white sm:text-base">
                      {
                        selectedLibraryModel.name
                      }
                    </p>

                    <p className="mt-1 truncate text-[10px] text-green-300 sm:text-xs">
                      {
                        selectedLibraryModel.category
                      }{" "}
                      ·{" "}
                      {
                        selectedLibraryModel.style
                      }
                    </p>

                  </div>

                  <div className="selected-pop flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-green-950 shadow-lg sm:h-10 sm:w-10">
                    ✓
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* STATISTIQUES */}

        <section className="mt-12 sm:mt-16">

          <div className="grid gap-4 sm:grid-cols-3">

            <div
              className="card-up rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm"
              style={{
                animationDelay:
                  "0.65s",
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                    Modèles
                  </p>

                  <p className="mt-2 text-3xl font-black text-green-950">
                    {
                      Object.keys(
                        publicationModels
                      ).length
                    }
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">
                  🎨
                </div>

              </div>

              <p className="mt-3 text-xs font-semibold text-gray-500">
                Modèles disponibles
              </p>

            </div>

            <div
              className="card-up rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm"
              style={{
                animationDelay:
                  "0.75s",
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                    Dimanches
                  </p>

                  <p className="mt-2 text-3xl font-black text-green-950">
                    {
                      dimanches.length
                    }
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-xl">
                  📅
                </div>

              </div>

              <p className="mt-3 text-xs font-semibold text-gray-500">
                Dimanches de l'assemblée sélectionnée
              </p>

            </div>

            <div
              className="card-up rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm"
              style={{
                animationDelay:
                  "0.85s",
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                    État
                  </p>

                  <p className="mt-2 text-xl font-black text-green-950">
                    {selectedModeleId &&
                    selectedDimancheId &&
                    selectedAssembleeId
                      ? "PRÊT"
                      : "EN ATTENTE"}
                  </p>

                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                    selectedModeleId &&
                    selectedDimancheId &&
                    selectedAssembleeId
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {selectedModeleId &&
                  selectedDimancheId &&
                  selectedAssembleeId
                    ? "✓"
                    : "⚠️"}
                </div>

              </div>

              <p className="mt-3 text-xs font-semibold text-gray-500">
                État de préparation
              </p>

            </div>

          </div>

        </section>

        {/* RAPPEL */}

        <section
          className="cta-appear mt-8 rounded-[2rem] border border-green-100 bg-gradient-to-r from-green-950 via-green-900 to-green-950 p-6 shadow-xl sm:mt-10 sm:p-8"
          style={{
            animationDelay:
              "0.95s",
          }}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                BETHEL GLORY MEDIA
              </p>

              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                Votre publication sera enregistrée automatiquement.
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-green-100">
                Après la génération, le visuel est envoyé au serveur,
                enregistré dans la base de données avec l'assemblée
                et le dimanche sélectionnés, puis téléchargé
                sur votre appareil.
              </p>

            </div>

            <Link
            to="/"
            className="hero-down group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20 sm:px-5"
          >
            <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            Retour à l'accueil
          </Link>

          </div>

        </section>

      </main>

    </div>
  )
}

// ============================================================
// PETIT COMPOSANT POUR LE MODÈLE TRANSMIS PAR URL
// ============================================================

function libraryTemplateForDisplay() {
  return null
}

export default Publications


