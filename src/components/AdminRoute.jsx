import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom"

function AdminRoute() {
  const location = useLocation()

  const token = localStorage.getItem("token")

  console.log("====================================")
  console.log("👑 ADMIN ROUTE")
  console.log("====================================")

  console.log(
    "TOKEN :",
    token ? "✅ PRÉSENT" : "❌ ABSENT"
  )

  // ==================================================
  // PAS DE TOKEN
  // ==================================================

  if (!token) {
    console.warn(
      "🔒 Accès administrateur refusé : aucun token."
    )

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // ==================================================
  // DÉCODAGE DU JWT
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
      "❌ Impossible de décoder le token :",
      error
    )

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("utilisateur")

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // ==================================================
  // VÉRIFICATION EXPIRATION
  // ==================================================

  if (
    payload.exp &&
    Date.now() >= payload.exp * 1000
  ) {
    console.warn(
      "⏰ Token administrateur expiré."
    )

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("utilisateur")

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // ==================================================
  // INFORMATIONS
  // ==================================================

  console.log(
    "👤 ID :",
    payload.id
  )

  console.log(
    "👑 RÔLE :",
    payload.role
  )

  // ==================================================
  // ADMINISTRATEUR UNIQUEMENT
  // ==================================================

  if (
    payload.role !== "administrateur"
  ) {
    console.warn(
      "🚫 Accès refusé : administrateur uniquement."
    )

    /*
     * IMPORTANT :
     * On ne supprime PAS le token.
     *
     * L'utilisateur est simplement renvoyé
     * vers son espace publications.
     */

    return (
      <Navigate
        to="/publications"
        replace
      />
    )
  }

  // ==================================================
  // UTILISATEUR ADMINISTRATEUR
  // ==================================================

  const utilisateurExistant =
    localStorage.getItem("user")

  if (!utilisateurExistant) {
    const utilisateur = {
      id: payload.id,
      role: payload.role,
      email: payload.email || "",
      assemblee_id:
        payload.assemblee_id ?? null,
    }

    localStorage.setItem(
      "user",
      JSON.stringify(utilisateur)
    )

    console.log(
      "💾 Utilisateur administrateur enregistré :",
      utilisateur
    )
  }

  console.log(
    "✅ ACCÈS ADMINISTRATEUR AUTORISÉ"
  )

  console.log(
    "===================================="
  )

  // ==================================================
  // AUTORISER L'ACCÈS
  // ==================================================

  return <Outlet />
}

export default AdminRoute