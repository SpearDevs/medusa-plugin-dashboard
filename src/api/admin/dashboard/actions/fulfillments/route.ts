import { FulfillmentStatus, MedusaRequest, MedusaResponse, OrderService } from "@medusajs/medusa"
import { In } from "typeorm"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const orderService: OrderService = req.scope.resolve("orderService")

  const offset = parseInt(req.query.offset as string) || 0
  const limit = parseInt(req.query.limit as string) || 10

  try {
    const [items, count] = await orderService.listAndCount(
      { fulfillment_status: In([FulfillmentStatus.NOT_FULFILLED, FulfillmentStatus.PARTIALLY_FULFILLED]) },
      { skip: offset, take: limit, relations: ["customer"] }
    )

    res.json({ items, count, offset, limit })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
