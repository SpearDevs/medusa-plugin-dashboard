import { MedusaRequest, MedusaResponse, SwapFulfillmentStatus, SwapService } from "@medusajs/medusa"
import { In } from "typeorm"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const swapService: SwapService = req.scope.resolve("swapService")

  const offset = parseInt(req.query.offset as string) || 0
  const limit = parseInt(req.query.limit as string) || 10

  try {
    const [items, count] = await swapService.listAndCount(
      { fulfillment_status: In([SwapFulfillmentStatus.NOT_FULFILLED, SwapFulfillmentStatus.REQUIRES_ACTION]) },
      { skip: offset, take: limit, relations: ["order.customer"] }
    )

    res.json({ items, count, offset, limit })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
