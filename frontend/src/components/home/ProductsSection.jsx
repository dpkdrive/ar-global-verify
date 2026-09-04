
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "Nitro Whey",
    category: "Protein Supplement",
  },
  {
    name: "Performance Series",
    category: "Sports Nutrition",
  },
  {
    name: "Recovery Formula",
    category: "Recovery",
  },
];

export default function ProductsSection() {
  return (
    <section className="px-6 py-24 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Our Range
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase sm:text-5xl">
              Featured Products
            </h2>

          </div>

          <a
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-red-600"
          >
            View All

            <ArrowRight className="h-4 w-4" />
          </a>

        </div>


        {/* Products */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {products.map((product, index) => (

            <article
              key={product.name}
              className="group overflow-hidden border border-slate-200 bg-white"
            >

              {/* Image */}
              <div className="relative flex h-80 items-center justify-center overflow-hidden bg-slate-900">

                <div
                  className={`absolute inset - 0 ${
  index === 1
    ? "bg-red-600"
    : "bg-slate-900"
} `}
                />

                <div className="relative z-10 text-center">

                  <div className="mx-auto flex h-28 w-28 items-center justify-center border-4 border-white">

                    <span className="text-3xl font-black text-white">
                      AR
                    </span>

                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-white">
                    Anabolic Research
                  </p>

                </div>

                <span className="absolute left-4 top-4 z-10 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  Product {String(index + 1).padStart(2, "0")}
                </span>

              </div>


              {/* Content */}
              <div className="p-6">

                <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                  {product.category}
                </p>

                <h3 className="mt-2 text-2xl font-black uppercase">
                  {product.name}
                </h3>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition group-hover:text-red-600"
                >
                  Explore Product

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}
