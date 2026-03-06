const API_URL = "http://localhost:5000";

export default function ProductList({
  products,
  setEditingProduct,
  fetchProducts,
}) {
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="grid gap-4">
      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow">
          No products yet.
        </div>
      ) : (
        products.map((product) => (
          <div key={product.id} className="rounded-2xl bg-white p-6 shadow">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  {product.category} • {product.tone}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="rounded-lg border px-3 py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="mb-2 text-sm text-gray-600">
              <strong>Features:</strong> {product.features}
            </p>

            <p className="text-gray-800">{product.description}</p>
          </div>
        ))
      )}
    </div>
  );
}