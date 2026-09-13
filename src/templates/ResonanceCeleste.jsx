function Modele085({
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
    a: "#7C2D12",
    b: "#431407",
    accent: "#FCD34D",
    text: "#FFFFFF",
    soft: "#FDBA74",
  }

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: linear-gradient(145deg, \, \),
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
            background: linear-gradient(145deg, \, \),
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

      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/5" />
      <div className="absolute bottom-32 left-0 h-28 w-28 rounded-tr-full bg-white/5" />

      <div className="absolute left-5 right-5 top-5 h-[3px]">
        <div
          className="h-full w-full"
          style={{
            background: linear-gradient(to right, transparent, \, transparent),
          }}
        />
      </div>

      <div className="absolute left-5 right-5 top-6">
  <div className="flex items-center gap-3">
    <div className="rounded-xl border border-white/20 bg-black/30 p-2 backdrop-blur">
      {logoFinal ? (
        <img src={logoFinal} alt={Logo } className="h-11 w-11 rounded-lg object-contain" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center text-xl" style={{color: palette.accent}}>✝</div>
      )}
    </div>

    <div className="min-w-0">
      <span className="block text-[8px] font-bold uppercase tracking-[0.3em]" style={{color: palette.accent}}>
        EPICI
      </span>
      <span className="block truncate text-xs font-black uppercase text-white">
        {nom}
      </span>
    </div>
  </div>
</div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div
          className="rounded-3xl border p-5 shadow-2xl backdrop-blur-md"
          style={{
            background: linear-gradient(135deg, \, rgba(0,0,0,0.82)),
            borderColor: \40,
          }}
        >

          <span
            className="text-[9px] font-bold uppercase tracking-[0.4em]"
            style={{color: palette.accent}}
          >
            EPICI • Dimanche
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p
              className="mt-2 text-[9px] uppercase tracking-widest"
              style={{color: palette.soft}}
            >
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div
            className="mt-5 flex items-center justify-between border-t pt-4"
            style={{borderColor: \35}}
          >

            <span
              className="text-xl"
              style={{color: palette.accent}}
            >
              ✦
            </span>

            <div className="text-center">

              <span className="block text-[8px] uppercase tracking-widest text-gray-300">
                Rendez-vous
              </span>

              <span
                className="text-sm font-bold"
                style={{color: palette.accent}}
              >
                {date}
              </span>

            </div>

            <span
              className="text-xl"
              style={{color: palette.accent}}
            >
              ✦
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Modele085