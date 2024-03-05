import { MedusaRequest, MedusaResponse, ReturnService, ReturnStatus } from "@medusajs/medusa"
import { In, IsNull } from "typeorm"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const returnService: ReturnService = req.scope.resolve("returnService")

  const offset = parseInt(req.query.offset as string) || 0
  const limit = parseInt(req.query.limit as string) || 10

  try {
    const [items, count] = await returnService.listAndCount(
      {
        status: In([ReturnStatus.REQUESTED, ReturnStatus.REQUIRES_ACTION]),
        swap_id: IsNull()
      },
      { skip: offset, take: limit, relations: ["order.customer"] }
    )

    res.json({ items, count, offset, limit })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
