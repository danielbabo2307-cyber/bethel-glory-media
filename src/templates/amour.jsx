
function amour({
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

  const palette = {
    a: "#134E4A",
    b: "#042F2E",
    accent: "#5EEAD4",
    text: "#FFFFFF",
    soft: "#99F6E4",
  }

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: `linear-gradient(145deg, ${palette.a}, ${palette.b})`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(145deg, ${palette.a}, ${palette.b})`,
          }}
        >
          <div className="text-center">
            <div
              className="text-6xl"
              style={{ color: palette.accent }}
            >
              ✦
            </div>

            <p
              className="mt-3 text-sm"
              style={{ color: palette.soft }}
            >
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Décorations */}
      <div
        className="absolute right-[-20px] top-20 h-40 w-40 rounded-full border-[18px] border-white/5"
        aria-hidden="true"
      />

      <div
        className="absolute bottom-48 left-[-30px] h-32 w-32 rounded-full border-[12px] border-white/10"
        aria-hidden="true"
      />

      {/* Ligne décorative supérieure */}
      <div className="absolute left-5 right-5 top-5 h-[3px]">
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${palette.accent}, transparent)`,
          }}
        />
      </div>

      {/* En-tête */}
      <div className="absolute left-0 right-0 top-0 p-5">
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="min-w-0">
            <span
              className="text-[8px] font-bold uppercase tracking-[0.4em]"
              style={{ color: palette.accent }}
            >
              EPICI
            </span>

            <h3 className="mt-1 max-w-[220px] truncate text-sm font-black uppercase text-white">
              {nom}
            </h3>
          </div>

          {logoFinal ? (
            <img
              src={logoFinal}
              alt={nom ? `Logo ${nom}` : "Logo assemblée"}
              className="h-12 w-12 rounded-xl object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none"
              }}
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center text-2xl"
              style={{ color: palette.accent }}
            >
              ✦
            </div>
          )}
        </div>
      </div>

      {/* Bloc inférieur */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="rounded-3xl border p-5 shadow-2xl backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, ${palette.b}E6, rgba(0,0,0,0.82))`,
            borderColor: `${palette.accent}40`,
          }}
        >
          <span
            className="text-[9px] font-bold uppercase tracking-[0.4em]"
            style={{ color: palette.accent }}
          >
            EPICI • Dimanche
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p
              className="mt-2 text-[9px] uppercase tracking-widest"
              style={{ color: palette.soft }}
            >
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          {/* Date */}
          <div
            className="mt-5 flex items-center justify-between border-t pt-4"
            style={{
              borderColor: `${palette.accent}35`,
            }}
          >
            <span
              className="text-xl"
              style={{ color: palette.accent }}
            >
              ✦
            </span>

            <div className="text-center">
              <span className="block text-[8px] uppercase tracking-widest text-gray-300">
                Rendez-vous
              </span>

              <span
                className="text-sm font-bold"
                style={{ color: palette.accent }}
              >
                {date}
              </span>
            </div>

            <span
              className="text-xl"
              style={{ color: palette.accent }}
            >
              ✦
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default amour
