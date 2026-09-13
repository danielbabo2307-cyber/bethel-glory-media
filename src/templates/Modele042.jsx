function Modele042({
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
  const nom = nomAssemblee || assembleeData?.nom || assemblee?.nom || "Assemblée"
  const logoFinal = logoAssemblee || logo || ""
  const villeFinal = ville || assembleeData?.ville || assemblee?.ville || ""
  const quartierFinal = quartier || assembleeData?.quartier || assemblee?.quartier || ""

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#2b0d29] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-fuchsia-950 to-purple-950">
          <div className="text-center text-white">
            <div className="text-6xl text-pink-300">♡</div>
            <p className="mt-3 text-sm text-pink-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#180719] via-purple-950/20 to-fuchsia-950/10" />

      <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

      <div className="absolute right-5 top-7">

        {logoFinal ? (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-pink-300 bg-white/10 p-1 backdrop-blur">
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-full object-contain" />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-pink-300 text-xl text-pink-300">
            ✝
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="border border-pink-300/30 bg-[#32102f]/95 p-5 backdrop-blur-md">

          <span className="text-[8px] font-bold tracking-[0.4em] text-pink-300">
            EPICI •  {nom}
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-[8px] uppercase tracking-widest text-pink-200/80">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-pink-300">♡</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-300/70 to-transparent" />
            <span className="text-xs font-black text-pink-200">{date}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele042
