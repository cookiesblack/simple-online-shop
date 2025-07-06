'use client'
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import ProtectedPage from '@/components/ProtectedPage';

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = getToken();
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  async function removeItem(id) {
    const token = getToken();
    await fetch(`http://localhost:3001/api/cart/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems(items.filter(i => i.id !== id));
  }

  return (
    <ProtectedPage>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Keranjang Saya</h1>
        {items.length === 0 && <p>Keranjang kosong.</p>}
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="border p-2 rounded">
              <strong>{item.Product.title}</strong> - Qty: {item.quantity}
              <button onClick={() => removeItem(item.id)} className="ml-2 text-red-600">Hapus</button>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedPage>
  );
}
