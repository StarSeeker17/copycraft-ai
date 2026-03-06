import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function ProductForm({
  editingProduct,
  setEditingProduct,
  fetchProducts,
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    features: "",
    tone: "professional",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
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

      const data = await res.json();
      setForm((prev) => ({ ...prev, description: data.description }));
    } catch (error) {
      alert("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `${API_URL}/products/${editingProduct.id}`
      : `${API_URL}/products`;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setForm({
        name: "",
        category: "",
        features: "",
        tone: "professional",
        description: "",
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert("Failed to save product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl bg-white p-6 shadow"
    >
      <h2 className="mb-4 text-xl font-semibold">
        {editingProduct ? "Edit Product" : "Create Product"}
      </h2>

      <div className="grid gap-4">
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="rounded-lg border p-3"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="rounded-lg border p-3"
          required
        />

        <textarea
          name="features"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={handleChange}
          className="rounded-lg border p-3"
          rows="4"
          required
        />

        <select
          name="tone"
          value={form.tone}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="luxury">Luxury</option>
          <option value="technical">Technical</option>
        </select>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-black px-4 py-3 text-white"
        >
          {loading ? "Generating..." : "Generate Description"}
        </button>

        <textarea
          name="description"
          placeholder="Generated description"
          value={form.description}
          onChange={handleChange}
          className="rounded-lg border p-3"
          rows="6"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-3 text-white"
          >
            {editingProduct ? "Update Product" : "Save Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setForm({
                  name: "",
                  category: "",
                  features: "",
                  tone: "professional",
                  description: "",
                });
              }}
              className="rounded-lg border px-4 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}