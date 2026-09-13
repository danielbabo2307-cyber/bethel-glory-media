
function AnnonceModerne({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-cyan-950 shadow-2xl">

      {/* ============================================================
          PHOTO
      ============================================================ */}

      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-cyan-950">

          <div className="text-center text-white">

            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-cyan-200">
              Votre photo apparaîtra ici
            </p>

          </div>

        </div>
      )}

      {/* ============================================================
          VOILE
      ============================================================ */}

      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/95 via-cyan-950/10 to-transparent" />

      {/* ============================================================
          DÉCOR TECHNO
      ============================================================ */}

      <div className="pointer-events-none absolute right-6 top-10 h-3 w-3 rounded-full bg-cyan-300/70" />

      <div className="pointer-events-none absolute right-12 top-16 h-2 w-2 rounded-full bg-white/50" />

      <div className="pointer-events-none absolute left-7 top-20 h-2 w-2 rounded-full bg-cyan-200/50" />

      <div className="pointer-events-none absolute bottom-32 right-[-30px] h-36 w-36 rounded-full border-[12px] border-cyan-300/10" />

      {/* ============================================================
          BANNIÈRE
      ============================================================ */}

      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">

        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-950/90 px-3 py-4 shadow-2xl backdrop-blur-md sm:px-4 sm:py-5">

          {/* ========================================================
              GRILLE
          ======================================================== */}

          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* ========================================================
              LIGNE
          ======================================================== */}

          <div className="absolute left-0 right-0 top-0 h-[2px] bg-cyan-300" />

          {/* ========================================================
              CONTENU
          ======================================================== */}

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* ======================================================
                LOGO
            ====================================================== */}

            <div className="flex shrink-0 justify-center">

              {logoFinal ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-950 p-1 shadow-lg sm:h-14 sm:w-14">

                  <img
                    src={logoFinal}
                    alt={
                      nom
                        ? `Logo ${nom}`
                        : "Logo assemblée"
                    }
                    className="h-full w-full rounded-xl object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />

                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-950 text-xl text-cyan-300 sm:h-14 sm:w-14">
                  ✝
                </div>
              )}

            </div>

            {/* ======================================================
                CENTRE
            ====================================================== */}

            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-cyan-300">
                  ●
                </span>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-300/60" />

                <span className="text-[8px] font-bold tracking-[0.2em] text-cyan-100 sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-300/60" />

                <span className="text-cyan-300">
                  ●
                </span>

              </div>

              {/* NOM DYNAMIQUE */}
              <h2 className="mt-1 break-words text-[10px] font-black uppercase tracking-wider text-white sm:text-[13px]">
                {nom}
              </h2>

              {/* VILLE / QUARTIER */}
              {(villeFinal || quartierFinal) && (
                <p className="mt-1 break-words text-[7px] font-semibold uppercase tracking-wide text-cyan-200 sm:text-[9px]">

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

            <div className="flex w-full flex-col items-center border-t border-cyan-300/20 pt-2 text-center sm:w-[85px] sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-sm text-cyan-300">
                ◈
              </span>

              <span className="text-[8px] uppercase tracking-wider text-cyan-100">
                Dimanche
              </span>

              <span className="mt-1 text-[9px] font-black text-cyan-200 sm:text-[11px]">
                {date}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AnnonceModerne
