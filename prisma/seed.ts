import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  const product = await prisma.product.create({
    data: {
      name: "iPhone"
    }
  })

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse"
    }
  })

  await prisma.stock.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalUnits: 5
    }
  })

  console.log("Seeded successfully")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })