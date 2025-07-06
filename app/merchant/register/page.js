'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterMerchant() {
  const [form, setForm] = useState({ email: '', password: '', store_name: '' });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/merchant/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Merchant berhasil didaftarkan');
      router.push('/merchant/login');
    } else {
      const data = await res.json();
      alert(data.message || 'Gagal registrasi');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register Merchant</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="email" type="email" placeholder="Email" className="border p-2 w-full" onChange={handleChange} required />
        <input name="store_name" type="text" placeholder="Nama Toko" className="border p-2 w-full" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="border p-2 w-full" onChange={handleChange} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Daftar</button>
      </form>
    </div>
  );
}
