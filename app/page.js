'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getToken } from '@/lib/auth'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [qtys, setQtys] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Cek token login
    const token = getToken()
    setIsLoggedIn(!!token)

    // Fetch product list
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  const handleQtyChange = (productId, value) => {
    setQtys({ ...qtys, [productId]: parseInt(value) })
  }

  const handleAddToCart = async (productId) => {
    const token = getToken()
    if (!token) {
      alert('Silakan login terlebih dahulu')
      return
    }

    const quantity = qtys[productId] || 1

    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+'/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    })

    const data = await res.json()
    if (res.ok) {
      alert('Berhasil ditambahkan ke keranjang')
    } else {
      alert(data.message || 'Gagal menambahkan ke keranjang')
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Simple Online Shop</h1>

        {/* ✅ Tampilkan tombol login hanya jika belum login */}
        {!isLoggedIn && (
          <div className="space-x-2">
            <Link href="/auth/login"><Button variant="outline">Login User</Button></Link>
            <Link href="/merchant/login"><Button>Login Merchant</Button></Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            {/* ✅ Tampilkan gambar pertama */}
            {product.images?.[0]?.url && (
              <img
                src={product.images[0].url}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <h2 className="font-semibold">{product.title}</h2>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="text-sm mt-1">Stok: {product.qty}</p>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={qtys[product.id] || 1}
                onChange={(e) => handleQtyChange(product.id, e.target.value)}
                className="border px-2 py-1 w-16"
              />
              <Button onClick={() => handleAddToCart(product.id)}>Tambah</Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
