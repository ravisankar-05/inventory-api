import { prisma } from "@/lib/prisma"

export async function GET() {

  const stocks = await prisma.stock.findMany({
    include: {
      product: true,
      warehouse: true
    }
  })

  const data = stocks.map((s) => ({
    product: s.product.name,
    warehouse: s.warehouse.name,
    available: s.totalUnits - s.reservedUnits,
    productId: s.productId,
    warehouseId: s.warehouseId
  }))

  return Response.json(data)
}