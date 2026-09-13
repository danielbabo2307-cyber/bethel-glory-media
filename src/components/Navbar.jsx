import { NavLink, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import dani from "../assets/dani.jpg"

function Navbar() {
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [utilisateur, setUtilisateur] = useState(null)

  // ==================================================
  // ÉTAT DE LA FENÊTRE DE CONFIRMATION
  // ==================================================

  const [deconnexion, setDeconnexion] = useState(false)

  // ==================================================
  // CHARGER L'UTILISATEUR CONNECTÉ
  // ==================================================

  const chargerUtilisateur = () => {
    try {
      const utilisateurBrut =
        localStorage.getItem("utilisateur") ||
        localStorage.getItem("user")

      if (!utilisateurBrut) {
        setUtilisateur(null)
        return
      }

      const utilisateurParse = JSON.parse(utilisateurBrut)

      setUtilisateur(utilisateurParse)
    } catch (error) {
      console.error(
        "❌ Erreur lecture utilisateur :",
        error
      )

      setUtilisateur(null)
    }
  }

  // ==================================================
  // INITIALISATION + SURVEILLANCE
  // ==================================================

  useEffect(() => {
    chargerUtilisateur()

    const interval = setInterval(() => {
      chargerUtilisateur()
    }, 1000)

    const handleStorage = () => {
      chargerUtilisateur()
    }

    window.addEventListener(
      "storage",
      handleStorage
    )

    return () => {
      clearInterval(interval)

      window.removeEventListener(
        "storage",
        handleStorage
      )
    }
  }, [])

  // ==================================================
  // DEMANDER LA CONFIRMATION DE DÉCONNEXION
  // ==================================================

  const handleLogout = () => {
    console.log(
      "🔐 DEMANDE DE DÉCONNEXION DEPUIS LA NAVBAR"
    )

    setMenuOpen(false)
    setDeconnexion(true)
  }

  // ==================================================
  // ANNULER LA DÉCONNEXION
  // ==================================================

  const annulerDeconnexion = () => {
    console.log(
      "❌ DÉCONNEXION ANNULÉE"
    )

    setDeconnexion(false)
  }

  // ==================================================
  // CONFIRMER LA DÉCONNEXION
  // ==================================================

  const confirmerDeconnexion = () => {
    console.log(
      "🚪 DÉCONNEXION EFFECTUÉE"
    )

    // Suppression de toutes les informations
    localStorage.removeItem("utilisateur")
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Réinitialisation de l'état
    setUtilisateur(null)
    setDeconnexion(false)
    setMenuOpen(false)

    // Retour à l'accueil
    navigate("/", {
      replace: true,
    })
  }

  // ==================================================
  // FERMER LA FENÊTRE AVEC ESC
  // ==================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        deconnexion
      ) {
        annulerDeconnexion()
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      )
    }
  }, [deconnexion])

  // ==================================================
  // ÉTAT DE CONNEXION
  // ==================================================

  const estConnecte =
    !!utilisateur &&
    !!localStorage.getItem("token")

  const estAdministrateur =
    utilisateur?.role === "administrateur"

  const estUtilisateur =
    utilisateur?.role === "utilisateur"

  // ==================================================
  // NOM DE L'UTILISATEUR
  // ==================================================

  const nomUtilisateur =
    utilisateur?.prenom ||
    utilisateur?.nom ||
    utilisateur?.email?.split("@")[0] ||
    "Utilisateur"

  const nomComplet =
    [
      utilisateur?.prenom,
      utilisateur?.nom,
    ]
      .filter(Boolean)
      .join(" ") || nomUtilisateur

  // ==================================================
  // FERMER LE MENU
  // ==================================================

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // ==================================================
  // STYLE DES LIENS DESKTOP
  // ==================================================

  const navLinkClass = ({ isActive }) =>
    `
      whitespace-nowrap
      text-sm
      font-medium
      transition-all
      duration-300
      ${
        isActive
          ? "font-bold text-white"
          : "text-green-100 hover:text-white"
      }
    `

  // ==================================================
  // STYLE DES LIENS MOBILE
  // ==================================================

  const mobileNavLinkClass = ({ isActive }) =>
    `
      rounded-xl
      px-4
      py-3
      font-medium
      transition-all
      duration-300
      ${
        isActive
          ? "bg-white/10 font-bold text-white"
          : "text-white hover:bg-white/10"
      }
    `

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header
        className="
          fixed
          top-0
          z-50
          w-full
          border-b
          border-white/10
          bg-green-950/90
          text-white
          backdrop-blur-xl
        "
      >

        {/* ==================================================
            BARRE PRINCIPALE
        ================================================== */}

        <div
          className="
            mx-auto
            flex
            h-[76px]
            max-w-[1600px]
            items-center
            gap-6
            px-5
            lg:px-8
          "
        >

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="flex shrink-0 items-center gap-3">

            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center"
            >
              <img
                src={dani}
                alt="Logo BETHEL GLORY MEDIA"
                className="
                  h-11
                  w-11
                  rounded-xl
                  object-cover
                  shadow-lg
                  transition
                  duration-300
                  hover:scale-105
                "
              />
            </Link>

            <Link
              to="/"
              onClick={closeMenu}
              className="hidden sm:block"
            >

              <p className="whitespace-nowrap text-sm font-bold tracking-wide">
                BETHEL GLORY MEDIA
              </p>

              <p className="whitespace-nowrap text-xs text-green-200">
                Communication & Création
              </p>

            </Link>

          </div>

          {/* ==================================================
              NAVIGATION DESKTOP
          ================================================== */}

          <nav
            className="
              hidden
              flex-1
              items-center
              justify-center
              gap-5
              xl:gap-7
              md:flex
            "
          >

            <NavLink
              to="/"
              end
              className={navLinkClass}
            >
              Accueil
            </NavLink>

            <NavLink
              to="/church"
              className={navLinkClass}
            >
              Notre Église
            </NavLink>

            <NavLink
              to="/assemblies"
              className={navLinkClass}
            >
              Assemblées
            </NavLink>

            <NavLink
              to="/programs"
              className={navLinkClass}
            >
              Programmes
            </NavLink>

            {/* PUBLICATIONS UNIQUEMENT CONNECTÉ */}

            {estConnecte && (
              <NavLink
                to="/publications"
                className={navLinkClass}
              >
                Publications
              </NavLink>
            )}

            <NavLink
              to="/contact"
              className={navLinkClass}
            >
              Contact
            </NavLink>

          </nav>

          {/* ==================================================
              ZONE ACTIONS DESKTOP
          ================================================== */}

          <div
            className="
              ml-auto
              hidden
              shrink-0
              items-center
              gap-2
              md:flex
            "
          >

            {/* ==================================================
                VISITEUR
            ================================================== */}

            {!estConnecte && (
              <div className="flex items-center gap-2">

                {/* SE CONNECTER */}

                <Link
                  to="/login"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-white/10
                  "
                >
                  Se connecter
                </Link>

                {/* ADMIN */}

                <Link
                  to="/admin/login"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    bg-green-800
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-700
                    hover:shadow-lg
                  "
                >
                  ⚙️ Admin
                </Link>

              </div>
            )}

            {/* ==================================================
                UTILISATEUR CONNECTÉ
            ================================================== */}

            {estConnecte && estUtilisateur && (
              <div className="flex items-center gap-2">

                {/* NOM */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-white/10
                      text-sm
                    "
                  >
                    👤
                  </div>

                  <div className="leading-tight">

                    <p className="text-[10px] text-green-200">
                      Connecté en tant que
                    </p>

                    <p
                      className="
                        max-w-[140px]
                        truncate
                        text-sm
                        font-bold
                        text-white
                      "
                      title={nomComplet}
                    >
                      {nomComplet}
                    </p>

                  </div>

                </div>

                {/* CRÉER */}

                <Link
                  to="/publications"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-green-950
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-50
                    hover:shadow-lg
                  "
                >
                  ✨ Créer
                </Link>

                {/* DÉCONNEXION */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:border-red-400/30
                    hover:bg-red-500/10
                    hover:text-red-200
                  "
                >
                  🚪 Déconnexion
                </button>

              </div>
            )}

            {/* ==================================================
                ADMIN CONNECTÉ
            ================================================== */}

            {estConnecte && estAdministrateur && (
              <div className="flex items-center gap-2">

                {/* NOM ADMIN */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-yellow-400/20
                    bg-yellow-400/10
                    px-3
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-yellow-400/10
                      text-sm
                    "
                  >
                    👑
                  </div>

                  <div className="leading-tight">

                    <p className="text-[10px] text-yellow-200">
                      Administrateur
                    </p>

                    <p
                      className="
                        max-w-[140px]
                        truncate
                        text-sm
                        font-bold
                        text-white
                      "
                      title={nomComplet}
                    >
                      {nomComplet}
                    </p>

                  </div>

                </div>

                {/* ADMINISTRATION */}

                <Link
                  to="/admin"
                  className="
                    whitespace-nowrap
                    rounded-xl
                    bg-green-800
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-700
                    hover:shadow-lg
                  "
                >
                  ⚙️ Administration
                </Link>

                {/* DÉCONNEXION */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:border-red-400/30
                    hover:bg-red-500/10
                    hover:text-red-200
                  "
                >
                  🚪 Déconnexion
                </button>

              </div>
            )}

          </div>

          {/* ==================================================
              BOUTON MOBILE
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="
              ml-auto
              rounded-xl
              p-2
              text-xl
              text-white
              transition
              duration-300
              hover:bg-white/10
              md:hidden
            "
            aria-label={
              menuOpen
                ? "Fermer le menu"
                : "Ouvrir le menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* ==================================================
            MENU MOBILE
        ================================================== */}

        {menuOpen && (
          <div
            className="
              border-t
              border-white/10
              bg-green-950
              px-5
              pb-6
              pt-4
              shadow-2xl
              md:hidden
            "
          >

            <nav className="flex flex-col gap-2">

              {/* ACCUEIL */}

              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                🏠 Accueil
              </NavLink>

              {/* ÉGLISE */}

              <NavLink
                to="/church"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                ⛪ Notre Église
              </NavLink>

              {/* ASSEMBLÉES */}

              <NavLink
                to="/assemblies"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                🏛️ Assemblées
              </NavLink>

              {/* PROGRAMMES */}

              <NavLink
                to="/programs"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                📅 Programmes
              </NavLink>

              {/* PUBLICATIONS */}

              {estConnecte && (
                <NavLink
                  to="/publications"
                  onClick={closeMenu}
                  className={mobileNavLinkClass}
                >
                  🖼️ Publications
                </NavLink>
              )}

              {/* CONTACT */}

              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                📞 Contact
              </NavLink>

              <div className="my-2 h-px bg-white/10" />

              {/* ==================================================
                  VISITEUR
              ================================================== */}

              {!estConnecte && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      text-center
                      font-bold
                      text-green-950
                      transition
                      duration-300
                      hover:bg-green-100
                    "
                  >
                    🔐 Se connecter
                  </Link>

                  <Link
                    to="/admin/login"
                    onClick={closeMenu}
                    className="
                      rounded-xl
                      bg-green-800
                      px-4
                      py-3
                      text-center
                      font-bold
                      text-white
                      transition
                      duration-300
                      hover:bg-green-700
                    "
                  >
                    ⚙️ Administration
                  </Link>
                </>
              )}

              {/* ==================================================
                  UTILISATEUR CONNECTÉ
              ================================================== */}

              {estConnecte &&
                estUtilisateur && (
                  <>

                    {/* IDENTITÉ */}

                    <div
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-3
                        text-center
                      "
                    >

                      <p className="text-xs text-green-200">
                        Connecté en tant que
                      </p>

                      <p className="mt-1 font-bold text-white">
                        👤 {nomComplet}
                      </p>

                    </div>

                    {/* CRÉER */}

                    <Link
                      to="/publications"
                      onClick={closeMenu}
                      className="
                        rounded-xl
                        bg-white
                        px-4
                        py-3
                        text-center
                        font-bold
                        text-green-950
                        transition
                        duration-300
                        hover:bg-green-100
                      "
                    >
                      ✨ Créer une publication
                    </Link>

                    {/* DÉCONNEXION */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        rounded-xl
                        border
                        border-white/20
                        px-4
                        py-3
                        text-center
                        font-bold
                        text-white
                        transition
                        duration-300
                        hover:border-red-400/30
                        hover:bg-red-500/10
                        hover:text-red-200
                      "
                    >
                      🚪 Déconnexion
                    </button>

                  </>
                )}

              {/* ==================================================
                  ADMIN CONNECTÉ
              ================================================== */}

              {estConnecte &&
                estAdministrateur && (
                  <>

                    {/* IDENTITÉ ADMIN */}

                    <div
                      className="
                        rounded-xl
                        border
                        border-yellow-400/20
                        bg-yellow-400/10
                        px-4
                        py-3
                        text-center
                      "
                    >

                      <p className="text-xs text-yellow-200">
                        Administrateur
                      </p>

                      <p className="mt-1 font-bold text-white">
                        👑 {nomComplet}
                      </p>

                    </div>

                    {/* ADMINISTRATION */}

                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="
                        rounded-xl
                        bg-green-800
                        px-4
                        py-3
                        text-center
                        font-bold
                        text-white
                        transition
                        duration-300
                        hover:bg-green-700
                      "
                    >
                      ⚙️ Administration
                    </Link>

                    {/* DÉCONNEXION */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        rounded-xl
                        border
                        border-white/20
                        px-4
                        py-3
                        text-center
                        font-bold
                        text-white
                        transition
                        duration-300
                        hover:border-red-400/30
                        hover:bg-red-500/10
                        hover:text-red-200
                      "
                    >
                      🚪 Déconnexion
                    </button>

                  </>
                )}

            </nav>

          </div>
        )}

      </header>

      {/* ============================================================
          FENÊTRE DE CONFIRMATION DE DÉCONNEXION
          MÊME MODÈLE QUE LE DASHBOARD ADMIN
      ============================================================ */}

      {deconnexion && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-[#061f18]/70
            px-4
            py-6
            backdrop-blur-md
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              annulerDeconnexion()
            }
          }}
        >

          {/* ==================================================
              MODALE
          ================================================== */}

          <div
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-[30px]
              bg-white
              shadow-2xl
              animate-[logoutModalIn_0.35s_ease-out]
            "
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* ==================================================
                BARRE SUPÉRIEURE VERTE / OR
            ================================================== */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-1.5
                bg-gradient-to-r
                from-green-950
                via-yellow-400
                to-green-700
              "
            />

            {/* ==================================================
                BOUTON FERMER
            ================================================== */}

            <button
              type="button"
              onClick={annulerDeconnexion}
              aria-label="Fermer"
              className="
                absolute
                right-4
                top-4
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-green-950/5
                text-lg
                font-bold
                text-green-950/60
                transition-all
                duration-300
                hover:rotate-90
                hover:bg-red-500/10
                hover:text-red-600
              "
            >
              ✕
            </button>

            {/* ==================================================
                CONTENU
            ================================================== */}

            <div className="px-6 pb-7 pt-9 sm:px-8">

              {/* ==================================================
                  ICÔNE
              ================================================== */}

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-green-950
                  text-3xl
                  shadow-xl
                  ring-8
                  ring-green-950/5
                  animate-[logoutIconIn_0.5s_ease-out]
                "
              >
                🚪
              </div>

              {/* ==================================================
                  TITRE
              ================================================== */}

              <div className="mt-6 text-center">

                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-green-950
                  "
                >
                  Déconnexion
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-sm
                    text-sm
                    leading-6
                    text-slate-600
                  "
                >
                  Êtes-vous sûr de vouloir vous
                  déconnecter de votre espace
                  {estAdministrateur
                    ? " d'administration"
                    : " utilisateur"}{" "}
                  ?
                </p>

              </div>

              {/* ==================================================
                  INFORMATIONS SESSION
              ================================================== */}

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-green-900/10
                  bg-green-50
                  p-4
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-green-950
                      text-lg
                      shadow-md
                    "
                  >
                    {estAdministrateur
                      ? "👑"
                      : "👤"}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
                      Session actuelle
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-sm
                        font-bold
                        text-green-950
                      "
                      title={nomComplet}
                    >
                      {nomComplet}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {utilisateur?.email ||
                        "Compte connecté"}
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  BOUTONS
              ================================================== */}

              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >

                {/* NON */}

                <button
                  type="button"
                  onClick={annulerDeconnexion}
                  className="
                    rounded-2xl
                    border
                    border-green-950/10
                    bg-white
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-green-950
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-50
                    hover:shadow-md
                  "
                >
                  Non, rester
                </button>

                {/* OUI */}

                <button
                  type="button"
                  onClick={confirmerDeconnexion}
                  className="
                    rounded-2xl
                    bg-green-950
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-900
                    hover:shadow-xl
                  "
                >
                  Oui, me déconnecter
                </button>

              </div>

              {/* ==================================================
                  INDICATION ESC
              ================================================== */}

              <p className="mt-5 text-center text-[11px] text-slate-400">
                Appuyez sur{" "}
                <span className="font-bold text-green-800">
                  Échap
                </span>{" "}
                pour annuler
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================
          ANIMATIONS DE LA FENÊTRE
      ============================================================ */}

      <style>
        {`
          @keyframes logoutModalIn {
            0% {
              opacity: 0;
              transform: translateY(25px) scale(0.94);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes logoutIconIn {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-15deg);
            }

            70% {
              transform: scale(1.08) rotate(3deg);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }
        `}
      </style>
    </>
  )
}

export default Navbar 