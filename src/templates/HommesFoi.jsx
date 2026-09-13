function HommesFoi({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-blue-950 shadow-2xl">

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-950">
          <div className="text-center text-white">
            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-blue-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/10 to-transparent" />

      {/* FORMES */}
      <div className="pointer-events-none absolute bottom-28 left-[-35px] h-32 w-32 rotate-45 border-2 border-blue-300/10" />

      <div className="pointer-events-none absolute right-[-25px] bottom-24 h-28 w-28 rotate-45 border border-yellow-300/20" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="relative overflow-hidden border-t-2 border-yellow-400/50 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-950 px-3 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* BANDE */}
          <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ==================================================
                LOGO DYNAMIQUE
            ================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-yellow-400 bg-blue-950 p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-lg object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-yellow-400 bg-blue-950 text-xl text-yellow-400 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* ==================================================
                CENTRE
            ================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-yellow-400">
                  ◆
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/60" />

                <span className="text-[8px] font-bold tracking-[0.2em] text-blue-200 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/60" />

                <span className="text-yellow-400">
                  ◆
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wider text-yellow-300 sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-blue-200/80 sm:text-[9px]">

                  {villeFinal}

                  {villeFinal && quartierFinal
                    ? " • "
                    : ""}

                  {quartierFinal}

                </p>
              )}

            </div>

            {/* ==================================================
                DATE
            ================================================== */}

            <div className="flex w-full flex-col items-center border-t border-yellow-400/20 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-300">
                ✦
              </span>

              <span className="text-[8px] uppercase tracking-wider text-blue-200">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-yellow-300 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default HommesFoi