import api from "./api"

export async function testConnection() {
  try {
    console.log("📡 Test de connexion au serveur...")

    const response = await api.get("/responsables/public")

    console.log("📊 Status :", response.status)
    console.log("📥 Réponse :", response.data)

    return response.data
  } catch (error) {
    console.error(
      "❌ Erreur de connexion au serveur :",
      error
    )

    if (error.response) {
      console.error(
        "📊 Status :",
        error.response.status
      )

      console.error(
        "📥 Réponse :",
        error.response.data
      )
    }

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Erreur de connexion au serveur",
    }
  }
}