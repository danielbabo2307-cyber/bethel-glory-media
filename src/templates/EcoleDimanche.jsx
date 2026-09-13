function EcoleDimanche({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-orange-950 shadow-2xl">

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-orange-950">
          <div className="text-center text-white">
            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-orange-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/95 via-orange-900/10 to-transparent" />

      {/* FORMES */}
      <div className="pointer-events-none absolute bottom-28 left-[-20px] h-24 w-24 rounded-full bg-orange-400/10" />

      <div className="pointer-events-none absolute right-[-25px] bottom-32 h-32 w-32 rounded-full bg-yellow-300/10" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="relative overflow-hidden rounded-t-[25px] bg-gradient-to-r from-orange-950 via-orange-800 to-amber-950 px-3 py-4 shadow-2xl sm:rounded-t-[32px] sm:px-4 sm:py-5">

          {/* LIGNE SUPÉRIEURE */}
          <div className="absolute left-0 right-0 top-0 h-[4px] bg-yellow-300" />

          {/* PETITS CARRÉS */}
          <div className="absolute right-3 top-3 flex gap-1 opacity-30">

            <div className="h-2 w-2 bg-yellow-300" />

            <div className="h-2 w-2 bg-yellow-300" />

            <div className="h-2 w-2 bg-yellow-300" />

          </div>

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ======================================================
                LOGO DYNAMIQUE
            ====================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-yellow-300 bg-orange-950 p-1 shadow-lg sm:h-14 sm:w-14">

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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-yellow-300 bg-orange-950 text-xl text-yellow-300 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* ======================================================
                CENTRE
            ====================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-yellow-300">
                  ✦
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-300/60" />

                <span className="text-[8px] font-bold tracking-[0.2em] text-orange-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-300/60" />

                <span className="text-yellow-300">
                  ✦
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wider text-yellow-300 sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-orange-100/80 sm:text-[9px]">

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

            <div className="flex w-full flex-col items-center border-t border-yellow-300/30 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-200">
                ☀
              </span>

              <span className="text-[8px] uppercase tracking-wider text-orange-100">
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

export default EcoleDimanche