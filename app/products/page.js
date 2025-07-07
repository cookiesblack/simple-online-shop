'use client'
import { useEffect, useState } from 'react';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/products', {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Gagal fetch produk', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Katalog Produk</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{product.title}</h2>
            <p>{product.description}</p>
            <p className="text-sm text-gray-500">Stok: {product.qty}</p>
            <AddToCart productId={product.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddToCart({ productId }) {
  const [qty, setQty] = useState(1);

  async function handleAdd() {
    const token = localStorage.getItem('token');
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: qty })
    });

    const data = await res.json();
    if (res.ok) alert('Berhasil tambah ke keranjang');
    else alert(data.message || 'Gagal menambah ke keranjang');
  }

  return (
    <div className="mt-2">
      <input type="number" value={qty} min={1} onChange={e => setQty(Number(e.target.value))} className="w-12 border p-1" />
      <button onClick={handleAdd} className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">Tambah</button>
    </div>
  );
}
