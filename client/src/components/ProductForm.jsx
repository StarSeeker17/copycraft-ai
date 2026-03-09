import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

const initialForm = {
  name: "",
  category: "",
  features: "",
  tone: "professional",
  description: "",
};

export default function ProductForm({
  editingProduct,
  setEditingProduct,
  fetchProducts,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm(initialForm);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    if (!form.name || !form.category || !form.features) {
      toast.error("Please fill in name, category, and features first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          features: form.features,
          tone: form.tone,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate description");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, description: data.description || "" }));
      toast.success("Description generated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate description.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `${API_URL}/products/${editingProduct.id}`
      : `${API_URL}/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      setForm(initialForm);
      setEditingProduct(null);
      await fetchProducts();

      toast.success(
        editingProduct
          ? "Product updated successfully."
          : "Product saved successfully."
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
          Workspace
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {editingProduct ? "Edit Product" : "Create a Product"}
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Add product details, generate a compelling description, then save it
          to your database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Product Name
          </label>
          <input
            name="name"
            placeholder="e.g. ZenSound Pro X1"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Category
          </label>
          <input
            name="category"
            placeholder="e.g. Electronics"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Features
          </label>
          <textarea
            name="features"
            placeholder="Enter key product features separated by commas"
            value={form.features}
            onChange={handleChange}
            rows="4"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Tone
          </label>
          <select
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="luxury">Luxury</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">AI Description</h3>
              <p className="text-sm text-slate-300">
                Generate marketing copy from the product details above.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          <textarea
            name="description"
            placeholder="Your AI-generated product description will appear here..."
            value={form.description}
            onChange={handleChange}
            rows="7"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-violet-400"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Save Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setForm(initialForm);
                toast("Edit cancelled.", {
                  icon: "✏️",
                });
              }}
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}