import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import api from "../../services/api"

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(null)

  // ==================================================
  // RÉCUPÉRER LES UTILISATEURS
  // ==================================================
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/utilisateurs")

      if (response.data?.success) {
        setUsers(response.data.data || [])
      } else {
        setError(
          response.data?.message ||
          "Impossible de récupérer les utilisateurs."
        )
      }
    } catch (err) {
      console.error("❌ Erreur récupération utilisateurs :", err)

      setError(
        err.response?.data?.message ||
        "Impossible de récupérer les utilisateurs."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ==================================================
  // MODIFIER LE STATUT
  // ==================================================
  const toggleStatus = async (user) => {
    const nouveauStatut = Number(user.statut) === 1 ? 0 : 1

    try {
      setActionLoading(`status-${user.id}`)
      setError("")

      await api.put(`/utilisateurs/${user.id}/statut`, {
        statut: nouveauStatut,
      })

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? { ...item, statut: nouveauStatut }
            : item
        )
      )
    } catch (err) {
      console.error("❌ Erreur modification statut :", err)

      setError(
        err.response?.data?.message ||
        "Impossible de modifier le statut."
      )
    } finally {
      setActionLoading(null)
    }
  }

  // ==================================================
  // SUPPRIMER UN UTILISATEUR
  // ==================================================
  const deleteUser = async (user) => {
    const nomComplet = `${user.prenom || ""} ${user.nom || ""}`.trim()

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer ${nomComplet || "cet utilisateur"} ?`
    )

    if (!confirmation) return

    try {
      setActionLoading(`delete-${user.id}`)
      setError("")

      await api.delete(`/utilisateurs/${user.id}`)

      setUsers((prev) =>
        prev.filter((item) => item.id !== user.id)
      )
    } catch (err) {
      console.error("❌ Erreur suppression utilisateur :", err)

      setError(
        err.response?.data?.message ||
        "Impossible de supprimer cet utilisateur."
      )
    } finally {
      setActionLoading(null)
    }
  }

  // ==================================================
  // FONCTIONS UTILITAIRES
  // ==================================================
  const getRoleLabel = (role) => {
    if (role === "administrateur") return "Administrateur"
    if (role === "responsable") return "Responsable"
    return "Utilisateur"
  }

  const getInitiales = (user) => {
    const prenom = user.prenom?.charAt(0) || ""
    const nom = user.nom?.charAt(0) || ""

    return `${prenom}${nom}`.toUpperCase() || "U"
  }

  const formatDate = (value) => {
    if (!value) return "Jamais"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return "—"
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // ==================================================
  // STATISTIQUES
  // ==================================================
  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => Number(user.statut) === 1
  ).length

  const adminUsers = users.filter(
    (user) => user.role === "administrateur"
  ).length

  return (
    <div className="min-h-screen bg-[#f5f7f6] pb-32">

      <AdminSidebar />

      <main className="px-4 pt-5 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="mb-8">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <Link
                  to="/admin"
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    text-lg font-bold text-green-950
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                  aria-label="Retour au tableau de bord"
                >
                  ←
                </Link>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                    BETHEL 
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                    Utilisateurs
                  </h1>

                </div>

              </div>

              <div
                className="
                  hidden items-center gap-2
                  rounded-2xl
                  border border-gray-100
                  bg-white
                  px-4 py-3
                  shadow-sm
                  sm:flex
                "
              >

                <span className="text-lg">
                  👥
                </span>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Sécurité
                  </p>

                  <p className="text-sm font-black text-green-950">
                    Accès administration
                  </p>

                </div>

              </div>

            </div>

          </header>


          {/* ==================================================
              HERO
          ================================================== */}

          <section
            className="
              relative overflow-hidden
              rounded-[30px]
              bg-green-950
              p-6 text-white
              shadow-[0_20px_60px_rgba(6,78,59,0.18)]
              sm:p-8
            "
          >

            <div
              className="
                absolute -right-20 -top-20
                h-60 w-60
                rounded-full
                bg-green-700/30
                blur-2xl
              "
            />

            <div
              className="
                absolute -bottom-24 -left-10
                h-52 w-52
                rounded-full
                bg-yellow-400/10
                blur-3xl
              "
            />

            <div className="relative">

              <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-2xl">

                  <div
                    className="
                      mb-4 inline-flex
                      items-center gap-2
                      rounded-full
                      border border-white/10
                      bg-white/10
                      px-3 py-1.5
                    "
                  >

                    <span className="h-2 w-2 rounded-full bg-yellow-400" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-100">
                      Administration sécurisée
                    </span>

                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Gérez les accès à votre espace
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                    Contrôlez les utilisateurs autorisés à accéder
                    à l'administration de BETHEL GLORY MEDIA.
                  </p>

                </div>


                {/* ==================================================
                    BOUTON AJOUTER
                ================================================== */}

                <Link
                  to="/admin/users/add"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-white
                    px-6 py-3.5
                    text-sm font-black
                    text-green-950
                    shadow-xl
                    transition
                    hover:-translate-y-0.5
                    hover:bg-green-50
                    active:scale-[0.98]
                  "
                >

                  <span className="text-lg">
                    +
                  </span>

                  Ajouter un utilisateur

                </Link>

              </div>

            </div>

          </section>


          {/* ==================================================
              MESSAGE ERREUR
          ================================================== */}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-black text-red-800">
                    Une erreur est survenue
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchUsers}
                  className="
                    rounded-xl
                    bg-white
                    px-4 py-2
                    text-sm font-bold
                    text-red-700
                    shadow-sm
                    transition
                    hover:bg-red-100
                  "
                >
                  Réessayer
                </button>

              </div>

            </div>
          )}


          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <section className="mt-5 grid gap-4 sm:grid-cols-3">

            {/* UTILISATEURS */}

            <div
              className="
                rounded-[24px]
                border border-gray-100
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-green-50
                    text-xl
                  "
                >
                  👥
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  TOTAL
                </span>

              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {loading ? "..." : totalUsers}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Utilisateurs
              </p>

            </div>


            {/* ACTIFS */}

            <div
              className="
                rounded-[24px]
                border border-gray-100
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-yellow-50
                    text-xl
                  "
                >
                  ✓
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  ACTIFS
                </span>

              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {loading ? "..." : activeUsers}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Comptes actifs
              </p>

            </div>


            {/* ADMINISTRATEURS */}

            <div
              className="
                rounded-[24px]
                border border-gray-100
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <span
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    bg-gray-100
                    text-xl
                  "
                >
                  🔐
                </span>

                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                  ADMIN
                </span>

              </div>

              <p className="mt-5 text-3xl font-black text-gray-950">
                {loading ? "..." : adminUsers}
              </p>

              <p className="mt-1 text-sm font-medium text-gray-500">
                Administrateurs
              </p>

            </div>

          </section>


          {/* ==================================================
              LISTE DES UTILISATEURS
          ================================================== */}

          <section className="mt-8">

            <div className="mb-5 flex items-end justify-between gap-4">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                  Administration
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950">
                  Utilisateurs
                </h2>

              </div>

              <span
                className="
                  hidden rounded-full
                  bg-white
                  px-3 py-1.5
                  text-[10px] font-bold
                  text-gray-400
                  shadow-sm
                  sm:block
                "
              >
                {loading
                  ? "Chargement..."
                  : `${totalUsers} compte${totalUsers > 1 ? "s" : ""}`}
              </span>

            </div>


            {/* ==================================================
                CHARGEMENT
            ================================================== */}

            {loading && (
              <div
                className="
                  overflow-hidden
                  rounded-[30px]
                  border border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                <div className="grid gap-4 p-6 sm:p-10 md:grid-cols-2 xl:grid-cols-3">

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-[24px] border border-gray-100 bg-gray-50 p-5"
                    >

                      <div className="flex items-center gap-4">

                        <div className="h-14 w-14 rounded-2xl bg-gray-200" />

                        <div className="flex-1">

                          <div className="h-4 w-32 rounded bg-gray-200" />

                          <div className="mt-2 h-3 w-44 rounded bg-gray-200" />

                        </div>

                      </div>

                      <div className="mt-5 h-3 w-full rounded bg-gray-200" />

                      <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />

                    </div>
                  ))}

                </div>

              </div>
            )}


            {/* ==================================================
                UTILISATEURS
            ================================================== */}

            {!loading && users.length > 0 && (
              <div
                className="
                  overflow-hidden
                  rounded-[30px]
                  border border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                <div className="grid gap-4 p-6 sm:p-10 md:grid-cols-2 xl:grid-cols-3">

                  {users.map((user) => {

                    const isActive = Number(user.statut) === 1

                    return (
                      <div
                        key={user.id}
                        className="
                          rounded-[24px]
                          border border-gray-100
                          bg-white
                          p-5
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                          hover:shadow-md
                        "
                      >

                        {/* PROFIL */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            {user.photo ? (
                              <img
                                src={
                                  user.photo.startsWith("http")
                                    ? user.photo
: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.photo.startsWith("/") ? "" : "/"}${user.photo}`                                }
                                alt={`${user.prenom} ${user.nom}`}
                                className="
                                  h-14 w-14
                                  shrink-0
                                  rounded-2xl
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex h-14 w-14
                                  shrink-0
                                  items-center justify-center
                                  rounded-2xl
                                  bg-green-50
                                  text-sm font-black
                                  text-green-800
                                "
                              >
                                {getInitiales(user)}
                              </div>
                            )}

                            <div className="min-w-0">

                              <h3 className="truncate text-sm font-black text-gray-950">
                                {user.prenom} {user.nom}
                              </h3>

                              <p className="mt-1 truncate text-xs text-gray-500">
                                {user.email}
                              </p>

                            </div>

                          </div>

                          <span
                            className={`
                              shrink-0 rounded-full
                              px-2.5 py-1
                              text-[9px] font-black uppercase
                              ${
                                isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }
                            `}
                          >
                            {isActive ? "Actif" : "Inactif"}
                          </span>

                        </div>


                        {/* INFORMATIONS */}

                        <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4">

                          <div className="flex items-center justify-between gap-3">

                            <span className="text-xs text-gray-400">
                              Rôle
                            </span>

                            <span className="text-xs font-black text-gray-800">
                              {getRoleLabel(user.role)}
                            </span>

                          </div>

                          <div className="flex items-center justify-between gap-3">

                            <span className="text-xs text-gray-400">
                              Téléphone
                            </span>

                            <span className="truncate text-xs font-bold text-gray-800">
                              {user.telephone || "Non renseigné"}
                            </span>

                          </div>

                          <div className="flex items-center justify-between gap-3">

                            <span className="text-xs text-gray-400">
                              Dernière connexion
                            </span>

                            <span className="text-xs font-bold text-gray-800">
                              {formatDate(user.derniere_connexion)}
                            </span>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="mt-4 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() => toggleStatus(user)}
                            disabled={
                              actionLoading === `status-${user.id}`
                            }
                            className={`
                              rounded-xl
                              px-3 py-2.5
                              text-xs font-black
                              transition
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              ${
                                isActive
                                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }
                            `}
                          >
                            {actionLoading === `status-${user.id}`
                              ? "Traitement..."
                              : isActive
                                ? "Désactiver"
                                : "Activer"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteUser(user)}
                            disabled={
                              actionLoading === `delete-${user.id}`
                            }
                            className="
                              rounded-xl
                              bg-red-50
                              px-3 py-2.5
                              text-xs font-black
                              text-red-600
                              transition
                              hover:bg-red-100
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {actionLoading === `delete-${user.id}`
                              ? "Suppression..."
                              : "Supprimer"}
                          </button>

                        </div>

                      </div>
                    )
                  })}

                </div>

              </div>
            )}


            {/* ==================================================
                AUCUN UTILISATEUR
            ================================================== */}

            {!loading && users.length === 0 && !error && (
              <div
                className="
                  overflow-hidden
                  rounded-[30px]
                  border border-gray-100
                  bg-white
                  shadow-sm
                "
              >

                <div className="p-6 sm:p-10">

                  <div
                    className="
                      relative overflow-hidden
                      rounded-[26px]
                      border-2 border-dashed
                      border-gray-200
                      bg-gray-50/70
                      px-5 py-12
                      text-center
                      sm:px-10
                    "
                  >

                    {/* DÉCOR */}

                    <div
                      className="
                        absolute -left-10 -top-10
                        h-24 w-24
                        rounded-full
                        bg-green-100/60
                        blur-xl
                      "
                    />

                    <div
                      className="
                        absolute -bottom-10 -right-10
                        h-24 w-24
                        rounded-full
                        bg-yellow-100/50
                        blur-xl
                      "
                    />

                    <div className="relative">

                      <div
                        className="
                          mx-auto flex h-20 w-20
                          items-center justify-center
                          rounded-[26px]
                          bg-white
                          text-4xl
                          shadow-md
                        "
                      >
                        👥
                      </div>

                      <h3 className="mt-6 text-xl font-black text-gray-950">
                        Aucun utilisateur
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Les comptes utilisateurs autorisés à accéder
                        à votre administration apparaîtront ici.
                      </p>


                      {/* ==================================================
                          PREMIER UTILISATEUR
                      ================================================== */}

                      <Link
                        to="/admin/users/add"
                        className="
                          mt-6 inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-2xl
                          bg-green-950
                          px-6 py-3.5
                          text-sm font-black
                          text-white
                          shadow-lg
                          shadow-green-950/15
                          transition
                          hover:bg-green-900
                          active:scale-[0.98]
                        "
                      >

                        <span className="text-lg">
                          +
                        </span>

                        Ajouter mon premier utilisateur

                      </Link>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </section>


          {/* ==================================================
              INFORMATIONS
          ================================================== */}

          <section
            className="
              mt-6
              rounded-[26px]
              border border-green-100
              bg-green-50
              p-5
              sm:p-6
            "
          >

            <div className="flex gap-4">

              <div
                className="
                  flex h-11 w-11
                  shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-white
                  text-xl
                  shadow-sm
                "
              >
                🔐
              </div>

              <div>

                <p className="font-black text-green-950">
                  Gestion des accès
                </p>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  Les utilisateurs de cette section pourront
                  disposer d'un accès à l'espace d'administration
                  selon leurs autorisations.
                </p>

              </div>

            </div>

          </section>


          {/* ESPACE BAS */}

          <div className="h-6" />

        </div>

      </main>

    </div>
  )
}

export default Users