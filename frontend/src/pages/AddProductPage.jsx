import { useEffect, useState } from 'react';
import { ArrowLeft, Boxes, CheckCircle2, ImagePlus, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

const initialForm = { name: '', sku: '', brand: '', authenticationCode: '', category: '', batchNumber: '', description: '', status: 'active' };

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const updateField = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]:
        name === "authenticationCode"
          ? value.toUpperCase().replace(/\s/g, "")
          : value,
    });
  };
  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const updateImage = (event) => {
    const selectedImage = event.target.files?.[0];
    if (!selectedImage) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedImage.type)) {
      setError('Please select a JPEG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }
    if (selectedImage.size > 5 * 1024 * 1024) {
      setError('Product image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }
    setError('');
    setImage(selectedImage);
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form)
        .filter(([, value]) => value !== "")
        .forEach(([key, value]) => body.append(key, value));
      if (image) body.append('image', image);
      await apiRequest("/products", { method: "POST", body });
      await Swal.fire({
        icon: "success",
        title: "Product created",
        text: "The authentication code is now ready for verification.",
        confirmButtonColor: "#dc2626",
      });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      setError(err.message ?? "Unable to create the product.");
    } finally {
      setSaving(false);
    }
  };
  const fields = [
    ["name", "Product name", true, "e.g. Heritage Olive Oil"],
    ["sku", "SKU", true, "e.g. HOO-500ML"],
    ["brand", "Brand", true, "e.g. Authentica Foods"],
    [
      "authenticationCode",
      "Authentication code",
      true,
      "6+ letters, numbers, _ or -",
    ],
    ["category", "Category", false, "e.g. Food & beverage"],
    ["batchNumber", "Batch number", false, "e.g. BATCH-2026-01"],
  ];
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="size-4" /> Back to products
          </button>
          <div className="flex items-start gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-red-600 text-white">
              <Boxes className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-600">
                Product catalog
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Add product
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Create a protected product and its unique
                authentication code.
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          onSubmit={submit}
        >
          <div className="border-b border-slate-200 p-6">
            <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-600" />
              <p className="text-sm leading-6 text-slate-600">
                The authentication code cannot be changed after
                the product is created. Confirm it carefully
                before saving.
              </p>
            </div>
            {error && (
              <p
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {fields.map(
                ([name, label, required, placeholder]) => (
                  <label
                    key={name}
                    className="grid gap-2 text-sm font-semibold text-slate-700"
                  >
                    {label}
                    {required && (
                      <span className="text-red-600">
                        {" "}
                        *
                      </span>
                    )}
                    <input
                      name={name}
                      required={required}
                      minLength={
                        name === "authenticationCode"
                          ? 6
                          : undefined
                      }
                      maxLength={
                        name === "authenticationCode"
                          ? 128
                          : undefined
                      }
                      pattern={
                        name === "authenticationCode"
                          ? "[A-Za-z0-9_-]+"
                          : undefined
                      }
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={updateField}
                      className="h-12 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    />
                  </label>
                ),
              )}
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="recalled">Recalled</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
                Product image <span className="font-normal text-slate-400">(optional, JPEG/PNG/WebP, max 5 MB)</span>
                <span className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected product preview" className="h-24 w-24 rounded-lg border border-slate-200 bg-white object-cover" />
                  ) : (
                    <span className="grid h-24 w-24 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400"><ImagePlus className="size-7" /></span>
                  )}
                  <span className="flex flex-1 flex-wrap items-center gap-3">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={updateImage} className="block max-w-full text-sm font-medium text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-red-700" />
                    {image && <button type="button" onClick={() => setImage(null)} className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-red-700"><X className="size-4" /> Remove</button>}
                  </span>
                </span>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700 sm:col-span-2">
                Description
                <textarea
                  name="description"
                  rows="4"
                  maxLength="5000"
                  placeholder="Add product details that help customers identify it."
                  value={form.description}
                  onChange={updateField}
                  className="resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-white"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" />{" "}
              {saving ? "Creating product…" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
