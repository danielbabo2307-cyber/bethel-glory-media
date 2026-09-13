
function LouangeCeleste({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-blue-950 shadow-2xl">

      {/* IMAGE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-950">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>
            <p className="mt-3 text-sm text-cyan-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/10 to-transparent" />

      {/* LUMIÈRE */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

        <div className="relative overflow-hidden rounded-b-2xl rounded-t-[50%_30px] bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-950 px-2 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* VAGUES */}
          <div className="pointer-events-none absolute -bottom-16 left-1/2 h-32 w-[140%] -translate-x-1/2 rounded-[50%] border border-cyan-300/20" />

          <div className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-[120%] -translate-x-1/2 rounded-[50%] border border-yellow-300/10" />

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-300 bg-blue-950/80 p-1 shadow-xl sm:h-14 sm:w-14">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-300 bg-blue-950/80 text-xl text-cyan-300 sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center gap-2">

                <span className="text-cyan-300">✦</span>

                <div className="h-px flex-1 bg-cyan-300/40" />

                <span className="text-[8px] font-bold tracking-[0.3em] text-cyan-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-cyan-300/40" />

                <span className="text-cyan-300">✦</span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black tracking-wide text-white sm:text-sm">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-0.5 text-[7px] font-medium text-cyan-200 sm:text-[9px]">
                  {villeFinal}
                  {villeFinal && quartierFinal ? " • " : ""}
                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full items-center justify-center gap-2 border-t border-cyan-300/20 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-300">✧</span>

              <div className="text-center">
                <span className="block text-[8px] font-bold uppercase text-cyan-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-300 sm:text-[11px]">
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

export default LouangeCeleste


