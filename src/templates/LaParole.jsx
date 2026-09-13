
function LaParole({
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
  // INFORMATIONS DYNAMIQUES DE L'ASSEMBLÉE
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-stone-950 shadow-2xl">

      {/* IMAGE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>
            <p className="mt-3 text-sm text-orange-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-black/20 to-transparent" />

      {/* LUEUR */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 sm:px-3 sm:pb-3">

        <div className="relative overflow-hidden rounded-[22px] border border-orange-300/30 bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 px-3 py-4 shadow-2xl sm:rounded-[28px] sm:px-4 sm:py-5">

          {/* DOUBLE CADRE */}
          <div className="pointer-events-none absolute inset-2 rounded-[18px] border border-yellow-400/10 sm:rounded-[24px]" />

          {/* BANDE DÉCORATIVE */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500 via-yellow-300 to-orange-500" />

          {/* ORNEMENT */}
          <div className="relative mb-2 flex items-center justify-center gap-2">

            <span className="text-sm text-yellow-400">❧</span>

            <div className="h-px w-10 bg-yellow-400/40" />

            <span className="text-[8px] font-bold tracking-[0.3em] text-orange-200 sm:text-[10px]">
              LA PAROLE
            </span>

            <div className="h-px w-10 bg-yellow-400/40" />

            <span className="text-sm text-yellow-400">❧</span>

          </div>

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">
              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-yellow-400 bg-black/40 p-1 shadow-xl sm:h-14 sm:w-14">
                  <img
                    src={logoFinal}
                    alt={`Logo ${nom}`}
                    className="h-full w-full rounded-md object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-yellow-400 bg-black/40 text-xl text-yellow-400 shadow-xl sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}
            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <span className="text-[8px] font-semibold tracking-[0.25em] text-orange-200 sm:text-[10px]">
                EPICI
              </span>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black uppercase tracking-wide text-yellow-400 sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-0.5 text-[7px] font-medium text-orange-200 sm:text-[9px]">
                  {villeFinal}
                  {villeFinal && quartierFinal ? " • " : ""}
                  {quartierFinal}
                </p>
              )}

              <div className="mx-auto mt-1 h-[2px] w-12 rounded-full bg-yellow-400/60" />

            </div>

            {/* DATE */}
            <div className="flex w-full items-center justify-center gap-2 border-t border-yellow-400/20 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-400">✦</span>

              <div className="text-center">
                <span className="block text-[8px] font-bold uppercase tracking-wider text-orange-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-400 sm:text-[11px]">
                  {date}
                </span>
              </div>

            </div>

          </div>

          {/* ORNEMENTS */}
          <div className="absolute bottom-2 left-4 text-xs text-yellow-400/40">
            ❧
          </div>

          <div className="absolute bottom-2 right-4 text-xs text-yellow-400/40">
            ❧
          </div>

        </div>
      </div>
    </div>
  )
}

export default LaParole
