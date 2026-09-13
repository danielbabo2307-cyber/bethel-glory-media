import { useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

function Contact() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  })

  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState("")
  const [erreur, setErreur] = useState("")

  // ============================================================
  // URL API
  // ============================================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"

  // ============================================================
  // GESTION DES CHAMPS
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((ancien) => ({
      ...ancien,
      [name]: value,
    }))

    if (succes) {
      setSucces("")
    }

    if (erreur) {
      setErreur("")
    }
  }

  // ============================================================
  // ENVOI DU FORMULAIRE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSucces("")
    setErreur("")
    setEnvoi(true)

    try {
      const response = await fetch(
        `${API_URL}/api/contact`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,
            message: formData.message,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Une erreur est survenue lors de l'envoi."
        )
      }

      // ========================================================
      // SUCCÈS
      // ========================================================

      setSucces(
        "Votre message a été envoyé avec succès. Merci de nous avoir contactés !"
      )

      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: "",
      })
    } catch (error) {
      console.error(
        "❌ Erreur envoi formulaire :",
        error
      )

      setErreur(
        error.message ||
          "Impossible d'envoyer votre message. Veuillez réessayer."
      )
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f8f7]">

      {/* ============================================================
          ANIMATIONS CSS
      ============================================================ */}

      <style>{`
        @keyframes pageFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floating {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(20px, -20px, 0);
          }
        }

        @keyframes floatingReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-20px, 18px, 0);
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }

          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes statAppear {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cardAppearLeft {
          from {
            opacity: 0;
            transform: translateX(-45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardAppearRight {
          from {
            opacity: 0;
            transform: translateX(45px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes contentAppear {
          from {
            opacity: 0;
            transform: translateY(35px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes successAppear {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes errorAppear {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes buttonPulse {
          0%,
          100% {
            box-shadow: 0 10px 25px rgba(6, 78, 59, 0.18);
          }

          50% {
            box-shadow: 0 15px 35px rgba(6, 78, 59, 0.35);
          }
        }

        @keyframes checkAppear {
          from {
            opacity: 0;
            transform: scale(0.4) rotate(-20deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes ctaAppear {
          from {
            opacity: 0;
            transform: translateY(45px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-fade {
          animation: pageFade 0.6s ease-out both;
        }

        .hero-fade-up {
          animation: heroFadeUp 0.8s ease-out both;
        }

        .hero-fade-down {
          animation: heroFadeDown 0.7s ease-out both;
        }

        .hero-scale {
          animation: heroScale 0.7s ease-out both;
        }

        .floating {
          animation: floating 6s ease-in-out infinite;
        }

        .floating-reverse {
          animation: floatingReverse 7s ease-in-out infinite;
        }

        .glow-pulse {
          animation: glowPulse 4s ease-in-out infinite;
        }

        .stat-appear {
          animation: statAppear 0.7s ease-out both;
        }

        .card-left {
          animation: cardAppearLeft 0.8s ease-out both;
        }

        .card-right {
          animation: cardAppearRight 0.8s ease-out both;
        }

        .content-appear {
          animation: contentAppear 0.8s ease-out both;
        }

        .icon-float {
          animation: iconFloat 4s ease-in-out infinite;
        }

        .success-appear {
          animation: successAppear 0.5s ease-out both;
        }

        .error-appear {
          animation: errorAppear 0.5s ease-out both;
        }

        .button-pulse {
          animation: buttonPulse 2.5s ease-in-out infinite;
        }

        .check-appear {
          animation: checkAppear 0.5s ease-out both;
        }

        .cta-appear {
          animation: ctaAppear 0.8s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .page-fade,
          .hero-fade-up,
          .hero-fade-down,
          .hero-scale,
          .floating,
          .floating-reverse,
          .glow-pulse,
          .stat-appear,
          .card-left,
          .card-right,
          .content-appear,
          .icon-float,
          .success-appear,
          .error-appear,
          .button-pulse,
          .check-appear,
          .cta-appear {
            animation: none !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="page-fade pt-24">

        {/* ============================================================
            HERO
        ============================================================ */}

        <section className="relative overflow-hidden bg-green-950 px-6 pb-24 pt-20 text-white md:pb-28 md:pt-24">

          <div className="floating absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-700/30 blur-3xl" />

          <div className="floating-reverse absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="glow-pulse absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />

          <div className="absolute left-[15%] top-24 h-2 w-2 animate-pulse rounded-full bg-yellow-400/70" />

          <div className="absolute right-[20%] top-32 h-1.5 w-1.5 animate-ping rounded-full bg-white/50" />

          <div className="relative z-10 mx-auto max-w-6xl text-center">

            <div
              className="hero-fade-down inline-flex items-center gap-2 rounded-full border border-green-700/60 bg-green-900/70 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-green-200 backdrop-blur-sm"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
              BETHEL GLORY MEDIA
            </div>

            <p
              className="hero-fade-up mt-8 text-sm font-black uppercase tracking-[0.25em] text-yellow-400"
              style={{
                animationDelay: "0.15s",
              }}
            >
              Contact
            </p>

            <h1
              className="hero-fade-up mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl"
              style={{
                animationDelay: "0.3s",
              }}
            >
              Parlons{" "}
              <span className="text-yellow-400">
                ensemble.
              </span>
            </h1>

            <p
              className="hero-fade-up mx-auto mt-6 max-w-2xl text-base leading-8 text-green-100 md:text-lg"
              style={{
                animationDelay: "0.45s",
              }}
            >
              Une question, une information ou simplement envie de nous
              contacter ? L'équipe de BETHEL GLORY MEDIA est à votre écoute.
            </p>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">

              <HeroStat
                value="24/7"
                label="À votre écoute"
                delay="0.55s"
              />

              <HeroStat
                value="03"
                label="Moyens de contact"
                delay="0.7s"
              />

              <HeroStat
                value="100%"
                label="Disponibilité"
                delay="0.85s"
              />

            </div>

          </div>

          <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-[#f6f8f7] to-transparent" />

        </section>

        {/* ============================================================
            INTRO
        ============================================================ */}

        <section className="px-6 py-16 md:py-20">

          <div className="mx-auto max-w-6xl">

            <div
              className="content-appear group rounded-[2rem] border border-green-100 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl md:p-10"
              style={{
                animationDelay: "0.2s",
              }}
            >

              <div className="flex flex-col gap-7 md:flex-row md:items-center">

                <div className="icon-float flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-950 text-3xl shadow-lg transition-all duration-500 group-hover:scale-110">
                  💬
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                    Restons connectés
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-green-950 md:text-3xl">
                    Nous sommes là pour vous répondre
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                    Pour toute question concernant l'église, les programmes,
                    les assemblées ou BETHEL GLORY MEDIA, n'hésitez pas à nous
                    écrire ou à nous appeler.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ============================================================
            CONTACT + FORMULAIRE
        ============================================================ */}

        <section className="px-6 pb-20">

          <div className="mx-auto max-w-6xl">

            <div
              className="content-appear mb-10"
              style={{
                animationDelay: "0.2s",
              }}
            >

              <p className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
                Comment nous joindre
              </p>

              <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                  <h2 className="text-3xl font-black tracking-tight text-green-950 md:text-4xl">
                    Contactez-nous
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                    Choisissez le moyen qui vous convient le mieux ou
                    utilisez directement notre formulaire.
                  </p>

                </div>

                <div className="hidden h-px flex-1 bg-green-100 md:ml-10 md:block" />

              </div>

            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              {/* ========================================================
                  INFORMATIONS
              ======================================================== */}

              <div className="space-y-5">

                <div
                  className="card-left"
                  style={{
                    animationDelay: "0.25s",
                  }}
                >
                  <ContactCard
                    icon="📍"
                    title="Localisation"
                    label="Retrouvez-nous"
                    text="Abidjan, Côte d'Ivoire"
                  />
                </div>

                <div
                  className="card-left"
                  style={{
                    animationDelay: "0.4s",
                  }}
                >
                  <ContactCard
                    icon="📞"
                    title="Téléphone"
                    label="Appelez-nous"
                    text="+225 05 02 00 42 28"
                    href="tel:+2250502004228"
                  />
                </div>

                <div
                  className="card-left"
                  style={{
                    animationDelay: "0.55s",
                  }}
                >
                  <ContactCard
                    icon="✉️"
                    title="Email"
                    label="Écrivez-nous"
                    text="danielbabo2307@gmail.com"
                    href="mailto:danielbabo2307@gmail.com"
                  />
                </div>

                <div
                  className="content-appear relative overflow-hidden rounded-[2rem] bg-green-950 p-7 text-white shadow-xl"
                  style={{
                    animationDelay: "0.7s",
                  }}
                >

                  <div className="floating absolute -right-12 -top-12 h-36 w-36 rounded-full bg-green-700/30 blur-2xl" />

                  <div className="floating-reverse absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-3xl" />

                  <div className="relative z-10">

                    <div className="flex items-center gap-3">

                      <div className="icon-float flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-xl">
                        ✨
                      </div>

                      <div>

                        <p className="text-xs font-black uppercase tracking-widest text-green-300">
                          BETHEL GLORY MEDIA
                        </p>

                        <h3 className="mt-1 text-xl font-black">
                          Une équipe à votre écoute
                        </h3>

                      </div>

                    </div>

                    <p className="mt-5 leading-7 text-green-100">
                      Votre message est important pour nous. Nous ferons de
                      notre mieux pour vous répondre dans les meilleurs
                      délais.
                    </p>

                  </div>

                </div>

              </div>

              {/* ========================================================
                  FORMULAIRE
              ======================================================== */}

              <div
                className="card-right rounded-[2rem] border border-green-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl md:p-8"
                style={{
                  animationDelay: "0.25s",
                }}
              >

                <div className="mb-7">

                  <div className="flex items-center gap-3">

                    <div className="icon-float flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                      ✍️
                    </div>

                    <div>

                      <p className="text-xs font-black uppercase tracking-widest text-green-700">
                        Votre message
                      </p>

                      <h3 className="text-2xl font-black text-green-950">
                        Écrivez-nous
                      </h3>

                    </div>

                  </div>

                  <p className="mt-4 leading-7 text-gray-500">
                    Remplissez les informations ci-dessous pour nous envoyer
                    votre message.
                  </p>

                </div>

                {/* MESSAGE DE SUCCÈS */}

                {succes && (

                  <div className="success-appear mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="check-appear flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                        ✓
                      </div>

                      <div>

                        <p className="font-black text-green-900">
                          Message envoyé
                        </p>

                        <p className="mt-1 text-sm leading-6 text-green-700">
                          {succes}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* MESSAGE D'ERREUR */}

                {erreur && (

                  <div className="error-appear mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                        !
                      </div>

                      <div>

                        <p className="font-black text-red-900">
                          Envoi impossible
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-700">
                          {erreur}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                <form onSubmit={handleSubmit}>

                  {/* NOM */}

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Votre nom
                    </label>

                    <input
                      id="name"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Entrez votre nom"
                      required
                      minLength={2}
                      maxLength={150}
                      disabled={envoi}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="mt-5">

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Votre email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      required
                      maxLength={255}
                      disabled={envoi}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* TELEPHONE */}

                  <div className="mt-5">

                    <label
                      htmlFor="telephone"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Votre numéro de téléphone
                    </label>

                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Entrez votre numéro de téléphone"
                      required
                      maxLength={20}
                      disabled={envoi}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                  {/* MESSAGE */}

                  <div className="mt-5">

                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Votre message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Écrivez votre message ici..."
                      rows="6"
                      required
                      minLength={5}
                      maxLength={5000}
                      disabled={envoi}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="mt-2 text-right text-xs text-gray-400">
                      {formData.message.length}/5000
                    </div>

                  </div>

                  {/* BOUTON */}

                  <button
                    type="submit"
                    disabled={envoi}
                    className={`group mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-950 px-5 py-4 font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-900 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${
                      !envoi ? "button-pulse" : ""
                    }`}
                  >

                    {envoi ? (

                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        <span>
                          Envoi en cours...
                        </span>
                      </>

                    ) : (

                      <>
                        <span>
                          Envoyer le message
                        </span>

                        <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </>

                    )}

                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                    Vos informations sont utilisées uniquement pour traiter
                    votre demande.
                  </p>

                </form>

              </div>

            </div>

          </div>

        </section>

        {/* ============================================================
            CTA FINAL
        ============================================================ */}

        <section className="px-6 pb-20">

          <div
            className="cta-appear relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-green-950 px-7 py-12 text-center text-white shadow-xl md:px-12 md:py-16"
            style={{
              animationDelay: "0.2s",
            }}
          >

            <div className="floating absolute -left-20 -top-20 h-52 w-52 rounded-full bg-green-700/30 blur-3xl" />

            <div className="floating-reverse absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="glow-pulse absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative z-10">

              <div className="icon-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-2xl shadow-lg transition-all duration-500 hover:scale-110">
                🤝
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-300">
                BETHEL GLORY MEDIA
              </p>

              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight md:text-4xl">
                Nous serons heureux de vous entendre.
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-green-100">
                Que Dieu vous bénisse et merci de votre intérêt pour notre
                église et notre ministère.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <a
                  href="tel:+2250502004228"
                  className="group rounded-xl bg-yellow-400 px-6 py-3.5 font-black text-green-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-xl"
                >

                  <span className="transition-transform duration-300 group-hover:mr-1">
                    Nous appeler
                  </span>

                  <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                    ☎️
                  </span>

                </a>

                <a
                  href="mailto:danielbabo2307@gmail.com"
                  className="group rounded-xl border border-green-700 bg-green-900/50 px-6 py-3.5 font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-green-950"
                >

                  <span>
                    Nous écrire
                  </span>

                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

/* ================================================================
   HERO STAT
================================================================ */

function HeroStat({
  value,
  label,
  delay = "0s",
}) {
  return (
    <div
      className="stat-appear group rounded-2xl border border-green-800/70 bg-green-900/60 px-5 py-4 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/30 hover:bg-green-900 hover:shadow-xl"
      style={{
        animationDelay: delay,
      }}
    >

      <p className="text-2xl font-black text-yellow-400 transition-transform duration-300 group-hover:scale-110">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-green-200">
        {label}
      </p>

    </div>
  )
}

/* ================================================================
   CONTACT CARD
================================================================ */

function ContactCard({
  icon,
  title,
  label,
  text,
  href,
}) {
  const content = (
    <div className="group flex items-center gap-5 rounded-[2rem] border border-green-100 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl md:p-6">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-green-950">

        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>

      </div>

      <div className="min-w-0">

        <p className="text-xs font-black uppercase tracking-widest text-green-700">
          {label}
        </p>

        <h3 className="mt-1 text-lg font-black text-green-950">
          {title}
        </h3>

        <p className="mt-1 break-words font-semibold text-gray-600">
          {text}
        </p>

      </div>

      {href && (

        <span className="ml-auto hidden text-xl text-green-700 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 sm:block">
          →
        </span>

      )}

    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block"
      >
        {content}
      </a>
    )
  }

  return content
}

export default Contact
