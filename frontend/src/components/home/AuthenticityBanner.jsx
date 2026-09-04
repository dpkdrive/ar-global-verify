
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AuthenticityBanner() {
  return (
    <section className="bg-red-600">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center lg:px-8">

        <div className="flex items-start gap-4">

          <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-white" />

          <div>
            <h2 className="text-lg font-black uppercase text-white">
              Don't Fall For Counterfeits
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-red-100">
              Always verify your product before use. Check the authenticity
              details and make sure your product is genuine.
            </p>
          </div>

        </div>

        <a
          href="/authenticity"
          className="inline-flex shrink-0 items-center gap-2 bg-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-900"
        >
          Check Authenticity

          <ArrowRight className="h-4 w-4" />
        </a>

      </div>
    </section>
  );
}

