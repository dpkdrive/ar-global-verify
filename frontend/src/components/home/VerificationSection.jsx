
import {
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";

const steps = [
  "Locate the authenticity code on your product.",
  "Enter the code into our verification system.",
  "Confirm whether your product is genuine.",
];

export default function VerificationSection() {
  return (
    <section className="bg-slate-100 px-6 py-24 lg:px-8">

      <div className="mx-auto max-w-7xl">

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          {/* Content */}
          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Product Authentication
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">
              Is Your Product
              <br />
              Genuine?
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Counterfeit products can look convincing. Use our verification
              system to check your product and confirm its authenticity.
            </p>

            <a
              href="/authenticity"
              className="mt-8 inline-flex items-center gap-3 bg-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-red-600"
            >
              <Search className="h-5 w-5" />

              Verify Now

              <ArrowRight className="h-4 w-4" />
            </a>

          </div>


          {/* Steps */}
          <div className="space-y-4">

            {steps.map((step, index) => (

              <div
                key={step}
                className="flex gap-5 border border-slate-200 bg-white p-6"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-600 text-sm font-black text-white">
                  0{index + 1}
                </div>

                <div>

                  <h3 className="font-bold uppercase">
                    Step {index + 1}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {step}
                  </p>

                </div>

                <CheckCircle2 className="ml-auto hidden h-5 w-5 shrink-0 text-green-600 sm:block" />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
