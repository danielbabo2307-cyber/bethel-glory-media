import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  /*
   * ==================================================
   * CONNEXION
   * ==================================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErreur("")

    if (!email.trim() || !motDePasse.trim()) {
      setErreur(
        "Veuillez renseigner votre adresse e-mail et votre mot de passe."
      )

      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.trim(),
          mot_de_passe: motDePasse,
        }
      )

      const data = response.data

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Impossible de se connecter."
        )
      }

      const utilisateur = data.utilisateur
      const token = data.token

      /*
       * ==================================================
       * VÉRIFICATION DU RÔLE
       * ==================================================
       */

      if (
        utilisateur?.role !== "utilisateur"
      ) {
        setErreur(
          "Ce compte est réservé à l'administration. Veuillez utiliser « Admin » pour vous connecter."
        )

        setLoading(false)

        return
      }

      /*
       * ==================================================
       * SAUVEGARDE DE LA SESSION
       * ==================================================
       */

      localStorage.setItem(
        "token",
        token
      )

      localStorage.setItem(
        "utilisateur",
        JSON.stringify(utilisateur)
      )

      localStorage.setItem(
        "user",
        JSON.stringify(utilisateur)
      )

      /*
       * ==================================================
       * REDIRECTION
       *
       * IMPORTANT :
       * On ne redirige PLUS automatiquement
       * vers /publications.
       * ==================================================
       */

      const destination =
        location.state?.from &&
        !location.state.from.startsWith("/admin")
          ? location.state.from
          : "/"

      navigate(destination, {
        replace: true,
      })
    } catch (error) {
      console.error(
        "❌ Erreur connexion :",
        error
      )

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Une erreur est survenue pendant la connexion."

      setErreur(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-black px-4 py-10 text-white">

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">

        <div className="w-full">

          {/* ==================================================
              RETOUR
          ================================================== */}

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-200 transition hover:text-white"
          >
            ← Retour à l'accueil
          </Link>

          {/* ==================================================
              CARD
          ================================================== */}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

            {/* ==================================================
                TITRE
            ================================================== */}

            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-xl">
                🔐
              </div>

              <h1 className="text-3xl font-black">
                Se connecter
              </h1>

              <p className="mt-2 text-sm text-green-100">
                Accédez à votre espace de création
              </p>

            </div>

            {/* ==================================================
                ERREUR
            ================================================== */}

            {erreur && (
              <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                <div className="flex gap-3">
                  <span>⚠️</span>

                  <p>{erreur}</p>
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
                <label className="mb-2 block text-sm font-semibold text-green-100">
                  Adresse e-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="exemple@email.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-green-200/50 focus:border-green-300 focus:bg-black/30"
                />
              </div>

              {/* MOT DE PASSE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-green-100">
                  Mot de passe
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={motDePasse}
                    onChange={(e) =>
                      setMotDePasse(
                        e.target.value
                      )
                    }
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 pr-14 text-white outline-none transition placeholder:text-green-200/50 focus:border-green-300 focus:bg-black/30"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-lg transition hover:bg-white/10"
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>
              </div>

              {/* BOUTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-white px-5 py-4 font-black text-green-950 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-950/30 border-t-green-950" />

                    Connexion...

                  </span>
                ) : (
                  "Se connecter"
                )}

              </button>

            </form>

            {/* ==================================================
                ADMIN
            ================================================== */}

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-green-200">
                Administration
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/admin/login"
              className="block w-full rounded-2xl border border-white/10 px-5 py-3.5 text-center font-bold text-white transition duration-300 hover:bg-white/10"
            >
              ⚙️ Connexion administrateur
            </Link>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Login