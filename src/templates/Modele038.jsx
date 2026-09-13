function Modele038({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#031827] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-950 to-blue-950">
          <div className="text-center text-white">
            <div className="text-6xl text-cyan-300">◇</div>
            <p className="mt-3 text-sm text-cyan-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#020b16] via-blue-950/20 to-cyan-950/10" />

      <div className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-cyan-400/20 to-transparent" />

      <div className="absolute left-5 right-5 top-7 flex items-center justify-between">

        <div>
          <span className="text-[8px] tracking-[0.4em] text-cyan-200">
            EPICI
          </span>
          <div className="mt-1 h-[2px] w-12 bg-cyan-300" />
        </div>

        {logoFinal ? (
          <img
            src={logoFinal}
            alt={`Logo ${nom}`}
            className="h-14 w-14 rounded-full border-2 border-cyan-300 bg-white/10 p-1 object-contain"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-300 text-xl text-cyan-300">
            ✝
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="border-l-4 border-cyan-300 pl-4">

          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-cyan-300">
            Dimanche
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase leading-tight text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-[9px] uppercase tracking-widest text-cyan-200/80">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-5 inline-flex rounded-full border border-cyan-300/40 bg-blue-950/80 px-5 py-2">
            <span className="text-xs font-black text-cyan-300">
              {date}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele038
