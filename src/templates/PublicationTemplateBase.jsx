
import React from "react"

const designs = {
  "elegance-royale": {
    banner:
      "bg-gradient-to-r from-green-950 via-green-900 to-black",
    accent: "text-yellow-400",
    accentLight: "text-yellow-100",
    border: "border-yellow-400/50",
    line: "bg-gradient-to-r from-transparent via-yellow-400 to-transparent",
    radius: "rounded-t-[40px]",
    logoShape: "rounded-full",
    dateStyle:
      "border-l border-yellow-400/30",
    ornament: "✦",
    symbol: "❧",
    extra:
      "before:absolute before:-top-12 before:left-1/2 before:h-24 before:w-24 before:-translate-x-1/2 before:rounded-full before:border before:border-yellow-400/20",
  },

  "grace-lumiere": {
    banner:
      "bg-gradient-to-r from-purple-950 via-purple-900 to-black",
    accent: "text-yellow-300",
    accentLight: "text-purple-100",
    border: "border-yellow-300/40",
    line: "bg-gradient-to-r from-transparent via-yellow-300 to-transparent",
    radius: "rounded-t-[30px]",
    logoShape: "rounded-full",
    dateStyle:
      "rounded-2xl border border-yellow-300/20 bg-black/20",
    ornament: "✧",
    symbol: "❧",
    extra:
      "before:absolute before:inset-x-8 before:top-2 before:h-px before:bg-yellow-300/20",
  },

  "dimanche-royal": {
    banner:
      "bg-gradient-to-r from-blue-950 via-blue-900 to-slate-950",
    accent: "text-cyan-300",
    accentLight: "text-blue-100",
    border: "border-cyan-300/40",
    line: "bg-gradient-to-r from-cyan-400 via-white to-cyan-400",
    radius: "rounded-t-[12px]",
    logoShape: "rounded-xl",
    dateStyle:
      "border-l-2 border-cyan-300/30",
    ornament: "◆",
    symbol: "✦",
    extra:
      "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-cyan-400",
  },

  "presence-divine": {
    banner:
      "bg-gradient-to-r from-emerald-950 via-green-900 to-black",
    accent: "text-emerald-300",
    accentLight: "text-emerald-100",
    border: "border-emerald-300/40",
    line: "bg-gradient-to-r from-transparent via-emerald-300 to-transparent",
    radius: "rounded-t-[50px]",
    logoShape: "rounded-full",
    dateStyle:
      "border-l border-emerald-300/30",
    ornament: "❋",
    symbol: "✧",
    extra:
      "before:absolute before:-left-10 before:top-1/2 before:h-20 before:w-20 before:-translate-y-1/2 before:rounded-full before:border before:border-emerald-300/20",
  },
}

function PublicationTemplateBase({
  image,
  date,
  logo,

  // ============================================================
  // INFORMATIONS DE L'ASSEMBLÉE
  // ============================================================

  assemblee,
  assembleeData,
  nomAssemblee,
  ville,
  quartier,
  adresse,
  telephone,
  logoAssemblee,
  assembleeId,

  variant = "grace-lumiere",
}) {
  // ============================================================
  // ASSEMBLÉE SÉLECTIONNÉE
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

  const design =
    designs[variant] ||
    designs["grace-lumiere"]

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">

      {/* =====================================================
          PHOTO
      ===================================================== */}

      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">

            <div className="text-5xl">
              🖼️
            </div>

            <p className="mt-3 text-sm text-gray-300">
              Votre photo apparaîtra ici
            </p>

          </div>
        </div>
      )}

      {/* =====================================================
          ASSOMBRISSEMENT
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/10" />

      {/* =====================================================
          LUEUR
      ===================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/60 to-transparent" />

      {/* =====================================================
          BANDEAU DU BAS
      ===================================================== */}

      <div className="absolute bottom-0 left-0 right-0">

        {/* LIGNE LUMINEUSE */}

        <div
          className={`h-[3px] ${design.line}`}
        />

        {/* ===================================================
            PANNEAU PRINCIPAL
        =================================================== */}

        <div
          className={`
            relative
            overflow-hidden
            ${design.radius}
            ${design.banner}
            border-t
            ${design.border}
            px-3
            py-5
            shadow-2xl
            ${design.extra}
          `}
        >

          {/* REFLET */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.05]" />

          {/* DÉCORATION SUPÉRIEURE */}

          <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-2 opacity-70">

            <div
              className={`h-px w-10 ${design.line}`}
            />

            <span
              className={`text-[10px] ${design.accent}`}
            >
              {design.ornament}
            </span>

            <div
              className={`h-px w-10 ${design.line}`}
            />

          </div>

          {/* =================================================
              CONTENU HORIZONTAL
          ================================================= */}

          <div className="relative flex items-center gap-3">

            {/* =================================================
                LOGO GAUCHE
            ================================================= */}

            <div className="flex shrink-0 items-center justify-center">

              {logoFinal ? (
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    ${design.logoShape}
                    border-2
                    ${design.border}
                    bg-black/30
                    p-1
                    shadow-xl
                  `}
                >
                  <img
                    src={logoFinal}
                    alt={`Logo ${nom}`}
                    className="h-full w-full rounded-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none"
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    ${design.logoShape}
                    border-2
                    ${design.border}
                    bg-black/30
                    text-2xl
                    ${design.accent}
                    shadow-xl
                  `}
                >
                  ✝
                </div>
              )}

            </div>

            {/* =================================================
                CENTRE
            ================================================= */}

            <div className="min-w-0 flex-1 text-center">

              {/* EPICI */}

              <div className="flex items-center justify-center gap-2">

                <span
                  className={`text-lg ${design.accent}`}
                >
                  {design.symbol}
                </span>

                <div
                  className={`h-px flex-1 ${design.line} opacity-60`}
                />

                <span
                  className={`
                    text-[9px]
                    font-semibold
                    tracking-[0.25em]
                    ${design.accentLight}
                  `}
                >
                  EPICI
                </span>

                <div
                  className={`h-px flex-1 ${design.line} opacity-60`}
                />

                <span
                  className={`text-lg ${design.accent}`}
                >
                  {design.symbol}
                </span>

              </div>

              {/* NOM DYNAMIQUE DE L'ASSEMBLÉE */}

              <h2
                className={`
                  mt-1
                  text-[13px]
                  font-black
                  leading-tight
                  tracking-wide
                  ${design.accent}
                  sm:text-sm
                `}
              >
                {nom}
              </h2>

              {/* LOCALISATION */}

              {(villeFinal || quartierFinal) && (
                <p
                  className={`
                    mt-1
                    text-[8px]
                    font-medium
                    leading-tight
                    ${design.accentLight}
                    opacity-80
                    sm:text-[9px]
                  `}
                >
                  {villeFinal}
                  {villeFinal && quartierFinal
                    ? " • "
                    : ""}
                  {quartierFinal}
                </p>
              )}

            </div>

            {/* =================================================
                DATE DROITE
            ================================================= */}

            <div
              className={`
                flex
                w-[82px]
                shrink-0
                flex-col
                items-center
                justify-center
                pl-3
                text-center
                ${design.dateStyle}
              `}
            >

              <span
                className={`text-lg ${design.accent}`}
              >
                {design.ornament}
              </span>

              <span
                className={`
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  ${design.accentLight}
                `}
              >
                Dimanche
              </span>

              <span
                className={`
                  mt-1
                  text-[10px]
                  font-black
                  leading-tight
                  ${design.accent}
                `}
              >
                {date || "À venir"}
              </span>

            </div>

          </div>

          {/* =================================================
              DÉCORATIONS BASSES
          ================================================= */}

          <div
            className={`
              absolute
              bottom-1
              left-4
              text-xs
              opacity-60
              ${design.accent}
            `}
          >
            {design.ornament}
          </div>

          <div
            className={`
              absolute
              bottom-1
              right-4
              text-xs
              opacity-60
              ${design.accent}
            `}
          >
            {design.ornament}
          </div>

        </div>
      </div>
    </div>
  )
}

export default PublicationTemplateBase
