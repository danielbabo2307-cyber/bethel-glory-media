function Modele041({
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
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#102719] shadow-2xl">

      {image ? (
        <img src={image} alt="Publication" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-950 to-[#102719]">
          <div className="text-center text-white">
            <div className="text-6xl text-amber-100">✿</div>
            <p className="mt-3 text-sm text-amber-100/70">Votre photo apparaîtra ici</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#08150d] via-green-950/20 to-transparent" />

      <div className="absolute inset-x-5 top-6 flex items-center justify-between">

        <div className="rounded-full bg-amber-50 p-[2px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-950">
            <span className="text-lg text-amber-100">✝</span>
          </div>
        </div>

        {logoFinal ? (
          <img
            src={logoFinal}
            alt={`Logo ${nom}`}
            className="h-14 w-14 rounded-full border border-amber-100 bg-white p-1 object-contain"
          />
        ) : null}

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">

        <div className="rounded-[2rem] bg-gradient-to-br from-green-950/95 to-[#183d27]/95 p-5 shadow-2xl">

          <p className="text-center text-[8px] font-bold tracking-[0.45em] text-amber-100">
            EPICI
          </p>

          <h2 className="mt-2 break-words text-center text-xl font-black uppercase text-amber-50">
            {nom}
          </h2>

          <div className="mx-auto mt-3 h-[2px] w-16 bg-amber-100/70" />

          {(villeFinal || quartierFinal) && (
            <p className="mt-3 text-center text-[8px] uppercase tracking-widest text-emerald-200">
              {villeFinal}
              {villeFinal && quartierFinal ? " • " : ""}
              {quartierFinal}
            </p>
          )}

          <div className="mt-5 text-center">
            <span className="text-xs font-black text-amber-100">{date}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Modele041
