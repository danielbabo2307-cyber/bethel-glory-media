
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

const verifierToken = (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization

    // Aucun header Authorization
    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Token d'authentification manquant",
      })
    }

    // Vérifier le format Bearer TOKEN
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Format du token invalide",
      })
    }

    const token = authorization.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      })
    }

    // Vérification JWT
    const utilisateur = jwt.verify(
      token,
      JWT_SECRET
    )

    // Stocker les informations dans req
    req.utilisateur = utilisateur

    next()
  } catch (error) {
    console.error(
      "❌ ERREUR JWT :",
      error.message
    )

    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    })
  }
}

const verifierAdministrateur = (
  req,
  res,
  next
) => {
  if (
    !req.utilisateur ||
    req.utilisateur.role !==
      "administrateur"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Accès réservé aux administrateurs",
    })
  }

  next()
}

module.exports = {
  verifierToken,
  verifierAdministrateur,
}

