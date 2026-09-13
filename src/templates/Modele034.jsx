function Modele034({
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

  const logoFinal = logoAssemblee || logo || ""

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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#07152f] shadow-2xl">

      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07152f]">
          <div className="text-center text-white">
            <div className="text-6xl">✦</div>
            <p className="mt-3 text-sm text-blue-200">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#07152f]/20 via-[#07152f]/30 to-[#020617]/95" />

      <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-blue-400 via-yellow-300 to-blue-700" />

      <div className="absolute inset-x-5 top-6 flex items-center justify-between">
        {logoFinal ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-300 bg-white/10 p-2 shadow-xl backdrop-blur">
            <img
              src={logoFinal}
              alt={`Logo ${nom}`}
              className="h-full w-full rounded-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-300 bg-blue-950/70 text-2xl text-yellow-300">
            ✝
          </div>
        )}

        <span className="rounded-full border border-yellow-300/40 bg-blue-950/70 px-4 py-2 text-[9px] font-bold tracking-[0.3em] text-yellow-300 backdrop-blur">
          EPICI
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="mb-4 h-[2px] w-20 bg-gradient-to-r from-yellow-300 to-transparent" />

        <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-blue-200">
          Dimanche
        </p>

        <h2 className="mt-2 break-words text-2xl font-black uppercase tracking-wide text-white">
          {nom}
        </h2>

        {(villeFinal || quartierFinal) && (
          <p className="mt-2 text-[10px] uppercase tracking-wider text-blue-200">
            {villeFinal}
            {villeFinal && quartierFinal ? " • " : ""}
            {quartierFinal}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-yellow-300/30 bg-blue-950/80 p-4 backdrop-blur-md">
          <span className="text-yellow-300">✦</span>

          <div className="text-center">
            <span className="block text-[8px] uppercase tracking-[0.3em] text-blue-200">
              Date
            </span>
            <span className="mt-1 block text-sm font-black text-yellow-300">
              {date}
            </span>
          </div>

          <span className="text-yellow-300">✦</span>
        </div>

      </div>
    </div>
  )
}

export default Modele034
