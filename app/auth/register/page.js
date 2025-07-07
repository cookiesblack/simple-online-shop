'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterUser() {
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/auth/register', {
      method: 'POST',
      headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
},
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Registrasi berhasil');
      router.push('/auth/login');
    } else {
      const data = await res.json();
      alert(data.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register User</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="email" type="email" placeholder="Email" className="border p-2 w-full" onChange={handleChange} required />
        <input name="phone" type="text" placeholder="Nomor HP" className="border p-2 w-full" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="border p-2 w-full" onChange={handleChange} required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Daftar</button>
      </form>
    </div>
  );
}
