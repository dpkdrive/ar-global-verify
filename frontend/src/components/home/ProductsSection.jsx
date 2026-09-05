
import { ArrowRight } from "lucide-react";
import ReactSlick from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// react-slick is CommonJS. In this Vite setup its default import is a module
// wrapper, while the actual React component is nested under `.default`.
const Slider = ReactSlick.default ?? ReactSlick;

export default function ProductsSection({ products = [], loading = false }) {
  const productCount = products.length;
  const desktopSlides = Math.min(4, productCount);
  const tabletSlides = Math.min(2, productCount);
  const mobileSlides = Math.min(1, productCount);

  const settings = {
    dots: true,
    infinite: productCount > desktopSlides,
    speed: 500,
    slidesToShow: desktopSlides,
    slidesToScroll: 1,
    autoplay: productCount > desktopSlides,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: tabletSlides,
          infinite: productCount > tabletSlides,
          autoplay: productCount > tabletSlides,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: mobileSlides,
          infinite: productCount > mobileSlides,
          autoplay: productCount > mobileSlides,
        }
      }
    ]
  };


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
        <div className="mt-12">
          {loading ? (
            <p className="text-sm font-medium text-slate-500">Loading products…</p>
          ) : productCount ? (
            <Slider {...settings} className="-mx-3" aria-label="Featured products">
              {products.map((product, index) => (
              <div key={product._id} className="px-3">
                <article
                  className="group overflow-hidden border border-slate-200 bg-white"
                >

                  {/* Image */}
                  <div className="relative flex h-80 items-center justify-center overflow-hidden bg-slate-900">

                    <div
                      className={`absolute inset-0 ${index === 1
                        ? "bg-red-600"
                        : "bg-slate-900"
                        } `}
                    />

                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                    ) : <div className="relative z-10 text-center">

                      <div className="mx-auto flex h-28 w-28 items-center justify-center border-4 border-white">

                        <span className="text-3xl font-black text-white">
                          AR
                        </span>

                      </div>

                      <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-white">
                        Anabolic Research
                      </p>

                    </div>}

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
              </div>
              ))}
            </Slider>
          ) : (
              <p className="text-sm font-medium text-slate-500">No products are available right now.</p>
          )}
        </div>

      </div>

    </section>
  );
}
