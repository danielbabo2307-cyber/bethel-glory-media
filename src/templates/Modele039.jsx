function Modele039({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-950 to-black">
          <div className="text-center text-white">
            <div className="text-6xl text-red-400">✦</div>
            <p className="mt-3 text-sm text-red-200">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-red-950/10" />

      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-yellow-300 via-red-600 to-black" />

      <div className="absolute left-7 right-6 top-7 flex items-center justify-between">

        <div>
          <span className="text-[9px] font-black tracking-[0.4em] text-yellow-300">
            EPICI
          </span>
          <p className="mt-1 text-[7px] tracking-widest text-red-300">
             {nom}
          </p>
        </div>

        {logoFinal ? (
          <div className="h-14 w-14 rounded-full border-2 border-yellow-300 bg-black/60 p-1">
            <img src={logoFinal} alt={`Logo ${nom}`} className="h-full w-full rounded-full object-contain" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-300 text-xl text-yellow-300">
            ✝
          </div>
        )}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="rounded-t-3xl border-t-2 border-yellow-300 bg-black/90 p-5 backdrop-blur">

          <p className="text-[8px] font-bold tracking-[0.35em] text-red-400">
            DIMANCHE • CULTE
          </p>

          <h2 className="mt-2 break-words text-2xl font-black uppercase text-white">
            {nom}
          </h2>

          {(villeFinal || quartierFinal) && (
            <p className="mt-2 text-[8px] uppercase tracking-widest text-gray-300">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-yellow-300 to-transparent" />
            <span className="text-sm font-black text-yellow-300">{date}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele039
