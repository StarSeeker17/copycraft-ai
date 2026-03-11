import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import AuthPage from "./components/AuthPage";
import { API_URL, getAuthHeaders } from "./lib/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const fetchProducts = async () => {
    if (!localStorage.getItem("token")) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    setProductsError("");

    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProductsError("Could not load products from the database.");
      toast.error("Could not load saved products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      setLoadingProducts(false);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProducts([]);
    setEditingProduct(null);
    toast.success("Logged out.");
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage onAuthSuccess={setUser} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "14px 16px",
          },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                AI Product Copy Generator
              </p>
              <h1 className="mb-3 text-4xl font-bold md:text-5xl">
                CopyCraft AI
              </h1>
              <p className="max-w-2xl text-sm text-white/90 md:text-base">
                Generate polished ecommerce product descriptions, save them to
                your database, and manage them with full CRUD functionality.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-white/80">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Log out
              </button>
            </div>
          </div>

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