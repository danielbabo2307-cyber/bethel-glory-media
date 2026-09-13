function Modele037({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#210b35] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-950 via-fuchsia-950 to-[#210b35]">
          <div className="text-center text-white">
            <div className="text-6xl text-pink-300">✦</div>
            <p className="mt-3 text-sm text-pink-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#160722] via-purple-950/30 to-fuchsia-900/10" />

      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">

        <span className="text-[9px] font-black tracking-[0.35em] text-yellow-300">
 {nom}
         </span>

        {logoFinal ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-300 bg-white/10 p-1 backdrop-blur">
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-full object-contain" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-300 text-xl text-yellow-300">
            ✝
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">

        <div className="overflow-hidden rounded-[2rem] border border-pink-300/30 bg-gradient-to-r from-purple-950/95 via-fuchsia-950/95 to-purple-900/95 p-5 shadow-2xl backdrop-blur">

          <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400" />

          <p className="text-center text-[8px] font-bold tracking-[0.4em] text-pink-200">
            EPICI • DIMANCHE
          </p>

          <h2 className="mt-2 break-words text-center text-xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-center text-[8px] uppercase tracking-widest text-pink-200/80">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-4 text-center">
            <span className="text-sm font-black text-yellow-300">
              {date}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele037
