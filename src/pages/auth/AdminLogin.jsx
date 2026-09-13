import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState("")

  // ============================================================
  // CONNEXION ADMINISTRATEUR
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErreur("")

    if (!email || !motDePasse) {
      setErreur(
        "Veuillez renseigner votre adresse e-mail et votre mot de passe."
      )
      return
    }

    try {
      setLoading(true)

      console.log("====================================")
      console.log("👑 CONNEXION ADMINISTRATEUR")
      console.log("====================================")
      console.log("📧 Email :", email)

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          mot_de_passe: motDePasse,
        }
      )

      console.log("📦 Réponse serveur :", response.data)

      const {
        token,
        utilisateur,
      } = response.data

      // ========================================================
      // VÉRIFICATION DU RÔLE
      // ========================================================

      if (!utilisateur) {
        throw new Error(
          "Les informations de l'utilisateur sont introuvables."
        )
      }

      if (utilisateur.role !== "administrateur") {
        console.warn(
          "🚫 Tentative de connexion admin avec un compte non administrateur."
        )

        setErreur(
          "Ce compte n'est pas un compte administrateur. Utilisez « Se connecter » pour accéder à votre espace utilisateur."
        )

        setLoading(false)
        return
      }

      // ========================================================
      // ENREGISTREMENT DE LA SESSION
      // ========================================================

      localStorage.setItem(
        "token",
        token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(utilisateur)
      )

      localStorage.setItem(
        "utilisateur",
        JSON.stringify(utilisateur)
      )

      console.log("✅ ADMINISTRATEUR CONNECTÉ")
      console.log("👤 Nom :", utilisateur.nom)
      console.log("👤 Prénom :", utilisateur.prenom)
      console.log("👑 Rôle :", utilisateur.role)

      // ========================================================
      // REDIRECTION ADMIN
      // ========================================================

      navigate("/admin", {
        replace: true,
      })
    } catch (error) {
      console.error(
        "❌ ERREUR CONNEXION ADMIN :",
        error
      )

      if (
        error.response &&
        error.response.data
      ) {
        setErreur(
          error.response.data.message ||
            "Une erreur est survenue lors de la connexion."
        )
      } else if (error.message) {
        setErreur(error.message)
      } else {
        setErreur(
          "Impossible de contacter le serveur."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-950">

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <div className="flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* ==================================================
              LOGO / TITRE
          ================================================== */}

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-block"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 text-4xl shadow-xl transition duration-300 hover:scale-105">
                👑
              </div>
            </Link>

            <h1 className="mt-6 text-3xl font-black text-white">
              BETHEL GLORY MEDIA
            </h1>

            <p className="mt-2 text-green-200">
              Espace d'administration
            </p>

          </div>

          {/* ==================================================
              CARTE
          ================================================== */}

          <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">

            {/* EN-TÊTE */}

            <div className="mb-8 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
                🔐
              </div>

              <h2 className="mt-5 text-2xl font-black text-green-950">
                Connexion administrateur
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Cette page est réservée aux administrateurs
                de BETHEL GLORY MEDIA.
              </p>

            </div>

            {/* ==================================================
                MESSAGE ERREUR
            ================================================== */}

            {erreur && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                <div className="flex gap-3">

                  <span className="text-lg">
                    ⚠️
                  </span>

                  <p className="text-sm font-medium leading-6 text-red-700">
                    {erreur}
                  </p>

                </div>

              </div>
            )}

            {/* ==================================================
                FORMULAIRE
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-bold text-green-950"
                >
                  Adresse e-mail
                </label>

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="admin@bethelglory.local"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

              {/* MOT DE PASSE */}

              <div>

                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-bold text-green-950"
                >
                  Mot de passe
                </label>

                <input
                  id="admin-password"
                  type="password"
                  value={motDePasse}
                  onChange={(e) =>
                    setMotDePasse(e.target.value)
                  }
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

              {/* BOUTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-950 px-6 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    👑
                    Accéder à l'administration
                  </>
                )}

              </button>

            </form>

            {/* ==================================================
                SÉPARATION
            ================================================== */}

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                ou
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* ==================================================
                CONNEXION UTILISATEUR
            ================================================== */}

            <div className="rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-sm text-gray-600">
                Vous êtes un utilisateur ?
              </p>

              <Link
                to="/login"
                className="mt-3 inline-block font-bold text-green-700 transition hover:text-green-900 hover:underline"
              >
                Se connecter comme utilisateur →
              </Link>

            </div>

            {/* ==================================================
                RETOUR ACCUEIL
            ================================================== */}

            <div className="mt-6 text-center">

              <Link
                to="/"
                className="text-sm font-medium text-gray-500 transition hover:text-green-700"
              >
                ← Retour à l'accueil
              </Link>

            </div>

          </div>

          {/* ==================================================
              INFORMATIONS
          ================================================== */}

          <p className="mt-6 text-center text-xs leading-5 text-green-300">
            Accès sécurisé réservé aux administrateurs
            autorisés.
          </p>

        </div>

      </div>

    </div>
  )
}

export default AdminLogin