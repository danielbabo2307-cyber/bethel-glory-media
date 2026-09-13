// ==================================================
// CHARGEMENT DES VARIABLES D'ENVIRONNEMENT
// ==================================================

require("dotenv").config()

// ==================================================
// IMPORTS
// ==================================================

const express = require("express")
const cors = require("cors")
const db = require("./db")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")

const {
  verifierToken,
  verifierAdministrateur,
} = require("./authMiddleware")

// ==================================================
// APPLICATION
// ==================================================

const app = express()

const PORT = 5000

// ==================================================
// JWT
// ==================================================

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error(
    "❌ JWT_SECRET est manquant dans le fichier .env"
  )

  process.exit(1)
}

// ==================================================
// 📧 CONFIGURATION EMAIL
// ==================================================

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_EMAIL = process.env.CONTACT_EMAIL

let transporter = null

if (SMTP_USER && SMTP_PASS && CONTACT_EMAIL) {
  transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  transporter
    .verify()
    .then(() => {
      console.log("📧 Connexion SMTP réussie")
    })
    .catch((error) => {
      console.error(
        "⚠️ Connexion SMTP impossible :",
        error.message
      )
    })
} else {
  console.warn(
    "⚠️ Configuration SMTP incomplète."
  )

  console.warn(
    "⚠️ Les messages seront enregistrés dans MySQL mais aucun email ne sera envoyé."
  )
}

// ==================================================
// DOSSIER DES UPLOADS
// ==================================================

const uploadDir = path.join(
  __dirname,
  "uploads",
  "responsables"
)

fs.mkdirSync(uploadDir, {
  recursive: true,
})

// ==================================================
// CONFIGURATION MULTER
// ==================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname)

    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension

    cb(null, filename)
  },
})

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
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
          "Format non autorisé. Utilisez JPG, PNG ou WEBP."
        )
      )
    }
  },
})

// ==================================================
// MIDDLEWARES
// ==================================================

app.use(
  cors({
    origin: true,
  })
)

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true,
  })
)

// ==================================================
// 🔐 FONCTION DE SÉCURISATION HTML
// ==================================================

const escapeHtml = (texte) => {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// ==================================================
// 💬 TABLE DES MESSAGES DE CONTACT
// ==================================================

const creerTableMessagesContact = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages_contact (
        id INT AUTO_INCREMENT PRIMARY KEY,

        nom VARCHAR(150) NOT NULL,

        email VARCHAR(255) NOT NULL,

        message TEXT NOT NULL,

        statut ENUM(
          'non_lu',
          'lu'
        ) NOT NULL DEFAULT 'non_lu',

        created_at TIMESTAMP
          DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
          DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    console.log(
      "✅ Table messages_contact prête"
    )
  } catch (error) {
    console.error(
      "❌ ERREUR CRÉATION TABLE messages_contact :",
      error
    )
  }
}

creerTableMessagesContact()

// ==================================================
// FICHIERS STATIQUES
// ==================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
)

// ==================================================
// FONCTIONS AUTORISÉES
// ==================================================

const fonctionsAutorisees = [
  "pasteur",
  "ancien_principal",
  "ancien_second",
  "diacre",
  "diaconesse",
]

// ==================================================
// FONCTION : SUPPRIMER UNE PHOTO
// ==================================================

const supprimerPhoto = (photo) => {
  if (
    !photo ||
    !photo.startsWith(
      "/uploads/responsables/"
    )
  ) {
    return
  }

  const photoPath = path.join(
    __dirname,
    photo
  )

  try {
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath)

      console.log(
        "🗑️ Photo supprimée :",
        photoPath
      )
    }
  } catch (error) {
    console.error(
      "⚠️ Impossible de supprimer la photo :",
      error.message
    )
  }
}

// ==================================================
// ROUTE RACINE
// ==================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "🚀 API BETHEL GLORY MEDIA fonctionne correctement",
  })
})

// ==================================================
// TEST MYSQL
// ==================================================

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT 1 AS test"
      )

      return res.status(200).json({
        success: true,
        message:
          "Connexion MySQL réussie !",
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR MYSQL :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Erreur de connexion à MySQL",
        error:
          error?.message ||
          String(error),
      })
    }
  }
)

// ==================================================
// 💬 MESSAGES DE CONTACT
// ADMIN
// ==================================================

// ==================================================
// GET - TOUS LES MESSAGES
// ==================================================

app.get(
  "/api/messages-contact",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
          id,
          nom,
          email,
          message,
          statut,
          created_at,
          updated_at
        FROM messages_contact
        ORDER BY created_at DESC
      `)

      return res.status(200).json({
        success: true,
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR GET messages-contact :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les messages.",
      })
    }
  }
)

// ==================================================
// GET - NOMBRE DE MESSAGES NON LUS
// ==================================================

app.get(
  "/api/messages-contact/non-lus",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) AS total
        FROM messages_contact
        WHERE statut = 'non_lu'
      `)

      return res.status(200).json({
        success: true,
        total:
          Number(rows[0]?.total) || 0,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR messages non lus :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de compter les messages non lus.",
      })
    }
  }
)

// ==================================================
// PUT - MARQUER UN MESSAGE COMME LU
// ==================================================

app.put(
  "/api/messages-contact/:id/lire",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } = req.params

      const [result] = await db.query(
        `
        UPDATE messages_contact
        SET
          statut = 'lu',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [id]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        message:
          "Message marqué comme lu.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR lecture message :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier le message.",
      })
    }
  }
)

// ==================================================
// DELETE - SUPPRIMER UN MESSAGE
// ==================================================

app.delete(
  "/api/messages-contact/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } = req.params

      const [result] = await db.query(
        `
        DELETE FROM messages_contact
        WHERE id = ?
        `,
        [id]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        message:
          "Message supprimé avec succès.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR suppression message :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de supprimer le message.",
      })
    }
  }
)

// ==================================================
// 💬 CONTACT
// PUBLIC
// ==================================================

// ==================================================
// GET - TEST DE LA ROUTE CONTACT
// ==================================================

app.get(
  "/api/contact",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "✅ Route /api/contact disponible.",
      method:
        "Utilisez POST pour envoyer un message.",
    })
  }
)

// ==================================================
// POST - ENVOYER UN MESSAGE DE CONTACT
// PUBLIC
// ==================================================

app.post(
  "/api/contact",
  async (req, res) => {
    try {
      const {
        nom,
        email,
        message,
      } = req.body

      // ==================================================
      // VALIDATION
      // ==================================================

      const nomFinal =
        String(nom || "").trim()

      const emailFinal =
        String(email || "")
          .trim()
          .toLowerCase()

      const messageFinal =
        String(message || "").trim()

      if (
        !nomFinal ||
        !emailFinal ||
        !messageFinal
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Veuillez remplir tous les champs.",
        })
      }

      if (nomFinal.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Le nom doit contenir au moins 2 caractères.",
        })
      }

      if (nomFinal.length > 150) {
        return res.status(400).json({
          success: false,
          message:
            "Le nom est trop long.",
        })
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(emailFinal)) {
        return res.status(400).json({
          success: false,
          message:
            "Veuillez saisir une adresse email valide.",
        })
      }

      if (messageFinal.length < 5) {
        return res.status(400).json({
          success: false,
          message:
            "Le message doit contenir au moins 5 caractères.",
        })
      }

      if (messageFinal.length > 5000) {
        return res.status(400).json({
          success: false,
          message:
            "Le message est trop long.",
        })
      }

      // ==================================================
      // ENREGISTREMENT MYSQL
      // ==================================================

      const [result] = await db.query(
        `
        INSERT INTO messages_contact
        (
          nom,
          email,
          message,
          statut
        )
        VALUES (?, ?, ?, 'non_lu')
        `,
        [
          nomFinal,
          emailFinal,
          messageFinal,
        ]
      )

      const messageId =
        result.insertId

      console.log(
        "💬 Nouveau message de contact enregistré :",
        messageId
      )

      // ==================================================
      // 🔔 NOTIFICATION ADMIN
      // ==================================================

      try {
        await db.query(
          `
          INSERT INTO notifications
          (
            utilisateur_id,
            type,
            titre,
            message
          )
          VALUES (NULL, ?, ?, ?)
          `,
          [
            "contact",
            "Nouveau message de contact",
            `${nomFinal} (${emailFinal}) a envoyé un nouveau message.`,
          ]
        )

        console.log(
          "🔔 Notification admin créée"
        )
      } catch (notificationError) {
        console.error(
          "⚠️ Impossible de créer la notification :",
          notificationError.message
        )
      }

      // ==================================================
      // 📧 ENVOI EMAIL
      // ==================================================

      let emailEnvoye = false

      if (
        transporter &&
        CONTACT_EMAIL
      ) {
        try {
          const nomHtml =
            escapeHtml(nomFinal)

          const emailHtml =
            escapeHtml(emailFinal)

          const messageHtml =
            escapeHtml(
              messageFinal
            ).replace(
              /\n/g,
              "<br>"
            )

          await transporter.sendMail({
            from:
              `"BETHEL GLORY MEDIA" <${SMTP_USER}>`,

            to: CONTACT_EMAIL,

            replyTo: emailFinal,

            subject:
              `💬 Nouveau message - ${nomFinal}`,

            text: `
NOUVEAU MESSAGE DE CONTACT

Nom : ${nomFinal}

Email : ${emailFinal}

Message :

${messageFinal}

--------------------------------

BETHEL GLORY MEDIA
            `,

            html: `
<!DOCTYPE html>

<html lang="fr">

<head>
  <meta charset="UTF-8">

  <title>
    Nouveau message de contact
  </title>
</head>

<body
  style="
    margin:0;
    padding:30px;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:650px;
      margin:auto;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
    "
  >

    <div
      style="
        background:#14532d;
        color:white;
        padding:30px;
      "
    >

      <h1
        style="
          margin:0;
          font-size:25px;
        "
      >
        💬 Nouveau message
      </h1>

      <p
        style="
          margin:8px 0 0;
          color:#bbf7d0;
        "
      >
        BETHEL GLORY MEDIA
      </p>

    </div>

    <div
      style="
        padding:30px;
      "
    >

      <p>
        <strong>
          Nom :
        </strong>

        ${nomHtml}
      </p>

      <p>
        <strong>
          Email :
        </strong>

        ${emailHtml}
      </p>

      <hr
        style="
          border:none;
          border-top:1px solid #e5e7eb;
          margin:25px 0;
        "
      >

      <h3
        style="
          color:#14532d;
        "
      >
        Message
      </h3>

      <div
        style="
          background:#f9fafb;
          border-left:4px solid #eab308;
          padding:18px;
          border-radius:8px;
          line-height:1.7;
          color:#374151;
        "
      >

        ${messageHtml}

      </div>

      <p
        style="
          margin-top:30px;
          color:#9ca3af;
          font-size:13px;
        "
      >
        Message enregistré sous
        le numéro #${messageId}.
      </p>

    </div>

  </div>

</body>

</html>
            `,
          })

          emailEnvoye = true

          console.log(
            "📧 Email de contact envoyé avec succès"
          )
        } catch (emailError) {
          console.error(
            "⚠️ Erreur envoi email :",
            emailError.message
          )
        }
      } else {
        console.warn(
          "⚠️ Email non envoyé : configuration SMTP absente."
        )
      }

      // ==================================================
      // RÉPONSE
      // ==================================================

      return res.status(201).json({
        success: true,

        message:
          "Votre message a été envoyé avec succès.",

        id: messageId,

        emailEnvoye,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR POST /api/contact :",
        error
      )

      return res.status(500).json({
        success: false,

        message:
          "Une erreur est survenue lors de l'envoi du message.",

        error:
          process.env.NODE_ENV ===
          "production"
            ? undefined
            : error.message,
      })
    }
  }
)

// ==================================================
// 🔐 AUTHENTIFICATION
// ==================================================

// ==================================================
// POST - LOGIN
// PUBLIC
// ==================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      console.log(
        "🔐 Tentative de connexion..."
      )

      const {
        email,
        mot_de_passe,
      } = req.body

      if (
        !email ||
        !mot_de_passe
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email et mot de passe obligatoires.",
        })
      }

      const [rows] = await db.query(
        `
        SELECT
          id,
          nom,
          prenom,
          email,
          telephone,
          mot_de_passe,
          role,
          fonction,
          photo,
          statut,
          assemblee_id
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email.trim().toLowerCase()]
      )

      if (
        !rows ||
        rows.length === 0
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Email ou mot de passe incorrect.",
        })
      }

      const utilisateur =
        rows[0]

      if (
        Number(utilisateur.statut) !== 1
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Ce compte est désactivé.",
        })
      }

      const motDePasseValide =
        await bcrypt.compare(
          mot_de_passe,
          utilisateur.mot_de_passe
        )

      if (!motDePasseValide) {
        return res.status(401).json({
          success: false,
          message:
            "Email ou mot de passe incorrect.",
        })
      }

      await db.query(
        `
        UPDATE users
        SET derniere_connexion = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [utilisateur.id]
      )

      const token =
        jwt.sign(
          {
            id: utilisateur.id,
            role: utilisateur.role,
            assemblee_id:
              utilisateur.assemblee_id,
          },
          JWT_SECRET,
          {
            expiresIn: "8h",
          }
        )

      delete utilisateur.mot_de_passe

      return res.status(200).json({
        success: true,
        message:
          "Connexion réussie.",
        token,
        utilisateur,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR LOGIN :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Erreur lors de la connexion.",
      })
    }
  }
)

// ==================================================
// 👥 UTILISATEURS
// ==================================================

// ==================================================
// POST - CRÉER UTILISATEUR
// ADMIN
// ==================================================

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
        role,
      } = req.body

      if (
        !nom ||
        !prenom ||
        !email ||
        !mot_de_passe
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Nom, prénom, email et mot de passe sont obligatoires.",
        })
      }

      const emailFinal =
        email.trim().toLowerCase()

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !emailRegex.test(emailFinal)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Adresse email invalide.",
        })
      }

      if (
        mot_de_passe.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Le mot de passe doit contenir au moins 6 caractères.",
        })
      }

      const rolesAutorises = [
        "administrateur",
        "utilisateur",
      ]

      const roleFinal =
        rolesAutorises.includes(role)
          ? role
          : "utilisateur"

      const [existant] =
        await db.query(
          `
          SELECT id
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [emailFinal]
        )

      if (existant.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Un utilisateur avec cet email existe déjà.",
        })
      }

      const hash =
        await bcrypt.hash(
          mot_de_passe,
          10
        )

      const [result] =
        await db.query(
          `
          INSERT INTO users
          (
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            role,
            fonction,
            photo,
            statut
          )
          VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, 1)
          `,
          [
            nom.trim(),
            prenom.trim(),
            emailFinal,
            telephone
              ? telephone.trim()
              : null,
            hash,
            roleFinal,
          ]
        )

      try {
        await db.query(
          `
          INSERT INTO notifications
          (
            utilisateur_id,
            type,
            titre,
            message
          )
          VALUES (NULL, ?, ?, ?)
          `,
          [
            "utilisateur",
            "Nouvel utilisateur",
            `${prenom.trim()} ${nom.trim()} a été ajouté.`,
          ]
        )
      } catch (notificationError) {
        console.error(
          "⚠️ Notification utilisateur impossible :",
          notificationError.message
        )
      }

      return res.status(201).json({
        success: true,
        message:
          "Utilisateur créé avec succès.",
        id: result.insertId,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR CRÉATION UTILISATEUR :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de créer l'utilisateur.",
      })
    }
  }
)

// ==================================================
// GET - TOUS LES UTILISATEURS
// ADMIN
// ==================================================

app.get(
  "/api/utilisateurs",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT
            id,
            nom,
            prenom,
            email,
            telephone,
            role,
            fonction,
            photo,
            statut,
            assemblee_id,
            derniere_connexion,
            created_at,
            updated_at
          FROM users
          ORDER BY created_at DESC
        `)

      return res.status(200).json({
        success: true,
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR UTILISATEURS :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les utilisateurs.",
      })
    }
  }
)

// ==================================================
// GET - UTILISATEUR PAR ID
// ADMIN
// ==================================================

app.get(
  "/api/utilisateurs/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } =
        req.params

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            nom,
            prenom,
            email,
            telephone,
            role,
            fonction,
            photo,
            statut,
            assemblee_id,
            derniere_connexion,
            created_at,
            updated_at
          FROM users
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        )

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
      })
    } catch (error) {
      console.error(
        "❌ ERREUR UTILISATEUR :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer l'utilisateur.",
      })
    }
  }
)

// ==================================================
// PUT - STATUT UTILISATEUR
// ADMIN
// ==================================================

app.put(
  "/api/utilisateurs/:id/statut",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } =
        req.params

      const {
        statut,
      } = req.body

      const statutFinal =
        Number(statut) === 1
          ? 1
          : 0

      const [result] =
        await db.query(
          `
          UPDATE users
          SET
            statut = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            statutFinal,
            id,
          ]
        )

      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        message:
          statutFinal === 1
            ? "Utilisateur activé."
            : "Utilisateur désactivé.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR STATUT UTILISATEUR :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier le statut.",
      })
    }
  }
)

// ==================================================
// DELETE - UTILISATEUR
// ADMIN
// ==================================================

app.delete(
  "/api/utilisateurs/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } =
        req.params

      const [rows] =
        await db.query(
          `
          SELECT role
          FROM users
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        )

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      if (
        rows[0].role ===
        "responsable"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Impossible de supprimer un responsable.",
        })
      }

      const [result] =
        await db.query(
          `
          DELETE FROM users
          WHERE id = ?
          `,
          [id]
        )

      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        message:
          "Utilisateur supprimé avec succès.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR SUPPRESSION UTILISATEUR :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de supprimer l'utilisateur.",
      })
    }
  }
)

// ==================================================
// 👨‍👩‍👧 RESPONSABLES
// ==================================================

// ==================================================
// GET - RESPONSABLES PUBLICS
// ==================================================

app.get(
  "/api/responsables/public",
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT
            id,
            nom,
            prenom,
            email,
            telephone,
            fonction,
            photo
          FROM users
          WHERE
            role = 'responsable'
            AND statut = 1
          ORDER BY FIELD(
            fonction,
            'pasteur',
            'ancien_principal',
            'ancien_second',
            'diacre',
            'diaconesse'
          )
        `)

      return res.status(200).json({
        success: true,
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR RESPONSABLES PUBLICS :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les responsables.",
      })
    }
  }
)

// ==================================================
// GET - RESPONSABLES ADMIN
// ==================================================

app.get(
  "/api/responsables",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const [rows] =
        await db.query(`
          SELECT
            id,
            nom,
            prenom,
            email,
            telephone,
            fonction,
            photo,
            statut,
            assemblee_id,
            created_at,
            updated_at
          FROM users
          WHERE role = 'responsable'
          ORDER BY FIELD(
            fonction,
            'pasteur',
            'ancien_principal',
            'ancien_second',
            'diacre',
            'diaconesse'
          )
        `)

      return res.status(200).json({
        success: true,
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR RESPONSABLES :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les responsables.",
      })
    }
  }
)

// ==================================================
// GET - RESPONSABLE PAR ID
// ==================================================

app.get(
  "/api/responsables/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } =
        req.params

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            nom,
            prenom,
            email,
            telephone,
            fonction,
            photo,
            statut,
            assemblee_id,
            created_at,
            updated_at
          FROM users
          WHERE
            id = ?
            AND role = 'responsable'
          LIMIT 1
          `,
          [id]
        )

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
      })
    } catch (error) {
      console.error(
        "❌ ERREUR RESPONSABLE :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer le responsable.",
      })
    }
  }
)

// ==================================================
// POST - AJOUTER RESPONSABLE
// ADMIN
// ==================================================

app.post(
  "/api/responsables",
  verifierToken,
  verifierAdministrateur,
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        nom,
        prenom,
        email,
        telephone,
        fonction,
        assemblee_id,
      } = req.body

      if (
        !nom ||
        !prenom ||
        !fonction
      ) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Nom, prénom et fonction sont obligatoires.",
        })
      }

      if (
        !fonctionsAutorisees.includes(
          fonction
        )
      ) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Fonction invalide.",
        })
      }

      const photo =
        req.file
          ? `/uploads/responsables/${req.file.filename}`
          : null

      const emailFinal =
        email &&
        email.trim()
          ? email.trim().toLowerCase()
          : `responsable${Date.now()}@bethel.local`

      const [result] =
        await db.query(
          `
          INSERT INTO users
          (
            nom,
            prenom,
            email,
            telephone,
            mot_de_passe,
            role,
            fonction,
            photo,
            statut,
            assemblee_id
          )
          VALUES (?, ?, ?, ?, '', 'responsable', ?, ?, 1, ?)
          `,
          [
            nom.trim(),
            prenom.trim(),
            emailFinal,
            telephone
              ? telephone.trim()
              : null,
            fonction,
            photo,
            assemblee_id
              ? assemblee_id
              : null,
          ]
        )

      return res.status(201).json({
        success: true,
        message:
          "Responsable ajouté avec succès.",
        id: result.insertId,
      })
    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(
            req.file.path
          )
        } catch {}
      }

      console.error(
        "❌ ERREUR AJOUT RESPONSABLE :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible d'ajouter le responsable.",
      })
    }
  }
)

// ==================================================
// PUT - MODIFIER RESPONSABLE
// ADMIN
// ==================================================

app.put(
  "/api/responsables/:id",
  verifierToken,
  verifierAdministrateur,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { id } =
        req.params

      const {
        nom,
        prenom,
        email,
        telephone,
        fonction,
        assemblee_id,
        statut,
      } = req.body

      if (
        !nom ||
        !prenom ||
        !fonction
      ) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Nom, prénom et fonction sont obligatoires.",
        })
      }

      if (
        !fonctionsAutorisees.includes(
          fonction
        )
      ) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          )
        }

        return res.status(400).json({
          success: false,
          message:
            "Fonction invalide.",
        })
      }

      const [existingRows] =
        await db.query(
          `
          SELECT photo
          FROM users
          WHERE
            id = ?
            AND role = 'responsable'
          LIMIT 1
          `,
          [id]
        )

      if (
        existingRows.length === 0
      ) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          )
        }

        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      const anciennePhoto =
        existingRows[0].photo

      let nouvellePhoto =
        anciennePhoto

      if (req.file) {
        nouvellePhoto =
          `/uploads/responsables/${req.file.filename}`
      }

      const emailFinal =
        email &&
        email.trim()
          ? email.trim().toLowerCase()
          : `responsable${id}@bethel.local`

      const statutFinal =
        Number(statut) === 0
          ? 0
          : 1

      await db.query(
        `
        UPDATE users
        SET
          nom = ?,
          prenom = ?,
          email = ?,
          telephone = ?,
          fonction = ?,
          photo = ?,
          statut = ?,
          assemblee_id = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ?
          AND role = 'responsable'
        `,
        [
          nom.trim(),
          prenom.trim(),
          emailFinal,
          telephone
            ? telephone.trim()
            : null,
          fonction,
          nouvellePhoto,
          statutFinal,
          assemblee_id
            ? assemblee_id
            : null,
          id,
        ]
      )

      if (
        req.file &&
        anciennePhoto &&
        anciennePhoto !==
          nouvellePhoto
      ) {
        supprimerPhoto(
          anciennePhoto
        )
      }

      return res.status(200).json({
        success: true,
        message:
          "Responsable modifié avec succès.",
      })
    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(
            req.file.path
          )
        } catch {}
      }

      console.error(
        "❌ ERREUR MODIFICATION RESPONSABLE :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier le responsable.",
      })
    }
  }
)

// ==================================================
// DELETE - RESPONSABLE
// ADMIN
// ==================================================

app.delete(
  "/api/responsables/:id",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const { id } =
        req.params

      const [rows] =
        await db.query(
          `
          SELECT photo
          FROM users
          WHERE
            id = ?
            AND role = 'responsable'
          LIMIT 1
          `,
          [id]
        )

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      const photo =
        rows[0].photo

      const [result] =
        await db.query(
          `
          DELETE FROM users
          WHERE
            id = ?
            AND role = 'responsable'
          `,
          [id]
        )

      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Responsable introuvable.",
        })
      }

      supprimerPhoto(photo)

      return res.status(200).json({
        success: true,
        message:
          "Responsable supprimé avec succès.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR SUPPRESSION RESPONSABLE :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de supprimer le responsable.",
      })
    }
  }
)

// ==================================================
// 🔔 NOTIFICATIONS
// ==================================================

// ==================================================
// GET - NOTIFICATIONS
// ADMIN
// ==================================================

app.get(
  "/api/notifications",
  verifierToken,
  verifierAdministrateur,
  async (req, res) => {
    try {
      const utilisateurId =
        req.utilisateur.id

      const [rows] =
        await db.query(
          `
          SELECT
            id,
            utilisateur_id,
            type,
            titre,
            message,
            lu,
            created_at
          FROM notifications
          WHERE
            utilisateur_id IS NULL
            OR utilisateur_id = ?
          ORDER BY created_at DESC
          LIMIT 50
          `,
          [utilisateurId]
        )

      return res.status(200).json({
        success: true,
        data: rows,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR NOTIFICATIONS :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les notifications.",
      })
    }
  }
)

// ==================================================
// GET - NOTIFICATIONS NON LUES
// ==================================================

app.get(
  "/api/notifications/non-lues",
  verifierToken,
  async (req, res) => {
    try {
      const utilisateurId =
        req.utilisateur.id

      const [rows] =
        await db.query(
          `
          SELECT COUNT(*) AS total
          FROM notifications
          WHERE
            (
              utilisateur_id IS NULL
              OR utilisateur_id = ?
            )
            AND lu = 0
          `,
          [utilisateurId]
        )

      return res.status(200).json({
        success: true,
        total:
          Number(rows[0]?.total) || 0,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR NOTIFICATIONS NON LUES :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer le nombre de notifications.",
      })
    }
  }
)

// ==================================================
// PUT - MARQUER NOTIFICATION COMME LUE
// ==================================================

app.put(
  "/api/notifications/:id/lue",
  verifierToken,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params

      const utilisateurId =
        req.utilisateur.id

      const [result] =
        await db.query(
          `
          UPDATE notifications
          SET
            lu = 1
          WHERE
            id = ?
            AND (
              utilisateur_id IS NULL
              OR utilisateur_id = ?
            )
          `,
          [
            id,
            utilisateurId,
          ]
        )

      if (
        result.affectedRows === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Notification introuvable.",
        })
      }

      return res.status(200).json({
        success: true,
        message:
          "Notification marquée comme lue.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR NOTIFICATION LUE :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier la notification.",
      })
    }
  }
)

// ==================================================
// PUT - LIRE TOUTES LES NOTIFICATIONS
// ==================================================

app.put(
  "/api/notifications/lire-tout",
  verifierToken,
  async (req, res) => {
    try {
      const utilisateurId =
        req.utilisateur.id

      await db.query(
        `
        UPDATE notifications
        SET
          lu = 1
        WHERE
          (
            utilisateur_id IS NULL
            OR utilisateur_id = ?
          )
          AND lu = 0
        `,
        [utilisateurId]
      )

      return res.status(200).json({
        success: true,
        message:
          "Toutes les notifications ont été marquées comme lues.",
      })
    } catch (error) {
      console.error(
        "❌ ERREUR LIRE TOUT :",
        error
      )

      return res.status(500).json({
        success: false,
        message:
          "Impossible de modifier les notifications.",
      })
    }
  }
)

// ==================================================
// ⚠️ GESTION DES ERREURS MULTER
// ==================================================

app.use(
  (error, req, res, next) => {
    if (
      error instanceof multer.MulterError
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Erreur lors de l'envoi du fichier.",
        error: error.message,
      })
    }

    if (
      error &&
      error.message &&
      error.message.includes(
        "Format non autorisé"
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

// ==================================================
// ❌ ROUTE 404
// ==================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,
      message:
        "Route introuvable.",
      route: req.originalUrl,
    })
  }
)

// ==================================================
// 🚀 DÉMARRAGE DU SERVEUR
// ==================================================

app.listen(
  PORT,
  () => {
    console.log("")

    console.log(
      "=========================================="
    )

    console.log(
      "🚀 BETHEL GLORY MEDIA - API"
    )

    console.log(
      "=========================================="
    )

    console.log(
      `🌍 Serveur : http://localhost:${PORT}`
    )

    console.log(
      "💬 GET /api/contact → TEST"
    )

    console.log(
      "💬 POST /api/contact → PUBLIC"
    )

    console.log(
      "🔐 POST /api/auth/login → PUBLIC"
    )

    console.log(
      "🗄️ MySQL : connecté via ./db"
    )

    console.log(
      "=========================================="
    )

    console.log("")
  }
)