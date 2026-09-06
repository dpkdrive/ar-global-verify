import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  History,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import { apiRequest, resolveAssetUrl } from "../api";
import {
  EmptyState,
  Modal,
  Notice,
  Pagination,
  Spinner,
  StatusBadge,
} from "../components/ui";

const blank = {
  name: "",
  sku: "",
  brand: "",
  authenticationCode: "",
  category: "",
  batchNumber: "",
  description: "",
  status: "active",
};

const query = (params) =>
  `?${new URLSearchParams(
    Object.entries(params).filter(([, value]) => value)
  ).toString()}`;


/* =========================================================
   PRODUCT FORM
========================================================= */

function ProductForm({ product, onSave, onClose }) {
  const editing = Boolean(product?.id || product?._id);

  const [form, setForm] = useState(
    product ? { ...blank, ...product } : blank
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fields = [
    ["name", "Product Name", true],
    ["sku", "SKU", true],
    ["brand", "Brand", true],
    ["authenticationCode", "Authentication Code", !editing],
    ["category", "Category"],
    ["batchNumber", "Batch Number"],
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await onSave(form, editing);
    } catch (err) {
      setError(
        err?.message ||
        "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? "Edit Product" : "Add Product"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-6">

        {/* Header */}

        <div className="rounded-xl border border-red-100 bg-red-50 p-4">

          <div className="flex gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
              <Boxes className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {editing
                  ? "Update product information"
                  : "Create a protected product"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {editing
                  ? "Update the product details and protection status."
                  : "Add the product details and authentication code."}
              </p>
            </div>

          </div>

        </div>


        {/* Error */}

        {error && <Notice message={error} />}


        {/* Fields */}

        <div className="grid gap-5 sm:grid-cols-2">

          {fields.map(([key, label, required]) => (
            <div key={key}>

              <label
                htmlFor={key}
                className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600"
              >
                {label}
                {required && (
                  <span className="ml-1 text-red-600">
                    *
                  </span>
                )}
              </label>

              <input
                id={key}
                name={key}
                type="text"
                required={required}
                disabled={
                  key === "authenticationCode" &&
                  editing
                }
                value={form[key] ?? ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              />

            </div>
          ))}


          {/* Status */}

          <div>

            <label
              htmlFor="status"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            >
              <option value="active">
                Active
              </option>

              <option value="disabled">
                Disabled
              </option>

              <option value="recalled">
                Recalled
              </option>
            </select>

          </div>


          {/* Description */}

          <div className="sm:col-span-2">

            <label
              htmlFor="description"
              className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />

          </div>

        </div>


        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-900 hover:bg-slate-950 hover:text-white"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : editing ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Product
              </>
            )}
          </button>

        </div>

      </form>
    </Modal>
  );
}


/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function ProductsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const [activeFilters, setActiveFilters] =
    useState({
      page: 1,
      limit: 10,
      search: "",
      status: "",
    });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] =
    useState(false);


  /* =====================================================
     LOAD PRODUCTS
  ====================================================== */

  const load = (next = activeFilters) => {
    setActiveFilters({
      ...next,
    });
  };


  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = await apiRequest(
          `/products${query(activeFilters)}`
        );

        if (active) {
          setItems(
            payload.data.products
          );

          setMeta(payload.meta);
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
            "Unable to load products."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      active = false;
    };
  }, [activeFilters]);


  /* =====================================================
     SAVE PRODUCT
  ====================================================== */

  const save = async (form, editing) => {
    const id = form.id ?? form._id;

    const body = Object.fromEntries(
      Object.entries(form).filter(
        ([key, value]) =>
          key !== "_id" &&
          key !== "id" &&
          value !== ""
      )
    );

    await apiRequest(
      editing
        ? `/products/${id}`
        : "/products",
      {
        method: editing ? "PATCH" : "POST",
        body,
      }
    );

    setModal(null);
    load();
  };


  /* =====================================================
     REMOVE PRODUCT
  ====================================================== */

  const remove = async (product) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Remove Product?",
      text: `Are you sure you want to remove "${product.name}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await apiRequest(
        `/products/${product._id ?? product.id}`,
        {
          method: "DELETE",
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Product Removed",
        text: `"${product.name}" has been removed successfully.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#16a34a",
      });

      load();
    } catch (err) {
      setError(
        err?.message ||
        "Unable to remove product."
      );

      Swal.fire({
        icon: "error",
        title: "Remove Failed",
        text:
          err?.message ||
          "Unable to remove this product.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };


  /* =====================================================
     VERIFICATION HISTORY
  ====================================================== */

  const openHistory = async (product) => {
    setHistoryLoading(true);

    try {
      const payload = await apiRequest(
        `/products/${product._id ?? product.id
        }/verifications?limit=20`
      );

      setHistory({
        product,
        ...payload.data,
      });
    } catch (err) {
      setError(
        err?.message ||
        "Unable to load verification history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };


  /* =====================================================
     SEARCH
  ====================================================== */

  const submitSearch = (event) => {
    event.preventDefault();

    const next = {
      ...filters,
      page: 1,
    };

    setFilters(next);
    load(next);
  };


  /* =====================================================
     STATUS FILTER
  ====================================================== */

  const updateStatus = (status) => {
    const next = {
      ...filters,
      status,
      page: 1,
    };

    setFilters(next);
    load(next);
  };


  /* =====================================================
     PAGINATION
  ====================================================== */

  const changePage = (page) => {
    const next = {
      ...filters,
      page,
    };

    setFilters(next);
    load(next);
  };


  /* =====================================================
     RETURN
  ====================================================== */

  return (
    <main className="min-h-screen bg-slate-50">


      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                  <Boxes className="h-4 w-4 text-white" />
                </div>

                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Product Catalog
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Products
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create and manage the authentication
                codes customers use to verify products.
              </p>

            </div>


            <button
              type="button"
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">


        {/* =================================================
            FILTER PANEL
        ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
              <Search className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-950">
                Find Products
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search by product name, brand or SKU.
              </p>
            </div>

          </div>


          <form
            onSubmit={submitSearch}
            className="grid gap-3 md:grid-cols-[1fr_200px_auto]"
          >

            {/* Search */}

            <div className="relative">

              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search name, brand or SKU..."
                value={filters.search}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    search: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />

            </div>


            {/* Status */}

            <select
              value={filters.status}
              onChange={(event) =>
                updateStatus(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            >

              <option value="">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="disabled">
                Disabled
              </option>

              <option value="recalled">
                Recalled
              </option>

            </select>


            {/* Search button */}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

          </form>

        </section>


        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-5">
            <Notice message={error} />
          </div>
        )}


        {/* =================================================
            PRODUCT TABLE
        ================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table Header */}

          <div className="border-b border-slate-200 px-6 py-5 lg:px-7">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-black uppercase tracking-tight text-slate-950">
                  Product Inventory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your protected product catalog.
                </p>

              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-red-50 sm:flex">
                <PackageIcon />
              </div>

            </div>

          </div>


          {/* Loading */}

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex flex-col items-center gap-4">

                <Spinner />

                <p className="text-sm font-medium text-slate-500">
                  Loading products...
                </p>

              </div>

            </div>

          ) : items.length ? (

            <>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400 lg:px-7">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        SKU
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Brand
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400 lg:px-7">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {items.map((product) => (

                      <tr
                        key={product._id}
                        className="group transition hover:bg-slate-50"
                      >

                        {/* Product */}

                        <td className="px-6 py-5 lg:px-7">

                          <div className="flex items-center gap-3">

                            {product.imageUrl ? (
                              <img
                                src={resolveAssetUrl(product.imageUrl)}
                                alt={`${product.name} product`}
                                className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 bg-white object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-red-50">
                                <Boxes className="h-5 w-5 text-slate-500 group-hover:text-red-600" />
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {product.category ||
                                  "Uncategorized"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* SKU */}

                        <td className="px-6 py-5">

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600">
                            {product.sku}
                          </span>

                        </td>


                        {/* Brand */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-semibold text-slate-700">
                            {product.brand}
                          </span>

                        </td>


                        {/* Status */}

                        <td className="px-6 py-5">

                          <StatusBadge
                            value={product.status}
                          />

                        </td>


                        {/* Created */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                            <CalendarDays className="h-4 w-4 text-slate-400" />

                            {new Date(
                              product.createdAt
                            ).toLocaleDateString()}

                          </div>

                        </td>


                        {/* Actions */}

                        <td className="px-6 py-5 lg:px-7">

                          <div className="flex items-center justify-end gap-2">

                            <ActionButton
                              icon={History}
                              label="History"
                              onClick={() =>
                                openHistory(product)
                              }
                            />

                            <ActionButton
                              icon={Edit3}
                              label="Edit"
                              onClick={() =>
                                setModal(product)
                              }
                            />

                            <ActionButton
                              icon={Trash2}
                              label="Remove"
                              danger
                              onClick={() =>
                                remove(product)
                              }
                            />

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {/* Pagination */}

              <div className="border-t border-slate-200 px-6 py-4 lg:px-7">

                <Pagination
                  meta={meta}
                  onChange={changePage}
                />

              </div>

            </>

          ) : (

            <div className="p-10">

              <EmptyState
                title="No products found"
                description="Add your first product to begin protecting it."
              />

            </div>

          )}

        </section>

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================== */}

      {modal && (
        <ProductForm
          product={modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}


      {/* =================================================
          HISTORY MODAL
      ================================================== */}

      {history && (

        <Modal
          title={`${history.product.name} — Verification History`}
          onClose={() => setHistory(null)}
        >

          {historyLoading ? (

            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner />
            </div>

          ) : history.events.length ? (

            <div className="space-y-3">

              {history.events.map((event) => (

                <div
                  key={event._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">

                      {event.outcome ===
                        "verified" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}

                    </div>

                    <div>
                      <StatusBadge
                        value={event.outcome}
                      />

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">

                        <Clock3 className="h-3.5 w-3.5" />

                        {new Date(
                          event.createdAt
                        ).toLocaleString()}

                      </div>
                    </div>

                  </div>

                  <div className="flex flex-col gap-1 text-xs sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-slate-800">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{event.email || "No Email"}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{event.mobile || "No Mobile"}</span>
                    </div>
                  </div>

                </div>

              ))}

            </div>

          ) : (

            <EmptyState
              title="No scans yet"
              description="Verification attempts for this product will appear here."
            />

          )}

        </Modal>

      )}

    </main>
  );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        inline-flex h-9 items-center justify-center gap-1.5
        rounded-lg border px-2.5 text-xs font-bold
        transition

        ${danger
          ? "border-red-100 text-red-500 hover:border-red-500 hover:bg-red-600 hover:text-white"
          : "border-slate-200 text-slate-500 hover:border-slate-900 hover:bg-slate-950 hover:text-white"
        }
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      <span className="hidden xl:inline">
        {label}
      </span>
    </button>
  );
}


/* =========================================================
   PACKAGE ICON
========================================================= */

function PackageIcon() {
  return (
    <Boxes className="h-5 w-5 text-red-600" />
  );
}
