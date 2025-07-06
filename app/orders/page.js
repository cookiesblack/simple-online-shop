'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4">Memuat riwayat pesanan...</p>

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <p>Kamu belum pernah melakukan pemesanan.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-md p-4 shadow-sm hover:shadow transition"
          >
            <div className="flex justify-between text-sm text-gray-600">
              <span>Order ID: {order.id}</span>
              <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>

            <div className="mt-2 space-y-1">
              {order.items.map((item) => (
                <div key={item.Product.id} className="flex justify-between">
                  <span>
                    {item.Product.title} × {item.quantity}
                  </span>
                  {/* <span>Rp {item.Product.price * item.quantity}</span> */}
                </div>
              ))}
            </div>

            <div className="mt-2 text-right font-semibold">
              {/* Total: Rp {order.total} */}
            </div>
          </div>
        ))
      )}
    </main>
  )
}
