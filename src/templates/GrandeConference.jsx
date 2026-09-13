function GrandeConference({
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

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
          <div className="text-center text-white">
            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-gray-300">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

      {/* CADRE DÉCORATIF */}
      <div className="pointer-events-none absolute inset-4 rounded-xl border border-yellow-400/50" />

      <div className="pointer-events-none absolute inset-6 rounded-lg border border-white/20" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* DOUBLE LIGNE */}
        <div className="flex h-2 items-center justify-center gap-1 bg-black">

          <div className="h-[2px] flex-1 bg-yellow-400/40" />

          <div className="h-[3px] w-20 bg-yellow-400" />

          <div className="h-[2px] flex-1 bg-yellow-400/40" />

        </div>

        <div className="relative overflow-hidden rounded-b-2xl border-t border-yellow-400/40 bg-gradient-to-r from-black via-neutral-900 to-black px-3 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* REFLET */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/5" />

          {/* ANGLES */}
          <div className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-yellow-400/50" />

          <div className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-yellow-400/50" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">

            {/* ==================================================
                LOGO DYNAMIQUE
            ================================================== */}

            <div className="flex shrink-0 items-center justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-400 bg-black p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-yellow-400 bg-black text-xl text-yellow-400 sm:h-14 sm:w-14 sm:text-2xl">
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

                <span className="text-[8px] font-bold tracking-[0.2em] text-yellow-200 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/60" />

                <span className="text-yellow-400">
                  ◆
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[11px] font-black uppercase tracking-wider text-yellow-400 sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-gray-300 sm:text-[9px]">

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

            <div className="flex w-full shrink-0 flex-col items-center justify-center border-t border-yellow-400/30 pt-2 text-center sm:w-[88px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-400">
                ✦
              </span>

              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-yellow-400 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default GrandeConference