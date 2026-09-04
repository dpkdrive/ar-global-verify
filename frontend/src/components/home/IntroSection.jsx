
import { ArrowRight } from "lucide-react";

export default function IntroSection() {
  return (
    <section className="px-6 py-24 lg:px-8">

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-end">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
            Built For Performance
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl">
            Nutrition
            <br />
            Without
            <br />
            Compromise.
          </h2>
        </div>

        <div>

          <p className="text-base leading-8 text-slate-600">
            Your training deserves products you can trust. Our focus is
            simple: quality formulations, reliable products and a strong
            commitment to authenticity.
          </p>

          <a
            href="/about"
            className="mt-7 inline-flex items-center gap-2 border-b-2 border-black pb-2 text-sm font-bold uppercase tracking-wider transition hover:border-red-600 hover:text-red-600"
          >
            About Anabolic Research

            <ArrowRight className="h-4 w-4" />
          </a>

        </div>

      </div>

    </section>
  );
}
