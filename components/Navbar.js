'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, removeToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Home, UserIcon, ShoppingCart, FileText, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  // Update isLogin setiap kali komponen di-render
  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      setIsLogin(!!token);
    };

    checkToken();

    // Tambahkan event listener jika ada perubahan di localStorage
    window.addEventListener('storage', checkToken);

    // Optional polling setiap 2 detik (jaga-jaga kalau perubahan dari tab yang sama)
    const interval = setInterval(checkToken, 2000);

    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLogin(false);
    // router.push('/');
            window.location.href = '/';
    
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg text-blue-600">Simple Shop</Link>
      <div className="space-x-4 flex items-center">
        <Link href="/" className="flex items-center gap-1 hover:text-blue-500">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {isLogin ? (
          <>
            <Link href="/cart" className="flex items-center gap-1 hover:text-blue-500">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </Link>
            <Link href="/orders" className="flex items-center gap-1 hover:text-blue-500">
              <FileText className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
            <UserIcon className="w-5 h-5 text-gray-700" />
          </>
        ) : (
          <>
            {/* <Link href="/auth/login" className="hover:text-blue-500">Login</Link> */}
            <Link href="/auth/register" className="hover:text-blue-500">Daftar User</Link>
            <Link href="/merchant/register" className="hover:text-blue-500">Daftar Toko</Link>
          </>
        )}
      </div>
    </nav>
  );
}
