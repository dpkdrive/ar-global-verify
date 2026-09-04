
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black">

      {/* Background Decoration */}
      <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rotate-12 bg-red-600" />

      <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] -rotate-12 bg-slate-900" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-20 lg:px-8">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <BadgeCheck className="h-4 w-4 text-red-500" />

              Authentic. Trusted. Verified.
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-6xl lg:text-8xl">
              Train
              <br />

              <span className="text-red-600">
                Hard.
              </span>

              <br />

              Stay
              <br />

              Genuine.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Premium sports nutrition built for people who take their
              training seriously. Choose genuine products and verify them
              before use.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="/authenticity"
                className="group inline-flex items-center justify-center gap-3 bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
              >
                Verify Product

                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="/about"
                className="inline-flex items-center justify-center gap-3 border border-white/30 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
              >
                Discover More
              </a>

            </div>

          </div>


          {/* Right Product Visual */}
          <div className="relative hidden lg:flex justify-center">

            <div className="relative h-[520px] w-[430px]">

              {/* Red Shape */}
              <div className="absolute inset-8 rotate-6 bg-red-600" />

              {/* Product Card */}
              <div className="absolute inset-0 flex rotate-[-5deg] items-center justify-center border border-white/10 bg-gradient-to-br from-slate-800 to-black shadow-2xl">

                <div className="text-center">

                  <div className="mx-auto flex h-28 w-28 items-center justify-center border-4 border-red-600">
                    <span className="text-4xl font-black text-white">
                      AR
                    </span>
                  </div>

                  <p className="mt-7 text-sm font-bold uppercase tracking-[0.35em] text-red-500">
                    Anabolic Research
                  </p>

                  <h2 className="mt-4 text-5xl font-black uppercase text-white">
                    Performance
                  </h2>

                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-400">
                    Premium Sports Nutrition
                  </p>

                </div>

              </div>

              {/* Verification Badge */}
              <div className="absolute -bottom-4 -left-8 flex items-center gap-3 border border-white/10 bg-slate-900 px-5 py-4 shadow-xl">

                <ShieldCheck className="h-7 w-7 text-green-500" />

                <div>
                  <p className="text-xs font-bold uppercase text-white">
                    Verified
                  </p>

                  <p className="text-[10px] uppercase text-slate-500">
                    Genuine Product
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

