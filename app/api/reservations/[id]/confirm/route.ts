import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  context: any
) {

  try {

    const params = await context.params

    const id = params.id

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id
        }
      })

    if (!reservation) {
      return Response.json(
        {
          error: "Reservation not found"
        },
        {
          status: 404
        }
      )
    }

    if (
      reservation.status !== "PENDING"
    ) {
      return Response.json(
        {
          error: "Already processed"
        },
        {
          status: 400
        }
      )
    }

    if (
      new Date() > reservation.expiresAt
    ) {

      await prisma.stock.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId
        },
        data: {
          reservedUnits: {
            decrement: reservation.quantity
          }
        }
      })

      await prisma.reservation.update({
        where: {
          id
        },
        data: {
          status: "RELEASED"
        }
      })

      return Response.json(
        {
          error: "Reservation expired"
        },
        {
          status: 410
        }
      )
    }

    const updated =
      await prisma.reservation.update({
        where: {
          id
        },
        data: {
          status: "CONFIRMED"
        }
      })

    return Response.json(updated)

  } catch (err) {

    console.error(err)

    return Response.json(
      {
        error: "Internal server error"
      },
      {
        status: 500
      }
    )
  }
}