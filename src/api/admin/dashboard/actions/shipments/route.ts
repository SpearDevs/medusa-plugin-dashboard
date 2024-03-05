import { FulfillmentStatus, MedusaRequest, MedusaResponse, OrderService } from "@medusajs/medusa"
import { In } from "typeorm"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const orderService: OrderService = req.scope.resolve("orderService")

  const offset = parseInt(req.query.offset as string) || 0
  const limit = parseInt(req.query.limit as string) || 10

  try {
    const [items, count] = await orderService.listAndCount(
      { fulfillment_status: In([FulfillmentStatus.FULFILLED, FulfillmentStatus.PARTIALLY_SHIPPED]) },
      { skip: offset, take: limit, relations: ["customer"] }
    )

    res.json({ items, count, offset, limit })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
