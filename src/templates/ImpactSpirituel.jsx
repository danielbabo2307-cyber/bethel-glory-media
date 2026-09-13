function ImpactSpirituel({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-red-950 shadow-2xl">

      {/* IMAGE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-red-950">
          <div className="text-center text-white">
            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-red-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-red-950/20 to-transparent" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* LIGNE ROUGE */}
        <div className="h-[4px] bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400" />

        <div className="relative overflow-hidden rounded-b-2xl bg-gradient-to-br from-red-950 via-red-900 to-black px-2 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* DIAGONALE */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rotate-45 bg-red-500/10" />

          <div className="pointer-events-none absolute -left-20 bottom-0 h-32 w-72 -skew-x-12 bg-yellow-400/[0.04]" />

          {/* LIGNE VERTICALE */}
          <div className="absolute right-3 top-0 h-full w-[2px] bg-yellow-400/20" />

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ==================================================
                LOGO DYNAMIQUE
            ================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/50 p-1 shadow-xl sm:h-14 sm:w-14">

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
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/50 text-xl text-yellow-400 sm:h-14 sm:w-14 sm:text-2xl">
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

                <div className="h-px flex-1 bg-yellow-400/40" />

                <span className="text-[8px] font-black tracking-[0.28em] text-red-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-yellow-400/40" />

                <span className="text-yellow-400">
                  ◆
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wide text-yellow-400 sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-red-100/80 sm:text-[9px]">

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

            <div className="flex w-full items-center justify-center gap-2 border-t border-yellow-400/20 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-400">
                ⚡
              </span>

              <div className="text-center">

                <span className="block text-[8px] font-bold uppercase text-red-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-400 sm:text-[11px]">
                  {date}
                </span>

              </div>

            </div>

          </div>

          {/* LIGNE BAS */}
          <div className="relative mt-3 flex justify-center">

            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

          </div>

        </div>

      </div>

    </div>
  )
}

export default ImpactSpirituel