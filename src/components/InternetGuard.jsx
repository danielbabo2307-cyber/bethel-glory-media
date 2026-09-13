import { useEffect, useState } from "react"

function InternetGuard({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setApiAvailable(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    let interval

    const checkApi = async () => {
      if (!navigator.onLine) {
        setIsOnline(false)
        setApiAvailable(false)
        return
      }

      try {
        const controller = new AbortController()

        const timeout = setTimeout(() => {
          controller.abort()
        }, 5000)

        const response = await fetch(
          "http://localhost:5000/api/test-db",
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        )

        clearTimeout(timeout)

        if (response.ok) {
          setIsOnline(true)
          setApiAvailable(true)
        } else {
          setApiAvailable(false)
        }
      } catch (error) {
        console.error("❌ API inaccessible :", error)
        setApiAvailable(false)
      }
    }

    checkApi()

    interval = setInterval(() => {
      checkApi()
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!isOnline || !apiAvailable) {
    return (
      <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-black px-6">

        {/* Lumières décoratives */}
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-green-400/20 blur-3xl" />

        <div
          className="absolute -bottom-20 -right-20 h-72 w-72 animate-pulse rounded-full bg-yellow-400/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        {/* Carte */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">

          {/* Cercle connexion */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.53 16.11a5 5 0 016.94 0M5.17 12.75a10 10 0 0113.66 0M1.81 9.39a15 15 0 0120.38 0M12 20h.01"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4l16 16"
                />
              </svg>

            </div>
          </div>

          {/* Logo / nom */}
          <div className="mb-5">
            <h1 className="text-2xl font-black tracking-wide text-white">
              BETHEL GLORY MEDIA
            </h1>

            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-yellow-400" />
          </div>

          {/* Message */}
          <h2 className="mb-3 text-xl font-bold text-white">
            Connexion Internet requise
          </h2>

          <p className="mx-auto max-w-md leading-7 text-white/70">
            BETHEL GLORY MEDIA nécessite une connexion Internet pour
            fonctionner correctement.
          </p>

          {/* Statut */}
          <div className="mt-7 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">

            <div className="flex items-center justify-center gap-3">

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>

              <span className="font-semibold text-red-300">
                {!isOnline
                  ? "Aucune connexion Internet"
                  : "Serveur momentanément inaccessible"}
              </span>

            </div>
          </div>

          {/* Animation chargement */}
          <div className="mt-7 flex items-center justify-center gap-2">

            <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" />

            <span
              className="h-2 w-2 animate-bounce rounded-full bg-green-400"
              style={{ animationDelay: "0.15s" }}
            />

            <span
              className="h-2 w-2 animate-bounce rounded-full bg-green-400"
              style={{ animationDelay: "0.3s" }}
            />

            <span className="ml-2 text-sm text-white/60">
              Vérification de la connexion...
            </span>

          </div>

          {/* Conseil */}
          <div className="mt-7 rounded-xl bg-black/20 p-4 text-sm text-white/50">
            Vérifiez votre connexion Wi-Fi ou vos données mobiles.
            L'application reprendra automatiquement dès que la connexion
            sera rétablie.
          </div>

        </div>
      </div>
    )
  }

  return children
}

export default InternetGuard