import { Link, useLocation } from "react-router-dom"

function AdminSidebar() {
  const location = useLocation()

  const navigation = [
    {
      label: "Accueil",
      icon: "⌂",
      route: "/admin",
    },
    {
      label: "Église",
      icon: "✦",
      route: "/admin/churches",
    },
    {
      label: "Assemblées",
      icon: "⌂",
      route: "/admin/assemblies",
    },
    {
      label: "Responsables",
      icon: "♙",
      route: "/admin/responsables",
    },
    {
      label: "Programmes",
      icon: "◷",
      route: "/admin/programs",
    },
    {
      label: "Publications",
      icon: "▣",
      route: "/admin/publications",
    },
    {
      label: "Utilisateurs",
      icon: "♧",
      route: "/admin/users",
    },
  ]

  return (
    <>
      {/* NAVIGATION MOBILE / DESKTOP */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-3 sm:px-6">
        <div className="mx-auto max-w-6xl">

          <nav
            className="
              flex items-center gap-1.5
              overflow-x-auto
              rounded-[24px]
              border border-white/70
              bg-white/90
              px-2 py-2
              shadow-[0_15px_50px_rgba(0,0,0,0.14)]
              backdrop-blur-2xl
              scrollbar-hide
            "
          >

            {/* LOGO - visible surtout sur ordinateur */}
            <div className="hidden md:flex shrink-0 items-center gap-3 px-3 pr-5">
              <img
                src="/src/assets/dani.jpg"
                alt="BETHEL GLORY"
                className="h-10 w-10 rounded-2xl object-cover shadow-md"
              />

              <div className="leading-tight">
                <p className="text-[11px] font-black tracking-[0.18em] text-green-950">
                  BETHEL
                </p>
                <p className="text-[9px] font-semibold tracking-[0.12em] text-gray-400">
                  ADMINISTRATION
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex min-w-max items-center gap-1">

              {navigation.map((item) => {
                const active =
                  location.pathname === item.route ||
                  (item.route !== "/admin" &&
                    location.pathname.startsWith(item.route))

                return (
                  <Link
                    key={item.route}
                    to={item.route}
                    className={`
                      group relative flex min-w-[82px]
                      flex-col items-center justify-center
                      gap-1 rounded-[18px]
                      px-3 py-2.5
                      transition-all duration-300
                      ${
                        active
                          ? "bg-green-950 text-white shadow-lg shadow-green-950/20"
                          : "text-gray-400 hover:bg-gray-100 hover:text-green-950"
                      }
                    `}
                  >
                    {/* indicateur actif */}
                    {active && (
                      <span className="absolute -top-1 h-1 w-5 rounded-full bg-yellow-400" />
                    )}

                    <span
                      className={`
                        flex h-7 w-7 items-center justify-center
                        rounded-xl text-xl
                        transition-transform duration-300
                        ${
                          active
                            ? "bg-white/10 scale-105"
                            : "group-hover:scale-110"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span
                      className={`
                        whitespace-nowrap text-[10px] font-bold
                        ${
                          active
                            ? "text-white"
                            : "text-gray-500 group-hover:text-green-950"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* VOIR LE SITE */}
            <div className="ml-auto hidden md:block pl-2">
              <Link
                to="/"
                className="
                  flex items-center gap-2
                  rounded-2xl
                  border border-green-950/10
                  bg-green-50
                  px-4 py-3
                  text-xs font-bold
                  text-green-950
                  transition
                  hover:bg-green-950
                  hover:text-white
                "
              >
                <span className="text-base">↗</span>
                <span>Voir le site</span>
              </Link>
            </div>

          </nav>
        </div>
      </div>

      {/* ESPACE POUR ÉVITER QUE LE CONTENU PASSE SOUS LA BARRE */}
      <div className="h-28" />
    </>
  )
}

export default AdminSidebar