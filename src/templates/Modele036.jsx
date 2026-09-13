function Modele036({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#3b0d18] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#3b0d18]">
          <div className="text-center text-white">
            <div className="text-6xl text-amber-100">◆</div>
            <p className="mt-3 text-sm text-amber-100/70">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#260711] via-[#3b0d18]/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">

        <div className="relative overflow-hidden rounded-[2rem] border border-amber-100/30 bg-[#4b101e]/95 p-5 backdrop-blur-md">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/10 blur-3xl" />

          <div className="relative flex items-center gap-4">

            {logoFinal ? (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-100 bg-amber-50 p-1">
                <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-full object-contain" />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-100 text-xl text-amber-100">
                ✝
              </div>
            )}

            <div className="min-w-0">
              <span className="text-[8px] font-bold tracking-[0.35em] text-amber-100/80">
                EPICI
              </span>

              <h2 className="mt-1 break-words text-sm font-black uppercase tracking-wide text-amber-50">
                {nom}
              </h2>
            </div>

          </div>

          {(villeFinal || quartierFinal) && (
            <p className="relative mt-3 text-[8px] uppercase tracking-wider text-amber-100/70">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="relative mt-4 flex items-center justify-between border-t border-amber-100/20 pt-3">
            <span className="text-xs text-amber-200">DIMANCHE</span>
            <span className="text-xs font-black text-amber-100">{date}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele036
