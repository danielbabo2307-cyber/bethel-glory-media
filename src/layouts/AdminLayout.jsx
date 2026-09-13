import { NavLink, Outlet } from "react-router-dom"

function AdminLayout() {
  const menu = [
    {
      name: "Tableau de bord",
      path: "/admin",
      icon: "🏠",
    },
    {
      name: "Utilisateurs",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Églises / Assemblées",
      path: "/admin/churches",
      icon: "⛪",
    },
    {
      name: "Dimanches",
      path: "/admin/sundays",
      icon: "📅",
    },
    {
      name: "Thèmes",
      path: "/admin/themes",
      icon: "📝",
    },
    {
      name: "Modèles",
      path: "/admin/templates",
      icon: "🎨",
    },
    {
      name: "Images",
      path: "/admin/images",
      icon: "🖼️",
    },
    {
      name: "Filigranes",
      path: "/admin/watermarks",
      icon: "💧",
    },
    {
      name: "Publications",
      path: "/admin/publications",
      icon: "📢",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col bg-green-950 text-white lg:flex">

        {/* LOGO */}

        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">

          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">

            <img
              src="/assets/logo.png"
              alt="Logo BETHEL GLORY MEDIA"
              className="h-full w-full object-contain"
            />

          </div>

          <div>
            <p className="font-bold">
              BETHEL GLORY
            </p>

            <p className="text-xs text-green-300">
              MEDIA
            </p>
          </div>

        </div>

        {/* MENU */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-green-400">
            Administration
          </p>

          <div className="space-y-1">

            {menu.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-green-950 shadow"
                      : "text-green-100 hover:bg-white/10"
                  }`
                }
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>

            ))}

          </div>

        </nav>

        {/* BAS DE MENU */}

        <div className="border-t border-white/10 p-4">

          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-100 transition hover:bg-white/10"
          >
            <span>🌐</span>

            <span>
              Voir le site
            </span>
          </NavLink>

        </div>

      </aside>


      {/* CONTENU PRINCIPAL */}

      <main className="min-h-screen lg:ml-72">

        {/* BARRE SUPERIEURE */}

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-200 bg-white/90 px-6 backdrop-blur">

          <div>

            <p className="text-sm text-gray-500">
              Administration
            </p>

            <h1 className="font-bold text-gray-900">
              BETHEL GLORY MEDIA
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-gray-900">
                Administrateur
              </p>

              <p className="text-xs text-gray-500">
                Gestionnaire
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900 font-bold text-white">
              A
            </div>

          </div>

        </header>


        {/* PAGE */}

        <Outlet />

      </main>

    </div>
  )
}

export default AdminLayout