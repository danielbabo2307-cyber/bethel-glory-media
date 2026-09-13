import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

function ProtectedRoute() {
  const location = useLocation()

  const [verification, setVerification] = useState({
    loading: true,
    authenticated: false,
  })

  useEffect(() => {
    const verifierConnexion = () => {
      const token = localStorage.getItem("token")

      const utilisateurBrut =
        localStorage.getItem("utilisateur") ||
        localStorage.getItem("user")

      if (!token || !utilisateurBrut) {
        setVerification({
          loading: false,
          authenticated: false,
        })

        return
      }

      try {
        const utilisateur = JSON.parse(utilisateurBrut)

        /*
         * ==================================================
         * VÉRIFICATION DU JWT
         * ==================================================
         */

        const parties = token.split(".")

        if (parties.length !== 3) {
          throw new Error("Token invalide")
        }

        const payload = JSON.parse(
          atob(
            parties[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        )

        /*
         * ==================================================
         * VÉRIFICATION EXPIRATION
         * ==================================================
         */

        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("utilisateur")

          setVerification({
            loading: false,
            authenticated: false,
          })

          return
        }

        /*
         * ==================================================
         * RECONSTRUCTION DE L'UTILISATEUR
         * ==================================================
         */

        const utilisateurFinal = {
          ...utilisateur,
          id: utilisateur.id || payload.id,
          email: utilisateur.email || payload.email,
          role: utilisateur.role || payload.role,
        }

        /*
         * On s'assure que les deux clés restent synchronisées.
         */

        localStorage.setItem(
          "utilisateur",
          JSON.stringify(utilisateurFinal)
        )

        localStorage.setItem(
          "user",
          JSON.stringify(utilisateurFinal)
        )

        /*
         * ==================================================
         * UTILISATEUR AUTHENTIFIÉ
         * ==================================================
         */

        setVerification({
          loading: false,
          authenticated: true,
        })
      } catch (error) {
        console.error(
          "❌ Erreur vérification authentification :",
          error
        )

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("utilisateur")

        setVerification({
          loading: false,
          authenticated: false,
        })
      }
    }

    verifierConnexion()
  }, [location.pathname])

  /*
   * ==================================================
   * CHARGEMENT
   * ==================================================
   */

  if (verification.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-950 text-white">
        <div className="text-center">

          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />

          <p className="text-sm font-medium text-green-100">
            Vérification de votre connexion...
          </p>

        </div>
      </div>
    )
  }

  /*
   * ==================================================
   * PAS CONNECTÉ
   * ==================================================
   */

  if (!verification.authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message:
            "Connectez-vous pour accéder à cet espace.",
        }}
      />
    )
  }

  /*
   * ==================================================
   * CONNECTÉ
   * ==================================================
   */

  return <Outlet />
}

export default ProtectedRoute