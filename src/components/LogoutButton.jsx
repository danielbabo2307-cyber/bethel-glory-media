
import { useNavigate } from "react-router-dom"

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // ============================================
    // SUPPRIMER LES INFORMATIONS DE CONNEXION
    // ============================================

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("utilisateur")

    console.log("🚪 Déconnexion effectuée")

    // ============================================
    // RETOUR AU SITE PUBLIC
    // ============================================

    navigate("/", {
      replace: true,
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white shadow transition hover:bg-red-700"
    >
      🚪 Se déconnecter
    </button>
  )
}

export default LogoutButton

