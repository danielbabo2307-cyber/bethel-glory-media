
function VersetJour({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-stone-900 shadow-2xl">

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>

            <p className="mt-3 text-sm text-stone-300">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/10 to-transparent" />

      {/* CADRE */}
      <div className="pointer-events-none absolute inset-5 rounded-lg border border-amber-100/30" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="relative overflow-hidden rounded-t-[22px] bg-gradient-to-r from-stone-950 via-stone-800 to-stone-950 px-3 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* REFLET */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-100/10 via-transparent to-amber-100/5" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-100 bg-stone-900 p-1 shadow-lg sm:h-14 sm:w-14">

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
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-100 bg-stone-900 text-xl text-amber-100 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-amber-100">
                  ❧
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-100/50" />

                <span className="text-[8px] font-semibold tracking-[0.2em] text-stone-200 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-100/50" />

                <span className="text-amber-100">
                  ❧
                </span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[10px] font-black tracking-wider text-amber-100 sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[7px] font-medium leading-tight text-stone-300 sm:text-[8px]">
                  {villeFinal}

                  {villeFinal && quartierFinal ? " • " : ""}

                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE */}
            <div className="flex w-full flex-col items-center border-t border-amber-100/20 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-amber-100">
                ✦
              </span>

              <span className="text-[8px] uppercase tracking-wider text-stone-300">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-amber-100 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default VersetJour
