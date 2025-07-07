"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MerchantDashboard() {
  const router = useRouter();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("merchant_token")
      : null;

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    sku: "",
    description: "",
    qty: 0,
  });
  const [images, setImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const fetchProducts = () => {
    fetch("http://localhost:3001/api/products/own", {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("respon:", data); // ⬅️ Cek bentuknya
        setProducts(data.data || data); // ✅ fallback ke array
      });
  };

  useEffect(() => {
    if (!token) return router.push("/merchant/login");
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({ title: "", sku: "", description: "", qty: 0 });
    setImages([]);
    setEditMode(false);
    setEditProductId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("sku", form.sku);
    formData.append("description", form.description);
    formData.append("qty", form.qty);
    images.forEach((img) => formData.append("images", img));

    const url = editMode
      ? `http://localhost:3001/api/products/${editProductId}`
      : `http://localhost:3001/api/products`;

    const method = editMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(editMode ? "Produk diperbarui" : "Produk ditambahkan");
      resetForm();
      fetchProducts();
    } else {
      alert(data.message || "Gagal");
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditProductId(product.id);
    setForm({
      title: product.title,
      sku: product.sku,
      description: product.description,
      qty: product.qty,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("merchant_token");
    router.push("/");
  };

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard Merchant</h1>
      </div>

      {/* ✅ Form Tambah/Edit Produk */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded shadow"
      >
        <h2 className="font-semibold text-lg">
          {editMode ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Judul"
          className="w-full border p-2"
          required
        />
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="w-full border p-2"
        />
        <input
          name="qty"
          type="number"
          value={form.qty}
          onChange={handleChange}
          placeholder="Stok"
          className="w-full border p-2"
          min="0"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <div className="flex gap-2 mt-2">
          {images.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-16 h-16 object-cover border"
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editMode ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 underline"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* ✅ Daftar Produk */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Produk Saya</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-bold">{product.title}</h3>
              <p className="text-sm">SKU: {product.sku}</p>
              <p className="text-sm">Stok: {product.qty}</p>
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images?.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt="img"
                    className="w-16 h-16 object-cover border"
                  />
                ))}
              </div>
              <button
                onClick={() => handleEdit(product)}
                className="mt-2 text-sm text-blue-600 underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
