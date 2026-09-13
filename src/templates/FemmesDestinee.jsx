function FemmesDestinee({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-pink-950 shadow-2xl">

      {/* PHOTO */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-950">
          <div className="text-center text-white">
            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-pink-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-950/95 via-pink-900/10 to-transparent" />

      {/* ORNEMENTS */}
      <div className="pointer-events-none absolute right-8 top-12 text-2xl text-pink-200/50">
        ✦
      </div>

      <div className="pointer-events-none absolute left-7 top-24 text-lg text-rose-200/40">
        ✧
      </div>

      <div className="pointer-events-none absolute right-12 bottom-36 h-24 w-24 rounded-full border border-pink-200/20" />

      {/* BANNIÈRE */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="relative overflow-hidden rounded-t-[35px] bg-gradient-to-r from-pink-950 via-rose-900 to-black px-3 py-4 shadow-2xl sm:rounded-t-[45px] sm:px-4 sm:py-5">

          {/* REFLET */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pink-300/10 via-transparent to-rose-300/10" />

          {/* COURBE */}
          <div className="absolute -right-8 -top-12 h-28 w-28 rounded-full border border-pink-200/20" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ======================================================
                LOGO DYNAMIQUE
            ====================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-950 p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-950 text-xl text-pink-200 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* ======================================================
                CENTRE
            ====================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-pink-200">
                  ❧
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-pink-200/60" />

                <span className="text-[8px] font-semibold tracking-[0.2em] text-pink-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-pink-200/60" />

                <span className="text-pink-200">
                  ❧
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wider text-pink-200 sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-pink-100/80 sm:text-[9px]">

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

            <div className="flex w-full flex-col items-center border-t border-pink-200/20 pt-2 sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-pink-200">
                ✦
              </span>

              <span className="text-[8px] uppercase tracking-wider text-pink-100">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-pink-200 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default FemmesDestinee