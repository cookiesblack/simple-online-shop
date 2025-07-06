'use client'
import { useState } from 'react';
import { getToken } from '@/lib/auth';
import ProtectedPage from '@/components/ProtectedPage';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
  const [form, setForm] = useState({ title: '', sku: '', description: '', qty: 1 });
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = getToken();

    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/merchant/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Produk berhasil ditambahkan');
      router.push('/products');
    } else {
      const data = await res.json();
      alert(data.message || 'Gagal menambahkan produk');
    }
  };

  return (
    <ProtectedPage>
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-4">Tambah Produk</h1>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input name="title" placeholder="Nama Produk" className="border p-2 w-full" onChange={handleChange} required />
          <input name="sku" placeholder="SKU" className="border p-2 w-full" onChange={handleChange} required />
          <textarea name="description" placeholder="Deskripsi" className="border p-2 w-full" onChange={handleChange} />
          <input name="qty" type="number" min={1} placeholder="Stok" className="border p-2 w-full" onChange={handleChange} required />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Tambah</button>
        </form>
      </div>
    </ProtectedPage>
  );
}
