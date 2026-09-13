import dani from "../assets/dani.jpg"
function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* MARQUE */}
          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-xl font-bold">
                <img src={dani} alt="Dani" className="h-full w-full rounded-xl object-cover" />
              </div>

              <div>
                <p className="font-bold">
                  BETHEL GLORY
                </p>

                <p className="text-xs text-gray-400">
                  MEDIA
                </p>
              </div>

            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              Une plateforme dédiée à la création de contenus et de
              publications modernes pour les églises.
            </p>
          </div>

          {/* PLATEFORME */}
          <div>
            <h3 className="font-semibold">
              Plateforme
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>Création de publications</li>
              <li>Modèles</li>
              <li>Intelligence artificielle</li>
              <li>Gestion des images</li>
            </ul>
          </div>

          {/* ÉGLISE */}
          <div>
            <h3 className="font-semibold">
              Église
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>EGLISE DE PENTECOTE INTERNATIONALE DE CÔTE D'IVOIRE (EPICI)</li>
              <li> SECTEUR D'ABOBO <br /> DISTRICT D'ABOBO EST</li>
              <li>Assemblées de BETHEL</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold">
              Contact
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>
                  https://maps.app.goo.gl/ykfXcP4Sz5KYcKtk7 <br />  5.454592, -4.025483
                    99 Rue Joël Embiid, Abidjan, Côte d'Ivoire</li>
              <li>BETHEL GLORY MEDIA</li>
              <li>Communication d'église</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2026 BETHEL GLORY MEDIA — Tous droits réservés.
        </div>

      </div>

    </footer>
  )
}

export default Footer