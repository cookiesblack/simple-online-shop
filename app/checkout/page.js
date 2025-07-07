'use client'
import { getToken } from '@/lib/auth';
import ProtectedPage from '@/components/ProtectedPage';

export default function CheckoutPage() {
  async function handleCheckout() {
    const token = getToken();
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/api/orders/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Checkout berhasil!');
    } else {
      alert(data.message || 'Checkout gagal');
    }
  }

  return (
    <ProtectedPage>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Checkout</h1>
        <p>Pastikan isi keranjang Anda sudah benar sebelum checkout.</p>
        <button onClick={handleCheckout} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Checkout</button>
      </div>
    </ProtectedPage>
  );
}
