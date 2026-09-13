
function VeilleePriere({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>

            <p className="mt-3 text-sm text-slate-300">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE NOCTURNE */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/10" />

      {/* ÉTOILES */}
      <div className="pointer-events-none absolute left-8 top-12 text-xs text-yellow-200">
        ✦
      </div>

      <div className="pointer-events-none absolute right-12 top-20 text-sm text-blue-200">
        ✧
      </div>

      <div className="pointer-events-none absolute left-20 top-28 text-[9px] text-white/60">
        ✦
      </div>

      <div className="pointer-events-none absolute right-8 top-10 text-[10px] text-white/50">
        ✧
      </div>

      {/* BANNIÈRE FLOTTANTE */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">

        <div className="relative overflow-hidden rounded-2xl border border-blue-200/20 bg-slate-950/90 px-3 py-4 shadow-2xl backdrop-blur-md sm:px-4 sm:py-5">

          {/* HALO */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-slate-900 p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={`Logo ${nom}`}
                    className="h-full w-full rounded-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-slate-900 text-xl text-blue-200 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-blue-200">
                  ✦
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-200/40" />

                <span className="text-[8px] font-semibold tracking-[0.2em] text-slate-300 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-200/40" />

                <span className="text-blue-200">
                  ✦
                </span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black tracking-wide text-white sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[7px] font-medium leading-tight text-slate-400 sm:text-[8px]">
                  {villeFinal}

                  {villeFinal && quartierFinal ? " • " : ""}

                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full flex-col items-center border-t border-blue-200/20 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-200">
                ☾
              </span>

              <span className="text-[8px] uppercase tracking-wider text-slate-400">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-blue-200 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default VeilleePriere
