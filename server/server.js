// ============================================================
// BETHEL GLORY MEDIA
// SERVER PRINCIPAL
// ============================================================

require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { Resend } = require("resend")
const { GoogleGenAI } = require("@google/genai")

const {
  verifierToken,
  verifierAdministrateur,
} = require("./authMiddleware")

// ============================================================
// APPLICATION
// ============================================================

const app = express()

const PORT = process.env.PORT || 5000

// ============================================================
// GEMINI
// ============================================================

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// ============================================================
// BASE DE DONNÃ‰ES
// ============================================================

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bethel_glory_studio",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// ============================================================
// RESEND
// ============================================================

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// ============================================================
// DOSSIERS UPLOADS
// ============================================================

const uploadsDir = path.join(
  __dirname,
  "uploads"
)

const responsablesDir = path.join(
  uploadsDir,
  "responsables"
)

const imagesDir = path.join(
  uploadsDir,
  "images"
)

const publicationsDir = path.join(
  uploadsDir,
  "publications"
)

const filigranesDir = path.join(
  uploadsDir,
  "filigranes"
)

const logosDir = path.join(
  uploadsDir,
  "logos"
)

;[
  uploadsDir,
  responsablesDir,
  imagesDir,
  publicationsDir,
  filigranesDir,
  logosDir,
].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    })
  }
})

// ============================================================
// MIDDLEWARES
// ============================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use(
  express.json({
    limit: "50mb",
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
)

// ============================================================
// FICHIERS STATIQUES
// ============================================================

app.use(
  "/uploads",
  express.static(uploadsDir)
)

// ============================================================
// FONCTIONS AUTORISÃ‰ES
// ============================================================

const fonctionsAutorisees = [
  "apotre",
  "pasteur",
  "ancien_principal",
  "ancien_second",
  "diacre",
  "diaconesse",
]

// ============================================================
// NORMALISATION FONCTION
// ============================================================

function normaliserFonction(fonction) {
  if (!fonction) {
    return ""
  }

  return String(fonction)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
}

// ============================================================
// NORMALISATION LOGO
// ============================================================

function normaliserLogo(logo) {
  if (!logo) {
    return ""
  }

  let valeur = String(logo).trim()

  if (!valeur) {
    return ""
  }

  if (
    valeur.startsWith("http://") ||
    valeur.startsWith("https://") ||
    valeur.startsWith("data:")
  ) {
    return valeur
  }

  valeur = valeur.replace(
    /^https?:\/\/localhost:\d+/i,
    ""
  )

  if (!valeur.startsWith("/")) {
    valeur = `/${valeur}`
  }

  valeur = valeur.replace(
    /^\/+/,
    "/"
  )

  return valeur
}

// ============================================================
// UTILISATEUR CONNECTÃ‰
// ============================================================

function obtenirUtilisateurId(req) {
  return (
    req.utilisateur?.id ||
    req.utilisateur?.userId ||
    req.utilisateur?.utilisateur_id ||
    req.utilisateur?.id_utilisateur ||
    req.user?.id ||
    req.user?.userId ||
    req.user?.utilisateur_id ||
    req.user?.id_utilisateur ||
    null
  )
}

// ============================================================
// VALEUR NULLABLE
// ============================================================

function convertirNullable(value) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null" ||
    value === "undefined"
  ) {
    return null
  }

  return value
}

// ============================================================
// SUPPRESSION PHOTO RESPONSABLE
// ============================================================

function supprimerPhoto(photo) {
  if (!photo) {
    return
  }

  try {
    const nomFichier = path.basename(
      String(photo)
    )

    const fichier = path.join(
      responsablesDir,
      nomFichier
    )

    if (fs.existsSync(fichier)) {
      fs.unlinkSync(fichier)
    }
  } catch (error) {
    console.error(
      "âŒ Erreur suppression photo :",
      error.message
    )
  }
}

// ============================================================
// SUPPRESSION FICHIER PUBLICATION
// ============================================================

function supprimerFichierPublication(
  fichierFinal
) {
  if (!fichierFinal) {
    return
  }

  try {
    const nomFichier = path.basename(
      String(fichierFinal)
    )

    const fichier = path.join(
      publicationsDir,
      nomFichier
    )

    if (fs.existsSync(fichier)) {
      fs.unlinkSync(fichier)

      console.log(
        "ðŸ—‘ï¸ Fichier publication supprimÃ© :",
        fichier
      )
    }
  } catch (error) {
    console.error(
      "âŒ Erreur suppression publication :",
      error.message
    )
  }
}

// ============================================================
// MULTER RESPONSABLES
// ============================================================

const storageResponsable =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        responsablesDir
      )
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        )

      const nom =
        `responsable-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`

      cb(null, nom)
    },
  })

const uploadResponsable =
  multer({
    storage:
      storageResponsable,

    limits: {
      fileSize:
        50 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const typesAutorises = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ]

      if (
        typesAutorises.includes(
          file.mimetype
        )
      ) {
        cb(null, true)
      } else {
        cb(
          new Error(
            "Format d'image non autorisÃ©"
          )
        )
      }
    },
  })

// ============================================================
// MULTER IMAGES
// ============================================================

const storageImage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        imagesDir
      )
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        )

      const nom =
        `image-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`

      cb(null, nom)
    },
  })

const uploadImage =
  multer({
    storage:
      storageImage,

    limits: {
      fileSize:
        100 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const typesAutorises = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ]

      if (
        typesAutorises.includes(
          file.mimetype
        )
      ) {
        cb(null, true)
      } else {
        cb(
          new Error(
            "Format d'image non autorisÃ©"
          )
        )
      }
    },
  })

// ============================================================
// MULTER PUBLICATIONS
// ============================================================

const storagePublication =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        publicationsDir
      )
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        ) || ".png"

      const nom =
        `publication-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`

      cb(null, nom)
    },
  })

const uploadPublication =
  multer({
    storage:
      storagePublication,

    limits: {
      fileSize:
        100 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const typesAutorises = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ]

      if (
        typesAutorises.includes(
          file.mimetype
        )
      ) {
        cb(null, true)
      } else {
        cb(
          new Error(
            "La publication doit Ãªtre une image JPEG, PNG ou WEBP"
          )
        )
      }
    },
  })

// ============================================================
// VÃ‰RIFICATION STRUCTURE UTILISATEURS
// ============================================================

async function verifierStructureUtilisateurs() {
  try {
    await db.query(`
      ALTER TABLE utilisateurs
      MODIFY COLUMN email VARCHAR(255) NULL
    `)

    await db.query(`
      ALTER TABLE utilisateurs
      MODIFY COLUMN telephone VARCHAR(50) NULL
    `)

    await db.query(`
      ALTER TABLE utilisateurs
      MODIFY COLUMN mot_de_passe VARCHAR(255) NULL
    `)

    const [
      colonnes,
    ] =
      await db.query(`
        SHOW COLUMNS
        FROM utilisateurs
        LIKE 'fonction'
      `)

    if (
      colonnes.length > 0
    ) {
      const type =
        colonnes[0].Type || ""

      if (
        type.includes(
          "'apotre'"
        )
      ) {
        console.log(
          "âœ… La fonction apotre est disponible dans la base."
        )
      } else {
        console.warn(
          "âš ï¸ La fonction apotre n'est pas prÃ©sente dans l'ENUM fonction."
        )
      }
    }
  } catch (error) {
    console.error(
      "âŒ Erreur structure utilisateurs :",
      error.message
    )
  }
}

// ============================================================
// TABLE MESSAGES CONTACT
// ============================================================

async function initialiserTableMessages() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages_contact (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        sujet VARCHAR(255) NULL,
        message TEXT NOT NULL,
        lu TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `)

    console.log(
      "âœ… Table messages_contact vÃ©rifiÃ©e."
    )
  } catch (error) {
    console.error(
      "âŒ Erreur table messages_contact :",
      error.message
    )
  }
}

// ============================================================
// TABLE THEME ANNUEL
// ============================================================

async function initialiserTableThemeAnnee() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS theme_annee (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        annee VARCHAR(10) NOT NULL,
        theme VARCHAR(255) NOT NULL,
        verset VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_annee (annee)
      ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `)

    const [
      lignes,
    ] = await db.query(
      `
      SELECT id
      FROM theme_annee
      WHERE annee = 2026
      LIMIT 1
      `
    )

    if (
      lignes.length === 0
    ) {
      await db.query(
        `
        INSERT INTO theme_annee
        (
          annee,
          theme,
          verset
        )
        VALUES (?, ?, ?)
        `,
        [
          2026,
          "CONNAÃŽTRE DIEU POUR ÃŠTRE EXCELLENT",
          "Philippiens 3:13",
        ]
      )

      console.log(
        "âœ… ThÃ¨me annuel 2026 crÃ©Ã©."
      )
    }
  } catch (error) {
    console.error(
      "âŒ Erreur thÃ¨me annuel :",
      error.message
    )
  }
}

// ============================================================
// 32 MODÃˆLES DE PUBLICATION
// ============================================================

const modelesPublication = [
  {
    slug: "elegance-royale",
    nom: "Ã‰lÃ©gance Royale",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "grace-lumiere",
    nom: "GrÃ¢ce & LumiÃ¨re",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "dimanche-royal",
    nom: "Dimanche Royal",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "presence-divine",
    nom: "PrÃ©sence Divine",
    categorie: "Dimanche",
    format: "portrait",
  },

  {
    slug: "parole-vivante",
    nom: "Parole Vivante",
    categorie: "PrÃ©dication",
    format: "portrait",
  },
  {
    slug: "revelation",
    nom: "RÃ©vÃ©lation",
    categorie: "PrÃ©dication",
    format: "portrait",
  },
  {
    slug: "la-parole",
    nom: "La Parole",
    categorie: "PrÃ©dication",
    format: "portrait",
  },
  {
    slug: "impact-spirituel",
    nom: "Impact Spirituel",
    categorie: "PrÃ©dication",
    format: "portrait",
  },

  {
    slug: "louange-celeste",
    nom: "Louange CÃ©leste",
    categorie: "Louange",
    format: "portrait",
  },
  {
    slug: "adoration",
    nom: "Adoration",
    categorie: "Louange",
    format: "portrait",
  },
  {
    slug: "chant-de-victoire",
    nom: "Chant de Victoire",
    categorie: "Louange",
    format: "portrait",
  },
  {
    slug: "atmosphere-divine",
    nom: "AtmosphÃ¨re Divine",
    categorie: "Louange",
    format: "portrait",
  },

  {
    slug: "grande-conference",
    nom: "Grande ConfÃ©rence",
    categorie: "Ã‰vÃ©nement",
    format: "portrait",
  },
  {
    slug: "semaine-spirituelle",
    nom: "Semaine Spirituelle",
    categorie: "Ã‰vÃ©nement",
    format: "portrait",
  },
  {
    slug: "retraite-spirituelle",
    nom: "Retraite Spirituelle",
    categorie: "Ã‰vÃ©nement",
    format: "portrait",
  },
  {
    slug: "veillee-de-priere",
    nom: "VeillÃ©e de PriÃ¨re",
    categorie: "Ã‰vÃ©nement",
    format: "portrait",
  },

  {
    slug: "jeunesse-en-feu",
    nom: "Jeunesse en Feu",
    categorie: "Jeunesse",
    format: "portrait",
  },
  {
    slug: "generation-bethel",
    nom: "GÃ©nÃ©ration Bethel",
    categorie: "Jeunesse",
    format: "portrait",
  },
  {
    slug: "jeunesse-connect",
    nom: "Jeunesse Connect",
    categorie: "Jeunesse",
    format: "portrait",
  },
  {
    slug: "nouvelle-generation",
    nom: "Nouvelle GÃ©nÃ©ration",
    categorie: "Jeunesse",
    format: "portrait",
  },

  {
    slug: "femmes-de-destinee",
    nom: "Femmes de DestinÃ©e",
    categorie: "DÃ©partements",
    format: "portrait",
  },
  {
    slug: "hommes-de-foi",
    nom: "Hommes de Foi",
    categorie: "DÃ©partements",
    format: "portrait",
  },
  {
    slug: "ecole-du-dimanche",
    nom: "Ã‰cole du Dimanche",
    categorie: "DÃ©partements",
    format: "portrait",
  },
  {
    slug: "chorale-bethel",
    nom: "Chorale Bethel",
    categorie: "DÃ©partements",
    format: "portrait",
  },

  {
    slug: "verset-du-jour",
    nom: "Verset du Jour",
    categorie: "Publications",
    format: "portrait",
  },
  {
    slug: "pensee-du-jour",
    nom: "PensÃ©e du Jour",
    categorie: "Publications",
    format: "portrait",
  },
  {
    slug: "bonne-semaine",
    nom: "Bonne Semaine",
    categorie: "Publications",
    format: "portrait",
  },
  {
    slug: "bonne-journee",
    nom: "Bonne JournÃ©e",
    categorie: "Publications",
    format: "portrait",
  },

  {
    slug: "annonce-premium",
    nom: "Annonce Premium",
    categorie: "Annonces",
    format: "portrait",
  },
  {
    slug: "invitation-royale",
    nom: "Invitation Royale",
    categorie: "Annonces",
    format: "portrait",
  },
  {
    slug: "annonce-moderne",
    nom: "Annonce Moderne",
    categorie: "Annonces",
    format: "portrait",
  },
  {
    slug: "a-ne-pas-manquer",
    nom: "Ã€ Ne Pas Manquer",
    categorie: "Annonces",
    format: "portrait",
  },

  {
    slug: "modele-034",
    nom: "Modeles034",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "modele-035",
    nom: "Modeles035",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "modele-036",
    nom: "Modeles036",
    categorie: "Événement",
    format: "portrait",
  },
  {
    slug: "modele-037",
    nom: "Modeles037",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "modele-038",
    nom: "Modeles038",
    categorie: "Prédication",
    format: "portrait",
  },
  {
    slug: "modele-039",
    nom: "Modeles039",
    categorie: "Prédication",
    format: "portrait",
  },
  {
    slug: "modele-040",
    nom: "Modeles040",
    categorie: "Dimanche",
    format: "portrait",
  },
  {
    slug: "modele-041",
    nom: "Modeles041",
    categorie: "Louange",
    format: "portrait",
  },
  {
    slug: "modele-042",
    nom: "Modeles042",
    categorie: "Départements",
    format: "portrait",
  },
  {
    slug: "modele-043",
    nom: "Modeles043",
    categorie: "Annonces",
    format: "portrait",
  },
]

// ============================================================
// NORMALISATION NOM MODÃˆLE
// ============================================================

function normaliserNomModele(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
}

// ============================================================
// INITIALISATION DES MODÃˆLES
// ============================================================

async function initialiserModelesPublication() {
  try {
    console.log("")
    console.log(
      "=============================================="
    )
    console.log(
      "ðŸ”„ SYNCHRONISATION DES MODÃˆLES DE PUBLICATION"
    )
    console.log(
      "=============================================="
    )

    // --------------------------------------------------------
    // VÃ‰RIFIER LA TABLE
    // --------------------------------------------------------

    const [tables] = await db.query(`
      SHOW TABLES LIKE 'modeles_publication'
    `)

    if (tables.length === 0) {
      console.error(
        "âŒ La table modeles_publication n'existe pas."
      )

      return
    }

    // --------------------------------------------------------
    // VÃ‰RIFIER LES COLONNES
    // --------------------------------------------------------

    let [colonnes] = await db.query(`
      SHOW COLUMNS FROM modeles_publication
    `)

    let nomsColonnes =
      colonnes.map(
        (colonne) =>
          colonne.Field
      )

    // --------------------------------------------------------
    // AJOUTER SLUG SI NÃ‰CESSAIRE
    // --------------------------------------------------------

    if (!nomsColonnes.includes("slug")) {
      await db.query(`
        ALTER TABLE modeles_publication
        ADD COLUMN slug VARCHAR(255) NULL
        AFTER nom
      `)

      console.log(
        "âœ… Colonne slug ajoutÃ©e."
      )
    }

    // --------------------------------------------------------
    // AJOUTER CATEGORIE SI NÃ‰CESSAIRE
    // --------------------------------------------------------

    if (!nomsColonnes.includes("categorie")) {
      await db.query(`
        ALTER TABLE modeles_publication
        ADD COLUMN categorie VARCHAR(100) NULL
        AFTER slug
      `)

      console.log(
        "âœ… Colonne categorie ajoutÃ©e."
      )
    }

    // --------------------------------------------------------
    // AJOUTER ACTIF SI NÃ‰CESSAIRE
    // --------------------------------------------------------

    if (!nomsColonnes.includes("actif")) {
      await db.query(`
        ALTER TABLE modeles_publication
        ADD COLUMN actif TINYINT(1) NOT NULL DEFAULT 1
      `)

      console.log(
        "âœ… Colonne actif ajoutÃ©e."
      )
    }

    // --------------------------------------------------------
    // RÃ‰CUPÃ‰RER LES MODÃˆLES EXISTANTS
    // --------------------------------------------------------

    const [
      modelesExistants,
    ] = await db.query(`
      SELECT
        id,
        nom,
        slug,
        categorie,
        format,
        actif
      FROM modeles_publication
      ORDER BY id ASC
    `)

    // --------------------------------------------------------
    // NORMALISATION
    // --------------------------------------------------------

    const normaliser = (value) => {
      return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
    }

    // --------------------------------------------------------
    // DÃ‰SACTIVER LES ANCIENS MODÃˆLES
    // --------------------------------------------------------

    for (
      const ligne
      of modelesExistants
    ) {
      const slugDB =
        normaliser(
          ligne.slug
        )

      const nomDB =
        normaliser(
          ligne.nom
        )

      const modeleOfficiel =
        modelesPublication.find(
          (modele) => {
            const slugOfficiel =
              normaliser(
                modele.slug
              )

            const nomOfficiel =
              normaliser(
                modele.nom
              )

            return (
              slugDB ===
                slugOfficiel ||
              nomDB ===
                nomOfficiel
            )
          }
        )

      if (
        !modeleOfficiel &&
        Number(ligne.actif) === 1
      ) {
        await db.query(
          `
          UPDATE modeles_publication
          SET actif = 0
          WHERE id = ?
          `,
          [ligne.id]
        )

        console.log(
          `â¸ï¸ Ancien modÃ¨le dÃ©sactivÃ© : ${ligne.nom}`
        )
      }
    }

    // --------------------------------------------------------
    // SYNCHRONISER LES 32 MODÃˆLES
    // --------------------------------------------------------

    let crees = 0
    let misAJour = 0

    for (
      const modele
      of modelesPublication
    ) {
      const slugNormalise =
        normaliser(
          modele.slug
        )

      const nomNormalise =
        normaliser(
          modele.nom
        )

      // ------------------------------------------------------
      // RECHERCHE PAR SLUG
      // ------------------------------------------------------

      let modeleExistant =
        modelesExistants.find(
          (ligne) =>
            normaliser(
              ligne.slug
            ) ===
            slugNormalise
        )

      // ------------------------------------------------------
      // RECHERCHE PAR NOM
      // ------------------------------------------------------

      if (
        !modeleExistant
      ) {
        modeleExistant =
          modelesExistants.find(
            (ligne) =>
              normaliser(
                ligne.nom
              ) ===
              nomNormalise
          )
      }

      // ------------------------------------------------------
      // MODÃˆLE EXISTANT
      // ------------------------------------------------------

      if (
        modeleExistant
      ) {
        await db.query(
          `
          UPDATE modeles_publication
          SET
            nom = ?,
            slug = ?,
            categorie = ?,
            format = ?,
            actif = 1
          WHERE id = ?
          `,
          [
            modele.nom,
            modele.slug,
            modele.categorie,
            modele.format ||
              "portrait",
            modeleExistant.id,
          ]
        )

        modeleExistant.nom =
          modele.nom

        modeleExistant.slug =
          modele.slug

        modeleExistant.categorie =
          modele.categorie

        modeleExistant.format =
          modele.format ||
          "portrait"

        modeleExistant.actif =
          1

        misAJour++

        continue
      }

      // ------------------------------------------------------
      // MODÃˆLE ABSENT : CRÃ‰ATION
      // ------------------------------------------------------

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO modeles_publication
        (
          nom,
          slug,
          categorie,
          format,
          actif
        )
        VALUES (?, ?, ?, ?, 1)
        `,
        [
          modele.nom,
          modele.slug,
          modele.categorie,
          modele.format ||
            "portrait",
        ]
      )

      modelesExistants.push({
        id:
          resultat.insertId,
        nom:
          modele.nom,
        slug:
          modele.slug,
        categorie:
          modele.categorie,
        format:
          modele.format ||
          "portrait",
        actif: 1,
      })

      crees++

      console.log(
        `âž• ModÃ¨le crÃ©Ã© : ${modele.nom}`
      )
    }

    // --------------------------------------------------------
    // VÃ‰RIFICATION FINALE
    // --------------------------------------------------------

    const [
      modelesActifs,
    ] = await db.query(`
      SELECT
        id,
        nom,
        slug,
        categorie,
        format,
        actif
      FROM modeles_publication
      WHERE actif = 1
      ORDER BY id ASC
    `)

    console.log("")
    console.log(
      `ðŸ”„ ModÃ¨les mis Ã  jour : ${misAJour}`
    )

    console.log(
      `ðŸ†• ModÃ¨les crÃ©Ã©s : ${crees}`
    )

    console.log(
      `ðŸ“š ModÃ¨les actifs : ${modelesActifs.length}/42`
    )

    if (
      modelesActifs.length === 42
    ) {
      console.log(
        "âœ… LES 42 MODÃˆLES SONT CORRECTEMENT SYNCHRONISÃ‰S."
      )
    } else {
      console.warn(
        `âš ï¸ ATTENTION : ${modelesActifs.length}/42 modÃ¨les actifs.`
      )
    }

    // --------------------------------------------------------
    // AFFICHER LES MODÃˆLES
    // --------------------------------------------------------

    modelesActifs.forEach(
      (modele, index) => {
        console.log(
          `${index + 1}. ${modele.nom} | ${modele.slug} | ${modele.categorie} | ID ${modele.id}`
        )
      }
    )

    console.log(
      "=============================================="
    )
    console.log("")
  } catch (error) {
    console.error(
      "âŒ INITIALISATION MODÃˆLES PUBLICATION :",
      error
    )

    throw error
  }
}

// ============================================================
// RACINE
// ============================================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "BETHEL GLORY MEDIA API fonctionne correctement.",
      version: "2026",
    })
  }
)

// ============================================================
// TEST BASE DE DONNÃ‰ES
// ============================================================

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(
        "SELECT 1 AS resultat"
      )

      res.json({
        success: true,
        message:
          "Connexion MySQL rÃ©ussie.",
        data: rows,
      })
    } catch (error) {
      console.error(
        "âŒ TEST DB :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur de connexion Ã  la base de donnÃ©es.",
        error:
          error.message,
      })
    }
  }
)

// ============================================================
// THÃˆME ANNUEL PUBLIC
// ============================================================

app.get(
  "/api/theme-annee",
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM theme_annee
        ORDER BY annee DESC
        LIMIT 1
      `)

      res.json({
        success: true,
        theme:
          rows[0] || null,
      })
    } catch (error) {
      console.error(
        "âŒ THEME ANNEE :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration thÃ¨me annuel.",
      })
    }
  }
)

// ============================================================
// MODIFICATION THÃˆME ANNUEL
// ============================================================

app.put(
  "/api/theme-annee",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const {
        annee,
        theme,
        verset,
      } = req.body

      if (
        !annee ||
        !theme
      ) {
        return res.status(400).json({
          success: false,
          message:
            "L'année et le thème sont obligatoires.",
        })
      }

      await db.query(
        `
        INSERT INTO theme_annee
        (
          annee,
          theme,
          verset
        )
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          theme = VALUES(theme),
          verset = VALUES(verset)
        `,
        [
          annee,
          theme,
          convertirNullable(
            verset
          ),
        ]
      )

      res.json({
        success: true,
        message:
          "Thème annuel enregistré avec succès.",
      })
    } catch (error) {
      console.error(
        "❌ PUT THEME :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de l'enregistrement du thème.",
      })
    }
  }
)

// ============================================================
// IA GEMINI
// ============================================================

app.post(
  "/api/ai/creation",
  verifierToken,
  async (req, res) => {
    try {
      const {
        prompt,
      } = req.body

      if (!prompt) {
        return res.status(400).json({
          success: false,
          message:
            "Le prompt est obligatoire.",
        })
      }

      if (
        String(prompt).length >
        3000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Le prompt ne doit pas dÃ©passer 3000 caractÃ¨res.",
        })
      }

      if (
        !process.env.GEMINI_API_KEY
      ) {
        return res.status(500).json({
          success: false,
          message:
            "La clÃ© Gemini n'est pas configurÃ©e.",
        })
      }

      const resultat =
        await gemini.models.generateContent(
          {
            model:
              "gemini-3.7-flash",

            contents:
              String(prompt),
          }
        )

      res.json({
        success: true,
        texte:
          resultat.text || "",
      })
    } catch (error) {
      console.error(
        "âŒ GEMINI :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la gÃ©nÃ©ration IA.",
      })
    }
  }
)

// ============================================================
// AUTHENTIFICATION
// ============================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        mot_de_passe,
        password,
      } = req.body

      const motDePasse =
        mot_de_passe ||
        password

      if (
        !email ||
        !motDePasse
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email et mot de passe obligatoires.",
        })
      }

      const [
        utilisateurs,
      ] = await db.query(
        `
        SELECT
          u.*,
          u.role AS role_nom
        FROM utilisateurs u
        WHERE u.email = ?
        LIMIT 1
        `,
        [email]
      )

      if (
        utilisateurs.length === 0
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Email ou mot de passe incorrect.",
        })
      }

      const utilisateur =
        utilisateurs[0]

      if (
        Number(utilisateur.statut) !== 1
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Ce compte est dÃ©sactivÃ©.",
        })
      }

      const motDePasseValide =
        await bcrypt.compare(
          motDePasse,
          utilisateur.mot_de_passe
        )

      if (
        !motDePasseValide
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Email ou mot de passe incorrect.",
        })
      }

      const role =
        utilisateur.role ||
        utilisateur.role_nom ||
        ""

      const token =
        jwt.sign(
          {
            id: utilisateur.id,
            email:
              utilisateur.email,
            role,
            fonction:
              utilisateur.fonction,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "8h",
          }
        )

      const utilisateurRetour = {
        ...utilisateur,
        mot_de_passe:
          undefined,
        role,
      }

      res.json({
        success: true,
        message:
          "Connexion rÃ©ussie.",
        token,
        utilisateur:
          utilisateurRetour,
        user:
          utilisateurRetour,
      })
    } catch (error) {
      console.error(
        "âŒ LOGIN :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la connexion.",
      })
    }
  }
)

// ============================================================
// UTILISATEURS - LISTE
// ============================================================

app.get(
  "/api/utilisateurs",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT
          u.id,
          u.nom,
          u.prenom,
          u.email,
          u.telephone,
          u.fonction,
          u.statut,
          u.role,
          u.role AS role_nom,
          u.created_at
        FROM utilisateurs u
        ORDER BY u.id DESC
      `)

      res.json({
        success: true,
        utilisateurs:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ UTILISATEURS :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration utilisateurs.",
      })
    }
  }
)

// ============================================================
// UTILISATEUR PAR ID
// ============================================================

app.get(
  "/api/utilisateurs/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(
        `
        SELECT
          u.id,
          u.nom,
          u.prenom,
          u.email,
          u.telephone,
          u.fonction,
          u.statut,
          u.role,
          u.role AS role_nom,
          u.created_at
        FROM utilisateurs u
        WHERE u.id = ?
        LIMIT 1
        `,
        [req.params.id]
      )

      if (
        rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      res.json({
        success: true,
        utilisateur:
          rows[0],
      })
    } catch (error) {
      console.error(
        "âŒ UTILISATEUR ID :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration utilisateur.",
      })
    }
  }
)

// ============================================================
// CRÃ‰ER UTILISATEUR
// ============================================================

app.post(
  "/api/utilisateurs",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        password,
        fonction,
        role_id,
        statut,
      } = req.body

      const motDePasse =
        mot_de_passe ||
        password

      if (
        !nom ||
        !prenom ||
        !email ||
        !motDePasse
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Nom, prÃ©nom, email et mot de passe sont obligatoires.",
        })
      }

      const fonctionNormalisee =
        normaliserFonction(
          fonction
        )

      if (
        fonction &&
        !fonctionsAutorisees.includes(
          fonctionNormalisee
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Fonction non autorisÃ©e.",
        })
      }

      const [
        existants,
      ] = await db.query(
        `
        SELECT id
        FROM utilisateurs
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      )

      if (
        existants.length > 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Cette adresse email existe dÃ©jÃ .",
        })
      }

      const hash =
        await bcrypt.hash(
          motDePasse,
          10
        )

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO utilisateurs
        (
          nom,
          prenom,
          email,
          telephone,
          mot_de_passe,
          fonction,
          role_id,
          statut
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          nom,
          prenom,
          email,
          convertirNullable(
            telephone
          ),
          hash,
          convertirNullable(
            fonctionNormalisee
          ),
          role_id ||
            null,
          statut ||
            "actif",
        ]
      )

      res.status(201).json({
        success: true,
        message:
          "Utilisateur crÃ©Ã© avec succÃ¨s.",
        id:
          resultat.insertId,
      })
    } catch (error) {
      console.error(
        "âŒ CREATION UTILISATEUR :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de la crÃ©ation de l'utilisateur.",
        error:
          error.message,
      })
    }
  }
)

// ============================================================
// MODIFIER UTILISATEUR
// ============================================================

app.put(
  "/api/utilisateurs/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const id =
        req.params.id

      const {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe,
        password,
        fonction,
        role_id,
        statut,
      } = req.body

      const [
        utilisateurs,
      ] = await db.query(
        `
        SELECT *
        FROM utilisateurs
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      )

      if (
        utilisateurs.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      const fonctionNormalisee =
        fonction !== undefined
          ? normaliserFonction(
              fonction
            )
          : utilisateurs[0]
              .fonction

      if (
        fonctionNormalisee &&
        !fonctionsAutorisees.includes(
          fonctionNormalisee
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Fonction non autorisÃ©e.",
        })
      }

      let nouveauMotDePasse =
        utilisateurs[0]
          .mot_de_passe

      const motDePasse =
        mot_de_passe ||
        password

      if (motDePasse) {
        nouveauMotDePasse =
          await bcrypt.hash(
            motDePasse,
            10
          )
      }

      await db.query(
        `
        UPDATE utilisateurs
        SET
          nom = ?,
          prenom = ?,
          email = ?,
          telephone = ?,
          mot_de_passe = ?,
          fonction = ?,
          role_id = ?,
          statut = ?
        WHERE id = ?
        `,
        [
          nom ??
            utilisateurs[0]
              .nom,

          prenom ??
            utilisateurs[0]
              .prenom,

          email ??
            utilisateurs[0]
              .email,

          telephone ??
            utilisateurs[0]
              .telephone,

          nouveauMotDePasse,

          fonctionNormalisee,

          role_id ??
            utilisateurs[0]
              .role_id,

          statut ??
            utilisateurs[0]
              .statut,

          id,
        ]
      )

      res.json({
        success: true,
        message:
          "Utilisateur modifiÃ© avec succÃ¨s.",
      })
    } catch (error) {
      console.error(
        "âŒ MODIFICATION UTILISATEUR :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur modification utilisateur.",
      })
    }
  }
)

// ============================================================
// SUPPRIMER UTILISATEUR
// ============================================================

app.delete(
  "/api/utilisateurs/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const id =
        req.params.id

      await db.query(
        `
        DELETE FROM utilisateurs
        WHERE id = ?
        `,
        [id]
      )

      res.json({
        success: true,
        message:
          "Utilisateur supprimÃ© avec succÃ¨s.",
      })
    } catch (error) {
      console.error(
        "âŒ SUPPRESSION UTILISATEUR :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Impossible de supprimer cet utilisateur.",
      })
    }
  }
)

// ============================================================
// RESPONSABLES PUBLICS
// ============================================================

app.get(
  "/api/responsables/public",
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT
          id,
          nom,
          prenom,
          fonction,
          photo,
          NULL AS description,
          created_at
        FROM utilisateurs
        WHERE role = 'responsable'
          AND statut = 1
        ORDER BY id DESC
      `)

      res.json({
        success: true,
        responsables:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ RESPONSABLES PUBLICS :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration responsables.",
      })
    }
  }
)

// ============================================================
// RESPONSABLES ADMIN
// ============================================================

app.get(
  "/api/responsables",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT
          id,
          assemblee_id,
          nom,
          prenom,
          email,
          telephone,
          fonction,
          photo,
          statut,
          role,
          created_at,
          updated_at,
          NULL AS description
        FROM utilisateurs
        WHERE role = 'responsable'
        ORDER BY id DESC
      `)

      res.json({
        success: true,
        responsables:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ RESPONSABLES :",
        error.message
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration responsables.",
      })
    }
  }
)

// ============================================================
// CRÃ‰ER RESPONSABLE
// ============================================================

app.post(
  "/api/responsables",
  verifierToken,
  verifierAdministrateur,
  uploadResponsable.single(
    "photo"
  ),
  async (req, res) => {
    try {
      const {
        nom,
        prenom,
        fonction,
        description,
      } = req.body

      const fonctionNormalisee =
        normaliserFonction(
          fonction
        )

      if (
        !nom ||
        !prenom ||
        !fonctionNormalisee
      ) {
        if (req.file) {
          supprimerPhoto(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Nom, prÃ©nom et fonction sont obligatoires.",
        })
      }

      if (
        !fonctionsAutorisees.includes(
          fonctionNormalisee
        )
      ) {
        if (req.file) {
          supprimerPhoto(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Fonction non autorisÃ©e.",
        })
      }

      const photo =
        req.file
          ? `/uploads/responsables/${req.file.filename}`
          : null

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO utilisateurs
        (
          nom,
          prenom,
          fonction,
          photo,
          role,
          statut
        )
        VALUES (?, ?, ?, ?, 'responsable', 1)
        `,
        [
          nom,
          prenom,
          fonctionNormalisee,
          photo,
        ]
      )

      res.status(201).json({
        success: true,
        message:
          "Responsable crÃ©Ã© avec succÃ¨s.",
        id:
          resultat.insertId,
        photo,
      })
    } catch (error) {
      if (req.file) {
        supprimerPhoto(
          req.file.filename
        )
      }

      console.error(
        "âŒ CREATION RESPONSABLE :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur crÃ©ation responsable.",
      })
    }
  }
)

// ============================================================
// MODIFIER RESPONSABLE
// ============================================================

app.put(
  "/api/responsables/:id",
  verifierToken,
  verifierAdministrateur,
  uploadResponsable.single(
    "photo"
  ),
  async (req, res) => {
    try {
      const id =
        req.params.id

      const [
        anciens,
      ] = await db.query(
        `
        SELECT
          id,
          assemblee_id,
          nom,
          prenom,
          email,
          telephone,
          fonction,
          photo,
          statut,
          role,
          created_at,
          updated_at,
          NULL AS description
        FROM utilisateurs
        WHERE id = ?
          AND role = 'responsable'
        LIMIT 1
        `,
        [id]
      )

      if (
        anciens.length === 0
      ) {
        if (req.file) {
          supprimerPhoto(
            req.file.filename
          )
        }

        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      const ancien =
        anciens[0]

      const {
        nom,
        prenom,
        fonction,
        description,
      } = req.body

      const fonctionNormalisee =
        fonction !== undefined
          ? normaliserFonction(
              fonction
            )
          : ancien.fonction

      if (
        fonctionNormalisee &&
        !fonctionsAutorisees.includes(
          fonctionNormalisee
        )
      ) {
        if (req.file) {
          supprimerPhoto(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Fonction non autorisÃ©e.",
        })
      }

      let nouvellePhoto =
        ancien.photo

      if (req.file) {
        nouvellePhoto =
          `/uploads/responsables/${req.file.filename}`
      }

      await db.query(
        `
        UPDATE utilisateurs
        SET
          nom = ?,
          prenom = ?,
          fonction = ?,
          photo = ?
        WHERE id = ?
          AND role = 'responsable'
        `,
        [
          nom ?? ancien.nom,
          prenom ?? ancien.prenom,
          fonctionNormalisee,
          nouvellePhoto,
          id,
        ]
      )

      if (
        req.file &&
        ancien.photo
      ) {
        supprimerPhoto(
          ancien.photo
        )
      }

      res.json({
        success: true,
        message:
          "Responsable modifiÃ© avec succÃ¨s.",
      })
    } catch (error) {
      if (req.file) {
        supprimerPhoto(
          req.file.filename
        )
      }

      console.error(
        "âŒ MODIFICATION RESPONSABLE :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur modification responsable.",
      })
    }
  }
)

// ============================================================
// SUPPRIMER RESPONSABLE
// ============================================================

app.delete(
  "/api/responsables/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const id =
        req.params.id

      const [
        rows,
      ] = await db.query(
        `
        SELECT photo
        FROM utilisateurs
        WHERE id = ?
          AND role = 'responsable'
        LIMIT 1
        `,
        [id]
      )

      if (
        rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      await db.query(
        `
        DELETE FROM utilisateurs
        WHERE id = ?
          AND role = 'responsable'
        `,
        [id]
      )

      supprimerPhoto(
        rows[0].photo
      )

      res.json({
        success: true,
        message:
          "Responsable supprimÃ© avec succÃ¨s.",
      })
    } catch (error) {
      console.error(
        "âŒ SUPPRESSION RESPONSABLE :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur suppression responsable.",
      })
    }
  }
)

// ============================================================
// ASSEMBLÃ‰ES
// ============================================================

app.get(
  "/api/assemblees",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT
          a.*,
          e.nom AS eglise_nom
        FROM assemblees a
        LEFT JOIN eglises e
          ON e.id = a.eglise_id
        WHERE a.actif = 1
        ORDER BY a.nom ASC
      `)

      const assemblees =
        rows.map(
          (assemblee) => {
            return {
              ...assemblee,
              logo:
                normaliserLogo(
                  assemblee.logo
                ),
            }
          }
        )

      console.log(
        "ðŸ›ï¸ AssemblÃ©es envoyÃ©es au frontend :"
      )

      assemblees.forEach(
        (assemblee) => {
          console.log(
            `   ${assemblee.id} - ${assemblee.nom} - logo: ${
              assemblee.logo ||
              "AUCUN"
            }`
          )
        }
      )

      res.json({
        success: true,
        assemblees,
      })
    } catch (error) {
      console.error(
        "âŒ ASSEMBLEES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration assemblÃ©es.",
      })
    }
  }
)

// ============================================================
// DIMANCHES
// ============================================================

app.get(
  "/api/dimanches",
  verifierToken,
  async (req, res) => {
    try {
      const {
        assemblee_id,
      } = req.query

      let sql = `
        SELECT
          d.*,
          a.nom AS assemblee_nom
        FROM dimanches d
        LEFT JOIN assemblees a
          ON a.id = d.assemblee_id
        WHERE d.actif = 1
      `

      const params = []

      if (
        assemblee_id
      ) {
        sql += `
          AND d.assemblee_id = ?
        `

        params.push(
          assemblee_id
        )
      }

      sql += `
        ORDER BY
          d.date_dimanche DESC,
          d.id DESC
      `

      const [
        rows,
      ] = await db.query(
        sql,
        params
      )

      res.json({
        success: true,
        dimanches:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ DIMANCHES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration dimanches.",
      })
    }
  }
)

// ============================================================
// MODÃˆLES DE PUBLICATION
// ============================================================

app.get(
  "/api/modeles-publication",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM modeles_publication
        WHERE actif = 1
        ORDER BY id ASC
      `)

      res.json({
        success: true,
        modeles:
          rows,
        total:
          rows.length,
      })
    } catch (error) {
      console.error(
        "âŒ MODELES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration modÃ¨les.",
      })
    }
  }
)

// ============================================================
// MODÃˆLE PAR ID
// ============================================================

app.get(
  "/api/modeles-publication/:id",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(
        `
        SELECT *
        FROM modeles_publication
        WHERE id = ?
        LIMIT 1
        `,
        [req.params.id]
      )

      if (
        rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "ModÃ¨le introuvable.",
        })
      }

      res.json({
        success: true,
        modele:
          rows[0],
      })
    } catch (error) {
      console.error(
        "âŒ MODELE ID :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration modÃ¨le.",
      })
    }
  }
)

// ============================================================
// IMAGES
// ============================================================

app.get(
  "/api/images",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM images
        ORDER BY id DESC
      `)

      res.json({
        success: true,
        images:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ IMAGES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration images.",
      })
    }
  }
)

// ============================================================
// UPLOAD IMAGE
// ============================================================

app.post(
  "/api/images/upload",
  verifierToken,
  uploadImage.single(
    "image"
  ),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Aucune image reÃ§ue.",
        })
      }

      const utilisateurId =
        obtenirUtilisateurId(
          req
        )

      const fichier =
        `/uploads/images/${req.file.filename}`

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO images
        (
          utilisateur_id,
          nom_original,
          fichier_original,
          fichier_traite,
          type_mime,
          taille,
          statut
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          utilisateurId,
          req.file.originalname,
          fichier,
          fichier,
          req.file.mimetype,
          req.file.size,
          "traite",
        ]
      )

      res.status(201).json({
        success: true,
        message:
          "Image tÃ©lÃ©chargÃ©e avec succÃ¨s.",
        id:
          resultat.insertId,
        fichier,
      })
    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(
            path.join(
              imagesDir,
              req.file.filename
            )
          )
        } catch {}
      }

      console.error(
        "âŒ UPLOAD IMAGE :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors du tÃ©lÃ©chargement de l'image.",
      })
    }
  }
)

// ============================================================
// FILIGRANES
// ============================================================

app.get(
  "/api/filigranes",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM filigranes
        WHERE actif = 1
        ORDER BY id ASC
      `)

      res.json({
        success: true,
        filigranes:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ FILIGRANES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration filigranes.",
      })
    }
  }
)

// ============================================================
// PUBLICATIONS - STATISTIQUES
// ============================================================

app.get(
  "/api/publications/statistiques",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [
        totalRows,
      ] = await db.query(`
        SELECT COUNT(*) AS total
        FROM publications
      `)

      const [
        statuts,
      ] = await db.query(`
        SELECT
          statut,
          COUNT(*) AS total
        FROM publications
        GROUP BY statut
        ORDER BY statut ASC
      `)

      res.json({
        success: true,
        total:
          Number(
            totalRows[0]?.total ||
              0
          ),
        statuts,
      })
    } catch (error) {
      console.error(
        "âŒ STATISTIQUES PUBLICATIONS :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration statistiques.",
      })
    }
  }
)

// ============================================================
// PUBLICATIONS - LISTE
// ============================================================

app.get(
  "/api/publications",
  verifierToken,
  async (req, res) => {
    try {
      const {
        statut,
        assemblee_id,
        utilisateur_id,
        modele_id,
        dimanche_id,
        recherche,
      } = req.query

      let sql = `
        SELECT
          p.*,

          CONCAT(
            COALESCE(u.prenom, ''),
            ' ',
            COALESCE(u.nom, '')
          ) AS utilisateur_nom,

          a.nom AS assemblee_nom,

          d.date_dimanche,
          d.titre AS dimanche_titre,

          m.nom AS modele_nom,
          m.format AS modele_format,

          i.nom_original AS image_nom,

          f.nom AS filigrane_nom

        FROM publications p

        LEFT JOIN utilisateurs u
          ON u.id = p.utilisateur_id

        LEFT JOIN assemblees a
          ON a.id = p.assemblee_id

        LEFT JOIN dimanches d
          ON d.id = p.dimanche_id

        LEFT JOIN modeles_publication m
          ON m.id = p.modele_id

        LEFT JOIN images i
          ON i.id = p.image_id

        LEFT JOIN filigranes f
          ON f.id = p.filigrane_id

        WHERE 1 = 1
      `

      const params = []

      if (statut) {
        sql += `
          AND p.statut = ?
        `

        params.push(
          statut
        )
      }

      if (assemblee_id) {
        sql += `
          AND p.assemblee_id = ?
        `

        params.push(
          assemblee_id
        )
      }

      if (utilisateur_id) {
        sql += `
          AND p.utilisateur_id = ?
        `

        params.push(
          utilisateur_id
        )
      }

      if (modele_id) {
        sql += `
          AND p.modele_id = ?
        `

        params.push(
          modele_id
        )
      }

      if (dimanche_id) {
        sql += `
          AND p.dimanche_id = ?
        `

        params.push(
          dimanche_id
        )
      }

      if (recherche) {
        sql += `
          AND (
            p.titre LIKE ?
            OR p.texte LIKE ?
            OR p.verset LIKE ?
            OR a.nom LIKE ?
            OR m.nom LIKE ?
          )
        `

        const terme =
          `%${recherche}%`

        params.push(
          terme,
          terme,
          terme,
          terme,
          terme
        )
      }

      sql += `
        ORDER BY
          p.created_at DESC,
          p.id DESC
      `

      const [
        rows,
      ] = await db.query(
        sql,
        params
      )

      res.json({
        success: true,
        publications:
          rows,
        total:
          rows.length,
      })
    } catch (error) {
      console.error(
        "âŒ LISTE PUBLICATIONS :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration publications.",
      })
    }
  }
)

// ============================================================
// PUBLICATION PAR ID
// ============================================================

app.get(
  "/api/publications/:id",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(
        `
        SELECT
          p.*,

          CONCAT(
            COALESCE(u.prenom, ''),
            ' ',
            COALESCE(u.nom, '')
          ) AS utilisateur_nom,

          u.email AS utilisateur_email,

          a.nom AS assemblee_nom,
          a.ville AS assemblee_ville,
          a.quartier AS assemblee_quartier,
          a.adresse AS assemblee_adresse,
          a.telephone AS assemblee_telephone,
          a.logo AS assemblee_logo,

          d.date_dimanche,
          d.titre AS dimanche_titre,
          d.description AS dimanche_description,

          m.nom AS modele_nom,
          m.description AS modele_description,
          m.format AS modele_format,
          m.largeur AS modele_largeur,
          m.hauteur AS modele_hauteur,

          i.nom_original AS image_nom,
          i.fichier_original AS image_fichier,
          i.fichier_traite AS image_fichier_traite,

          f.nom AS filigrane_nom,
          f.texte AS filigrane_texte

        FROM publications p

        LEFT JOIN utilisateurs u
          ON u.id = p.utilisateur_id

        LEFT JOIN assemblees a
          ON a.id = p.assemblee_id

        LEFT JOIN dimanches d
          ON d.id = p.dimanche_id

        LEFT JOIN modeles_publication m
          ON m.id = p.modele_id

        LEFT JOIN images i
          ON i.id = p.image_id

        LEFT JOIN filigranes f
          ON f.id = p.filigrane_id

        WHERE p.id = ?

        LIMIT 1
        `,
        [req.params.id]
      )

      if (
        rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Publication introuvable.",
        })
      }

      if (rows[0]) {
        rows[0].assemblee_logo =
          normaliserLogo(
            rows[0].assemblee_logo
          )
      }

      res.json({
        success: true,
        publication:
          rows[0],
      })
    } catch (error) {
      console.error(
        "âŒ PUBLICATION ID :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration publication.",
      })
    }
  }
)

// ============================================================
// VÃ‰RIFICATION STATUT PUBLICATION
// ============================================================

async function obtenirStatutsPublication() {
  try {
    const [
      colonnes,
    ] = await db.query(`
      SHOW COLUMNS
      FROM publications
      LIKE 'statut'
    `)

    if (
      colonnes.length === 0
    ) {
      return []
    }

    const type =
      colonnes[0].Type || ""

    const correspondance =
      type.match(
        /^enum\((.*)\)$/i
      )

    if (
      !correspondance
    ) {
      return []
    }

    return correspondance[1]
      .split(",")
      .map(
        (valeur) =>
          valeur
            .trim()
            .replace(/^'/, "")
            .replace(/'$/, "")
            .replace(/''/g, "'")
      )
  } catch (error) {
    console.error(
      "âŒ VÃ©rification statut publication :",
      error.message
    )

    return []
  }
}

// ============================================================
// CRÃ‰ER PUBLICATION
// ============================================================

app.post(
  "/api/publications",
  verifierToken,
  uploadPublication.single(
    "fichier"
  ),
  async (req, res) => {
    let fichierPhysique =
      null

    try {
      const {
        utilisateur_id,
        assemblee_id,
        dimanche_id,
        modele_id,
        image_id,
        filigrane_id,
        titre,
        texte,
        verset,
        fichier_final,
        statut,
        message_erreur,
      } = req.body

      const utilisateurId =
        utilisateur_id ||
        obtenirUtilisateurId(
          req
        )

      if (
        utilisateurId === null ||
        utilisateurId === undefined ||
        utilisateurId === ""
      ) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(401).json({
          success: false,
          message:
            "Utilisateur connectÃ© introuvable.",
        })
      }

      if (!assemblee_id) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "L'assemblÃ©e est obligatoire.",
        })
      }

      const [
        assemblees,
      ] = await db.query(
        `
        SELECT id
        FROM assemblees
        WHERE id = ?
          AND actif = 1
        LIMIT 1
        `,
        [assemblee_id]
      )

      if (
        assemblees.length === 0
      ) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "AssemblÃ©e introuvable ou inactive.",
        })
      }

      if (!dimanche_id) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Le dimanche est obligatoire.",
        })
      }

      const [
        dimanches,
      ] = await db.query(
        `
        SELECT id
        FROM dimanches
        WHERE id = ?
          AND assemblee_id = ?
          AND actif = 1
        LIMIT 1
        `,
        [
          dimanche_id,
          assemblee_id,
        ]
      )

      if (
        dimanches.length === 0
      ) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Le dimanche ne correspond pas Ã  cette assemblÃ©e ou est inactif.",
        })
      }

      if (!modele_id) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Le modÃ¨le est obligatoire.",
        })
      }

      const [
        modeles,
      ] = await db.query(
        `
        SELECT id
        FROM modeles_publication
        WHERE id = ?
          AND actif = 1
        LIMIT 1
        `,
        [modele_id]
      )

      if (
        modeles.length === 0
      ) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "ModÃ¨le introuvable ou inactif.",
        })
      }

      let imageId =
        convertirNullable(
          image_id
        )

      if (imageId) {
        const [
          images,
        ] = await db.query(
          `
          SELECT id
          FROM images
          WHERE id = ?
          LIMIT 1
          `,
          [imageId]
        )

        if (
          images.length === 0
        ) {
          if (req.file) {
            supprimerFichierPublication(
              req.file.filename
            )
          }

          return res.status(400).json({
            success: false,
            message:
              "Image source introuvable.",
          })
        }
      }

      let filigraneId =
        convertirNullable(
          filigrane_id
        )

      if (filigraneId) {
        const [
          filigranes,
        ] = await db.query(
          `
          SELECT id
          FROM filigranes
          WHERE id = ?
          AND actif = 1
          LIMIT 1
          `,
          [filigraneId]
        )

        if (
          filigranes.length === 0
        ) {
          if (req.file) {
            supprimerFichierPublication(
              req.file.filename
            )
          }

          return res.status(400).json({
            success: false,
            message:
              "Filigrane introuvable ou inactif.",
          })
        }
      }

      let fichierFinal =
        convertirNullable(
          fichier_final
        )

      if (req.file) {
        fichierPhysique =
          req.file.filename

        fichierFinal =
          `/uploads/publications/${req.file.filename}`

        console.log(
          "ðŸ–¼ï¸ Publication reÃ§ue :",
          fichierFinal
        )
      }

      let statutFinal =
        statut ||
        "brouillon"

      const statutsAutorises =
        await obtenirStatutsPublication()

      if (
        statutsAutorises.length >
          0 &&
        !statutsAutorises.includes(
          statutFinal
        )
      ) {
        if (req.file) {
          supprimerFichierPublication(
            req.file.filename
          )
        }

        return res.status(400).json({
          success: false,
          message:
            `Statut "${statutFinal}" non autorisÃ©.`,
          statuts_autorises:
            statutsAutorises,
        })
      }

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO publications
        (
          utilisateur_id,
          assemblee_id,
          dimanche_id,
          modele_id,
          image_id,
          filigrane_id,
          titre,
          texte,
          verset,
          fichier_final,
          statut,
          message_erreur
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          utilisateurId,
          assemblee_id,
          dimanche_id,
          modele_id,
          imageId,
          filigraneId,
          convertirNullable(
            titre
          ),
          convertirNullable(
            texte
          ),
          convertirNullable(
            verset
          ),
          fichierFinal,
          statutFinal,
          convertirNullable(
            message_erreur
          ),
        ]
      )

      res.status(201).json({
        success: true,
        message:
          "Publication enregistrÃ©e avec succÃ¨s.",
        publication: {
          id:
            resultat.insertId,
          utilisateur_id:
            utilisateurId,
          assemblee_id,
          dimanche_id,
          modele_id,
          image_id:
            imageId,
          filigrane_id:
            filigraneId,
          titre:
            convertirNullable(
              titre
            ),
          texte:
            convertirNullable(
              texte
            ),
          verset:
            convertirNullable(
              verset
            ),
          fichier_final:
            fichierFinal,
          statut:
            statutFinal,
        },
      })
    } catch (error) {
      if (
        fichierPhysique
      ) {
        supprimerFichierPublication(
          fichierPhysique
        )
      }

      console.error(
        "âŒ CREATION PUBLICATION :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de l'enregistrement de la publication.",
        error:
          error.message,
      })
    }
  }
)

// ============================================================
// MODIFIER PUBLICATION
// ============================================================

app.put(
  "/api/publications/:id",
  verifierToken,
  async (req, res) => {
    try {
      const id =
        req.params.id

      const {
        assemblee_id,
        dimanche_id,
        modele_id,
        image_id,
        filigrane_id,
        titre,
        texte,
        verset,
        fichier_final,
        statut,
        message_erreur,
      } = req.body

      const [
        anciennes,
      ] = await db.query(
        `
        SELECT *
        FROM publications
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      )

      if (
        anciennes.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Publication introuvable.",
        })
      }

      const ancienne =
        anciennes[0]

      const assembleeFinale =
        assemblee_id ??
        ancienne.assemblee_id

      const dimancheFinal =
        dimanche_id ??
        ancienne.dimanche_id

      const modeleFinal =
        modele_id ??
        ancienne.modele_id

      const [
        dimanches,
      ] = await db.query(
        `
        SELECT id
        FROM dimanches
        WHERE id = ?
          AND assemblee_id = ?
          AND actif = 1
        LIMIT 1
        `,
        [
          dimancheFinal,
          assembleeFinale,
        ]
      )

      if (
        dimanches.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Le dimanche ne correspond pas Ã  l'assemblÃ©e.",
        })
      }

      const [
        modeles,
      ] = await db.query(
        `
        SELECT id
        FROM modeles_publication
        WHERE id = ?
        LIMIT 1
        `,
        [modeleFinal]
      )

      if (
        modeles.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "ModÃ¨le introuvable.",
        })
      }

      const imageFinale =
        convertirNullable(
          image_id ??
            ancienne.image_id
        )

      const filigraneFinal =
        convertirNullable(
          filigrane_id ??
            ancienne.filigrane_id
        )

      const fichierFinal =
        fichier_final ??
        ancienne.fichier_final

      const statutFinal =
        statut ??
        ancienne.statut

      await db.query(
        `
        UPDATE publications
        SET
          assemblee_id = ?,
          dimanche_id = ?,
          modele_id = ?,
          image_id = ?,
          filigrane_id = ?,
          titre = ?,
          texte = ?,
          verset = ?,
          fichier_final = ?,
          statut = ?,
          message_erreur = ?
        WHERE id = ?
        `,
        [
          assembleeFinale,
          dimancheFinal,
          modeleFinal,
          imageFinale,
          filigraneFinal,
          convertirNullable(
            titre
          ),
          convertirNullable(
            texte
          ),
          convertirNullable(
            verset
          ),
          convertirNullable(
            fichierFinal
          ),
          statutFinal,
          convertirNullable(
            message_erreur
          ),
          id,
        ]
      )

      res.json({
        success: true,
        message:
          "Publication modifiÃ©e avec succÃ¨s.",
      })
    } catch (error) {
      console.error(
        "âŒ MODIFICATION PUBLICATION :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur modification publication.",
      })
    }
  }
)

// ============================================================
// SUPPRIMER PUBLICATION
// ============================================================

app.delete(
  "/api/publications/:id",
  verifierToken,
  async (req, res) => {
    try {
      const id =
        req.params.id

      const [
        rows,
      ] = await db.query(
        `
        SELECT
          fichier_final
        FROM publications
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      )

      if (
        rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Publication introuvable.",
        })
      }

      const fichierFinal =
        rows[0].fichier_final

      await db.query(
        `
        DELETE FROM publications
        WHERE id = ?
        `,
        [id]
      )

      supprimerFichierPublication(
        fichierFinal
      )

      res.json({
        success: true,
        message:
          "Publication supprimÃ©e avec succÃ¨s.",
      })
    } catch (error) {
      console.error(
        "âŒ SUPPRESSION PUBLICATION :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur suppression publication.",
      })
    }
  }
)

// ============================================================
// CONTACT
// ============================================================

app.post(
  "/api/contact",
  async (req, res) => {
    try {
      const {
        nom,
        email,
        sujet,
        message,
      } = req.body

      if (
        !nom ||
        !email ||
        !message
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Nom, email et message sont obligatoires.",
        })
      }

      const [
        resultat,
      ] = await db.query(
        `
        INSERT INTO messages_contact
        (
          nom,
          email,
          sujet,
          message
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          nom,
          email,
          convertirNullable(
            sujet
          ),
          message,
        ]
      )

      if (
        resend &&
        process.env.CONTACT_EMAIL
      ) {
        try {
          await resend.emails.send(
            {
              from:
                "BETHEL GLORY MEDIA <onboarding@resend.dev>",

              to: [
                process.env
                  .CONTACT_EMAIL,
              ],

              subject:
                sujet ||
                "Nouveau message de contact",

              html: `
                <div style="font-family:Arial,sans-serif;">
                  <h2>Nouveau message de contact</h2>

                  <p>
                    <strong>Nom :</strong>
                    ${nom}
                  </p>

                  <p>
                    <strong>Email :</strong>
                    ${email}
                  </p>

                  <p>
                    <strong>Sujet :</strong>
                    ${sujet || ""}
                  </p>

                  <hr />

                  <p>
                    ${String(
                      message
                    ).replace(
                      /\n/g,
                      "<br>"
                    )}
                  </p>
                </div>
              `,
            }
          )
        } catch (emailError) {
          console.error(
            "âš ï¸ Erreur Resend :",
            emailError.message
          )
        }
      }

      res.status(201).json({
        success: true,
        message:
          "Votre message a Ã©tÃ© envoyÃ© avec succÃ¨s.",
        id:
          resultat.insertId,
      })
    } catch (error) {
      console.error(
        "âŒ CONTACT :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur lors de l'envoi du message.",
      })
    }
  }
)

// ============================================================
// MESSAGES CONTACT ADMIN
// ============================================================

app.get(
  "/api/messages-contact",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM messages_contact
        ORDER BY created_at DESC
      `)

      res.json({
        success: true,
        messages:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ MESSAGES CONTACT :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration messages.",
      })
    }
  }
)

// ============================================================
// NOTIFICATIONS NON LUES
// ============================================================

app.get(
  "/api/notifications/non-lues",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM notifications
        WHERE lu = 0
        ORDER BY created_at DESC
      `)

      res.json({
        success: true,
        notifications:
          rows,
        total:
          rows.length,
      })
    } catch (error) {
      console.error(
        "âŒ NOTIFICATIONS NON LUES :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration notifications.",
      })
    }
  }
)

// ============================================================
// NOTIFICATIONS
// ============================================================

app.get(
  "/api/notifications",
  verifierToken,
  async (req, res) => {
    try {
      const [
        rows,
      ] = await db.query(`
        SELECT *
        FROM notifications
        ORDER BY created_at DESC
      `)

      res.json({
        success: true,
        notifications:
          rows,
      })
    } catch (error) {
      console.error(
        "âŒ NOTIFICATIONS :",
        error
      )

      res.status(500).json({
        success: false,
        message:
          "Erreur rÃ©cupÃ©ration notifications.",
      })
    }
  }
)

// ============================================================
// ERREUR MULTER
// ============================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      console.error(
        "âŒ ERREUR MULTER :",
        error
      )

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Le fichier est trop volumineux. Taille maximale : 100 Mo.",
        })
      }

      return res.status(400).json({
        success: false,
        message:
          error.message,
      })
    }

    if (
      error &&
      error.message &&
      error.message.includes(
        "Format d'image"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      })
    }

    next(error)
  }
)

// ============================================================
// ROUTE 404
// ============================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route API introuvable.",
      route:
        req.originalUrl,
    })
  }
)

// ============================================================
// GESTIONNAIRE D'ERREUR GLOBAL
// ============================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "âŒ ERREUR SERVEUR :",
      error
    )

    if (
      res.headersSent
    ) {
      return next(error)
    }

    res.status(500).json({
      success: false,
      message:
        "Une erreur interne du serveur est survenue.",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    })
  }
)

// ============================================================
// DÃ‰MARRAGE
// ============================================================

async function demarrerServeur() {
  try {
    await verifierStructureUtilisateurs()

    await initialiserTableMessages()

    await initialiserTableThemeAnnee()

    // ========================================================
    // SYNCHRONISATION DES 42 MODÃˆLES
    // ========================================================

    await initialiserModelesPublication()

    await db.query(
      "SELECT 1"
    )

    console.log(
      "âœ… Connexion MySQL rÃ©ussie."
    )

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log("")
        console.log(
          "=============================================="
        )
        console.log(
          "   BETHEL GLORY MEDIA - API"
        )
        console.log(
          "=============================================="
        )
        console.log(
          `ðŸš€ Serveur dÃ©marrÃ© sur le port ${PORT}`
        )
        console.log(
          `ðŸŒ http://localhost:${PORT}`
        )
        console.log(
          `ðŸ“ Uploads : ${uploadsDir}`
        )
        console.log(
          `ðŸ–¼ï¸ Logos : ${logosDir}`
        )
        console.log(
          `ðŸ–¼ï¸ Publications : ${publicationsDir}`
        )
        console.log(
          "=============================================="
        )
        console.log("")
      }
    )
  } catch (error) {
    console.error(
      "âŒ Impossible de dÃ©marrer le serveur :",
      error
    )

    process.exit(1)
  }
}

// ============================================================
// LANCEMENT
// ============================================================

demarrerServeur()





