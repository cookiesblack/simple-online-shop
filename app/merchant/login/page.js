'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MerchantLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/merchant/login', {
            method: 'POST',
            headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
},
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('merchant_token', data.access_token);
            localStorage.setItem('merchant_name', data?.merchant.store_name || 'Merchant');
            console.log(data);
            
            alert('Login berhasil');
            //   router.push('/merchant/dashboard');
            window.location.href = '/merchant/dashboard';

        } else {
            alert(data.message || 'Gagal login');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Login Merchant</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="merchant@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Masuk
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link href="/merchant/register" className="text-blue-600 hover:underline">
                        Daftar sebagai merchant
                    </Link>
                </p>
            </div>
        </main>
    );
}
