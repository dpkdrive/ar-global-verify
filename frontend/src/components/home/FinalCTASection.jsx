
import {
  ArrowRight,
  Dumbbell,
} from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-red-600 px-6 py-24 lg:px-8">

      {/* Decoration */}
      <div className="absolute right-0 top-0 h-full w-1/3 skew-x-[-20deg] bg-black/10" />

      <div className="relative mx-auto max-w-7xl">

        <Dumbbell className="h-12 w-12 text-white" />

        <h2 className="mt-8 max-w-4xl text-4xl font-black uppercase leading-none text-white sm:text-6xl">
          Your Training.
          <br />
          Your Progress.
          <br />
          Your Product.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-red-100">
          Your performance deserves genuine products. Verify before you use.
        </p>

        <a
          href="/authenticity"
          className="mt-8 inline-flex items-center gap-3 bg-black px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-slate-900"
        >
          Verify Product

          <ArrowRight className="h-5 w-5" />
        </a>

      </div>

    </section>
  );
}
