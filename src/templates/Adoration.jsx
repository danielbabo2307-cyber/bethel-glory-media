
function Adoration({
  image,
  date,
  logo,
  assemblee,
  assembleeData,
  nomAssemblee,
  ville,
  quartier,
  adresse,
  telephone,
  logoAssemblee,
  assembleeId,
}) {
  // ============================================================
  // INFORMATIONS DE L'ASSEMBLÉE
  // ============================================================

  const nom =
    nomAssemblee ||
    assembleeData?.nom ||
    assemblee?.nom ||
    "Assemblée"

  const logoFinal =
    logoAssemblee ||
    logo ||
    ""

  const villeFinal =
    ville ||
    assembleeData?.ville ||
    assemblee?.ville ||
    ""

  const quartierFinal =
    quartier ||
    assembleeData?.quartier ||
    assemblee?.quartier ||
    ""

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">

      {/* ============================================================
          IMAGE
      ============================================================ */}

      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">

            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-purple-200">
              Votre photo apparaîtra ici
            </p>

          </div>
        </div>
      )}

      {/* ============================================================
          VOILE
      ============================================================ */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

      {/* ============================================================
          BANDEAU FLOTTANT
      ============================================================ */}

      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 sm:px-3 sm:pb-3">

        <div className="relative overflow-hidden rounded-3xl border border-purple-300/20 bg-black/90 px-3 py-4 shadow-2xl backdrop-blur-md sm:px-4 sm:py-5">

          {/* ========================================================
              HALO
          ======================================================== */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-2xl" />

          {/* ========================================================
              PETITE LIGNE
          ======================================================== */}

          <div className="relative mx-auto mb-3 h-[2px] w-16 bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

          {/* ========================================================
              CONTENU
          ======================================================== */}

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ======================================================
                LOGO
            ====================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/70 bg-white/5 p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/70 bg-white/5 text-xl text-yellow-300 sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* ======================================================
                CENTRE
            ====================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <span className="text-[8px] font-medium tracking-[0.4em] text-purple-200 sm:text-[10px]">
                EPICI
              </span>

              <h2 className="mt-1 break-words text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-sm">
                {nom}
              </h2>

              {/* LOCALISATION */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-medium uppercase tracking-[0.08em] text-purple-200/80 sm:text-[9px]">

                  {villeFinal}

                  {villeFinal && quartierFinal
                    ? " • "
                    : ""}

                  {quartierFinal}

                </p>
              )}

            </div>

            {/* ======================================================
                DATE
            ====================================================== */}

            <div className="flex w-full items-center justify-center gap-2 border-t border-purple-300/20 pt-2 sm:w-[85px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-purple-300">
                ✦
              </span>

              <div className="text-center">

                <span className="block text-[8px] uppercase tracking-widest text-gray-300">
                  Dimanche
                </span>

                <span className="mt-1 block text-[9px] font-bold text-yellow-300 sm:text-[11px]">
                  {date}
                </span>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Adoration
