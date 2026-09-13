import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import { testConnection } from "./services/testApi"

// ==================================================
// PAGES PUBLIQUES
// ==================================================

import Home from "./pages/public/Home"
import Church from "./pages/public/Church"
import Assembles from "./pages/public/Assembles"
import AssemblyDetails from "./pages/AssemblyDetails"
import Programs from "./pages/public/Programs"
import Contact from "./pages/public/Contact"

// ==================================================
// AUTHENTIFICATION
// ==================================================

import Login from "./pages/auth/Login"
import AdminLogin from "./pages/auth/AdminLogin"

// ==================================================
// PAGES ADMINISTRATION
// ==================================================

import Dashboard from "./pages/admin/Dashboard"
import Churches from "./pages/admin/Churches"
import AdminAssemblies from "./pages/admin/Assembles"
import AdminPrograms from "./pages/admin/Programs1"
import AdminPublications from "./pages/admin/Publications"
import Users from "./pages/admin/Users"
import Responsables from "./pages/admin/Responsables"
import AddUser from "./pages/admin/AddUser"
import Templates from "./pages/admin/Templates"

// ==================================================
// PAGES UTILISATEUR
// ==================================================

import Publications from "./pages/public/Publications"
import AssistantIA from "./pages/public/AssistantIA"

// ==================================================
// PROTECTION
// ==================================================

import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

// ==================================================
// INTERNET
// ==================================================

import InternetGuard from "./components/InternetGuard"

function App() {

  // ==================================================
  // TEST DE CONNEXION AU SERVEUR
  // ==================================================

  useEffect(() => {
    const verifierServeur = async () => {
      try {
        await testConnection()

        console.log(
          "✅ Connexion au serveur vérifiée"
        )
      } catch (error) {
        console.error(
          "❌ Erreur connexion serveur :",
          error
        )
      }
    }

    verifierServeur()
  }, [])

  return (
    
    <InternetGuard>
      <Routes>

        {/* ==================================================
            PAGES PUBLIQUES
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/church"
          element={<Church />}
        />

        <Route
          path="/assemblies"
          element={<Assembles />}
        />

        <Route
          path="/assemblies/:id"
          element={<AssemblyDetails />}
        />

        <Route
          path="/programs"
          element={<Programs />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ==================================================
            CONNEXION UTILISATEUR
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            CONNEXION ADMINISTRATEUR
        ================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ==================================================
            ESPACE UTILISATEUR
            UTILISATEUR CONNECTÉ UNIQUEMENT
        ================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ==================================================
              PUBLICATIONS UTILISATEUR
          ================================================== */}

          <Route
            path="/publications"
            element={<Publications />}
          />

          {/* ==================================================
              MODÈLES UTILISATEUR
          ================================================== */}

          <Route
            path="/templates"
            element={<Templates />}
          />

          {/* ==================================================
              ASSISTANT IA
          ================================================== */}

          <Route
            path="/assistant-ia"
            element={<AssistantIA />}
          />

        </Route>

        {/* ==================================================
            ESPACE ADMINISTRATION
            ADMINISTRATEUR UNIQUEMENT
        ================================================== */}

        <Route element={<AdminRoute />}>

          {/* ==================================================
              DASHBOARD
          ================================================== */}

          <Route
            path="/admin"
            element={<Dashboard />}
          />

          {/* ==================================================
              ÉGLISES
          ================================================== */}

          <Route
            path="/admin/churches"
            element={<Churches />}
          />

          {/* ==================================================
              ASSEMBLÉES
          ================================================== */}

          <Route
            path="/admin/assemblies"
            element={<AdminAssemblies />}
          />

          {/* ==================================================
              PROGRAMMES
          ================================================== */}

          <Route
            path="/admin/programs"
            element={<AdminPrograms />}
          />

          {/* ==================================================
              PUBLICATIONS ADMIN
          ================================================== */}

          <Route
            path="/admin/publications"
            element={<AdminPublications />}
          />

          <Route
            path="/admin/publications/:id"
            element={<AdminPublications />}
          />

          {/* ==================================================
              UTILISATEURS
          ================================================== */}

          <Route
            path="/admin/users"
            element={<Users />}
          />

          {/* ==================================================
              RESPONSABLES
          ================================================== */}

          <Route
            path="/admin/responsables"
            element={<Responsables />}
          />

          {/* ==================================================
              AJOUT UTILISATEUR
          ================================================== */}

          <Route
            path="/admin/users/add"
            element={<AddUser />}
          />

          {/* ==================================================
              MODÈLES ADMIN
          ================================================== */}

          <Route
            path="/admin/templates"
            element={<Templates />}
          />

        </Route>

        {/* ==================================================
            PAGE 404
        ================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

              <div className="text-center">

                <div className="text-7xl font-black text-green-950">
                  404
                </div>

                <h1 className="mt-4 text-3xl font-black text-green-950">
                  Page introuvable
                </h1>

                <p className="mt-3 text-gray-600">
                  La page que vous recherchez n'existe pas.
                </p>

                <a
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-green-950 px-6 py-3 font-bold text-white transition duration-300 hover:bg-green-900 hover:shadow-lg"
                >
                  Retour à l'accueil
                </a>

              </div>

            </div>
          }
        />

      </Routes>

   </InternetGuard>
  )
}

export default App