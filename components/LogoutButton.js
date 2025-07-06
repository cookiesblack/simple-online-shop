'use client'
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    removeToken();
    router.push('/auth/login');
  }

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}
