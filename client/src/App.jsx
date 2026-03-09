import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const API_URL = "http://localhost:5000";

export default function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");

    try {
      const res = await fetch(`${API_URL}/products`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProductsError("Could not load products from the database.");
      toast.error("Could not load saved products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#8b5cf6",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
            AI Product Copy Generator
          </p>
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">CopyCraft AI</h1>
          <p className="max-w-2xl text-sm text-white/90 md:text-base">
            Generate polished ecommerce product descriptions, save them to your
            database, and manage them with full CRUD functionality.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              React Frontend
            </div>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              Prisma + SQLite
            </div>
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              Gemini API
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductForm
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            fetchProducts={fetchProducts}
          />

          <ProductList
            products={products}
            setEditingProduct={setEditingProduct}
            fetchProducts={fetchProducts}
            loadingProducts={loadingProducts}
            productsError={productsError}
          />
        </div>
      </div>
    </div>
  );
}