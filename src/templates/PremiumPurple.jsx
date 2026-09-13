
function PremiumPurple({
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

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>

            <p className="mt-3 text-sm text-gray-300">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* ASSOMBRISSEMENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* BANNIÈRE DU BAS */}
      <div className="absolute bottom-0 left-0 right-0">

        {/* LIGNE LUMINEUSE */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="relative overflow-hidden rounded-b-2xl rounded-t-[28px] bg-gradient-to-r from-purple-950 via-purple-900 to-black px-3 py-5 shadow-2xl">

          {/* REFLET DORÉ */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/10" />

          {/* CONTENU HORIZONTAL */}
          <div className="relative flex items-center gap-3">

            {/* LOGO — GAUCHE */}
            <div className="flex shrink-0 items-center justify-center">

              {logoFinal ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/30 p-1 shadow-lg">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/30 text-2xl text-yellow-400 shadow-lg">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              {/* ORNEMENT GAUCHE */}
              <div className="flex items-center justify-center gap-2">

                <span className="text-lg text-yellow-400">
                  ❧
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-400/60" />

                <span className="text-[10px] font-semibold tracking-[0.18em] text-yellow-200">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-400/60" />

                <span className="text-lg text-yellow-400">
                  ❧
                </span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}
              <h2 className="mt-1 text-[13px] font-black leading-tight tracking-wide text-yellow-400 sm:text-sm">
                {nom}
              </h2>

              {/* LOCALISATION */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 text-[8px] font-medium leading-tight text-yellow-100/80 sm:text-[9px]">
                  {villeFinal}
                  {villeFinal && quartierFinal ? " • " : ""}
                  {quartierFinal}
                </p>
              )}

            </div>

            {/* DATE — DROITE */}
            <div className="flex w-[82px] shrink-0 flex-col items-center justify-center border-l border-yellow-400/30 pl-3 text-center">

              <span className="text-lg text-yellow-300">
                ✦
              </span>

              <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-100">
                Dimanche
              </span>

              <span className="mt-1 text-[11px] font-black leading-tight text-yellow-400">
                {date}
              </span>

            </div>

          </div>

          {/* PETITS ORNEMENTS */}
          <div className="absolute bottom-1 left-4 text-xs text-yellow-400/60">
            ✧
          </div>

          <div className="absolute bottom-1 right-4 text-xs text-yellow-400/60">
            ✧
          </div>

        </div>

      </div>

    </div>
  )
}

export default PremiumPurple
