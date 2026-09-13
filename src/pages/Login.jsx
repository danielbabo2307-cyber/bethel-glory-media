
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErreur("")

    if (!email || !motDePasse) {
      setErreur("Veuillez remplir tous les champs.")
      return
    }

    try {
      setChargement(true)

      const response = await axios.post(
  `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
        {
          email: email.trim(),
          mot_de_passe: motDePasse,
        }
      )

      if (response.data.success) {
        // Enregistrer le token JWT
        localStorage.setItem(
          "token",
          response.data.token
        )

        // Enregistrer les informations de l'utilisateur
        localStorage.setItem(
          "utilisateur",
          JSON.stringify(response.data.utilisateur)
        )

        // Redirection vers l'administration
        navigate("/admin")
      }
    } catch (error) {
      console.error("❌ Erreur de connexion :", error)

      if (error.response) {
        setErreur(
          error.response.data?.message ||
            "Email ou mot de passe incorrect."
        )
      } else {
        setErreur(
          "Impossible de contacter le serveur."
        )
      }
    } finally {
      setChargement(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          BETHEL GLORY MEDIA
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Connexion à l'administration
        </p>

        {erreur && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#c62828",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            ❌ {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
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
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
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
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

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
                : "#198754",
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
      </div>
    </div>
  )
}

export default Login
