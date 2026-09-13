
function AtmosphereDivine({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-cyan-950 shadow-2xl">

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
        <div className="absolute inset-0 flex items-center justify-center bg-cyan-950">

          <div className="text-center text-white">

            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-cyan-100">
              Votre photo apparaîtra ici
            </p>

          </div>

        </div>
      )}

      {/* ============================================================
          VOILE
      ============================================================ */}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-cyan-950/10 to-transparent" />

      {/* ============================================================
          HALO
      ============================================================ */}

      <div className="pointer-events-none absolute bottom-8 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* ============================================================
          BANDEAU
      ============================================================ */}

      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 sm:px-3 sm:pb-3">

        <div className="relative overflow-hidden rounded-[26px] border border-cyan-200/30 bg-cyan-950/80 px-3 py-4 shadow-2xl backdrop-blur-xl sm:rounded-[34px] sm:px-4 sm:py-5">

          {/* ========================================================
              CERCLES DÉCORATIFS
          ======================================================== */}

          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border border-cyan-200/20" />

          <div className="pointer-events-none absolute -right-4 -top-10 h-28 w-28 rounded-full border border-yellow-300/10" />

          {/* ========================================================
              LIGNE
          ======================================================== */}

          <div className="relative mx-auto mb-3 flex items-center justify-center gap-2">

            <div className="h-px w-8 bg-cyan-300/50" />

            <span className="text-[8px] font-bold tracking-[0.35em] text-cyan-100 sm:text-[10px]">
              ATMOSPHÈRE DIVINE
            </span>

            <div className="h-px w-8 bg-cyan-300/50" />

          </div>

          {/* ========================================================
              CONTENU
          ======================================================== */}

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ======================================================
                LOGO
            ====================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200/60 bg-black/30 p-1 shadow-xl sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-xl object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200/60 bg-black/30 text-xl text-cyan-200 shadow-xl sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* ======================================================
                CENTRE
            ====================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center gap-2">

                <span className="text-cyan-200">
                  ◈
                </span>

                <div className="h-px flex-1 bg-cyan-200/30" />

                <span className="text-[8px] font-semibold tracking-[0.25em] text-cyan-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-cyan-200/30" />

                <span className="text-cyan-200">
                  ◈
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wide text-white sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-cyan-200/80 sm:text-[9px]">

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

            <div className="flex w-full items-center justify-center gap-2 border-t border-cyan-200/20 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-300">
                ✦
              </span>

              <div className="text-center">

                <span className="block text-[8px] font-bold uppercase tracking-wider text-cyan-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-300 sm:text-[11px]">
                  {date}
                </span>

              </div>

            </div>

          </div>

          {/* ========================================================
              PETITS POINTS
          ======================================================== */}

          <div className="absolute bottom-2 left-5 h-1 w-1 rounded-full bg-cyan-200/60" />

          <div className="absolute bottom-2 left-8 h-1 w-1 rounded-full bg-cyan-200/30" />

          <div className="absolute bottom-2 right-5 h-1 w-1 rounded-full bg-cyan-200/60" />

          <div className="absolute bottom-2 right-8 h-1 w-1 rounded-full bg-cyan-200/30" />

        </div>

      </div>

    </div>
  )
}

export default AtmosphereDivine
