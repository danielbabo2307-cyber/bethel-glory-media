import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import api from "../../services/api"

function AddUser() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    role: "utilisateur",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await api.post(
        "/utilisateurs",
        form
      )

      console.log(
        "✅ Utilisateur créé :",
        response.data
      )

      setSuccess(
        response.data?.message ||
          "Utilisateur ajouté avec succès."
      )

      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        role: "utilisateur",
      })

      setTimeout(() => {
        navigate("/admin/users", {
          replace: true,
        })
      }, 1200)

    } catch (err) {
      console.error(
        "❌ Erreur création utilisateur :",
        err
      )

      const message =
        err?.response?.data?.message ||
        "Impossible de créer l'utilisateur."

      setError(message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] pb-32">

      <AdminSidebar />

      <main className="px-4 pt-5 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl">

          {/* HEADER */}

          <header className="mb-8">

            <div className="flex items-center gap-3">

              <Link
                to="/admin/users"
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
                aria-label="Retour aux utilisateurs"
              >
                ←
              </Link>

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">
                  BETHEL 
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                  Ajouter un utilisateur
                </h1>

              </div>

            </div>

          </header>


          {/* HERO */}

          <section
            className="
              relative mb-6 overflow-hidden
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
                  Nouveau compte
                </span>

              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Créer un accès administration
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:text-base">
                Ajoutez un utilisateur autorisé à accéder à
                l'espace d'administration de BETHEL GLORY MEDIA.
              </p>

            </div>

          </section>


          {/* FORMULAIRE */}

          <section
            className="
              overflow-hidden
              rounded-[30px]
              border border-gray-100
              bg-white
              shadow-sm
            "
          >

            <div className="border-b border-gray-100 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-green-50
                    text-2xl
                  "
                >
                  👤
                </div>

                <div>

                  <h3 className="font-black text-gray-950">
                    Informations du compte
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Renseignez les informations du nouvel utilisateur.
                  </p>

                </div>

              </div>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 sm:p-8"
            >

              {/* MESSAGE ERREUR */}

              {error && (
                <div
                  className="
                    rounded-2xl
                    border border-red-100
                    bg-red-50
                    px-4 py-3
                    text-sm font-bold
                    text-red-700
                  "
                >
                  ⚠️ {error}
                </div>
              )}


              {/* MESSAGE SUCCÈS */}

              {success && (
                <div
                  className="
                    rounded-2xl
                    border border-green-100
                    bg-green-50
                    px-4 py-3
                    text-sm font-bold
                    text-green-800
                  "
                >
                  ✅ {success}
                </div>
              )}


              {/* NOM */}

              <div>

                <label
                  htmlFor="nom"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Nom
                </label>

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Ex. Kouassi"
                  required
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3.5
                    text-sm text-gray-950
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-green-700
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>


              {/* PRENOM */}

              <div>

                <label
                  htmlFor="prenom"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Prénom
                </label>

                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Ex. Jean"
                  required
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3.5
                    text-sm text-gray-950
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-green-700
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Adresse e-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  required
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3.5
                    text-sm text-gray-950
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-green-700
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>


              {/* TELEPHONE */}

              <div>

                <label
                  htmlFor="telephone"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Téléphone
                </label>

                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="Ex. 07 00 00 00 00"
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3.5
                    text-sm text-gray-950
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-green-700
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>


              {/* MOT DE PASSE */}

              <div>

                <label
                  htmlFor="mot_de_passe"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Mot de passe
                </label>

                <div className="relative">

                  <input
                    id="mot_de_passe"
                    name="mot_de_passe"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.mot_de_passe}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="
                      w-full rounded-2xl
                      border border-gray-200
                      bg-gray-50
                      px-4 py-3.5 pr-24
                      text-sm text-gray-950
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-green-700
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      rounded-xl
                      px-3 py-2
                      text-sm font-bold
                      text-gray-500
                      transition
                      hover:bg-gray-100
                    "
                  >
                    {showPassword
                      ? "Masquer"
                      : "Afficher"}
                  </button>

                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Le mot de passe doit contenir au minimum 6 caractères.
                </p>

              </div>


              {/* ROLE */}

              <div>

                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-black text-gray-800"
                >
                  Rôle
                </label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="
                    w-full rounded-2xl
                    border border-gray-200
                    bg-gray-50
                    px-4 py-3.5
                    text-sm text-gray-950
                    outline-none
                    transition
                    focus:border-green-700
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                >

                  <option value="utilisateur">
                    Utilisateur
                  </option>

                  <option value="administrateur">
                    Administrateur
                  </option>

                </select>

              </div>


              {/* SECURITE */}

              <div
                className="
                  flex gap-3
                  rounded-2xl
                  border border-green-100
                  bg-green-50
                  p-4
                "
              >

                <div className="text-xl">
                  🔐
                </div>

                <div>

                  <p className="text-sm font-black text-green-950">
                    Accès sécurisé
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-800">
                    Le mot de passe sera chiffré avant
                    son enregistrement dans la base de données.
                  </p>

                </div>

              </div>


              {/* BOUTONS */}

              <div
                className="
                  flex flex-col-reverse
                  gap-3
                  border-t border-gray-100
                  pt-6
                  sm:flex-row
                  sm:justify-end
                "
              >

                <Link
                  to="/admin/users"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-2xl
                    border border-gray-200
                    bg-white
                    px-6 py-3.5
                    text-sm font-black
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                >
                  Annuler
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex
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
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {loading ? (
                    <>
                      <span>⏳</span>
                      Création...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Créer l'utilisateur
                    </>
                  )}

                </button>

              </div>

            </form>

          </section>

          <div className="h-8" />

        </div>

      </main>

    </div>
  )
}

export default AddUser