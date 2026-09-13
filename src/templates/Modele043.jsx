function Modele043({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#42150b] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-950 to-red-950">
          <div className="text-center text-white">
            <div className="text-6xl text-orange-300">✦</div>
            <p className="mt-3 text-sm text-orange-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#260b06] via-red-950/20 to-orange-900/10" />

      <div className="absolute left-0 right-0 top-0 h-3 bg-gradient-to-r from-orange-400 via-yellow-300 to-red-700" />

      <div className="absolute left-5 right-5 top-7 flex items-center justify-between">

        <div>
          <span className="text-[9px] font-black tracking-[0.35em] text-orange-200">
            EPICI
          </span>
          <p className="mt-1 text-[7px] tracking-widest text-yellow-300">
             {nom}
          </p>
        </div>

        {logoFinal ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-yellow-300 bg-orange-950/70 p-1">
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-lg object-contain" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-yellow-300 text-xl text-yellow-300">
            ✝
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">

        <div className="relative overflow-hidden rounded-[2rem] border border-orange-300/30 bg-gradient-to-br from-[#52170d]/95 via-[#3d0f0a]/95 to-[#240806]/95 p-5 shadow-2xl backdrop-blur">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-400/15 blur-2xl" />

          <div className="relative">

            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-orange-300">
              Dimanche
            </span>

            <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
              {nom}
            </h2>

            {(villeFinal || quartierFinal) && (
              <p className="mt-2 text-[8px] uppercase tracking-widest text-orange-200/80">
                {villeFinal}
                {villeFinal && quartierFinal ? " • " : ""}
                {quartierFinal}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-yellow-300/20 pt-4">
              <span className="text-lg text-yellow-300">✦</span>
              <span className="text-sm font-black text-yellow-300">{date}</span>
              <span className="text-lg text-yellow-300">✦</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Modele043
