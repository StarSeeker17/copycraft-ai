import { useEffect, useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const API_URL = "http://localhost:5000";

export default function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">CopyCraft AI</h1>

        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          fetchProducts={fetchProducts}
        />

        <ProductList
          products={products}
          setEditingProduct={setEditingProduct}
          fetchProducts={fetchProducts}
        />
      </div>
    </div>
  );
}