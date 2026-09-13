function Modele040({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#0b1d4a] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950">
          <div className="text-center text-white">
            <div className="text-6xl text-slate-200">◇</div>
            <p className="mt-3 text-sm text-slate-300">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#050d25] via-blue-950/20 to-transparent" />

      <div className="absolute inset-x-5 top-5 h-16 rounded-full bg-blue-400/10 blur-2xl" />

      <div className="absolute left-6 right-6 top-8 flex items-center gap-4">

        {logoFinal ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-300/70 bg-white/10 p-1 backdrop-blur">
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-lg object-contain" />
          </div>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-300/70 text-xl text-slate-200">
            ✝
          </div>
        )}

        <div>
          <span className="text-[8px] tracking-[0.4em] text-slate-300">
            EPICI
          </span>
          <div className="mt-1 h-[2px] w-10 bg-slate-300" />
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="rounded-2xl border border-slate-300/20 bg-[#081633]/95 p-5 backdrop-blur-md">

          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">
            Dimanche
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-[8px] uppercase tracking-widest text-blue-200">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-900/50 px-4 py-3">
            <span className="text-slate-300">✦</span>
            <span className="text-xs font-black text-slate-100">{date}</span>
            <span className="text-slate-300">✦</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele040
