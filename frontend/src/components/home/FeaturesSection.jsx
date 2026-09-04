
import {
  Award,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Research Driven",
    description:
      "Formulations developed with a focus on quality ingredients and performance.",
  },
  {
    icon: ShieldCheck,
    title: "Product Security",
    description:
      "Verify your product and protect yourself from counterfeit products.",
  },
  {
    icon: Award,
    title: "Quality Focused",
    description:
      "Every product is designed around consistency, quality and trust.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-slate-950 px-6 py-24 lg:px-8">

      <div className="mx-auto max-w-7xl">

        <div className="mb-14 max-w-2xl">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase text-white sm:text-5xl">
            Built Around
            <br />
            Trust.
          </h2>

        </div>


        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="bg-slate-950 p-8 transition hover:bg-slate-900"
              >

                <Icon className="h-10 w-10 text-red-500" />

                <h3 className="mt-8 text-xl font-black uppercase text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}
