'use client'

import { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleRemove = async (productId) => {
    const token = getToken()
    const res = await fetch(`http://localhost:3001/api/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setCartItems(cartItems.filter((item) => item.product.id !== productId))
    } else {
      alert('Gagal menghapus item')
    }
  }

  const handleQtyChange = async (productId, newQty) => {
    const token = getToken()
    const res = await fetch(`http://localhost:3001/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQty }),
    })

    if (res.ok) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQty }
            : item
        )
      )
    } else {
      alert('Gagal mengupdate kuantitas')
    }
  }

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.product.price * item.quantity,
//     0
//   )

  if (loading) return <p className="p-4">Loading keranjang...</p>

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(({ Product, quantity }) => (
            <div
              key={Product.id}
              className="border p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{Product.title}</h2>
                <p className="text-sm text-gray-600">{Product.description}</p>
                {/* <p className="text-sm">Harga: Rp {product.price}</p> */}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    handleQtyChange(Product.id, parseInt(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1"
                />
                <button
                  onClick={() => handleRemove(Product.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 text-right">
            <p className="font-bold text-lg">
              {/* Total: <span className="text-green-600">Rp {totalPrice}</span> */}
            </p>
            <button
              onClick={() => router.push('/checkout')}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
