import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  // ==================================================
  // CONNEXION
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErreur("")

    // ==================================================
    // 1. VÉRIFICATION DES CHAMPS
    // ==================================================

    if (!email.trim() || !motDePasse) {
      setErreur("Veuillez remplir tous les champs.")
      return
    }

    try {
      setChargement(true)

      console.log("📡 Tentative de connexion...")

      // ==================================================
      // URL API
      // ==================================================

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000"

      // ==================================================
      // 2. CONNEXION
      // ==================================================

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: email.trim(),
          mot_de_passe: motDePasse,
        }
      )

      console.log(
        "✅ RÉPONSE CONNEXION :",
        response.data
      )

      // ==================================================
      // 3. VÉRIFIER LA RÉPONSE DU SERVEUR
      // ==================================================

      if (!response.data.success) {
        setErreur(
          response.data.message ||
            "Connexion impossible."
        )

        return
      }

      // ==================================================
      // 4. RÉCUPÉRER LE TOKEN
      // ==================================================

      const token = response.data.token

      if (!token) {
        setErreur(
          "Le serveur n'a pas envoyé de token."
        )

        return
      }

      console.log("🔐 Token reçu.")

      // ==================================================
      // 5. DÉCODER LE JWT POUR RÉCUPÉRER L'ID
      // ==================================================

      let payload

      try {
        const parties = token.split(".")

        if (parties.length !== 3) {
          throw new Error("JWT invalide")
        }

        const base64Payload = parties[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")

        payload = JSON.parse(
          atob(base64Payload)
        )

        console.log(
          "📦 PAYLOAD JWT :",
          payload
        )
      } catch (error) {
        console.error(
          "❌ ERREUR LECTURE JWT :",
          error
        )

        setErreur(
          "Le token reçu par le serveur est invalide."
        )

        return
      }

      // ==================================================
      // 6. VÉRIFIER L'ID UTILISATEUR
      // ==================================================

      if (!payload.id) {
        setErreur(
          "L'identifiant de l'utilisateur est absent du token."
        )

        return
      }

      console.log(
        "👤 ID UTILISATEUR :",
        payload.id
      )

      // ==================================================
      // 7. RÉCUPÉRER L'UTILISATEUR COMPLET
      //    DEPUIS LA BASE DE DONNÉES
      // ==================================================

      console.log(
        "👤 Récupération des informations utilisateur..."
      )

      const userResponse = await axios.get(
        `${API_URL}/api/utilisateurs/${payload.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log(
        "📥 RÉPONSE UTILISATEUR :",
        userResponse.data
      )

      // ==================================================
      // 8. EXTRAIRE LES DONNÉES UTILISATEUR
      // ==================================================

      const userData =
        userResponse.data?.data

      if (!userData) {
        console.error(
          "❌ DATA UTILISATEUR ABSENTE :",
          userResponse.data
        )

        throw new Error(
          "Les informations complètes de l'utilisateur sont absentes."
        )
      }

      console.log(
        "👤 UTILISATEUR COMPLET REÇU :",
        userData
      )

      // ==================================================
      // 9. VÉRIFIER LE RÔLE
      // ==================================================

      if (
        userData.role !== "administrateur"
      ) {
        console.warn(
          "❌ RÔLE UTILISATEUR :",
          userData.role
        )

        setErreur(
          "Ce compte n'est pas administrateur."
        )

        return
      }

      // ==================================================
      // 10. CONSTRUIRE L'UTILISATEUR COMPLET
      // ==================================================

      const utilisateur = {
        id: userData.id,

        nom: userData.nom || "",

        prenom: userData.prenom || "",

        email:
          userData.email ||
          email.trim(),

        telephone:
          userData.telephone || "",

        role: userData.role,

        assemblee_id:
          userData.assemblee_id ?? null,
      }

      console.log(
        "🚨 UTILISATEUR FINAL :",
        utilisateur
      )

      // ==================================================
      // 11. NETTOYER LES ANCIENNES DONNÉES
      // ==================================================

      localStorage.removeItem("user")
      localStorage.removeItem("utilisateur")

      // ==================================================
      // 12. ENREGISTRER LE TOKEN
      // ==================================================

      localStorage.setItem(
        "token",
        token
      )

      // ==================================================
      // 13. ENREGISTRER L'UTILISATEUR COMPLET
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(utilisateur)
      )

      // ==================================================
      // 14. VÉRIFIER LES DONNÉES ENREGISTRÉES
      // ==================================================

      const verification =
        JSON.parse(
          localStorage.getItem("user")
        )

      console.log(
        "💾 UTILISATEUR DANS LOCALSTORAGE :",
        verification
      )

      console.log(
        "👤 NOM :",
        verification?.nom
      )

      console.log(
        "👤 PRÉNOM :",
        verification?.prenom
      )

      console.log(
        "📧 EMAIL :",
        verification?.email
      )

      console.log(
        "🔐 RÔLE :",
        verification?.role
      )

      // ==================================================
      // 15. CONNEXION RÉUSSIE
      // ==================================================

      console.log(
        "===================================="
      )

      console.log(
        "✅ CONNEXION RÉUSSIE"
      )

      console.log(
        "👤 UTILISATEUR CONNECTÉ :",
        verification
      )

      console.log(
        "===================================="
      )

      // ==================================================
      // 16. REDIRECTION VERS LE DASHBOARD
      // ==================================================

      navigate("/admin", {
        replace: true,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR CONNEXION :",
        error
      )

      if (error.response) {
        console.error(
          "📥 RÉPONSE SERVEUR :",
          error.response.data
        )

        setErreur(
          error.response.data?.message ||
            "Email ou mot de passe incorrect."
        )
      } else {
        setErreur(
          "Impossible de contacter le serveur. Vérifie que le serveur est accessible."
        )
      }
    } finally {
      setChargement(false)
    }
  }

  // ==================================================
  // AFFICHAGE
  // ==================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "16px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.10)",
        }}
      >
        {/* ==================================================
            TITRE
        ================================================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "8px",
              fontSize: "28px",
            }}
          >
            🔐 Administration
          </h1>

          <p
            style={{
              color: "#666",
              margin: 0,
            }}
          >
            BETHEL GLORY MEDIA
          </p>
        </div>

        {/* ==================================================
            ERREUR
        ================================================== */}

        {erreur && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#b00020",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            ❌ {erreur}
          </div>
        )}

        {/* ==================================================
            FORMULAIRE
        ================================================== */}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@bethelglory.local"
              autoComplete="email"
              disabled={chargement}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* MOT DE PASSE */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: "600",
              }}
            >
              Mot de passe
            </label>

            <input
              type="password"
              value={motDePasse}
              onChange={(e) =>
                setMotDePasse(e.target.value)
              }
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              disabled={chargement}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* BOUTON */}

          <button
            type="submit"
            disabled={chargement}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: chargement
                ? "#999"
                : "#1f7a4d",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: chargement
                ? "not-allowed"
                : "pointer",
            }}
          >
            {chargement
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>

        {/* ==================================================
            RETOUR SITE
        ================================================== */}

        <Link
          to="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "20px",
            color: "#1f7a4d",
            textDecoration: "none",
          }}
        >
          ← Retour au site
        </Link>
      </div>
    </div>
  )
}

export default Login
