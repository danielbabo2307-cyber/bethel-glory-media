
function Revelation({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-purple-950 shadow-2xl">

      {/* IMAGE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-950">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>

            <p className="mt-3 text-sm text-purple-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-black/20 to-transparent" />

      {/* HALO */}
      <div className="pointer-events-none absolute bottom-12 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 sm:px-3 sm:pb-3">

        <div className="relative overflow-hidden rounded-[32px] border border-fuchsia-300/30 bg-gradient-to-br from-purple-950/95 via-fuchsia-950/95 to-black px-3 py-4 shadow-2xl backdrop-blur-md sm:rounded-[40px] sm:px-4 sm:py-5">

          {/* CERCLES */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-fuchsia-300/20" />

          <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full border border-yellow-300/10" />

          {/* ORNEMENT */}
          <div className="relative mb-2 flex items-center justify-center gap-3">

            <span className="text-fuchsia-300">
              ✦
            </span>

            <span className="text-[8px] font-bold tracking-[0.35em] text-yellow-200 sm:text-[10px]">
              RÉVÉLATION
            </span>

            <span className="text-fuchsia-300">
              ✦
            </span>

          </div>

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-fuchsia-300 bg-black/50 p-1 shadow-lg sm:h-14 sm:w-14">

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
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-fuchsia-300 bg-black/50 text-xl text-fuchsia-300 sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center gap-2">

                <div className="h-px flex-1 bg-fuchsia-300/40" />

                <span className="text-[8px] font-semibold tracking-[0.2em] text-purple-200 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-fuchsia-300/40" />

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black tracking-wide text-yellow-300 sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[7px] font-medium leading-tight text-purple-200/80 sm:text-[8px]">
                  {villeFinal}

                  {villeFinal && quartierFinal ? " • " : ""}

                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full items-center justify-center gap-2 border-t border-fuchsia-300/20 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-fuchsia-300 sm:text-lg">
                ✧
              </span>

              <div className="text-center">

                <span className="block text-[8px] font-bold uppercase text-purple-200">
                  Dimanche
                </span>

                <span className="mt-1 block text-[9px] font-black text-yellow-300 sm:text-[11px]">
                  {date}
                </span>

              </div>

            </div>

          </div>

          {/* ORNEMENTS */}
          <div className="absolute bottom-2 left-5 text-xs text-fuchsia-300/50">
            ✧
          </div>

          <div className="absolute bottom-2 right-5 text-xs text-fuchsia-300/50">
            ✧
          </div>

        </div>
      </div>
    </div>
  )
}

export default Revelation
