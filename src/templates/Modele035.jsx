
function Modele035({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#032e2b] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 to-[#021c1a]">
          <div className="text-center text-white">
            <div className="text-6xl text-emerald-300">✦</div>
            <p className="mt-3 text-sm text-emerald-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#011714] via-emerald-950/30 to-transparent" />

      <div className="absolute left-5 right-5 top-5 h-[3px] bg-gradient-to-r from-transparent via-yellow-300 to-transparent" />

      <div className="absolute inset-x-5 top-8 flex justify-between">
        <div className="rounded-2xl border border-yellow-300/50 bg-emerald-950/70 p-2 backdrop-blur">
          {logoFinal ? (
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-12 w-12 rounded-xl object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center text-2xl text-yellow-300">✝</div>
          )}
        </div>

        <div className="flex h-10 items-center rounded-full border border-yellow-300/40 bg-emerald-950/70 px-4 backdrop-blur">
          <span className="text-[9px] font-bold tracking-[0.3em] text-yellow-300"> {nom}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="rounded-3xl border border-emerald-300/20 bg-[#02231f]/90 p-5 shadow-2xl backdrop-blur-md">

          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-emerald-300">
            EPICI • Dimanche
          </span>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-[9px] uppercase tracking-widest text-emerald-200">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-yellow-300/20 pt-4">
            <span className="text-xl text-yellow-300">✦</span>

            <div className="text-center">
              <span className="block text-[8px] uppercase tracking-widest text-gray-300">
                Rendez-vous
              </span>
              <span className="text-sm font-bold text-yellow-300">
                {date}
              </span>
            </div>

            <span className="text-xl text-yellow-300">✦</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele035
