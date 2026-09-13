
function PremiumGold({
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
        <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
          <div className="px-4 text-center text-white">
            <div className="text-4xl sm:text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-xs text-yellow-100 sm:text-sm">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* HALO DORÉ */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* DOUBLE LIGNE */}
        <div className="flex items-center justify-center gap-1">

          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-yellow-400" />

          <div className="h-[5px] w-16 rounded-full bg-yellow-400" />

          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-yellow-400" />

        </div>

        {/* PANNEAU */}
        <div className="relative overflow-hidden rounded-b-2xl rounded-t-[42px] border-t-2 border-yellow-400/80 bg-gradient-to-br from-black via-stone-950 to-yellow-950 px-2 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* CADRE INTÉRIEUR */}
          <div className="pointer-events-none absolute inset-x-4 top-2 bottom-2 rounded-t-[34px] border border-yellow-400/20" />

          {/* LUEUR */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10" />

          {/* ORNEMENT SUPÉRIEUR */}
          <div className="relative mb-2 flex items-center justify-center gap-2">

            <span className="text-xs text-yellow-400 sm:text-sm">
              ◆
            </span>

            <div className="h-px w-8 bg-yellow-400/60 sm:w-12" />

            <span className="text-[8px] font-bold tracking-[0.3em] text-yellow-200 sm:text-[10px]">
              EPICI
            </span>

            <div className="h-px w-8 bg-yellow-400/60 sm:w-12" />

            <span className="text-xs text-yellow-400 sm:text-sm">
              ◆
            </span>

          </div>

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">

            {/* LOGO */}
            <div className="flex shrink-0 items-center justify-center">

              {logoFinal ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-yellow-400 bg-black/60 p-1 shadow-xl sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-lg object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-yellow-400 bg-black/60 text-xl text-yellow-400 shadow-xl sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <h2 className="break-words text-[10px] font-black uppercase tracking-[0.08em] text-yellow-400 sm:text-sm">
                {nom}
              </h2>

              {/* LOCALISATION */}
              {(ville || quartier) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-[0.08em] text-yellow-100/80 sm:text-[9px]">
                  {ville}

                  {ville && quartier
                    ? " • "
                    : ""}

                  {quartier}
                </p>
              )}

              <div className="mx-auto mt-1 h-[2px] w-16 rounded-full bg-yellow-400/70" />

            </div>

            {/* DATE */}
            <div className="flex w-full shrink-0 items-center justify-center gap-2 border-t border-yellow-400/30 pt-2 text-center sm:w-[90px] sm:flex-col sm:border-l sm:border-t-0 sm:gap-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-yellow-400 sm:text-lg">
                ✦
              </span>

              <div>

                <span className="block text-[8px] font-bold uppercase tracking-widest text-yellow-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-400 sm:text-[11px]">
                  {date}
                </span>

              </div>

            </div>

          </div>

          {/* ORNEMENTS */}
          <div className="absolute bottom-2 left-5 text-[10px] text-yellow-400/60 sm:text-xs">
            ◆
          </div>

          <div className="absolute bottom-2 right-5 text-[10px] text-yellow-400/60 sm:text-xs">
            ◆
          </div>

        </div>
      </div>
    </div>
  )
}

export default PremiumGold
