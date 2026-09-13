
function PremiumGreen({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">

      {/* IMAGE PRINCIPALE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="px-4 text-center text-white">

            <div className="text-4xl sm:text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-xs text-gray-300 sm:text-sm">
              Votre photo apparaîtra ici
            </p>

          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* LIGNE */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="relative overflow-hidden rounded-b-2xl rounded-t-[24px] bg-gradient-to-r from-green-950 via-green-900 to-black px-2 py-3 shadow-2xl sm:rounded-t-[28px] sm:px-3 sm:py-5">

          {/* LUMIÈRE */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/10" />

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">

            {/* LOGO */}
            <div className="flex shrink-0 items-center justify-center">
              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/30 p-1 shadow-lg sm:h-14 sm:w-14">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/30 text-xl text-yellow-400 shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}
            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              {/* EPICI */}
              <div className="flex items-center justify-center gap-1 sm:gap-2">

                <span className="text-sm text-yellow-400 sm:text-lg">
                  ❧
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/60" />

                <span className="shrink-0 text-[8px] font-semibold tracking-[0.14em] text-yellow-200 sm:text-[10px] sm:tracking-[0.18em]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/60" />

                <span className="text-sm text-yellow-400 sm:text-lg">
                  ❧
                </span>

              </div>

              {/* ASSEMBLÉE DYNAMIQUE */}
              <h2 className="mt-1 text-[10px] font-black leading-tight tracking-wide text-yellow-400 sm:text-[13px]">
                {nom}
              </h2>

              {/* LOCALISATION */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[7px] font-medium leading-tight text-yellow-100/80 sm:text-[8px]">
                  {villeFinal}
                  {villeFinal && quartierFinal ? " • " : ""}
                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full shrink-0 flex-col items-center justify-center border-t border-yellow-400/30 pt-2 text-center sm:w-[82px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-300 sm:text-lg">
                ✦
              </span>

              <span className="text-[8px] font-bold uppercase tracking-wider text-yellow-100 sm:text-[9px]">
                Dimanche
              </span>

              <span className="mt-1 break-words text-[9px] font-black leading-tight text-yellow-400 sm:text-[11px]">
                {date}
              </span>

            </div>
          </div>

          {/* ORNEMENTS */}
          <div className="absolute bottom-1 left-3 text-[10px] text-yellow-400/60 sm:left-4 sm:text-xs">
            ✧
          </div>

          <div className="absolute bottom-1 right-3 text-[10px] text-yellow-400/60 sm:right-4 sm:text-xs">
            ✧
          </div>

        </div>
      </div>
    </div>
  )
}

export default PremiumGreen
