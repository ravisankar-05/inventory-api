import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const body = await req.json()

  const {
    productId,
    warehouseId,
    quantity
  } = body

  try {

    const reservation =
      await prisma.$transaction(async (tx) => {

        const stock =
          await tx.stock.findFirst({
            where: {
              productId,
              warehouseId
            }
          })

        if (!stock) {
          throw new Error("NO_STOCK")
        }

        const available =
          stock.totalUnits -
          stock.reservedUnits

        if (available < quantity) {
          throw new Error("NOT_ENOUGH")
        }

        await tx.stock.update({
          where: {
            id: stock.id
          },
          data: {
            reservedUnits: {
              increment: quantity
            }
          }
        })

        return tx.reservation.create({
          data: {
            productId,
            warehouseId,
            quantity,
            expiresAt: new Date(
              Date.now() + 10 * 60 * 1000
            )
          }
        })
      })

    return Response.json(reservation)

  } catch (err: any) {

    if (
      err.message === "NOT_ENOUGH"
    ) {
      return new Response(
        JSON.stringify({
          error: "Not enough stock"
        }),
        {
          status: 409
        }
      )
    }

    return new Response(
      JSON.stringify({
        error: "Server error"
      }),
      {
        status: 500
      }
    )
  }
}