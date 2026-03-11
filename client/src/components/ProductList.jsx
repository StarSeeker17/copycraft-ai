import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { API_URL, getAuthHeaders } from "../lib/api";

function getToneClasses(tone) {
  switch (tone) {
    case "casual":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
    case "luxury":
      return "bg-amber-500/15 text-amber-300 border border-amber-400/20";
    case "technical":
      return "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20";
    default:
      return "bg-violet-500/15 text-violet-300 border border-violet-400/20";
  }
}

function parseFeatures(features) {
  if (!features) return [];
  return features
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

export default function ProductList({
  products,
  setEditingProduct,
  fetchProducts,
  loadingProducts,
  productsError,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const haystack = [
        product.name,
        product.category,
        product.tone,
        product.features,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy]);

  const handleDelete = async (id, productName) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
      toast.success(`Deleted "${productName}".`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product.");
    }
  };

  const handleCopy = async (text) => {
    if (!text) {
      toast.error("There is no description to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Description copied to clipboard.");
    } catch (error) {
      console.error(error);
      toast.error("Copy failed. Your browser may not allow clipboard access.");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300">
            Saved Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Product Library
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "item" : "items"}
        </div>
      </div>

      {!loadingProducts && !productsError && products.length > 0 && (
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            type="text"
            placeholder="Search by name, category, tone, features, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>
        </div>
      )}

      {loadingProducts ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-400/30 border-t-violet-400" />
          <h3 className="text-lg font-semibold text-white">Loading products</h3>
          <p className="mt-2 text-sm text-slate-400">
            Fetching saved products from your database...
          </p>
        </div>
      ) : productsError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-center">
          <h3 className="text-lg font-semibold text-rose-300">
            Could not load products
          </h3>
          <p className="mt-2 text-sm text-rose-200/80">{productsError}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xl font-bold text-white">
            AI
          </div>
          <h3 className="text-lg font-semibold text-white">No products yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Create your first product and generate a description to see it here.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-10 text-center">
          <h3 className="text-lg font-semibold text-white">No matching products</h3>
          <p className="mt-2 text-sm text-slate-400">
            Try a different search term or sort option.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const featureChips = parseFeatures(product.features);

            return (
              <div
                key={product.id}
                className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 transition hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-xl"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getToneClasses(
                        product.tone
                      )}`}
                    >
                      {product.tone}
                    </span>

                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        toast("Loaded product into editor.", { icon: "📝" });
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleCopy(product.description)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="rounded-xl bg-rose-500/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-3 rounded-2xl bg-white/5 p-3">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Features
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {featureChips.length > 0 ? (
                      featureChips.map((feature, index) => (
                        <span
                          key={`${product.id}-${feature}-${index}`}
                          className="rounded-full border border-white/10 bg-slate-800/90 px-3 py-1 text-xs text-slate-200"
                        >
                          {feature}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-slate-300">
                        No features available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Description
                    </p>

                    <button
                      onClick={() => handleCopy(product.description)}
                      className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                    >
                      Copy text
                    </button>
                  </div>

                  <p className="leading-7 text-slate-200">
                    {product.description || "No description available yet."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}