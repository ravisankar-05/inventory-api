"use client"

import { useEffect, useState } from "react"

export default function Home() {

  const [products, setProducts] = useState<any[]>([])

  async function loadProducts() {

    const res =
      await fetch("/api/products")

    const data = await res.json()

    setProducts(data)
  }

  async function reserve(
    productId: string,
    warehouseId: string
  ) {

    const res =
      await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1
        })
      })

    if (res.status === 409) {
      alert("Not enough stock")
      return
    }

    const data = await res.json()

    alert(
      "Reserved successfully\nReservation ID: " +
      data.id
    )

    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Inventory System
      </h1>

      <div className="space-y-4">

        {products.map((p) => (

          <div
            key={p.productId}
            className="border p-4 rounded"
          >

            <h2 className="text-xl font-semibold">
              {p.product}
            </h2>

            <p>
              Warehouse:
              {" "}
              {p.warehouse}
            </p>

            <p>
              Available Stock:
              {" "}
              {p.available}
            </p>

            <button
              onClick={() =>
                reserve(
                  p.productId,
                  p.warehouseId
                )
              }
              className="bg-black text-white px-4 py-2 mt-3 rounded"
            >
              Reserve
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}