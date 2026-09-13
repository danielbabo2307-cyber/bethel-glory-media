function ChantVictoire({ image, date, logo }) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-orange-950 shadow-2xl">

      {/* IMAGE */}
      {image ? (
        <img
          src={image}
          alt="Publication"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-orange-950">
          <div className="text-center text-white">
            <div className="text-5xl">🖼️</div>
            <p className="mt-3 text-sm text-orange-100">
              Votre photo apparaîtra ici
            </p>
          </div>
        </div>
      )}

      {/* VOILE */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/95 via-black/20 to-transparent" />

      {/* BANDEAU */}
      <div className="absolute bottom-0 left-0 right-0">

        <div className="h-[4px] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300" />

        <div className="relative overflow-hidden bg-gradient-to-r from-orange-950 via-orange-800 to-yellow-700 px-2 py-4 shadow-2xl sm:px-4 sm:py-5">

          {/* FORMES */}
          <div className="pointer-events-none absolute -left-20 -top-12 h-32 w-64 -skew-x-12 bg-yellow-300/10" />

          <div className="pointer-events-none absolute -right-20 bottom-0 h-24 w-56 skew-x-12 bg-orange-300/10" />

          {/* CONTENU */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* LOGO */}
            <div className="flex shrink-0 justify-center">

              {logo ? (
                <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-xl border-2 border-yellow-300 bg-orange-950/80 p-1 shadow-xl sm:h-14 sm:w-14">
                  <img
                    src={logo}
                    alt="Logo EPICI"
                    className="h-full w-full -rotate-3 rounded-lg object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-xl border-2 border-yellow-300 bg-orange-950/80 text-xl text-yellow-300 shadow-xl sm:h-14 sm:w-14 sm:text-2xl">
                  ✝
                </div>
              )}

            </div>

            {/* CENTRE */}
            <div className="min-w-0 flex-1 text-center">

              <div className="flex items-center justify-center gap-2">

                <span className="text-yellow-300">♫</span>

                <div className="h-px flex-1 bg-yellow-300/50" />

                <span className="text-[8px] font-black tracking-[0.25em] text-white sm:text-[10px]">
                  EPICI
                </span>

                <div className="h-px flex-1 bg-yellow-300/50" />

                <span className="text-yellow-300">♫</span>

              </div>

              <h2 className="mt-1 text-[10px] font-black uppercase tracking-wide text-white sm:text-sm">
                ASSEMBLÉE DE BETHEL
              </h2>

            </div>

            {/* DATE */}
            <div className="flex w-full items-center justify-center gap-2 border-t border-yellow-300/30 pt-2 sm:w-[88px] sm:flex-col sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">

              <span className="text-lg text-yellow-300">★</span>

              <div className="text-center">
                <span className="block text-[8px] font-bold uppercase text-orange-100">
                  Dimanche
                </span>

                <span className="mt-1 block break-words text-[9px] font-black text-yellow-300 sm:text-[11px]">
                  {date}
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ChantVictoire