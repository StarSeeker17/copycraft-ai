import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

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

export default function ProductList({
  products,
  setEditingProduct,
  fetchProducts,
  loadingProducts,
  productsError,
}) {
  const handleDelete = async (id, productName) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
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

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-300">
            Saved Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Product Library
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {products.length} {products.length === 1 ? "item" : "items"}
        </div>
      </div>

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
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
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
                      toast("Loaded product into editor.", {
                        icon: "📝",
                      });
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                  >
                    Edit
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
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Features
                </p>
                <p className="text-sm leading-6 text-slate-300">
                  {product.features}
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Description
                </p>
                <p className="leading-7 text-slate-200">
                  {product.description || "No description available yet."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}