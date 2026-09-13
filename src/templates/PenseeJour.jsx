
function PenseeJour({
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

      {/* PHOTO */}
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
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-purple-950/10 to-transparent" />

      {/* CERCLES */}
      <div className="pointer-events-none absolute left-[-35px] top-16 h-28 w-28 rounded-full border border-fuchsia-200/20" />
      <div className="pointer-events-none absolute right-[-35px] top-28 h-32 w-32 rounded-full border border-purple-200/20" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="relative overflow-hidden rounded-t-[32px] bg-gradient-to-br from-purple-950 via-purple-900 to-black px-3 py-4 shadow-2xl sm:rounded-t-[42px] sm:px-4 sm:py-5">

          {/* LUMIÈRE */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-fuchsia-300/10 via-transparent to-yellow-300/5" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">
              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-fuchsia-200 bg-purple-950 p-1 shadow-lg sm:h-14 sm:w-14">
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
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-fuchsia-200 bg-purple-950 text-xl text-fuchsia-200 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}
            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-fuchsia-200">
                  ✧
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-fuchsia-200/60" />

                <span className="text-[8px] font-semibold tracking-[0.2em] text-purple-200 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-fuchsia-200/60" />

                <span className="text-fuchsia-200">
                  ✧
                </span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black tracking-wider text-fuchsia-200 sm:text-[13px]">
                {nom}
              </h2>

              {/* LOCALISATION */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[7px] font-medium text-purple-200/80 sm:text-[8px]">
                  {villeFinal}
                  {villeFinal && quartierFinal ? " • " : ""}
                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full flex-col items-center border-t border-fuchsia-200/20 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-300">
                ✦
              </span>

              <span className="text-[8px] uppercase tracking-wider text-purple-200">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-fuchsia-200 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PenseeJour
