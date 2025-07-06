'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NavbarMerchant() {
  const [merchantName, setMerchantName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('merchant_name');
    const token = localStorage.getItem('merchant_token');

    if (!token) {
      router.push('/merchant/login');
    } else {
      setMerchantName(name || 'Merchant');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('merchant_token');
    localStorage.removeItem('merchant_name');
    // router.push('/');
    window.location.href = '/';

  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/merchant/dashboard" className="font-bold text-lg">
        Dashboard Merchant
      </Link>

      <div className="flex items-center gap-4">
        <span className="font-medium">{merchantName}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
