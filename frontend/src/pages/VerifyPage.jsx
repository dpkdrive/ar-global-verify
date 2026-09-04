
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  PackageCheck,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Swal from 'sweetalert2'
import { apiRequest } from "../api";
import { Notice, Spinner, StatusBadge } from "../components/ui";

const INITIAL_CODE = "";

export default function VerifyPage() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  console.log("Result:", result);
  /**
   * Handle authentication code input
   */
  const handleCodeChange = (event) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/\s/g, "");

    setCode(value);

    // Clear previous messages when user changes the code
    if (error) {
      setError("");
    }

    if (result) {
      setResult(null);
    }
  };

  /**
   * Verify product
   */
  /**
   * Verify product
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await apiRequest("/verify", {
        method: "POST",
        body: {
          code,
        },
        token: null,
      });

      const data = response.data;

      // Result ko state me save karo
      setResult(data);

      // ============================================
      // PRODUCT VERIFIED SUCCESSFULLY
      // ============================================
      if (data?.verified === true) {
        await Swal.fire({
          icon: "success",
          title: "Successfully Verified!",
          text: data?.message || "Product verified successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#16a34a",
        });
      }

      // ============================================
      // PRODUCT NOT VERIFIED
      // ============================================
      else {
        await Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text:
            data?.message ||
            "We could not verify this product.",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (err) {
      const errorMessage =
        err?.message ||
        "Unable to verify this product. Please try again.";

      setError(errorMessage);

      // ============================================
      // API / SERVER ERROR
      // ============================================
      await Swal.fire({
        icon: "error",
        title: "Verification Error",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset verification form
   */
  const handleReset = () => {
    setCode("");
    setResult(null);
    setError("");
  };

  const isVerified = result?.verified === true;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ====================================================== */}
      {/* <section className="relative overflow-hidden bg-black">


        <div className="absolute -right-32 -top-32 h-80 w-80 rotate-12 bg-red-600/90" />

        <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">


          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-red-600 text-sm font-black text-white">
              AR
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-wider text-white">
                Anabolic Research
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Product Authentication
              </p>
            </div>
          </div>


          <div className="mt-14 max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              Official Verification
            </div>

            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-7xl">
              Verify Your
              <br />

              <span className="text-red-600">
                Product.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Check your product's authentication code to confirm that it is
              genuine and officially verified.
            </p>

          </div>
        </div>
      </section> */}


      {/* =====================================================
          VERIFICATION AREA
      ====================================================== */}
      <section className="px-6 py-12 lg:px-8 lg:py-20">

        <div className="mx-auto max-w-4xl">

          {/* =================================================
              VERIFICATION FORM
          ================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:p-10">

            {/* Header */}
            <div className="mb-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Search className="h-6 w-6" />
              </div>

              <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-slate-950 sm:text-3xl">
                Check Authenticity
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the unique authentication code printed on your product
                or packaging.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="mb-6">
                <Notice message={error} />
              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label
                  htmlFor="authentication-code"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Authentication Code
                </label>

                <div className="relative">

                  <input
                    id="authentication-code"
                    name="code"
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    required
                    minLength={6}
                    maxLength={100}
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="AR-12345-XYZ"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 pr-12 font-mono text-base font-semibold tracking-wider text-slate-900 uppercase outline-none transition placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <ShieldCheck className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the code exactly as shown on your product.
                </p>

              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading || code.trim().length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Checking Product...
                  </>
                ) : (
                  <>
                    Verify Product
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

            </form>


            {/* Trust indicators */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-7 sm:grid-cols-3">

              <TrustItem
                icon={ShieldCheck}
                text="Secure Check"
              />

              <TrustItem
                icon={BadgeCheck}
                text="Official System"
              />

              <TrustItem
                icon={PackageCheck}
                text="Product Check"
              />

            </div>

          </div>




        </div>
      </section>


      {/* =====================================================
          RESULT SECTION
      ====================================================== */}
      {result && (
        <VerificationResult
          result={result}
          isVerified={isVerified}
          onReset={handleReset}
        />
      )}




    </main>
  );
}


/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
      <Icon className="h-4 w-4 text-red-600" />
      {text}
    </div>
  );
}


/* =========================================================
   VERIFICATION STEP
========================================================= */

/* =========================================================
   VERIFICATION RESULT
========================================================= */

function VerificationResult({
  result,
  isVerified,
  onReset,
}) {
  return (
    <section className="px-6 pb-16 lg:px-8">

      <div
        className={`mx - auto max - w - 7xl overflow - hidden rounded - 2xl border ${
  isVerified
    ? "border-green-200 bg-green-50"
    : "border-red-200 bg-red-50"
} `}
      >

        {/* Result Header */}
        <div
          className={`flex flex - col gap - 5 p - 6 sm: flex - row sm: items - center sm: justify - between sm: p - 8 ${
  isVerified
    ? "bg-green-600"
    : "bg-red-600"
} `}
        >

          <div className="flex items-center gap-4 text-white">

            {isVerified ? (
              <CheckCircle2 className="h-10 w-10 shrink-0" />
            ) : (
              <XCircle className="h-10 w-10 shrink-0" />
            )}

            <div>

              <div className="mb-2">
                <StatusBadge
                  value={
                    isVerified
                      ? "authentic"
                      : result.status
                  }
                />
              </div>

              <h2 className="text-xl font-black uppercase sm:text-2xl">
                {isVerified
                  ? "This Product Is Authentic"
                  : "Unable To Verify This Product"}
              </h2>

            </div>

          </div>


          <button
            type="button"
            onClick={onReset}
            className="w-fit border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
          >
            Check Another
          </button>

        </div>


        {/* Result Content */}
        <div className="p-6 sm:p-8">

          {result.product ? (

            <div className="grid gap-8 md:grid-cols-2">

              {/* Product Info */}
              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Product Information
                </p>

                <dl className="mt-5 divide-y divide-slate-200">

                  <ProductDetail
                    label="Product"
                    value={result.product.name}
                  />

                  <ProductDetail
                    label="Brand"
                    value={result.product.brand}
                  />

                  <ProductDetail
                    label="SKU"
                    value={result.product.sku}
                  />

                  {result.product.batchNumber && (
                    <ProductDetail
                      label="Batch"
                      value={result.product.batchNumber}
                    />
                  )}

                </dl>

              </div>


              {/* Verification Status */}
              <div className="flex items-center justify-center">

                <div className="text-center">

                  {isVerified ? (
                    <CheckCircle2 className="mx-auto h-20 w-20 text-green-600" />
                  ) : (
                    <XCircle className="mx-auto h-20 w-20 text-red-600" />
                  )}

                  <p className="mt-5 text-sm font-bold uppercase tracking-wider text-slate-500">
                    Verification Status
                  </p>

                  <p
                    className={`mt - 2 text - 2xl font - black uppercase ${
  isVerified
    ? "text-green-700"
    : "text-red-700"
} `}
                  >
                    {isVerified
                      ? "Authentic"
                      : result.status || "Not Verified"}
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="flex gap-4">

              <XCircle className="h-6 w-6 shrink-0 text-red-600" />

              <p className="text-sm leading-7 text-slate-600">
                {result.message ||
                  "We could not verify this product code."}
              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   PRODUCT DETAIL
========================================================= */

function ProductDetail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">

      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>

      <dd className="text-right text-sm font-bold text-slate-900">
        {value || "—"}
      </dd>

    </div>
  );
}
